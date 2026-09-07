"""
IP-SAKTI Sahayak - Multi-Regime Decision Engine
Module for evaluating InnovationFingerprint across Patent, Traditional Knowledge, ABS, and Regulatory regimes.
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
except ImportError:
    from fingerprint_schema import InnovationFingerprint
    from decision_map import DecisionResult


class MultiRegimeDecision(BaseModel):
    """Container for decisions across all 4 regulatory regimes."""

    decisions: List[DecisionResult] = Field(default_factory=list)
    overall_summary: str = Field(default="", description="High-level synthesis of regime decisions.")


def _clean_triggers(raw: List[Any]) -> List[str]:
    result = []
    for item in raw:
        if isinstance(item, list):
            for sub in item:
                if sub and isinstance(sub, str):
                    result.append(str(sub))
        elif isinstance(item, str) and item.strip():
            result.append(item.strip())
        elif item is not None and not isinstance(item, (dict, list)):
            result.append(str(item))
    return result


class DecisionEngine:
    """
    Multi-Regime Rules Engine for Ayurveda Innovations.
    Evaluates innovation fingerprints against Indian Patent Law, TKDL, BDA 2023, and AYUSH Regulations.
    Every decision contains explicit reason codes and triggering input factors.
    """

    def evaluate(self, fingerprint: Union[InnovationFingerprint, Dict[str, Any]]) -> MultiRegimeDecision:
        """
        Evaluates the InnovationFingerprint and returns 4 regime decisions.
        """
        if isinstance(fingerprint, dict):
            fp = InnovationFingerprint.from_user_input(
                innovation_name=fingerprint.get("innovation_name", "Innovation"),
                description=fingerprint.get("description", ""),
                ingredients=fingerprint.get("ingredients", []),
                intended_use=fingerprint.get("intended_use"),
                product_category=fingerprint.get("product_category"),
                traditional_knowledge_claimed=fingerprint.get("traditional_knowledge_claimed", True),
                novelty_description=fingerprint.get("novelty_description"),
                novelty_types=fingerprint.get("novelty_types"),
                biological_resource_used=fingerprint.get("biological_resource_used", False),
                source_location=fingerprint.get("source_location"),
            )
        else:
            fp = fingerprint

        decisions: List[DecisionResult] = []

        # 1. Patent Regime Evaluation (Section 3(p) & Section 3(e))
        patent_dec = self._evaluate_patent_regime(fp)
        decisions.append(patent_dec)

        # 2. Traditional Knowledge Regime Evaluation (TKDL & Prior Art)
        tk_dec = self._evaluate_tk_regime(fp)
        decisions.append(tk_dec)

        # 3. ABS / Biodiversity Regime Evaluation (Biological Diversity Amendment Act 2023)
        abs_dec = self._evaluate_abs_regime(fp)
        decisions.append(abs_dec)

        # 4. AYUSH Regulatory Regime Evaluation (Drugs & Cosmetics Act / FSSAI)
        reg_dec = self._evaluate_regulatory_regime(fp)
        decisions.append(reg_dec)

        summary = f"Evaluated 4 legal regimes. High-priority reviews detected in: {[d.regime_name for d in decisions if d.status in ['POSSIBLE', 'OVERLAP_POSSIBLE', 'REVIEW_REQUIRED', 'CLASSIFICATION_REQUIRED']]}."

        return MultiRegimeDecision(decisions=decisions, overall_summary=summary)

    def _evaluate_patent_regime(self, fp: InnovationFingerprint) -> DecisionResult:
        triggers = []
        if fp.novelty.novelty_detected:
            novelty_desc = fp.novelty.description or ""
            novelty_types = fp.novelty.novelty_type or []
            triggers.extend(novelty_types)
            if novelty_desc:
                triggers.append(novelty_desc[:50])

            status = "POSSIBLE"
            reason = (
                f"Claimed novelty in '{novelty_desc or 'process'}' may overcome Section 3(p) Traditional Knowledge "
                f"patent exclusion provided genuine non-obvious synergistic efficacy is established under Section 3(e)."
            )
            actions = [
                "Conduct comparative bio-availability and synergy studies against classical formulations.",
                "Consult a registered patent agent regarding Section 3(e) mere-admixture objections.",
            ]
        else:
            triggers = fp.ingredients
            status = "HIGH_RISK"
            reason = "Formulation lacks claimed novel process or extraction method. Pure combinations of known Ayurvedic herbs are barred from patenting under Section 3(p) of the Patents Act 1970."
            actions = ["Explore trade secret or brand/trademark protection instead of patent filing."]

        return DecisionResult(
            regime_name="PATENT",
            status=status,
            reason=reason,
            triggered_by=_clean_triggers(triggers),
            confidence=0.85,
            action_items=actions,
        )

    def _evaluate_tk_regime(self, fp: InnovationFingerprint) -> DecisionResult:
        triggers = list(fp.ingredients)
        if fp.intended_use:
            if isinstance(fp.intended_use, list):
                triggers.extend(fp.intended_use)
            else:
                triggers.append(fp.intended_use)

        use_str = ", ".join(fp.intended_use) if isinstance(fp.intended_use, list) else (fp.intended_use or "general health")

        if fp.traditional_knowledge_claimed or fp.ingredients:
            status = "OVERLAP_POSSIBLE"
            reason = f"Ingredients ({', '.join(fp.ingredients)}) and therapeutic use ('{use_str}') overlap with classical Ayurvedic literature (Charaka Samhita, Sushruta Samhita) and digitized TKDL prior art records."
            actions = [
                "Search public TKDL metadata catalog for listed ingredient combinations.",
                "Document exact textual variations between proposed formulation and classical recipes.",
            ]
        else:
            status = "LOW_INDICATION"
            reason = "No direct overlap with classical Ayurvedic texts identified."
            actions = []

        return DecisionResult(
            regime_name="TRADITIONAL_KNOWLEDGE",
            status=status,
            reason=reason,
            triggered_by=_clean_triggers(triggers),
            confidence=0.90,
            action_items=actions,
        )

    def _evaluate_abs_regime(self, fp: InnovationFingerprint) -> DecisionResult:
        triggers = []
        if fp.biological_resources.source_location:
            triggers.append(fp.biological_resources.source_location)
        triggers.extend(fp.ingredients)

        if fp.biological_resources.biological_resource_used:
            status = "REVIEW_REQUIRED"  # or CLASSIFICATION_REQUIRED
            location = fp.biological_resources.source_location or "India"
            reason = (
                f"Use of Indian biological resources sourced from {location} triggers compliance under the Biological Diversity (Amendment) Act 2023. "
                f"Domestic entities must file Form 8 registration with the National Biodiversity Authority (NBA) prior to patent grant."
            )
            actions = [
                "Verify whether raw materials are cultivated vs wild-harvested.",
                "If cultivated, obtain BMC Certificate of Origin for Section 7 SBB intimation exemption.",
                "File Form 8 registration on the NBA portal before patent grant.",
            ]
        else:
            status = "LOW_RISK"
            reason = "No Indian biological resources claimed."
            actions = []

        return DecisionResult(
            regime_name="ABS",
            status=status,
            reason=reason,
            triggered_by=_clean_triggers(triggers),
            confidence=0.88,
            action_items=actions,
        )

    def _evaluate_regulatory_regime(self, fp: InnovationFingerprint) -> DecisionResult:
        triggers = [fp.product_category or "Ayurvedic Medicine"]
        if fp.intended_use:
            if isinstance(fp.intended_use, list):
                triggers.extend(fp.intended_use)
            else:
                triggers.append(fp.intended_use)

        use_str = ", ".join(fp.intended_use) if isinstance(fp.intended_use, list) else (fp.intended_use or "therapeutic use")

        status = "CLASSIFICATION_REQUIRED"
        reason = (
            f"Product category '{fp.product_category}' intended for '{use_str}' "
            f"requires regulatory classification under the Drugs and Cosmetics Act 1940 (Rule 158-B for Proprietary ASU vs Form 25D for Classical ASU) or FSSAI Ayurveda Aahara food rules."
        )
        actions = [
            "Confirm regulatory track: Proprietary ASU Drug (Rule 158-B), Classical ASU Drug (Form 25D), or FSSAI Ayurveda Aahara.",
            "Submit application to State AYUSH Licensing Authority.",
        ]

        return DecisionResult(
            regime_name="REGULATORY",
            status=status,
            reason=reason,
            triggered_by=_clean_triggers(triggers),
            confidence=0.92,
            action_items=actions,
        )


if __name__ == "__main__":
    import json

    print("=== Running DecisionEngine Test ===\n")

    engine = DecisionEngine()
    sample_fp = InnovationFingerprint.from_user_input(
        innovation_name="Ayurvedic Wound Healing Formulation",
        description="Topical formulation combining Neem and Turmeric with nano-extraction process.",
        ingredients="Neem, Turmeric",
        intended_use="Wound healing",
        novelty_description="Nano-extraction process to improve skin absorption",
        novelty_types=["extraction_method", "process"],
        biological_resource_used=True,
        source_location="Tamil Nadu",
    )

    decision_output = engine.evaluate(sample_fp)

    print("Evaluated Multi-Regime Decisions:")
    for d in decision_output.decisions:
        print(f"Regime: {d.regime_name}")
        print(f"  Status      : {d.status}")
        print(f"  Reason      : {d.reason}")
        print(f"  Triggered By: {d.triggered_by}\n")

    assert len(decision_output.decisions) == 4
    assert decision_output.decisions[0].status == "POSSIBLE"
    assert decision_output.decisions[1].status == "OVERLAP_POSSIBLE"
    assert decision_output.decisions[2].status in ["REVIEW_REQUIRED", "CLASSIFICATION_REQUIRED"]
    assert decision_output.decisions[3].status == "CLASSIFICATION_REQUIRED"

    print("[OK] DecisionEngine test passed cleanly!")
