"""
IP-SAKTI Sahayak - Enhanced Innovation Fingerprint Schema
Central data object containing multi-layer extraction metadata, botanical scientific names,
language detection, confidence scoring, and multi-regime properties.
"""

import uuid
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, model_validator


class BiologicalResourceDetails(BaseModel):
    """Details regarding biological resources usage and compliance."""

    detected: bool = Field(default=False)
    resources: List[str] = Field(default_factory=list)
    source_location: Optional[str] = Field(default=None)
    confidence: float = Field(default=0.0)

    # Backwards compatibility properties
    @property
    def biological_resource_used(self) -> bool:
        return self.detected

    @property
    def source_known(self) -> bool:
        return bool(self.source_location and self.source_location.strip())


class TraditionalKnowledgeDetails(BaseModel):
    """Details regarding traditional knowledge overlap and indicators."""

    possible_overlap: bool = Field(default=True)
    indicators: List[str] = Field(default_factory=list)
    confidence: float = Field(default=0.0)


class ExtractionSourceFlags(BaseModel):
    """Tracks which extraction layers produced this fingerprint."""

    gemini: bool = Field(default=False)
    spacy: bool = Field(default=False)
    rules: bool = Field(default=True)


class NoveltyInfoCompat(BaseModel):
    """Backwards compatibility wrapper for novelty field queries."""

    novelty_detected: bool = Field(default=True)
    novelty_type: List[str] = Field(default_factory=list)
    description: Optional[str] = Field(default=None)


# Backwards compatibility type aliases
NoveltyInfo = NoveltyInfoCompat
BiologicalResourceInfo = BiologicalResourceDetails


