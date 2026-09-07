"""
IP-SAKTI Sahayak - Regime-Aware Retrieval Engine
Module for executing regime-targeted RAG retrieval using InnovationFingerprint & DecisionResults.
"""

import sys
from pathlib import Path
from typing import List, Dict, Any, Union, Optional
from pydantic import BaseModel, Field

# Support both package import and direct script execution
sys.path.append(str(Path(__file__).parent.parent))

try:
    from backend.fingerprint_schema import InnovationFingerprint
    from backend.retrieval import KnowledgeRetriever
    from backend.decision_map import DecisionResult
except ImportError:
    from fingerprint_schema import InnovationFingerprint
    from retrieval import KnowledgeRetriever
    from decision_map import DecisionResult


class EvidenceItem(BaseModel):
    """Schema for a single evidence document chunk with source metadata."""

    id: str
    law: str
    section: str
    jurisdiction: str
    plain_explanation: str
    source_note: str
    confidence: str
    score: float


class RegimeEvidenceGroup(BaseModel):
    """Group of retrieved evidence chunks for a specific regime."""

    query: str
    evidence: List[Dict[str, Any]] = Field(default_factory=list)


class RegimeRetrievalEngine:
    """
    Regime-Aware Retrieval Engine.
    Generates targeted, regime-specific search queries based on the InnovationFingerprint
    and DecisionResults, retrieving grounded evidence per regulatory regime.
    """

    def __init__(self, retriever: Optional[KnowledgeRetriever] = None):
        self.retriever = retriever or KnowledgeRetriever()

    def generate_regime_query(self, regime_name: str, fingerprint: InnovationFingerprint) -> str:
        """
        Generates a highly targeted search query for a specific legal/regulatory regime.
        """
        regime_upper = regime_name.upper().strip()

        title = fingerprint.innovation_name or ""
        ingredients_str = " ".join(fingerprint.ingredients) if fingerprint.ingredients else ""
        novelty_desc = fingerprint.novelty.description or ""
        novelty_types = " ".join(fingerprint.novelty.novelty_type) if fingerprint.novelty.novelty_type else ""
        source_loc = fingerprint.biological_resources.source_location or ""
        category = fingerprint.product_category or ""
        intended_use = fingerprint.intended_use or ""
        manufacturing = fingerprint.manufacturing_process or ""

        if "PATENT" in regime_upper:
            query = f"Patent Act Section 3(p) Section 3(e) patentability non-obviousness inventive step mere admixture traditional knowledge bar {title} {novelty_types} {novelty_desc} {ingredients_str}"
        elif "TK" in regime_upper or "TRADITIONAL" in regime_upper:
            query = f"Traditional Knowledge Digital Library TKDL prior art classical texts Charaka Samhita Sushruta Samhita geographical indication GI {title} {ingredients_str} {intended_use}"
        elif "ABS" in regime_upper or "BIODIVERSITY" in regime_upper or "NBA" in regime_upper:
            query = f"Biological Diversity Act BDA 2023 National Biodiversity Authority NBA Form 8 registration Form 7 Section 6(1A) Section 7 cultivated BMC Certificate of Origin benefit sharing access {title} {source_loc} {ingredients_str}"
        elif "REGULATORY" in regime_upper or "AYUSH" in regime_upper:
            query = f"Drugs and Cosmetics Act DCA Section 3(a) Form 25D Rule 158-B proprietary ASU classical ASU FSSAI Ayurveda Aahara food Phytopharmaceutical CDSCO NDCT Rule 2(ec) {title} {category} {ingredients_str} {intended_use} {manufacturing}"
        else:
            query = f"{regime_name} legal compliance regulation India {title} {ingredients_str}"

        # Clean whitespace
        return " ".join(query.split())

    def retrieve_for_regimes(
        self,
        fingerprint: Union[InnovationFingerprint, Dict[str, Any]],
        decisions: Union[List[Union[DecisionResult, Dict[str, Any]]], Dict[str, Any]],
        top_k_per_regime: int = 2,
    ) -> Dict[str, Dict[str, Any]]:
        """
        Performs regime-aware targeted retrieval.

        Args:
            fingerprint: InnovationFingerprint instance or dictionary.
            decisions: List of DecisionResult objects, dict, or list of decision dicts.
            top_k_per_regime: Max evidence chunks to retrieve per regime.

        Returns:
            Dictionary mapping regime names to targeted query and list of evidence chunks.
        """
        # Convert dict fingerprint if needed
        if isinstance(fingerprint, dict):
            fp_obj = InnovationFingerprint.from_user_input(
                innovation_name=fingerprint.get("innovation_name", "Innovation"),
                description=fingerprint.get("description", ""),
                ingredients=fingerprint.get("ingredients", []),
                intended_use=fingerprint.get("intended_use"),
                product_category=fingerprint.get("product_category"),
                novelty_description=fingerprint.get("novelty", {}).get("description") if isinstance(fingerprint.get("novelty"), dict) else None,
                novelty_types=fingerprint.get("novelty", {}).get("novelty_type") if isinstance(fingerprint.get("novelty"), dict) else None,
                biological_resource_used=bool(fingerprint.get("biological_resources", {}).get("biological_resource_used")) if isinstance(fingerprint.get("biological_resources"), dict) else False,
                source_location=fingerprint.get("biological_resources", {}).get("source_location") if isinstance(fingerprint.get("biological_resources"), dict) else None,
            )
        else:
            fp_obj = fingerprint

        # Standardize decision regimes list
        regime_names: List[str] = []
        if isinstance(decisions, dict):
            raw_decisions = decisions.get("decisions", decisions.get("regimes", []))
        else:
            raw_decisions = decisions

        for d in raw_decisions:
            if isinstance(d, DecisionResult):
                regime_names.append(d.regime_name)
            elif isinstance(d, dict):
                regime_names.append(d.get("regime_name", d.get("name", "UNKNOWN")))

        # Default fallback regimes if none supplied
        if not regime_names:
            regime_names = ["PATENT", "TRADITIONAL_KNOWLEDGE", "ABS", "REGULATORY"]

        results: Dict[str, Dict[str, Any]] = {}
        seen_chunk_ids: set[str] = set()

        for regime in regime_names:
            # Map canonical regime names
            canonical_name = regime.upper().strip()
            if "PATENT" in canonical_name:
                key_name = "PATENT"
            elif "TK" in canonical_name or "TRADITIONAL" in canonical_name:
                key_name = "TRADITIONAL_KNOWLEDGE"
            elif "ABS" in canonical_name or "BIODIVERSITY" in canonical_name or "NBA" in canonical_name:
                key_name = "ABS"
            elif "REGULATORY" in canonical_name or "AYUSH" in canonical_name:
                key_name = "REGULATORY"
            else:
                key_name = canonical_name

            # 1. Generate targeted query for this regime
            query = self.generate_regime_query(key_name, fp_obj)

            # 2. Retrieve top evidence chunks from retrieval engine using regime filter
            raw_evidence = self.retriever.retrieve(query, top_k=top_k_per_regime * 2, regime_filter=key_name)

            # 3. Filter duplicates and preserve source metadata
            regime_evidence = []
            for chunk in raw_evidence:
                chunk_id = chunk["id"]
                if chunk_id not in seen_chunk_ids or len(regime_evidence) == 0:
                    seen_chunk_ids.add(chunk_id)
                    evidence_entry = {
                        "id": chunk["id"],
                        "law": chunk["law"],
                        "section": chunk["section"],
                        "jurisdiction": chunk.get("jurisdiction", "India"),
                        "text": chunk.get("text", ""),
                        "plain_explanation": chunk.get("plain_explanation", ""),
                        "source_note": chunk.get("source_note", ""),
                        "confidence": chunk.get("confidence", "high"),
                        "score": chunk["score"],
                    }
                    regime_evidence.append(evidence_entry)
                    if len(regime_evidence) >= top_k_per_regime:
                        break

            results[key_name] = {
                "query": query,
                "evidence": regime_evidence,
            }

        return results


