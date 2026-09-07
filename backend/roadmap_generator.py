"""
IP-SAKTI Sahayak - Personalized Action Roadmap Generator
Module for synthesizing InnovationFingerprint, DecisionResults, Retrieved Evidence,
and EvidenceValidationResults into an actionable, evidence-grounded IP & regulatory roadmap.
"""

import sys
from pathlib import Path
from typing import List, Dict, Any, Union, Optional
from pydantic import BaseModel, Field

# Support both package import and direct script execution
sys.path.append(str(Path(__file__).parent.parent))

try:
    from backend.fingerprint_schema import InnovationFingerprint
    from backend.decision_map import DecisionResult
    from backend.evidence_validator import EvidenceValidationResult
except ImportError:
    from fingerprint_schema import InnovationFingerprint
    from decision_map import DecisionResult
    from evidence_validator import EvidenceValidationResult


class SourceCitation(BaseModel):
    """Source legal citation metadata."""

    id: str
    law: str
    section: str
    excerpt: str


class RegimeRoadmapItem(BaseModel):
    """Personalized roadmap step for a specific regulatory regime."""

    regime: str
    status: str
    reason: str
    evidence_status: str
    what_we_detected: str
    why_it_matters: str
    what_to_check_next: List[str] = Field(default_factory=list)
    sources: List[SourceCitation] = Field(default_factory=list)
    warning: Optional[str] = None


class InnovationSummary(BaseModel):
    """Compact summary of the innovation fingerprint."""

    innovation_name: str
    ingredients: List[str]
    intended_use: Optional[str] = None
    novelty_claimed: Optional[str] = None
    biological_resources_used: bool = False
    source_location: Optional[str] = None


class PersonalizedRoadmap(BaseModel):
    """Complete personalized IP & regulatory action roadmap."""

    innovation_summary: InnovationSummary
    regime_roadmaps: List[RegimeRoadmapItem]
    overall_next_action: str
    disclaimer: str


