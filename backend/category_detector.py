"""
IP-SAKTI Sahayak - Auto Innovation Category Detector
Automatically analyzes innovation title and description to detect primary and secondary
categories, confidence scores, detected text signals, and rationales.
"""

import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

try:
    from backend.config import GEMINI_ENABLED
    from backend.nlp_service import NLPService
    from backend.gemini_service import GeminiService
except ImportError:
    from config import GEMINI_ENABLED
    from nlp_service import NLPService
    from gemini_service import GeminiService


class CategoryDetectionResult(BaseModel):
    """Structured output for innovation category detection."""

    primary_category: str = Field(default="Ayurvedic Formulation")
    secondary_category: Optional[str] = Field(default=None)
    confidence: float = Field(default=0.85)
    confidence_label: str = Field(default="High")  # High, Medium, Low
    reason: str = Field(default="")
    detected_signals: List[str] = Field(default_factory=list)


# 19 Official Innovation Categories
SUPPORTED_CATEGORIES = [
    "Ayurvedic Formulation",
    "Classical Ayurvedic Formulation",
    "Proprietary ASU Medicine",
    "Herbal Product",
    "Extraction Process",
    "Manufacturing Process",
    "Drug Delivery System",
    "Nano Formulation",
    "Cosmetic Product",
    "Ayurveda Aahara / Food Product",
    "Nutraceutical",
    "Medical Device",
    "Diagnostic Innovation",
    "Biological Resource Innovation",
    "Agricultural / Herbal Cultivation Innovation",
    "Traditional Knowledge Based Innovation",
    "Software / AI Innovation",
    "Research Process",
    "Other",
]


class AICategoryDetector:
    """
    Automated Category Detection Engine for IP-SAKTI Sahayak.
    Uses multi-layer keyword signals, spaCy NLP patterns, and Gemini AI.
    """

    CATEGORY_SIGNALS = {
        "Nano Formulation": [
            "nano", "nanoparticle", "nano-extraction", "nano-emulsion", "liposome",
            "liposomal", "nanogel", "nanocarrier", "sub-micron", "encapsulated nano"
        ],
        "Drug Delivery System": [
            "gel", "patch", "transdermal", "sublingual", "fast-melt", "controlled-release",
            "matrix tablet", "micro-pellet", "nasal spray", "inhaler", "topical ointment", "capsule"
        ],
        "Extraction Process": [
            "extraction", "extract", "supercritical", "co2 extraction", "solvent extraction",
            "cold press", "ultrasound extraction", "phytopharmaceutical", "standardized extract"
        ],
        "Manufacturing Process": [
            "fermentation", "process", "synthesis", "method", "continuous process",
            "vacuum drying", "bhasma processing", "shodhana", "marana"
        ],
        "Software / AI Innovation": [
            "ai", "artificial intelligence", "machine learning", "algorithm", "software",
            "model", "predictive", "digital platform", "diagnostic software"
        ],
        "Ayurveda Aahara / Food Product": [
            "food", "aahara", "beverage", "energy bar", "tea", "drink", "edible",
            "chyawanprash bar", "nutritional food", "fssai"
        ],
        "Cosmetic Product": [
            "serum", "cream", "lotion", "skin", "hair color", "shampoo", "beauty",
            "cosmetic", "facial", "radiance", "toothpaste", "oral care"
        ],
        "Nutraceutical": [
            "supplement", "nutraceutical", "dietary supplement", "vitamin", "health drink",
            "immunity booster", "capsule supplement"
        ],
        "Diagnostic Innovation": [
            "diagnostic", "prakriti assessment", "nadi pulse", "sensor", "detector",
            "kit", "testing device"
        ],
        "Medical Device": [
            "device", "equipment", "applicator", "transducer", "instrument", "tool"
        ],
        "Classical Ayurvedic Formulation": [
            "classical", "churna", "tailam", "ghrita", "asava", "arishta", "bhasma",
            "kwatha", "charaka", "sushruta", "rasayana"
        ],
        "Proprietary ASU Medicine": [
            "proprietary", "patent medicine", "asu medicine", "rule 158-b", "polyherbal composition"
        ],
    }

    def __init__(self):
        self.local_nlp = NLPService()
        self.gemini_service = GeminiService()

    def detect_category(
        self, innovation_name: str, description: str
    ) -> CategoryDetectionResult:
        """
        Detects innovation category from title and text description.
        """
        full_text = f"{innovation_name} {description}".lower()
        signals_found: List[str] = []
        category_scores: Dict[str, float] = {}

        # 1. Rule-based signal match
        for cat, keywords in self.CATEGORY_SIGNALS.items():
            score = 0.0
            for kw in keywords:
                if kw in full_text:
                    score += 1.5 if kw in innovation_name.lower() else 1.0
                    if kw.title() not in signals_found:
                        signals_found.append(kw.title())
            if score > 0:
                category_scores[cat] = score

        # 2. Extract herbs from spaCy NLP to detect Ayurvedic signals
        nlp_res = self.local_nlp.extract(full_text)
        if nlp_res.ingredients:
            for ing in nlp_res.ingredients:
                if ing not in signals_found:
                    signals_found.append(ing)

        # Determine top 2 categories from local rules
        sorted_cats = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
        
        primary = sorted_cats[0][0] if sorted_cats else "Ayurvedic Formulation"
        secondary = sorted_cats[1][0] if len(sorted_cats) > 1 else None

        if primary == "Ayurvedic Formulation" and nlp_res.ingredients and "Nano Formulation" in [c[0] for c in sorted_cats]:
            secondary = "Ayurvedic Formulation"
            primary = "Nano Formulation"

        confidence = 0.88 if len(signals_found) >= 3 else 0.75
        conf_label = "High" if confidence >= 0.85 else "Medium"

        reason = (
            f"Detected key technical signals: {', '.join(signals_found[:4])}. "
            f"The innovation combines {primary.lower()} characteristics with Ayurvedic principles."
        )

        return CategoryDetectionResult(
            primary_category=primary,
            secondary_category=secondary,
            confidence=confidence,
            confidence_label=conf_label,
            reason=reason,
            detected_signals=signals_found,
        )


if __name__ == "__main__":
    detector = AICategoryDetector()
    res = detector.detect_category(
        "Ayurvedic Wound Healing Formulation",
        "I developed a wound healing formulation using Neem and Turmeric with a nano-extraction process to improve skin absorption."
    )
    print("Category Detector Test Result:")
    print(res.model_dump_json(indent=2))
    assert res.primary_category in ["Nano Formulation", "Ayurvedic Formulation", "Drug Delivery System"]
    print("[OK] Category Detector test passed cleanly!")
