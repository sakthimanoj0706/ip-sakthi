"""
IP-SAKTI Sahayak - Smart Interview State & Question Priority Manager
Eliminates duplicate interview questions, normalizes paraphrased queries,
evaluates question priorities (CRITICAL/HIGH/MEDIUM/LOW), tracks known vs missing fields,
and manages dynamic interview length (Min 3 to Max 8 questions).
"""

import sys
from pathlib import Path
from typing import List, Dict, Any, Optional, Set
from pydantic import BaseModel, Field

try:
    from backend.fingerprint_schema import InnovationFingerprint
    from backend.nlp_service import NLPService
    from backend.gemini_service import GeminiService
    from backend.question_deduplicator import QuestionDeduplicator, CANONICAL_QUESTIONS, DeduplicatedQuestionItem
except ImportError:
    from fingerprint_schema import InnovationFingerprint
    from nlp_service import NLPService
    from gemini_service import GeminiService
    from question_deduplicator import QuestionDeduplicator, CANONICAL_QUESTIONS, DeduplicatedQuestionItem


class QuestionPriorityItem(BaseModel):
    """Metadata representation of an interview question with priority scoring."""

    field_name: str
    question_text: str
    question_type: str = "text"  # boolean, select, multiselect, text, entity_input
    options: Optional[List[str]] = None
    required: bool = True
    help_text: Optional[str] = None
    priority_level: str = "HIGH"  # CRITICAL, HIGH, MEDIUM, LOW
    priority_score: int = 80  # 0 to 100
    why_asking: str = ""  # Explanation for UI: "Why are we asking this?"
    question_id: str = ""
    total_dynamic_questions: int = 5
    current_dynamic_step: int = 1


class DetailedInterviewSessionState(BaseModel):
    """Complete active interview session state."""

    session_id: str
    current_step: int = 1
    total_steps: int = 5
    min_questions: int = 3
    max_questions: int = 8
    completed: bool = False
    is_sufficient: bool = False
    asked_questions: List[str] = Field(default_factory=list)
    answered_questions: List[str] = Field(default_factory=list)
    skipped_questions: List[str] = Field(default_factory=list)
    known_fields: Dict[str, Any] = Field(default_factory=dict)
    missing_fields: List[str] = Field(default_factory=list)
    question_history: List[Dict[str, Any]] = Field(default_factory=list)
    completeness_percentage: float = Field(default=0.0)


FIELD_SYNONYM_MAP: Dict[str, Set[str]] = {
    "ingredients": {"ingredients", "herbs", "plants", "minerals", "botanicals", "raw_materials", "composition"},
    "novelty_description": {"novelty", "novelty_description", "novel_aspect", "new_process", "innovation_feature"},
    "biological_resources": {"biological_resources", "source_location", "plant_origin", "geographical_source"},
    "cultivation_status": {"cultivated_or_wild", "cultivation_status", "wild_harvested", "harvest_type"},
    "intended_use": {"intended_use", "therapeutic_use", "application", "indication"},
    "product_category": {"product_category", "product_form", "dosage_form"},
    "manufacturing_process": {"manufacturing_process", "process", "extraction_method"},
}


class QuestionPriorityEngine:
    """Calculates priority scores (0-100) for missing fields."""

    @staticmethod
    def score_field(field_name: str, known_fields: Dict[str, Any]) -> tuple[int, str, str]:
        """Returns (score, priority_level, why_asking explanation)."""
        field_lower = field_name.lower()

        if field_lower in ["ingredients", "biological_resources"]:
            return (95, "CRITICAL", "Required to verify Biological Diversity Act 2023 and Section 3(p) TKDL overlap.")
        elif field_lower in ["novelty_description", "novelty_type", "novelty_detected"]:
            return (90, "CRITICAL", "Determines whether the innovation overcomes Section 3(p) patent exclusions.")
        elif field_lower in ["source_location", "cultivation_status"]:
            if known_fields.get("biological_resource_used") or known_fields.get("ingredients"):
                return (85, "HIGH", "Required to assess State Biodiversity Board intimation exemptions.")
            return (60, "MEDIUM", "Helps identify geographical indication or regional access rules.")
        elif field_lower in ["product_category", "intended_use"]:
            return (80, "HIGH", "Required to determine regulatory track (Proprietary ASU drug vs FSSAI food).")
        elif field_lower == "manufacturing_process":
            return (70, "HIGH", "Helps evaluate Section 3(e) synergistic efficacy claims.")

        return (40, "LOW", "Provides additional contextual clarity.")


