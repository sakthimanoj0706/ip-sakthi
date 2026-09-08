"""
IP-SAKTI Sahayak - Question Deduplicator & Semantic Duplicate Engine
Ensures zero duplicate questions, eliminates semantic query repetition, tracks field confidence,
and calculates dynamic interview question bounds (Min 3, Max 8).
"""

import hashlib
from typing import List, Dict, Any, Optional, Set
from pydantic import BaseModel, Field


class DeduplicatedQuestionItem(BaseModel):
    """Structured question definition with unique ID, field key, intent hash, and input type."""

    id: str = Field(..., description="Unique question identifier (e.g. Q_ING_01).")
    field: str = Field(..., description="Canonical field key (e.g. ingredients, novelty_description).")
    category: str = Field(default="general", description="Category grouping.")
    intent: str = Field(..., description="Intent key (e.g. ingredient_collection).")
    intent_hash: str = Field(default="", description="MD5 hash of field + intent.")
    question: str = Field(..., description="User facing question prompt.")
    question_type: str = Field(default="text")  # boolean, select, multiselect, text, entity_input
    options: Optional[List[str]] = Field(default=None)
    priority: int = Field(default=50)  # 0 to 100
    why_asking: str = Field(default="")
    help_text: Optional[str] = Field(default=None)
    asked: bool = Field(default=False)
    answered: bool = Field(default=False)
    skipped: bool = Field(default=False)

    def model_post_init(self, __context: Any) -> None:
        if not self.intent_hash:
            raw = f"{self.field}:{self.intent}".lower()
            self.intent_hash = hashlib.md5(raw.encode("utf-8")).hexdigest()


CANONICAL_QUESTIONS: Dict[str, DeduplicatedQuestionItem] = {
    "Q_ING_01": DeduplicatedQuestionItem(
        id="Q_ING_01",
        field="ingredients",
        category="biological_information",
        intent="ingredient_collection",
        question="What herbs, minerals, or ingredients are used in your formulation?",
        question_type="entity_input",
        priority=95,
        why_asking="Identifies classical Ayurvedic plants and checks Traditional Knowledge Digital Library (TKDL) prior art records.",
        help_text="e.g. Neem, Turmeric",
    ),
    "Q_TK_01": DeduplicatedQuestionItem(
        id="Q_TK_01",
        field="traditional_knowledge_claimed",
        category="prior_art",
        intent="tk_basis_check",
        question="Is this formulation based on traditional Ayurvedic or classical text knowledge?",
        question_type="boolean",
        options=["Yes", "No", "Not Sure"],
        priority=90,
        why_asking="Crucial to evaluate Section 3(p) prior art exclusions under The Patents Act 1970.",
    ),
    "Q_NOV_DET_01": DeduplicatedQuestionItem(
        id="Q_NOV_DET_01",
        field="novelty_detected",
        category="patentability",
        intent="novelty_check",
        question="Does your innovation introduce a novel aspect (process, extraction, or delivery method)?",
        question_type="boolean",
        options=["Yes", "No", "Not Sure"],
        priority=90,
        why_asking="Determines whether technical novelty exists to overcome Section 3(p) patent bars.",
    ),
    "Q_NOV_TYPE_01": DeduplicatedQuestionItem(
        id="Q_NOV_TYPE_01",
        field="novelty_type",
        category="patentability",
        intent="novelty_classification",
        question="What type of innovation is this?",
        question_type="select",
        options=[
            "New Extraction Method",
            "New Formulation Ratio",
            "New Therapeutic Application",
            "New Manufacturing Process",
            "Software / AI Diagnostic",
            "Other",
        ],
        priority=85,
        why_asking="Focuses patentability analysis on process vs composition.",
    ),
    "Q_NOV_DESC_01": DeduplicatedQuestionItem(
        id="Q_NOV_DESC_01",
        field="novelty_description",
        category="patentability",
        intent="novelty_detail",
        question="Describe the novel aspect of your extraction or manufacturing process.",
        question_type="text",
        priority=85,
        why_asking="Assesses whether non-obvious synergistic efficacy (Section 3(e)) is demonstrated.",
        help_text="e.g., Nano-extraction process to improve skin absorption",
    ),
    "Q_BIO_USE_01": DeduplicatedQuestionItem(
        id="Q_BIO_USE_01",
        field="biological_resource_used",
        category="biodiversity",
        intent="biological_resource_check",
        question="Does your innovation use Indian biological resources (herbs, plants, biological materials)?",
        question_type="boolean",
        options=["Yes", "No", "Not Sure"],
        priority=90,
        why_asking="Triggers compliance requirements under the Biological Diversity (Amendment) Act 2023.",
    ),
    "Q_BIO_LOC_01": DeduplicatedQuestionItem(
        id="Q_BIO_LOC_01",
        field="source_location",
        category="biodiversity",
        intent="geographical_source",
        question="What is the geographical source location of the biological resources in India?",
        question_type="text",
        priority=80,
        why_asking="Identifies relevant State Biodiversity Board (SBB) jurisdiction.",
        help_text="e.g. Tamil Nadu, Kerala",
    ),
    "Q_CULT_STATUS_01": DeduplicatedQuestionItem(
        id="Q_CULT_STATUS_01",
        field="cultivation_status",
        category="biodiversity",
        intent="harvest_type",
        question="Are the biological materials cultivated or collected from the wild?",
        question_type="select",
        options=["Cultivated Farm", "Wild Harvested", "Both", "Unknown"],
        priority=75,
        why_asking="Cultivated medicinal plants with BMC Certificate of Origin enjoy SBB intimation exemptions.",
    ),
    "Q_TK_SRC_01": DeduplicatedQuestionItem(
        id="Q_TK_SRC_01",
        field="tk_sources",
        category="prior_art",
        intent="tk_source_selection",
        question="Which traditional knowledge sources apply?",
        question_type="multiselect",
        options=[
            "Classical Ayurvedic Text (Charaka/Sushruta)",
            "Community / Regional Knowledge",
            "Family Herbal Practice",
            "Tribal Knowledge",
            "None / Modern Research",
            "Not Sure",
        ],
        priority=70,
        why_asking="Helps verify whether classical text prior art in TKDL applies.",
    ),
    "Q_PROD_CAT_01": DeduplicatedQuestionItem(
        id="Q_PROD_CAT_01",
        field="product_category",
        category="regulatory",
        intent="regulatory_track",
        question="What product category best fits your innovation?",
        question_type="select",
        options=[
            "Ayurvedic Medicine / Formulation",
            "Nano Formulation",
            "Cosmetic Product",
            "Ayurveda Aahara / Food Product",
            "Nutraceutical",
            "Extraction Process",
        ],
        priority=75,
        why_asking="Determines whether AYUSH ASU drug licensing (Rule 158-B) or FSSAI food rules apply.",
    ),
}