if __name__ == "__main__":
    import json

    print("=== Running Regime-Aware Retrieval Engine Test ===\n")

    # Sample InnovationFingerprint
    sample_fingerprint = InnovationFingerprint.from_user_input(
        innovation_name="Ayurvedic Wound Healing Formulation",
        description="Topical formulation combining Neem and Turmeric with nano-extraction process.",
        ingredients="Neem, Turmeric",
        intended_use="Wound healing",
        novelty_description="Nano-extraction process to improve skin absorption",
        novelty_types=["extraction_method", "process"],
        biological_resource_used=True,
        source_location="Tamil Nadu",
    )

    # Sample Decision Results
    sample_decisions = [
        DecisionResult(
            regime_name="PATENT",
            status="POSSIBLE",
            reason="Novel nano-extraction process may overcome Section 3(p) TK bar if synergy is established.",
            triggered_by=["nano-extraction process"],
        ),
        DecisionResult(
            regime_name="TKDL_PRIOR_ART",
            status="OVERLAP_POSSIBLE",
            reason="Ingredients Neem and Turmeric are cited extensively in Ayurvedic classical texts.",
            triggered_by=["Neem", "Turmeric"],
        ),
        DecisionResult(
            regime_name="NATIONAL_BIODIVERSITY_AUTHORITY",
            status="CLASSIFICATION_REQUIRED",
            reason="Biological resources sourced from Tamil Nadu require NBA registration.",
            triggered_by=["Tamil Nadu", "Neem"],
        ),
        DecisionResult(
            regime_name="AYUSH_REGULATORY",
            status="REVIEW_REQUIRED",
            reason="ASU drug licensing required under Rule 158-B of Drugs and Cosmetics Rules.",
            triggered_by=["Topical formulation"],
        ),
    ]

    engine = RegimeRetrievalEngine()
    retrieved_data = engine.retrieve_for_regimes(sample_fingerprint, sample_decisions)

    print("Regime-Aware Retrieval Output JSON:")
    print(json.dumps(retrieved_data, indent=2))

    # Assertions
    assert "PATENT" in retrieved_data
    assert "TRADITIONAL_KNOWLEDGE" in retrieved_data
    assert "ABS" in retrieved_data
    assert "REGULATORY" in retrieved_data

    assert len(retrieved_data["PATENT"]["evidence"]) > 0
    assert len(retrieved_data["TRADITIONAL_KNOWLEDGE"]["evidence"]) > 0
    assert len(retrieved_data["ABS"]["evidence"]) > 0
    assert len(retrieved_data["REGULATORY"]["evidence"]) > 0

    print("\n[OK] Regime-Aware Retrieval Engine test passed cleanly!")
