"""
IP-SAKTI Sahayak - Adaptive Interview Agent
Module for dynamically gathering required innovation details for the Innovation Fingerprint.
"""

import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

from pydantic import BaseModel, Field

# Support both package import and direct script execution
sys.path.append(str(Path(__file__).parent.parent))

try:
    from backend.fingerprint_schema import (
        InnovationFingerprint,
        NoveltyInfo,
        BiologicalResourceInfo,
    )
except ImportError:
    from fingerprint_schema import (
        InnovationFingerprint,
        NoveltyInfo,
        BiologicalResourceInfo,
    )


class QuestionPrompt(BaseModel):
    """Metadata representation of an interview question."""

    field_name: str
    question_text: str
    question_type: str = "text"  # text, select, boolean, list
    options: Optional[List[str]] = None
    required: bool = True
    help_text: Optional[str] = None


class InterviewState(BaseModel):
    """Tracks the state of an active interview session."""

    current_step: int = 0
    questions_asked: List[str] = Field(default_factory=list)
    answers: Dict[str, Any] = Field(default_factory=dict)
    completed: bool = False
    missing_fields: List[str] = Field(default_factory=list)


class AdaptiveInterviewAgent:
    """
    Adaptive Interview Agent for IP-SAKTI Sahayak.
    Dynamically asks only the minimum necessary questions to construct a valid InnovationFingerprint.
    Uses Gemini AI to generate context-aware questions with rule-based fallbacks.
    """

    QUESTIONS: Dict[str, QuestionPrompt] = {
        "innovation_name": QuestionPrompt(
            field_name="innovation_name",
            question_text="What is the title or name of your Ayurvedic innovation?",
            question_type="text",
            required=True,
            help_text="e.g., Ayurvedic wound healing formulation",
        ),
        "description": QuestionPrompt(
            field_name="description",
            question_text="Please provide a brief description of your innovation.",
            question_type="text",
            required=True,
            help_text="Summarize what the innovation is and how it works.",
        ),
        "ingredients": QuestionPrompt(
            field_name="ingredients",
            question_text="What herbs, minerals, or ingredients are used in your formulation?",
            question_type="list",
            required=True,
            help_text="Enter comma-separated ingredients, e.g., Neem, Turmeric",
        ),
        "intended_use": QuestionPrompt(
            field_name="intended_use",
            question_text="What is the primary therapeutic or commercial intended use?",
            question_type="text",
            required=False,
            help_text="e.g., Topical wound healing, Immunity booster",
        ),
        "traditional_knowledge_claimed": QuestionPrompt(
            field_name="traditional_knowledge_claimed",
            question_text="Is this innovation based on or derived from Traditional Knowledge (TK) in Ayurvedic texts?",
            question_type="boolean",
            required=False,
            help_text="Select yes or no.",
        ),
        "novelty_detected": QuestionPrompt(
            field_name="novelty_detected",
            question_text="Does your innovation introduce a novel aspect (e.g., process, extraction, formulation, delivery method)?",
            question_type="boolean",
            required=True,
            help_text="Select yes or no.",
        ),
        "novelty_type": QuestionPrompt(
            field_name="novelty_type",
            question_text="What type of novelty does your innovation introduce?",
            question_type="select",
            options=[
                "formulation",
                "process",
                "extraction_method",
                "composition",
                "dosage_form",
                "application",
                "delivery_method",
                "other",
            ],
            required=True,
        ),
        "novelty_description": QuestionPrompt(
            field_name="novelty_description",
            question_text="Please describe the novel aspect or process in detail.",
            question_type="text",
            required=True,
            help_text="e.g., Nano-extraction process to improve skin absorption",
        ),
        "biological_resource_used": QuestionPrompt(
            field_name="biological_resource_used",
            question_text="Does your innovation use Indian biological resources (herbs, plants, biological materials)?",
            question_type="boolean",
            required=True,
            help_text="Required for Biological Diversity Act / NBA compliance checks.",
        ),
        "biological_resources": QuestionPrompt(
            field_name="biological_resources",
            question_text="List the biological resources used (or leave blank to use ingredients).",
            question_type="list",
            required=False,
        ),
        "source_location": QuestionPrompt(
            field_name="source_location",
            question_text="What is the geographical source location of the biological resources in India?",
            question_type="text",
            required=False,
            help_text="e.g., Tamil Nadu, Kerala, Western Ghats",
        ),
        "manufacturing_process": QuestionPrompt(
            field_name="manufacturing_process",
            question_text="Detail any specific manufacturing or processing steps (optional).",
            question_type="text",
            required=False,
        ),
        "product_category": QuestionPrompt(
            field_name="product_category",
            question_text="What product category best fits your innovation?",
            question_type="select",
            options=[
                "Ayurvedic Medicine / Formulation",
                "Nutraceutical / Food Supplement",
                "Cosmetic / Skin Care",
                "Medical Device / Equipment",
                "Process / Method",
            ],
            required=False,
        ),
    }

    def __init__(self, max_questions: int = 5):
        self.state = InterviewState()
        self.max_questions = max_questions
        self.gemini_service = None
        self._init_gemini()

    def _init_gemini(self):
        try:
            from backend.gemini_service import GeminiService
            self.gemini_service = GeminiService()
        except ImportError:
            try:
                from gemini_service import GeminiService
                self.gemini_service = GeminiService()
            except ImportError:
                self.gemini_service = None

    def start_interview(self, initial_inputs: Optional[Dict[str, Any]] = None) -> InterviewState:
        """
        Initializes an interview session with optional pre-filled inputs.
        """
        self.state = InterviewState()
        if initial_inputs:
            for field, val in initial_inputs.items():
                if val is not None and val != "":
                    self.submit_answer(field, val)

        self._update_missing_fields()
        return self.state

    def _should_ask_field(self, field_name: str) -> bool:
        """Determines if a field should be asked based on current answers and adaptiveness rules."""
        if field_name in self.state.answers:
            return False

        # Novelty conditional checks
        if field_name in ["novelty_type", "novelty_description"]:
            if not self.state.answers.get("novelty_detected", True):
                return False

        # Biological resource conditional checks
        if field_name in ["biological_resources", "source_location"]:
            if not self.state.answers.get("biological_resource_used", False):
                return False

        # Skip separate biological_resources prompt if ingredients are already answered
        if field_name == "biological_resources" and self.state.answers.get("ingredients"):
            return False

        return True

    def _get_field_sequence(self) -> List[str]:
        """Returns ordered sequence of potential questions."""
        return [
            "innovation_name",
            "description",
            "ingredients",
            "intended_use",
            "traditional_knowledge_claimed",
            "novelty_detected",
            "novelty_type",
            "novelty_description",
            "biological_resource_used",
            "biological_resources",
            "source_location",
            "manufacturing_process",
            "product_category",
        ]

    def _update_missing_fields(self):
        """Recalculates missing required fields and updates completion status."""
        missing = []
        unasked_active = []
        for field in self._get_field_sequence():
            q_info = self.QUESTIONS.get(field)
            if self._should_ask_field(field):
                unasked_active.append(field)
                if q_info and q_info.required:
                    missing.append(field)

        self.state.missing_fields = missing
        if len(self.state.questions_asked) >= self.max_questions:
            self.state.completed = True
        else:
            self.state.completed = len(unasked_active) == 0

    def get_next_question(self) -> Optional[QuestionPrompt]:
        """
        Returns the next required question prompt adaptively, or None if complete.
        Uses Gemini for natural question generation if available, with static fallback.
        """
        self._update_missing_fields()

        if len(self.state.questions_asked) >= self.max_questions:
            self.state.completed = True
            return None

        for field in self._get_field_sequence():
            if self._should_ask_field(field):
                q_info = self.QUESTIONS[field]
                if field not in self.state.questions_asked:
                    self.state.questions_asked.append(field)

                # Optional Gemini AI question enhancement
                if self.gemini_service and getattr(self.gemini_service, "enabled", False):
                    gemini_q = self.gemini_service.generate_interview_question(
                        field, self.state.answers
                    )
                    if gemini_q:
                        return QuestionPrompt(
                            field_name=q_info.field_name,
                            question_text=gemini_q,
                            question_type=q_info.question_type,
                            options=q_info.options,
                            required=q_info.required,
                            help_text=q_info.help_text,
                        )

                return q_info

        self.state.completed = True
        return None

    def submit_answer(self, field_name: str, answer: Any) -> InterviewState:
        """
        Submits an answer for a specific field and adapts state.
        """
        # Parse boolean answers if passed as string
        if isinstance(answer, str) and answer.lower() in ["yes", "true", "y"]:
            parsed_answer: Any = True
        elif isinstance(answer, str) and answer.lower() in ["no", "false", "n"]:
            parsed_answer = False
        else:
            parsed_answer = answer

        self.state.answers[field_name] = parsed_answer
        self._update_missing_fields()
        return self.state

    def get_progress(self) -> Dict[str, Any]:
        """Returns progress metrics for UI and tracking."""
        sequence = self._get_field_sequence()
        total = len(sequence)
        answered = len([f for f in sequence if f in self.state.answers])
        percentage = round((answered / total) * 100, 1) if total > 0 else 100.0

        return {
            "answered_count": answered,
            "total_count": total,
            "percentage": percentage,
            "completed": self.state.completed,
            "missing_fields": self.state.missing_fields,
        }

    def is_complete(self) -> bool:
        """Checks if all required interview fields have been satisfied."""
        self._update_missing_fields()
        return self.state.completed

    def build_fingerprint(self) -> InnovationFingerprint:
        """
        Constructs and returns a validated InnovationFingerprint object.
        """
        ans = self.state.answers

        # Extract biological resources from answers or fallback to ingredients
        bio_resources = ans.get("biological_resources")
        if not bio_resources and ans.get("biological_resource_used"):
            bio_resources = ans.get("ingredients")

        return InnovationFingerprint.from_user_input(
            innovation_name=ans.get("innovation_name", "Untitled Innovation"),
            description=ans.get("description", "No description provided."),
            ingredients=ans.get("ingredients", []),
            intended_use=ans.get("intended_use"),
            product_category=ans.get("product_category"),
            traditional_knowledge_claimed=ans.get("traditional_knowledge_claimed", True),
            novelty_description=ans.get("novelty_description"),
            novelty_types=ans.get("novelty_type") if isinstance(ans.get("novelty_type"), list) else ([ans.get("novelty_type")] if ans.get("novelty_type") else None),
            biological_resource_used=bool(ans.get("biological_resource_used", False)),
            biological_resources=bio_resources,
            source_location=ans.get("source_location"),
            manufacturing_process=ans.get("manufacturing_process"),
            target_users=ans.get("target_users"),
            additional_notes=ans.get("additional_notes"),
        )


