"""
IP-SAKTI Sahayak - Smart Interview State & Question Priority Manager
Eliminates duplicate interview questions, normalizes paraphrased queries,
evaluates question priorities (CRITICAL/HIGH/MEDIUM/LOW), tracks known vs missing fields,
and manages dynamic interview length (1 to 5 questions max).
"""

import sys
from pathlib import Path
from typing import List, Dict, Any, Optional, Set
from pydantic import BaseModel, Field

try:
    from backend.fingerprint_schema import InnovationFingerprint
    from backend.nlp_service import NLPService
    from backend.gemini_service import GeminiService
except ImportError:
    from fingerprint_schema import InnovationFingerprint
    from nlp_service import NLPService
    from gemini_service import GeminiService


class QuestionPriorityItem(BaseModel):
    """Metadata representation of an interview question with priority scoring."""

    field_name: str
    question_text: str
    question_type: str = "text"  # text, select, boolean, list
    options: Optional[List[str]] = None
    required: bool = True
    help_text: Optional[str] = None
    priority_level: str = "HIGH"  # CRITICAL, HIGH, MEDIUM, LOW
    priority_score: int = 80  # 0 to 100
    why_asking: str = ""  # Explanation for UI: "Why are we asking this?"


class DetailedInterviewSessionState(BaseModel):
    """Complete active interview session state."""

    session_id: str
    current_step: int = 1
    total_steps: int = 5
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
    Ensures zero duplicate questions and adaptive dynamic length.
    """

    QUESTIONS: Dict[str, QuestionPriorityItem] = {
        "ingredients": QuestionPriorityItem(
            field_name="ingredients",
            question_text="What herbs, minerals, or ingredients are used in your formulation?",
            question_type="list",
            required=True,
            help_text="e.g., Neem, Turmeric",
            priority_level="CRITICAL",
            priority_score=95,
            why_asking="Identifies classical Ayurvedic plants and checks TKDL prior art records.",
        ),
        "intended_use": QuestionPriorityItem(
            field_name="intended_use",
            question_text="What is the primary therapeutic or commercial intended use?",
            question_type="text",
            required=False,
            help_text="e.g., Wound healing, Immunity booster",
            priority_level="HIGH",
            priority_score=80,
            why_asking="Determines whether AYUSH ASU drug licensing or FSSAI food rules apply.",
        ),
        "novelty_detected": QuestionPriorityItem(
            field_name="novelty_detected",
            question_text="Does your innovation introduce a novel aspect (process, extraction, or delivery method)?",
            question_type="boolean",
            required=True,
            priority_level="CRITICAL",
            priority_score=90,
            why_asking="Crucial to assess patent eligibility under Section 3(p) and Section 3(e).",
        ),
        "novelty_type": QuestionPriorityItem(
            field_name="novelty_type",
            question_text="What type of novelty does your innovation introduce?",
            question_type="select",
            options=["extraction_method", "formulation", "process", "delivery_method"],
            required=True,
            priority_level="HIGH",
            priority_score=85,
            why_asking="Focuses patentability analysis on process vs composition.",
        ),
        "novelty_description": QuestionPriorityItem(
            field_name="novelty_description",
            question_text="Please describe the novel process or extraction method in detail.",
            question_type="text",
            required=True,
            help_text="e.g., Nano-extraction process to improve skin absorption",
            priority_level="HIGH",
            priority_score=85,
            why_asking="Assesses whether technical synergy or unexpected benefit is claimed.",
        ),
        "biological_resource_used": QuestionPriorityItem(
            field_name="biological_resource_used",
            question_text="Does your innovation use Indian biological resources (herbs, biological materials)?",
            question_type="boolean",
            required=True,
            priority_level="CRITICAL",
            priority_score=90,
            why_asking="Required for Biological Diversity (Amendment) Act 2023 compliance.",
        ),
        "source_location": QuestionPriorityItem(
            field_name="source_location",
            question_text="What is the geographical source location of the biological resources in India?",
            question_type="text",
            required=False,
            help_text="e.g., Tamil Nadu, Kerala",
            priority_level="HIGH",
            priority_score=80,
            why_asking="Identifies relevant State Biodiversity Board (SBB) jurisdiction.",
        ),
        "cultivation_status": QuestionPriorityItem(
            field_name="cultivation_status",
            question_text="Are the biological materials cultivated or collected from the wild?",
            question_type="select",
            options=["Cultivated Farm", "Wild Harvested", "Both", "Unknown"],
            required=False,
            priority_level="HIGH",
            priority_score=75,
            why_asking="Cultivated plants with BMC Certificate of Origin enjoy SBB intimation exemptions.",
        ),
        "product_category": QuestionPriorityItem(
            field_name="product_category",
            question_text="What product category best fits your innovation?",
            question_type="select",
            options=[
                "Ayurvedic Medicine / Formulation",
                "Nano Formulation",
                "Cosmetic Product",
                "Ayurveda Aahara / Food Product",
                "Nutraceutical",
                "Extraction Process",
            ],
            required=False,
            priority_level="HIGH",
            priority_score=75,
            why_asking="Selects exact regulatory licensing track under Drugs & Cosmetics Act 1940.",
        ),
    }

    def __init__(self, session_id: str = "sess_default"):
        self.state = DetailedInterviewSessionState(session_id=session_id)
        self.local_nlp = NLPService()
        self.gemini_service = GeminiService()

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
        """Updates completeness percentage and checks if sufficient."""
        total_possible = len(self.QUESTIONS)
        known_count = len([k for k in self.QUESTIONS.keys() if self.is_field_already_known(k)])
        pct = round((known_count / total_possible) * 100, 1)
        self.state.completeness_percentage = min(100.0, pct)

        # Dynamic early completion rule: if 4+ questions asked or >75% completeness
        if len(self.state.asked_questions) >= 5 or pct >= 80.0:
            self.state.completed = True
            self.state.is_sufficient = True

    def get_next_question(self) -> Optional[QuestionPriorityItem]:
        """
        Returns highest-priority unasked question prompt, or None if interview complete.
        """
        self._recalculate_completeness()
        if self.state.completed:
            return None

        # Filter out already known or asked questions
        candidates: List[tuple[int, QuestionPriorityItem]] = []
        for field, q_info in self.QUESTIONS.items():
            if not self.is_field_already_known(field):
                score, priority_lvl, why_str = QuestionPriorityEngine.score_field(field, self.state.known_fields)
                q_info_copy = QuestionPriorityItem(
                    field_name=q_info.field_name,
                    question_text=q_info.question_text,
                    question_type=q_info.question_type,
                    options=q_info.options,
                    required=q_info.required,
                    help_text=q_info.help_text,
                    priority_level=priority_lvl,
                    priority_score=score,
                    why_asking=why_str,
                )
                candidates.append((score, q_info_copy))

        if not candidates:
            self.state.completed = True
            self.state.is_sufficient = True
            return None

        # Sort by priority score descending
        candidates.sort(key=lambda x: x[0], reverse=True)
        top_q = candidates[0][1]

        # Record in asked list
        if top_q.field_name not in self.state.asked_questions:
            self.state.asked_questions.append(top_q.field_name)

        return top_q

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
        print(f"  Field: {q1.field_name} (Priority: {q1.priority_level}, Score: {q1.priority_score})")
        print(f"  Q: {q1.question_text}")
        print(f"  Why Asking: {q1.why_asking}")

    assert q1 is not None
    assert q1.field_name not in ["ingredients", "source_location"]  # ingredients and location already known!
    print("[OK] Interview State Manager test passed cleanly!")
