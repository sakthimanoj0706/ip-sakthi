"""
IP-SAKTI Sahayak - spaCy NLP Service & Domain Extractor
Provides entity extraction, phrase matching, and botanical normalization using spaCy and Ayurveda domain rules.
"""

import re
from typing import Dict, List, Any, Set
from pydantic import BaseModel, Field

try:
    import spacy
    from spacy.matcher import PhraseMatcher
    _SPACY_AVAILABLE = True
except ImportError:
    _SPACY_AVAILABLE = False

try:
    from backend.domain_patterns import (
        AYURVEDA_HERB_MAP,
        PROCESS_PATTERNS,
        INTENDED_USE_PATTERNS,
        INDIAN_STATES_LOCATIONS,
    )
except ImportError:
    from domain_patterns import (
        AYURVEDA_HERB_MAP,
        PROCESS_PATTERNS,
        INTENDED_USE_PATTERNS,
        INDIAN_STATES_LOCATIONS,
    )


class NLPExtractionResult(BaseModel):
    """Structured extraction result produced by spaCy and domain pattern matching."""

    ingredients: List[str] = Field(default_factory=list)
    scientific_names: List[str] = Field(default_factory=list)
    ayurvedic_names: List[str] = Field(default_factory=list)
    processes: List[str] = Field(default_factory=list)
    uses: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    innovation_type: str = Field(default="Formulation")
    confidence: float = Field(default=0.0)


class NLPService:
    """
    spaCy NLP Service for Ayurveda IP entity extraction & phrase matching.
    Combines spaCy PhraseMatcher, dictionary lookup, regex, and rule-based fallback.
    """

    def __init__(self):
        self.nlp = None
        self.matcher = None
        self._init_spacy()

    def _init_spacy(self):
        if not _SPACY_AVAILABLE:
            return

        try:
            self.nlp = spacy.load("en_core_web_sm")
            self.matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")

            # Add herb phrase patterns
            herb_docs = []
            for key, data in AYURVEDA_HERB_MAP.items():
                for syn in data["synonyms"]:
                    herb_docs.append(self.nlp.make_doc(syn))
            if herb_docs:
                self.matcher.add("HERBS", herb_docs)

            # Add process phrase patterns
            proc_docs = [self.nlp.make_doc(p) for p in PROCESS_PATTERNS]
            if proc_docs:
                self.matcher.add("PROCESSES", proc_docs)

            # Add location patterns
            loc_docs = [self.nlp.make_doc(l) for l in INDIAN_STATES_LOCATIONS]
            if loc_docs:
                self.matcher.add("LOCATIONS", loc_docs)

        except Exception:
            self.nlp = None
            self.matcher = None

    def extract(self, text: str) -> NLPExtractionResult:
        """
        Extracts structured entities and terms from input text using spaCy and domain patterns.
        """
        text_lower = text.lower()
        matched_ingredients: Set[str] = set()
        matched_scientific: Set[str] = set()
        matched_ayurvedic: Set[str] = set()
        matched_processes: Set[str] = set()
        matched_uses: Set[str] = set()
        matched_locations: Set[str] = set()

        # 1. Dictionary & Regex Search (High Reliability)
        for key, data in AYURVEDA_HERB_MAP.items():
            for syn in data["synonyms"]:
                if re.search(r"\b" + re.escape(syn) + r"\b", text_lower):
                    matched_ingredients.add(data["common_name"])
                    if data["scientific_name"]:
                        matched_scientific.add(data["scientific_name"])
                    if data["ayurvedic_name"]:
                        matched_ayurvedic.add(data["ayurvedic_name"])
                    break

        for proc in PROCESS_PATTERNS:
            if re.search(r"\b" + re.escape(proc) + r"\b", text_lower):
                matched_processes.add(proc.title())

        for use in INTENDED_USE_PATTERNS:
            if re.search(r"\b" + re.escape(use) + r"\b", text_lower):
                matched_uses.add(use.title())

        for loc in INDIAN_STATES_LOCATIONS:
            if re.search(r"\b" + re.escape(loc) + r"\b", text_lower):
                matched_locations.add(loc.title())

        # 2. spaCy PhraseMatcher & Named Entity Recognition (if loaded)
        if self.nlp and self.matcher:
            doc = self.nlp(text)
            matches = self.matcher(doc)
            for match_id, start, end in matches:
                string_id = self.nlp.vocab.strings[match_id]
                span_text = doc[start:end].text.lower()
                if string_id == "HERBS":
                    for key, data in AYURVEDA_HERB_MAP.items():
                        if span_text in data["synonyms"]:
                            matched_ingredients.add(data["common_name"])
                            if data["scientific_name"]:
                                matched_scientific.add(data["scientific_name"])
                            if data["ayurvedic_name"]:
                                matched_ayurvedic.add(data["ayurvedic_name"])
                elif string_id == "PROCESSES":
                    matched_processes.add(span_text.title())
                elif string_id == "LOCATIONS":
                    matched_locations.add(span_text.title())

            # spaCy GPE (Geopolitical Entity) NER
            for ent in doc.ents:
                if ent.label_ in ["GPE", "LOC"] and ent.text.title() not in matched_locations:
                    matched_locations.add(ent.text.title())

        # Determine innovation category
        inn_type = "Formulation"
        if matched_processes and any(k in " ".join(matched_processes).lower() for k in ["nano", "extraction", "fermentation"]):
            inn_type = "Process / Method"

        # Confidence calculation
        matched_count = len(matched_ingredients) + len(matched_processes) + len(matched_uses)
        confidence = min(0.95, round(0.50 + matched_count * 0.15, 2)) if matched_count > 0 else 0.40

        return NLPExtractionResult(
            ingredients=sorted(list(matched_ingredients)),
            scientific_names=sorted(list(matched_scientific)),
            ayurvedic_names=sorted(list(matched_ayurvedic)),
            processes=sorted(list(matched_processes)),
            uses=sorted(list(matched_uses)),
            locations=sorted(list(matched_locations)),
            innovation_type=inn_type,
            confidence=confidence,
        )


if __name__ == "__main__":
    print("=== Running spaCy NLP Service Test ===")
    service = NLPService()
    test_text = (
        "I developed an Ayurvedic wound healing formulation using Neem (vempu) and Turmeric (haldi). "
        "I use a new nano-extraction process to improve skin absorption. The herbs are sourced from Tamil Nadu."
    )
    result = service.extract(test_text)
    print("Extracted Result:")
    print(result.model_dump_json(indent=2))

    assert "Neem" in result.ingredients
    assert "Turmeric" in result.ingredients
    assert "Azadirachta indica" in result.scientific_names
    assert "Tamil Nadu" in result.locations
    print("\n[OK] spaCy NLP Service test passed cleanly!")
