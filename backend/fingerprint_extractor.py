"""
IP-SAKTI Sahayak - Multi-Layer Innovation Fingerprint Extractor
Orchestrates Language Detection -> spaCy NLP -> Ayurveda Dictionary -> Rule Engine -> Gemini AI (Optional Enhancement),
merging results into a unified, normalized InnovationFingerprint object.
"""

import re
from typing import Dict, List, Any, Optional

try:
    from langdetect import detect
    _LANGDETECT_AVAILABLE = True
except ImportError:
    _LANGDETECT_AVAILABLE = False

try:
    from backend.config import GEMINI_ENABLED
    from backend.fingerprint_schema import (
        InnovationFingerprint,
        BiologicalResourceDetails,
        TraditionalKnowledgeDetails,
        ExtractionSourceFlags,
    )
    from backend.nlp_service import NLPService
    from backend.gemini_service import GeminiService
    from backend.domain_patterns import AYURVEDA_HERB_MAP
except ImportError:
    from config import GEMINI_ENABLED
    from fingerprint_schema import (
        InnovationFingerprint,
        BiologicalResourceDetails,
        TraditionalKnowledgeDetails,
        ExtractionSourceFlags,
    )
    from nlp_service import NLPService
    from gemini_service import GeminiService
    from domain_patterns import AYURVEDA_HERB_MAP