if __name__ == "__main__":
    import json

    print("=== Running AdaptiveInterviewAgent Complete Demo ===\n")

    agent = AdaptiveInterviewAgent(max_questions=15)

    # Scenario:
    # 1. User starts interview with partial initial input (Innovation Name & Description)
    initial_data = {
        "innovation_name": "Ayurvedic Wound Healing Formulation",
        "description": "Topical formulation combining Neem and Turmeric with nano-extraction process.",
    }

    print("1. Starting interview with initial inputs:")
    print(f"   Initial Inputs: {initial_data}\n")
    agent.start_interview(initial_inputs=initial_data)

    # Simulated answers map for remaining steps
    simulated_user_responses = {
        "ingredients": "Neem, Turmeric",
        "intended_use": "Wound healing",
        "traditional_knowledge_claimed": True,
        "novelty_detected": True,
        "novelty_type": "extraction_method",
        "novelty_description": "New nano-extraction process to improve skin absorption",
        "biological_resource_used": True,
        "source_location": "Tamil Nadu",
        "manufacturing_process": "Cold extraction followed by nano-emulsification",
        "product_category": "Ayurvedic Medicine / Formulation",
    }

    step_num = 1
    while not agent.is_complete():
        q = agent.get_next_question()
        if not q:
            break

        print(f"Step {step_num}: [Field: {q.field_name}]")
        print(f"  Q: {q.question_text}")

        user_ans = simulated_user_responses.get(q.field_name, "N/A")
        print(f"  A: {user_ans}")

        agent.submit_answer(q.field_name, user_ans)
        progress = agent.get_progress()
        print(f"  Progress: {progress['percentage']}%\n")
        step_num += 1

    print("=== Interview Completed! ===")
    fingerprint = agent.build_fingerprint()

    print("\nFinal Innovation Fingerprint JSON:")
    print(json.dumps(fingerprint.model_to_dict(), indent=2))

    assert fingerprint.innovation_name == "Ayurvedic Wound Healing Formulation"
    assert "Neem" in fingerprint.ingredients
    assert fingerprint.novelty.novelty_detected is True
    assert fingerprint.biological_resources.source_location == "Tamil Nadu"

    print("\n[OK] Adaptive Interview Agent test passed cleanly!")