class RoadmapGenerator:
    """
    Synthesizes multi-regime evaluation components into a structured,
    non-definitive, evidence-grounded action roadmap for Ayurveda innovators.
    """

    MANDATORY_DISCLAIMER = (
        "INFORMATIONAL GUIDANCE ONLY: This output is produced for preliminary informational "
        "and academic guidance regarding Ayurveda IP and regulatory pathways under Indian law. "
        "It does not constitute professional legal advice. Always consult a qualified patent agent, "
        "IP attorney, or regulatory consultant before taking legal or commercial actions."
    )

    def generate_roadmap(
        self,
        fingerprint: Union[InnovationFingerprint, Dict[str, Any]],
        decisions: Union[List[Union[DecisionResult, Dict[str, Any]]], Dict[str, Any]],
        evidence_map: Dict[str, Dict[str, Any]],
        validation_results: Dict[str, Union[EvidenceValidationResult, Dict[str, Any]]],
    ) -> Dict[str, Any]:
        """
        Generates a complete structured roadmap JSON.

        Args:
            fingerprint: InnovationFingerprint instance or dict.
            decisions: List of DecisionResult objects or dict.
            evidence_map: Output dictionary from RegimeRetrievalEngine.
            validation_results: Output dictionary from EvidenceValidator.

        Returns:
            Structured dictionary matching PersonalizedRoadmap schema.
        """
        # 1. Parse fingerprint summary
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

        use_str = ", ".join(fp_obj.intended_use) if isinstance(fp_obj.intended_use, list) else fp_obj.intended_use
        summary = InnovationSummary(
            innovation_name=fp_obj.innovation_name,
            ingredients=fp_obj.ingredients,
            intended_use=use_str,
            novelty_claimed=fp_obj.novelty.description if fp_obj.novelty.novelty_detected else "None claimed",
            biological_resources_used=fp_obj.biological_resources.biological_resource_used,
            source_location=fp_obj.biological_resources.source_location,
        )

        # 2. Parse decisions list
        decision_items: List[Dict[str, Any]] = []
        if isinstance(decisions, dict):
            raw_d = decisions.get("decisions", decisions.get("regimes", []))
        else:
            raw_d = decisions

        for d in raw_d:
            if isinstance(d, DecisionResult):
                decision_items.append({
                    "name": d.regime_name,
                    "status": d.status,
                    "reason": d.reason,
                    "triggered_by": d.triggered_by,
                    "action_items": d.action_items,
                })
            elif isinstance(d, dict):
                decision_items.append({
                    "name": str(d.get("regime_name", d.get("name", "UNKNOWN"))),
                    "status": str(d.get("status", "LOW_INDICATION")),
                    "reason": str(d.get("reason", "")),
                    "triggered_by": d.get("triggered_by", []),
                    "action_items": d.get("action_items", []),
                })

        # 3. Construct regime roadmap items
        regime_roadmaps: List[RegimeRoadmapItem] = []
        top_actions: List[str] = []

        for d in decision_items:
            raw_name = d["name"]
            status = d["status"]
            reason = d["reason"]

            # Map canonical regime key
            canonical_name = raw_name.upper().strip()
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

            # Retrieve evidence validation for this regime
            val_obj = validation_results.get(key_name, validation_results.get(raw_name))
            if isinstance(val_obj, EvidenceValidationResult):
                ev_status = val_obj.status
                ev_warning = val_obj.warning
            elif isinstance(val_obj, dict):
                ev_status = str(val_obj.get("status", "INSUFFICIENT_EVIDENCE"))
                ev_warning = val_obj.get("warning")
            else:
                ev_status = "INSUFFICIENT_EVIDENCE"
                ev_warning = "Unable to verify this guidance from the currently available knowledge sources."

            # Retrieve evidence sources
            reg_ev_data = evidence_map.get(key_name, evidence_map.get(raw_name, {}))
            raw_sources = reg_ev_data.get("evidence", []) if isinstance(reg_ev_data, dict) else []

            sources_list: List[SourceCitation] = []
            for s in raw_sources:
                sources_list.append(SourceCitation(
                    id=s.get("id", "N/A"),
                    law=s.get("law", "N/A"),
                    section=s.get("section", "N/A"),
                    excerpt=s.get("plain_explanation", s.get("text", ""))[:180] + "...",
                ))

            # Synthesize non-definitive narrative blocks
            detected, matters, next_steps = self._synthesize_narrative(key_name, fp_obj, d)

            if next_steps:
                top_actions.append(f"[{key_name}] {next_steps[0]}")

            item = RegimeRoadmapItem(
                regime=key_name,
                status=status,
                reason=reason,
                evidence_status=ev_status,
                what_we_detected=detected,
                why_it_matters=matters,
                what_to_check_next=next_steps,
                sources=sources_list,
                warning=ev_warning,
            )
            regime_roadmaps.append(item)

        # 4. Formulate overall priority next action
        overall_action = (
            "Recommended Immediate Action Roadmap:\n" + "\n".join(f"{i+1}. {act}" for i, act in enumerate(top_actions[:3]))
            if top_actions else "Preliminary review complete. Consider consulting a registered patent agent."
        )

        result_obj = PersonalizedRoadmap(
            innovation_summary=summary,
            regime_roadmaps=regime_roadmaps,
            overall_next_action=overall_action,
            disclaimer=self.MANDATORY_DISCLAIMER,
        )

        return result_obj.model_dump()

    def _synthesize_narrative(
        self, regime_key: str, fp: InnovationFingerprint, d: Dict[str, Any]
    ) -> tuple[str, str, List[str]]:
        """Synthesizes WHAT WE DETECTED, WHY IT MATTERS, and WHAT TO CHECK NEXT with non-definitive hedging."""
        ingredients_str = ", ".join(fp.ingredients) if fp.ingredients else "formulation ingredients"
        novelty_str = fp.novelty.description or "novel process"
        location_str = fp.biological_resources.source_location or "India"

        if regime_key == "PATENT":
            detected = f"Preliminary analysis detects claimed novelty in '{novelty_str}' involving ingredients ({ingredients_str})."
            matters = "Under Section 3(p) of the Indian Patents Act 1970, traditional Ayurvedic knowledge is non-patentable per se. However, preliminary review suggests that establishing genuine non-obvious synergistic efficacy may allow patentability."
            next_steps = [
                "Consider conducting comparative bio-availability and synergy studies against classical formulations.",
                "Verify prior art filings in the Indian Patent Office (IPO) database.",
                "Consult a registered Patent Agent to assess whether Section 3(e) mere-admixture objections apply.",
            ]
        elif regime_key == "TRADITIONAL_KNOWLEDGE":
            detected = f"Preliminary analysis indicates traditional knowledge usage involving classical herbs ({ingredients_str})."
            matters = "Inventions drawing on codified Ayurvedic texts (e.g. Charaka Samhita) may face Section 3(p) prior art objections if cited in the Traditional Knowledge Digital Library (TKDL)."
            next_steps = [
                "Consider searching the public TKDL metadata catalog for listed ingredient combinations.",
                "Verify classical textual citations to establish degree of modification from classical recipes.",
            ]
        elif regime_key == "ABS":
            detected = f"Preliminary analysis indicates use of Indian biological resources ({ingredients_str}) sourced from {location_str}."
            matters = "Under the Biological Diversity (Amendment) Act 2023, domestic entities must complete mandatory Form 8 registration with the National Biodiversity Authority (NBA) prior to patent grant."
            next_steps = [
                "Determine whether biological raw materials are certified-cultivated or wild-harvested.",
                "If cultivated, consider obtaining a BMC Certificate of Origin to evaluate Section 7 State Biodiversity Board intimation exemptions.",
                "Prepare Form 8 registration filing for the NBA portal before patent grant.",
            ]
        elif regime_key == "REGULATORY":
            detected = f"Preliminary analysis detects a product category of '{fp.product_category}' intended for '{fp.intended_use or 'therapeutic use'}'."
            matters = "Commercial manufacturing may require ASU drug licensing under the Drugs and Cosmetics Act 1940 (Form 25D for classical or Rule 158-B for proprietary ASU formulations)."
            next_steps = [
                "Verify whether product positioning is proprietary drug (Rule 158-B), classical drug (Form 25D), or FSSAI Ayurveda Aahara food.",
                "Consult the State AYUSH Licensing Authority regarding required pilot safety observational studies.",
            ]
        else:
            detected = f"Preliminary analysis detects compliance requirements for regime {regime_key}."
            matters = "Compliance review suggests evaluating relevant statutory frameworks."
            next_steps = ["Consider consulting a qualified legal consultant for detailed verification."]

        return detected, matters, next_steps