class FingerprintExtractor:
    """
    Multi-layer Extraction Pipeline for Ayurveda Innovations.
    Ensures high precision by combining local NLP rules with Gemini AI intelligence.
    """

    def __init__(self):
        self.local_nlp = NLPService()
        self.gemini_service = GeminiService()

    def detect_language(self, text: str) -> str:
        """Detects language (English, Tamil, Hindi, or Tanglish)."""
        # Heuristics for Tamil / Hindi unicode characters
        if any(c > '\u0B80' and c < '\u0BFF' for c in text):
            return "Tamil"
        elif any(c > '\u0900' and c < '\u097F' for c in text):
            return "Hindi"

        # Check for Tanglish / Hinglish transliteration keywords
        text_lower = text.lower()
        if any(k in text_lower for k in ["panni", "panniruken", "use panni", "create panniruken", "kodukuthu"]):
            return "Tanglish"
        elif any(k in text_lower for k in ["banya hai", "karya", "gaya hai", "karniki"]):
            return "Hinglish"

        if _LANGDETECT_AVAILABLE:
            try:
                code = detect(text)
                if code == "ta":
                    return "Tamil"
                elif code == "hi":
                    return "Hindi"
            except Exception:
                pass

        return "English"

    def extract_fingerprint(
        self,
        text: str,
        innovation_name: Optional[str] = None,
        initial_answers: Optional[Dict[str, Any]] = None,
    ) -> InnovationFingerprint:
        """
        Runs the complete multi-layer extraction pipeline and returns a unified InnovationFingerprint.
        """
        # 1. Language Detection
        detected_lang = self.detect_language(text)

        # 2. Local spaCy NLP & Ayurveda Dictionary Extraction
        spacy_res = self.local_nlp.extract(text)
        spacy_used = len(spacy_res.ingredients) > 0 or len(spacy_res.processes) > 0

        # 3. Gemini AI Extraction (if enabled)
        gemini_res = None
        gemini_used = False
        if self.gemini_service.enabled:
            gemini_res = self.gemini_service.extract_structured_fingerprint(text)
            gemini_used = bool(gemini_res and (gemini_res.ingredients or gemini_res.process))

        # 4. Result Merging & Botanical Normalization
        merged_ingredients: set[str] = set(spacy_res.ingredients)
        merged_scientific: set[str] = set(spacy_res.scientific_names)
        merged_ayurvedic: set[str] = set(spacy_res.ayurvedic_names)
        merged_processes: set[str] = set(spacy_res.processes)
        merged_uses: set[str] = set(spacy_res.uses)
        merged_locations: set[str] = set(spacy_res.locations)

        if gemini_res:
            for ing in gemini_res.ingredients:
                merged_ingredients.add(ing.title())
            for sc in gemini_res.scientific_names:
                merged_scientific.add(sc)
            for ay in gemini_res.ayurvedic_names:
                merged_ayurvedic.add(ay)
            if gemini_res.process:
                merged_processes.add(gemini_res.process)
            if gemini_res.intended_use:
                merged_uses.add(gemini_res.intended_use)
            if gemini_res.source_location:
                merged_locations.add(gemini_res.source_location)

        # Incorporate initial answers if provided
        if initial_answers:
            if initial_answers.get("ingredients"):
                ings = initial_answers["ingredients"]
                if isinstance(ings, str):
                    for i in ings.split(","):
                        if i.strip():
                            merged_ingredients.add(i.strip().title())
                elif isinstance(ings, list):
                    for i in ings:
                        merged_ingredients.add(str(i).strip().title())

            if initial_answers.get("source_location"):
                merged_locations.add(str(initial_answers["source_location"]).title())

        # Botanical Enrichment via Ayurveda Dictionary
        for ing in list(merged_ingredients):
            ing_lower = ing.lower()
            for key, data in AYURVEDA_HERB_MAP.items():
                if ing_lower in data["synonyms"] or key in ing_lower:
                    if data["scientific_name"]:
                        merged_scientific.add(data["scientific_name"])
                    if data["ayurvedic_name"]:
                        merged_ayurvedic.add(data["ayurvedic_name"])

        # Determine titles and categories
        title = innovation_name or (
            f"Ayurvedic {list(merged_ingredients)[0]} Formulation"
            if merged_ingredients
            else "Ayurvedic Innovation Formulation"
        )
        
        novelty_list = list(merged_processes) if merged_processes else ["Novel formulation"]
        location_str = ", ".join(list(merged_locations)) if merged_locations else None
        is_bio_used = len(merged_ingredients) > 0 or bool(location_str)

        # 5. Compute Confidence Score
        confidence = 0.85
        if gemini_used and spacy_used:
            confidence = 0.95
        elif spacy_used:
            confidence = 0.90
        elif gemini_used:
            confidence = 0.88

        # Build missing information list
        missing = []
        if not merged_ingredients:
            missing.append("ingredients")
        if not merged_processes:
            missing.append("process")
        if not merged_uses:
            missing.append("intended_use")
        if is_bio_used and not location_str:
            missing.append("source_location")

        return InnovationFingerprint(
            original_input=text,
            detected_language=detected_lang,
            innovation_name=title,
            description=text,
            ingredients=sorted(list(merged_ingredients)),
            scientific_names=sorted(list(merged_scientific)),
            ayurvedic_names=sorted(list(merged_ayurvedic)),
            process=sorted(list(merged_processes)),
            intended_use=sorted(list(merged_uses)),
            novelty_indicators=novelty_list,
            innovation_type=spacy_res.innovation_type,
            biological_resource=BiologicalResourceDetails(
                detected=is_bio_used,
                resources=sorted(list(merged_ingredients)),
                source_location=location_str,
                confidence=confidence,
            ),
            traditional_knowledge=TraditionalKnowledgeDetails(
                possible_overlap=len(merged_ingredients) > 0,
                indicators=sorted(list(merged_ingredients)),
                confidence=confidence,
            ),
            missing_information=missing,
            overall_confidence=confidence,
            extraction_source=ExtractionSourceFlags(
                gemini=gemini_used,
                spacy=spacy_used,
                rules=True,
            ),
        )

    # Alias for flexibility
    extract_from_text = extract_fingerprint


if __name__ == "__main__":
    import json
    print("=== Running Multi-Layer Fingerprint Extractor Test ===")
    
    extractor = FingerprintExtractor()
    multilingual_text = "வேம்பு மற்றும் மஞ்சளை பயன்படுத்தி புதிய nano extraction method create panniruken in Tamil Nadu."

    fp = extractor.extract_fingerprint(multilingual_text)
    print("Multi-Layer Fingerprint Output JSON:")
    print(json.dumps(fp.model_to_dict(), indent=2))

    assert "Neem" in fp.ingredients or "Turmeric" in fp.ingredients
    assert fp.extraction_source.rules is True
    print("\n[OK] Fingerprint Extractor test passed cleanly!")