class InnovationFingerprint(BaseModel):
    """
    Central Innovation Fingerprint data object for IP-SAKTI Sahayak.
    Stores multi-layered extraction results, botanical normalization, language info, and confidence scores.
    """

    innovation_id: str = Field(default_factory=lambda: f"INF-{uuid.uuid4().hex[:8].upper()}")
    original_input: str = Field(default="", description="Raw user input text.")
    detected_language: str = Field(default="English", description="English, Tamil, Hindi, or Tanglish.")

    innovation_name: str = Field(..., description="Title of the innovation.")
    description: str = Field(..., description="Summary description.")

    ingredients: List[str] = Field(default_factory=list, description="Common English herb names.")
    scientific_names: List[str] = Field(default_factory=list, description="Latin botanical names.")
    ayurvedic_names: List[str] = Field(default_factory=list, description="Sanskrit/Ayurvedic terms.")

    process: List[str] = Field(default_factory=list, description="Manufacturing or extraction processes.")
    intended_use: List[str] = Field(default_factory=list, description="Therapeutic or commercial uses.")
    novelty_indicators: List[str] = Field(default_factory=list, description="Claimed novel aspects.")
    innovation_type: str = Field(default="Formulation", description="Product or process category.")

    biological_resource: BiologicalResourceDetails = Field(default_factory=BiologicalResourceDetails)
    traditional_knowledge: TraditionalKnowledgeDetails = Field(default_factory=TraditionalKnowledgeDetails)

    missing_information: List[str] = Field(default_factory=list)
    overall_confidence: float = Field(default=0.85)
    extraction_source: ExtractionSourceFlags = Field(default_factory=ExtractionSourceFlags)

    # Legacy fields / optional properties for backwards compatibility
    product_category: Optional[str] = Field(default="Ayurvedic Medicine / Formulation")
    traditional_knowledge_claimed: Optional[bool] = Field(default=True)
    manufacturing_process: Optional[str] = Field(default=None)
    target_users: Optional[str] = Field(default=None)
    additional_notes: Optional[str] = Field(default=None)

    @property
    def novelty(self) -> NoveltyInfoCompat:
        """Backwards compatibility property for existing decision engine & evaluation modules."""
        desc = self.novelty_indicators[0] if self.novelty_indicators else (self.process[0] if self.process else None)
        has_novelty = bool(self.novelty_indicators or self.process)
        types = ["extraction_method", "process"] if has_novelty else []
        return NoveltyInfoCompat(
            novelty_detected=has_novelty,
            novelty_type=types,
            description=desc,
        )

    @property
    def biological_resources(self) -> BiologicalResourceDetails:
        """Backwards compatibility alias for biological_resource field."""
        return self.biological_resource

    def model_to_dict(self) -> Dict[str, Any]:
        """Returns plain python dictionary representation."""
        return self.model_dump()

    @classmethod
    def from_user_input(
        cls,
        innovation_name: str,
        description: str,
        ingredients: Any = None,
        novelty_description: Optional[str] = None,
        novelty_types: Optional[Any] = None,
        intended_use: Optional[Any] = None,
        product_category: Optional[str] = None,
        traditional_knowledge_claimed: Optional[bool] = True,
        biological_resource_used: bool = False,
        biological_resources: Optional[Any] = None,
        source_location: Optional[str] = None,
        manufacturing_process: Optional[str] = None,
        target_users: Optional[str] = None,
        additional_notes: Optional[str] = None,
    ) -> "InnovationFingerprint":
        """
        Constructs an InnovationFingerprint instance from raw user parameter inputs.
        """
        # Parse ingredients
        parsed_ingredients = []
        if isinstance(ingredients, str):
            parsed_ingredients = [i.strip() for i in ingredients.split(",") if i.strip()]
        elif isinstance(ingredients, list):
            parsed_ingredients = [str(i).strip() for i in ingredients if str(i).strip()]

        # Parse intended use
        parsed_use = []
        if intended_use:
            if isinstance(intended_use, list):
                parsed_use = intended_use
            else:
                parsed_use = [str(intended_use)]

        # Parse process / novelty
        parsed_novelty = []
        if novelty_description:
            parsed_novelty.append(novelty_description)

        parsed_process = []
        if manufacturing_process:
            parsed_process.append(manufacturing_process)
        elif novelty_description:
            parsed_process.append(novelty_description)

        # Parse bio resources
        parsed_bio_list = []
        if biological_resources:
            if isinstance(biological_resources, str):
                parsed_bio_list = [r.strip() for r in biological_resources.split(",") if r.strip()]
            elif isinstance(biological_resources, list):
                parsed_bio_list = [str(r).strip() for r in biological_resources if str(r).strip()]
        elif biological_resource_used and parsed_ingredients:
            parsed_bio_list = parsed_ingredients

        is_bio_used = biological_resource_used or len(parsed_bio_list) > 0

        bio_details = BiologicalResourceDetails(
            detected=is_bio_used,
            resources=parsed_bio_list,
            source_location=source_location,
            confidence=0.90 if is_bio_used else 0.0,
        )

        tk_details = TraditionalKnowledgeDetails(
            possible_overlap=bool(traditional_knowledge_claimed or parsed_ingredients),
            indicators=parsed_ingredients,
            confidence=0.85,
        )

        return cls(
            original_input=description,
            detected_language="English",
            innovation_name=innovation_name,
            description=description,
            ingredients=parsed_ingredients,
            intended_use=parsed_use,
            novelty_indicators=parsed_novelty,
            process=parsed_process,
            product_category=product_category or "Ayurvedic Medicine / Formulation",
            traditional_knowledge_claimed=traditional_knowledge_claimed,
            biological_resource=bio_details,
            traditional_knowledge=tk_details,
            manufacturing_process=manufacturing_process,
            target_users=target_users,
            additional_notes=additional_notes,
            overall_confidence=0.85,
            extraction_source=ExtractionSourceFlags(rules=True),
        )


if __name__ == "__main__":
    import json
    print("=== Testing Upgraded InnovationFingerprint Schema ===")
    
    fp = InnovationFingerprint.from_user_input(
        innovation_name="Ayurvedic wound healing formulation",
        description="Ayurvedic formulation with Neem and Turmeric using nano-extraction process.",
        ingredients="Neem, Turmeric",
        novelty_description="Nano-extraction process to improve absorption",
        biological_resource_used=True,
        source_location="Tamil Nadu",
    )

    print("Fingerprint Output JSON:")
    print(json.dumps(fp.model_to_dict(), indent=2))

    assert fp.innovation_name == "Ayurvedic wound healing formulation"
    assert "Neem" in fp.ingredients
    assert fp.novelty.novelty_detected is True
    assert fp.biological_resources.biological_resource_used is True
    print("\n[OK] Upgraded InnovationFingerprint schema test passed cleanly!")