class InterviewStateManager:
    """
    State manager for IP-SAKTI smart interview.
    Ensures zero duplicate questions and adaptive dynamic length (Min 3 to Max 8).
    """

    def __init__(self, session_id: str = "sess_default"):
        self.state = DetailedInterviewSessionState(session_id=session_id)
        self.local_nlp = NLPService()
        self.gemini_service = GeminiService()
        self.deduplicator = QuestionDeduplicator()

    def normalize_field_name(self, raw_field: str) -> str:
        """Normalizes field aliases into canonical field keys."""
        cleaned = raw_field.lower().strip()
        for canonical, synonyms in FIELD_SYNONYM_MAP.items():
            if cleaned in synonyms:
                return canonical
        return cleaned

    def is_field_already_known(self, field_name: str) -> bool:
        """Checks if field is already answered or populated in known_fields."""
        norm = self.normalize_field_name(field_name)
        if norm in self.state.answered_questions or norm in self.state.asked_questions:
            return True

        val = self.state.known_fields.get(norm)
        if val is not None and val != "" and val != [] and val != "UNKNOWN":
            return True

        # Special conditional skip checks
        if norm in ["novelty_type", "novelty_description"]:
            if self.state.known_fields.get("novelty_detected") is False:
                return True

        if norm in ["source_location", "cultivation_status"]:
            if self.state.known_fields.get("biological_resource_used") is False:
                return True

        return False

    def ingest_initial_text(self, text: str, initial_data: Optional[Dict[str, Any]] = None):
        """
        Parses raw text description to pre-populate known_fields so we NEVER ask about them again.
        """
        if initial_data:
            for k, v in initial_data.items():
                if v is not None and v != "":
                    norm_k = self.normalize_field_name(k)
                    self.state.known_fields[norm_k] = v
                    if norm_k not in self.state.answered_questions:
                        self.state.answered_questions.append(norm_k)

        if text and len(text.strip()) > 10:
            nlp_res = self.local_nlp.extract(text)
            if nlp_res.ingredients:
                self.state.known_fields["ingredients"] = nlp_res.ingredients
                if "ingredients" not in self.state.answered_questions:
                    self.state.answered_questions.append("ingredients")

            if nlp_res.processes:
                self.state.known_fields["manufacturing_process"] = nlp_res.processes[0]

            if nlp_res.locations:
                self.state.known_fields["source_location"] = nlp_res.locations[0]
                self.state.known_fields["biological_resource_used"] = True

        self._recalculate_completeness()

    def _recalculate_completeness(self):
        """Updates completeness percentage and dynamic question bounds."""
        total_possible = len(CANONICAL_QUESTIONS)
        known_count = len([k for k in CANONICAL_QUESTIONS.keys() if self.is_field_already_known(CANONICAL_QUESTIONS[k].field)])
        pct = round((known_count / total_possible) * 100, 1)
        self.state.completeness_percentage = min(100.0, pct)

        # Dynamic bounds
        min_q, max_q = self.deduplicator.calculate_dynamic_bounds(pct, complexity_score=55)
        self.state.min_questions = min_q
        self.state.max_questions = max_q
        self.state.total_steps = max_q

        asked_count = len(self.state.asked_questions)
        if asked_count >= max_q or pct >= 80.0 or (asked_count >= min_q and pct >= 70.0):
            self.state.completed = True
            self.state.is_sufficient = True

    def get_next_question(self) -> Optional[QuestionPriorityItem]:
        """
        Returns highest-priority unasked deduplicated question prompt, or None if interview complete.
        """
        self._recalculate_completeness()
        if self.state.completed:
            return None

        candidates: List[tuple[int, DeduplicatedQuestionItem]] = []
        for q_id, q_item in CANONICAL_QUESTIONS.items():
            if not self.is_field_already_known(q_item.field) and not self.deduplicator.is_duplicate(q_item):
                score, priority_lvl, why_str = QuestionPriorityEngine.score_field(q_item.field, self.state.known_fields)
                candidates.append((score, q_item))

        if not candidates:
            self.state.completed = True
            self.state.is_sufficient = True
            return None

        # Sort by priority score descending
        candidates.sort(key=lambda x: x[0], reverse=True)
        top_q = candidates[0][1]

        # Record in asked list & deduplicator
        self.deduplicator.mark_asked(top_q)
        if top_q.field not in self.state.asked_questions:
            self.state.asked_questions.append(top_q.field)

        score, priority_lvl, why_str = QuestionPriorityEngine.score_field(top_q.field, self.state.known_fields)
        current_step_num = min(self.state.max_questions, len(self.state.asked_questions))

        return QuestionPriorityItem(
            field_name=top_q.field,
            question_text=top_q.question,
            question_type=top_q.question_type,
            options=top_q.options,
            required=True,
            help_text=top_q.help_text,
            priority_level=priority_lvl,
            priority_score=score,
            why_asking=why_str or top_q.why_asking,
            question_id=top_q.id,
            total_dynamic_questions=self.state.max_questions,
            current_dynamic_step=current_step_num,
        )

    def submit_answer(self, field_name: str, answer: Any):
        """Submits user answer and updates state."""
        norm_field = self.normalize_field_name(field_name)
        if norm_field not in self.state.answered_questions:
            self.state.answered_questions.append(norm_field)

        self.state.known_fields[norm_field] = answer
        self.state.question_history.append({
            "field": norm_field,
            "answer": answer,
            "action": "answered",
        })
        self._recalculate_completeness()

    def submit_skip(self, field_name: str):
        """Handles skipping a question ("Skip for now" / "I don't know")."""
        norm_field = self.normalize_field_name(field_name)
        if norm_field not in self.state.skipped_questions:
            self.state.skipped_questions.append(norm_field)

        self.state.known_fields[norm_field] = "UNKNOWN"
        self.state.question_history.append({
            "field": norm_field,
            "answer": "UNKNOWN",
            "action": "skipped",
        })
        self._recalculate_completeness()


if __name__ == "__main__":
    mgr = InterviewStateManager(session_id="test_sess_01")
    mgr.ingest_initial_text(
        "I developed an Ayurvedic wound healing formulation using Neem and Turmeric in Tamil Nadu with a new nano-extraction process.",
        initial_data={"innovation_name": "Ayurvedic Wound Healing Formulation"}
    )
    print("Initial Completeness:", mgr.state.completeness_percentage, "%")
    q1 = mgr.get_next_question()
    print("Next Highest Priority Question:")
    if q1:
        print(f"  Q ID: {q1.question_id} | Field: {q1.field_name} (Priority: {q1.priority_level})")
        print(f"  Progress: QUESTION {q1.current_dynamic_step} OF {q1.total_dynamic_questions}")
        print(f"  Q: {q1.question_text}")
        print(f"  Why Asking: {q1.why_asking}")

    assert q1 is not None
    assert q1.field_name not in ["ingredients", "source_location"]  # ingredients and location already known!
    print("[OK] Interview State Manager test passed cleanly!")
