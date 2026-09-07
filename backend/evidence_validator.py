"""
IP-SAKTI Sahayak - Evidence Validator
Module for validating whether retrieved legal evidence is sufficient to ground regime guidance.
"""

import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# Support both package import and direct script execution
sys.path.append(str(Path(__file__).parent.parent))


class EvidenceValidationResult(BaseModel):
    """Schema for the validation assessment of retrieved evidence for a specific regime."""

    regime: str = Field(..., description="Name of the regulatory/legal regime evaluated.")
    status: str = Field(..., description="SUPPORTED, PARTIALLY_SUPPORTED, INSUFFICIENT_EVIDENCE, or ABSTAIN.")
    confidence: str = Field(..., description="Assessment confidence level (high, medium, low).")
    evidence_count: int = Field(..., description="Number of evidence chunks retrieved.")
    top_score: float = Field(..., description="Highest relevance score among retrieved chunks.")
    citations: List[str] = Field(default_factory=list, description="Strict legal citations extracted from evidence.")
    warning: Optional[str] = Field(default=None, description="Warning or abstention message if evidence is insufficient.")


class EvidenceValidator:
    """
    Validates retrieved legal evidence against configurable relevance thresholds
    to prevent hallucinated or ungrounded regulatory advice.
    """

    DEFAULT_INSUFFICIENT_MSG = "Unable to verify this guidance from the currently available knowledge sources."

    def __init__(
        self,
        supported_threshold: float = 0.70,
        partial_threshold: float = 0.40,
    ):
        self.supported_threshold = supported_threshold
        self.partial_threshold = partial_threshold

    def validate_regime_evidence(
        self,
        regime_name: str,
        evidence_list: List[Dict[str, Any]],
        web_sources: Optional[List[Dict[str, Any]]] = None,
    ) -> EvidenceValidationResult:
        """
        Validates the evidence list for a specific regime, combining local RAG evidence and optional web sources.

        Args:
            regime_name: Name of the regime (e.g. PATENT, ABS).
            evidence_list: List of retrieved local evidence dictionary chunks.
            web_sources: Optional list of validated web research items.

        Returns:
            EvidenceValidationResult instance.
        """
        all_evidence = list(evidence_list or [])
        web_sources = web_sources or []

        # Merge web sources into evidence assessment if provided
        combined_scores = []
        for chunk in all_evidence:
            score = float(chunk.get("score", chunk.get("relevance_score", 0.0)))
            combined_scores.append(score)

        for wsrc in web_sources:
            score = float(wsrc.get("score", wsrc.get("authority_score", 0.70)))
            combined_scores.append(score)

        total_count = len(all_evidence) + len(web_sources)

        # 1. No evidence retrieved -> ABSTAIN
        if total_count == 0:
            return EvidenceValidationResult(
                regime=regime_name,
                status="ABSTAIN",
                confidence="low",
                evidence_count=0,
                top_score=0.0,
                citations=[],
                warning=self.DEFAULT_INSUFFICIENT_MSG,
            )

        top_score = max(combined_scores) if combined_scores else 0.0

        # Extract strict citations from actual local evidence chunks
        citations = []
        for chunk in all_evidence:
            chunk_id = chunk.get("id", "")
            law = chunk.get("law", "")
            section = chunk.get("section", "")
            if chunk_id and law:
                citation_str = f"{law} ({section}) [ID: {chunk_id}]" if section else f"{law} [ID: {chunk_id}]"
                if citation_str not in citations:
                    citations.append(citation_str)

        # Extract citations from web sources
        for wsrc in web_sources:
            title = wsrc.get("title", "Official Source")
            url = wsrc.get("url", "")
            domain = wsrc.get("domain", "")
            if url:
                w_cite = f"{title} - {domain} ({url})" if domain else f"{title} ({url})"
                if w_cite not in citations:
                    citations.append(w_cite)

        # 2. Score evaluation against configurable thresholds
        if top_score < self.partial_threshold:
            status = "INSUFFICIENT_EVIDENCE"
            confidence = "low"
            warning = self.DEFAULT_INSUFFICIENT_MSG
        elif top_score < self.supported_threshold:
            status = "PARTIALLY_SUPPORTED"
            confidence = "medium"
            warning = "Guidance is partially supported by available legal sources. Verify with primary gazette text."
        else:
            status = "SUPPORTED"
            confidence = "high"
            warning = None

        return EvidenceValidationResult(
            regime=regime_name,
            status=status,
            confidence=confidence,
            evidence_count=total_count,
            top_score=round(top_score, 4),
            citations=citations,
            warning=warning,
        )

    def validate_all_regimes(
        self,
        regime_evidence_map: Dict[str, Dict[str, Any]],
        web_research_map: Optional[Dict[str, List[Dict[str, Any]]]] = None,
    ) -> Dict[str, EvidenceValidationResult]:
        """
        Validates all regimes in a regime-aware retrieval map.

        Args:
            regime_evidence_map: Output dictionary from RegimeRetrievalEngine.
            web_research_map: Optional dictionary mapping regime names to lists of web research sources.

        Returns:
            Dictionary mapping regime names to EvidenceValidationResult objects.
        """
        results: Dict[str, EvidenceValidationResult] = {}
        web_research_map = web_research_map or {}

        for regime, data in regime_evidence_map.items():
            evidence = data.get("evidence", []) if isinstance(data, dict) else []
            web_sources = web_research_map.get(regime, [])
            results[regime] = self.validate_regime_evidence(regime, evidence, web_sources=web_sources)
        return results