if __name__ == "__main__":
    import json

    print("=== Running RoadmapGenerator Test ===\n")

    # Sample input artifacts
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

    sample_decisions = [
        DecisionResult(
            regime_name="PATENT",
            status="POSSIBLE",
            reason="Formulation uses novel nano-extraction process which may overcome Section 3(p) TK bar if synergy is established.",
            triggered_by=["nano-extraction process"],
        ),
        DecisionResult(
            regime_name="TRADITIONAL_KNOWLEDGE",
            status="OVERLAP_POSSIBLE",
            reason="Ingredients Neem and Turmeric are cited extensively in Ayurvedic classical literature.",
            triggered_by=["Neem", "Turmeric"],
        ),
        DecisionResult(
            regime_name="ABS",
            status="CLASSIFICATION_REQUIRED",
            reason="Biological resources sourced from Tamil Nadu require NBA registration under BDA 2023.",
            triggered_by=["Tamil Nadu", "Neem"],
        ),
        DecisionResult(
            regime_name="REGULATORY",
            status="REVIEW_REQUIRED",
            reason="ASU drug licensing required under Rule 158-B of Drugs and Cosmetics Rules.",
            triggered_by=["Topical formulation"],
        ),
    ]

    sample_evidence_map = {
        "PATENT": {
            "evidence": [
                {
                    "id": "PA-3P-001",
                    "law": "The Patents Act, 1970",
                    "section": "Section 3(p)",
                    "plain_explanation": "If your formulation is essentially traditional knowledge, it cannot be patented under Indian law unless genuine non-obvious modification is established.",
                    "score": 0.75,
                }
            ]
        },
        "TRADITIONAL_KNOWLEDGE": {
            "evidence": [
                {
                    "id": "TKDL-001",
                    "law": "Traditional Knowledge Digital Library Framework",
                    "section": "Purpose and Function",
                    "plain_explanation": "TKDL is a defensive prior art database used by patent examiners worldwide.",
                    "score": 0.82,
                }
            ]
        },
        "ABS": {
            "evidence": [
                {
                    "id": "BDA-2023-003",
                    "law": "Biological Diversity (Amendment) Act, 2023",
                    "section": "Section 6(1A)",
                    "plain_explanation": "Domestic Indian applicants must complete Form 8 registration with NBA before patent grant.",
                    "score": 0.78,
                }
            ]
        },
        "REGULATORY": {
            "evidence": [
                {
                    "id": "DCA-3H-001",
                    "law": "Drugs and Cosmetics Rules, 1945",
                    "section": "Rule 158-B",
                    "plain_explanation": "Proprietary ASU medicines require safety studies under Rule 158-B.",
                    "score": 0.71,
                }
            ]
        },
    }

    sample_validation_results = {
        "PATENT": EvidenceValidationResult(
            regime="PATENT", status="SUPPORTED", confidence="high", evidence_count=1, top_score=0.75, citations=["The Patents Act, 1970 (Section 3(p)) [ID: PA-3P-001]"]
        ),
        "TRADITIONAL_KNOWLEDGE": EvidenceValidationResult(
            regime="TRADITIONAL_KNOWLEDGE", status="SUPPORTED", confidence="high", evidence_count=1, top_score=0.82, citations=["TKDL Framework [ID: TKDL-001]"]
        ),
        "ABS": EvidenceValidationResult(
            regime="ABS", status="SUPPORTED", confidence="high", evidence_count=1, top_score=0.78, citations=["Biological Diversity Act 2023 [ID: BDA-2023-003]"]
        ),
        "REGULATORY": EvidenceValidationResult(
            regime="REGULATORY", status="SUPPORTED", confidence="high", evidence_count=1, top_score=0.71, citations=["Drugs & Cosmetics Rules 1945 [ID: DCA-3H-001]"]
        ),
    }

    generator = RoadmapGenerator()
    roadmap_output = generator.generate_roadmap(
        fingerprint=sample_fingerprint,
        decisions=sample_decisions,
        evidence_map=sample_evidence_map,
        validation_results=sample_validation_results,
    )

    print("Generated Action Roadmap JSON Output:")
    print(json.dumps(roadmap_output, indent=2))

    # Assertions
    assert roadmap_output["innovation_summary"]["innovation_name"] == "Ayurvedic Wound Healing Formulation"
    assert len(roadmap_output["regime_roadmaps"]) == 4
    assert "INFORMATIONAL GUIDANCE ONLY" in roadmap_output["disclaimer"]
    assert "what_we_detected" in roadmap_output["regime_roadmaps"][0]
    assert "why_it_matters" in roadmap_output["regime_roadmaps"][0]
    assert "what_to_check_next" in roadmap_output["regime_roadmaps"][0]

    print("\n[OK] Roadmap Generator test passed cleanly!")