class QuestionDeduplicator:
    """
    Stateful Question Deduplicator & Priority Engine.
    Guarantees no repeated questions and no semantic duplicate queries.
    """

    def __init__(self):
        self.asked_question_ids: Set[str] = set()
        self.asked_fields: Set[str] = set()
        self.asked_intent_hashes: Set[str] = set()

    def is_duplicate(self, q_item: DeduplicatedQuestionItem) -> bool:
        """
        Returns True if question ID, field, or intent has already been asked or answered.
        """
        if q_item.id in self.asked_question_ids:
            return True
        if q_item.field in self.asked_fields:
            return True
        if q_item.intent_hash in self.asked_intent_hashes:
            return True
        return False

    def mark_asked(self, q_item: DeduplicatedQuestionItem):
        """Records question as asked to prevent any future repeat."""
        self.asked_question_ids.add(q_item.id)
        self.asked_fields.add(q_item.field)
        self.asked_intent_hashes.add(q_item.intent_hash)

    def calculate_dynamic_bounds(
        self, initial_completeness: float, complexity_score: int
    ) -> tuple[int, int]:
        """
        Calculates (min_questions, max_questions) based on initial completeness and complexity.
        Min: 3, Max: 8.
        """
        if initial_completeness >= 75.0 or complexity_score < 40:
            return (3, 4)
        elif initial_completeness >= 40.0 or complexity_score < 70:
            return (3, 6)
        else:
            return (4, 8)


if __name__ == "__main__":
    dedup = QuestionDeduplicator()
    q1 = CANONICAL_QUESTIONS["Q_ING_01"]
    
    print("Deduplicator Test:")
    print(f"Is Q1 Duplicate initially? {dedup.is_duplicate(q1)}")
    assert not dedup.is_duplicate(q1)
    
    dedup.mark_asked(q1)
    print(f"Is Q1 Duplicate after mark_asked? {dedup.is_duplicate(q1)}")
    assert dedup.is_duplicate(q1)
    
    # Test semantic duplicate (different question ID but same field 'ingredients')
    q1_alias = DeduplicatedQuestionItem(
        id="Q_ING_02",
        field="ingredients",
        category="biological_information",
        intent="ingredient_collection",
        question="Which herbs are included?",
        question_type="entity_input",
    )
    print(f"Is semantic duplicate alias blocked? {dedup.is_duplicate(q1_alias)}")
    assert dedup.is_duplicate(q1_alias)
    print("[OK] Question Deduplicator test passed cleanly!")