if __name__ == "__main__":
    import json

    print("=== Running EvidenceValidator Test ===\n")

    validator = EvidenceValidator(supported_threshold=0.70, partial_threshold=0.40)

    # Simulated test retrieval outputs for 4 regimes
    test_retrieval_data = {
        "PATENT": {
            "evidence": [
                {
                    "id": "PA-3P-001",
                    "law": "The Patents Act, 1970",
                    "section": "Section 3(p)",
                    "score": 0.7250,
                },
                {
                    "id": "PA-3P-002",
                    "law": "The Patents Act, 1970",
                    "section": "Section 3(p) Legislative Intent",
                    "score": 0.6500,
                },
            ]
        },
        "TRADITIONAL_KNOWLEDGE": {
            "evidence": [
                {
                    "id": "TKDL-001",
                    "law": "Traditional Knowledge Digital Library Framework",
                    "section": "Purpose and Function",
                    "score": 0.8100,
                }
            ]
        },
        "ABS": {
            "evidence": [
                {
                    "id": "BDA-2023-008",
                    "law": "Biological Diversity (Amendment) Act, 2023",
                    "section": "Section 21",
                    "score": 0.5500,
                }
            ]
        },
        "REGULATORY": {
            "evidence": [
                {
                    "id": "DCA-3A-001",
                    "law": "Drugs and Cosmetics Act, 1940",
                    "section": "Section 3(a)",
                    "score": 0.3500,  # Below partial_threshold (0.40)
                }
            ]
        },
        "UNSUPPORTED_REGIME": {
            "evidence": []  # Empty evidence list -> ABSTAIN
        },
    }

    validation_results = validator.validate_all_regimes(test_retrieval_data)

    print("Validation Results Summary:")
    for regime, val_res in validation_results.items():
        print(f"Regime: {regime}")
        print(f"  Status        : {val_res.status}")
        print(f"  Confidence    : {val_res.confidence}")
        print(f"  Top Score     : {val_res.top_score}")
        print(f"  Evidence Count: {val_res.evidence_count}")
        print(f"  Citations     : {val_res.citations}")
        print(f"  Warning       : {val_res.warning}\n")

    # Verification assertions
    assert validation_results["PATENT"].status == "SUPPORTED"
    assert validation_results["TRADITIONAL_KNOWLEDGE"].status == "SUPPORTED"
    assert validation_results["ABS"].status == "PARTIALLY_SUPPORTED"
    assert validation_results["REGULATORY"].status == "INSUFFICIENT_EVIDENCE"
    assert validation_results["REGULATORY"].warning == "Unable to verify this guidance from the currently available knowledge sources."
    assert validation_results["UNSUPPORTED_REGIME"].status == "ABSTAIN"
    assert validation_results["UNSUPPORTED_REGIME"].warning == "Unable to verify this guidance from the currently available knowledge sources."

    print("[OK] Evidence Validator test passed cleanly!")
