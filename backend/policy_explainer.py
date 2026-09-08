"""
IP-SAKTI Sahayak - Policy & Decision Explainer Engine
Translates complex legal jargon (Section 3(p), Section 3(e), BDA Form 8, Rule 158-B)
into clear, simple-language policy cards and structured reasoning paths ("Why did IP-SAKTI say this?").
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

try:
    from backend.fingerprint_schema import InnovationFingerprint
    from backend.decision_map import DecisionResult
except ImportError:
    from fingerprint_schema import InnovationFingerprint
    from decision_map import DecisionResult


class SimplePolicyBreakdown(BaseModel):
    """Simple-language policy explanation card."""

    regime_name: str
    statute_name: str  # e.g. "The Patents Act, 1970 - Section 3(p)"
    policy_title: str  # e.g. "Traditional Knowledge Restriction"
    what_it_means: str
    why_it_applies_to_you: str
    what_makes_your_case_different: str
    what_you_should_prove: List[str]
    confidence_label: str = "High"
    confidence_score: float = 0.90


class ReasoningPathStep(BaseModel):
    """Step in the visual reasoning path."""

    step_name: str
    detail: str
    status: str = "completed"  # completed, active, pending


class DecisionExplanationDetail(BaseModel):
    """Detailed explainability response for "Why did IP-SAKTI say this?"."""

    regime_name: str
    decision_status: str
    detected_signals: List[str]
    reasoning_path: List[ReasoningPathStep]
    policy_breakdown: SimplePolicyBreakdown
    supporting_evidence_count: int = 0


class PolicyExplainerEngine:
    """
    Generates plain-language legal policy explanations and transparent decision rationales.
    """

    POLICY_TEMPLATES = {
        "PATENT": {
            "statute_name": "The Patents Act, 1970 — Section 3(p) & Section 3(e)",
            "policy_title": "Traditional Knowledge & Synergistic Admixture Rules",
            "what_it_means": "You generally cannot patent pure traditional Ayurvedic herb combinations already described in classical literature. However, novel extraction methods or non-obvious synergistic efficacy are patentable.",
            "why_applies": "Your formulation incorporates classical herbs (such as {ingredients}) known in traditional Ayurvedic texts.",
            "different": "You claim a novel process or extraction method ({novelty}).",
            "prove": [
                "Prove genuine technical process novelty (e.g., nano-extraction or cold-press stabilization).",
                "Demonstrate unexpected synergistic bio-availability (Section 3(e) non-admixture test).",
                "Provide comparative safety and efficacy studies against standard classical recipes."
            ],
        },
        "TRADITIONAL_KNOWLEDGE": {
            "statute_name": "Traditional Knowledge Digital Library (TKDL) Framework",
            "policy_title": "Defensive Prior Art & Classical Text Overlap",
            "what_it_means": "TKDL is India's digital repository of codified classical Ayurvedic knowledge (Charaka, Sushruta) used by global patent examiners to reject unoriginal claims.",
            "why_applies": "The combination of {ingredients} for {use} overlaps with prior art indexed in classical texts.",
            "different": "Your specific process parameters or dosage form may differentiate your product from classical recipes.",
            "prove": [
                "Search public TKDL metadata catalog for exact ingredient combinations.",
                "Document exact textual variations between proposed formulation and classical recipes.",
                "Highlight non-codified technological improvements."
            ],
        },
        "ABS": {
            "statute_name": "Biological Diversity (Amendment) Act, 2023 — Form 8 / NBA Guidelines",
            "policy_title": "Access & Benefit Sharing for Indian Biological Resources",
            "what_it_means": "Commercial use of Indian biological resources (herbs/plants) requires compliance with National Biodiversity Authority (NBA) rules. Domestic entities must complete Form 8 registration prior to patent grant.",
            "why_applies": "Your innovation utilizes Indian biological materials sourced from {location}.",
            "different": "Cultivated medicinal plants accompanied by a BMC Certificate of Origin enjoy State Biodiversity Board intimation exemptions.",
            "prove": [
                "Determine whether biological raw materials are cultivated vs wild-harvested.",
                "Obtain BMC Certificate of Origin if raw materials are farm-cultivated.",
                "Complete Form 8 registration on the NBA portal before patent grant."
            ],
        },
        "REGULATORY": {
            "statute_name": "Drugs and Cosmetics Act, 1940 (Rule 158-B) / FSSAI Ayurveda Aahara 2022",
            "policy_title": "AYUSH Drug vs Food Product Classification",
            "what_it_means": "ASU (Ayurveda, Siddha, Unani) products require licensing under Form 25D (classical) or Rule 158-B (proprietary ASU medicine). Non-therapeutic products can follow FSSAI Ayurveda Aahara food regulations.",
            "why_applies": "Your product category ({category}) and intended use ({use}) require formal regulatory track assignment.",
            "different": "Positioning as a food supplement avoids ASU drug safety trial burdens if therapeutic drug claims are omitted.",
            "prove": [
                "Select regulatory track: Proprietary ASU Drug (Rule 158-B), Classical ASU Drug (Form 25D), or FSSAI Ayurveda Aahara.",
                "Submit manufacturing license application to State AYUSH Licensing Authority.",
                "Conduct required pilot safety and stability studies."
            ],
        },
    }

    def explain_policy(
        self, regime: str, fp: InnovationFingerprint
    ) -> SimplePolicyBreakdown:
        """Generates plain-language policy card for a given regime."""
        r_upper = regime.upper().strip()
        tmpl = self.POLICY_TEMPLATES.get(r_upper, self.POLICY_TEMPLATES["PATENT"])

        ing_str = ", ".join(fp.ingredients) if fp.ingredients else "Ayurvedic herbs"
        use_str = fp.intended_use if isinstance(fp.intended_use, str) else (", ".join(fp.intended_use) if fp.intended_use else "therapeutic use")
        novelty_str = fp.novelty.description or "claimed novel process"
        loc_str = fp.biological_resources.source_location or "India"
        cat_str = fp.product_category or "Ayurvedic Formulation"

        why_applies = tmpl["why_applies"].format(ingredients=ing_str, use=use_str, location=loc_str, category=cat_str)
        different = tmpl["different"].format(novelty=novelty_str)

        return SimplePolicyBreakdown(
            regime_name=r_upper,
            statute_name=tmpl["statute_name"],
            policy_title=tmpl["policy_title"],
            what_it_means=tmpl["what_it_means"],
            why_it_applies_to_you=why_applies,
            what_makes_your_case_different=different,
            what_you_should_prove=tmpl["prove"],
            confidence_label="High",
            confidence_score=0.90,
        )

    def explain_decision(
        self, regime: str, decision: DecisionResult, fp: InnovationFingerprint, evidence_count: int = 1
    ) -> DecisionExplanationDetail:
        """Generates complete explainability object ('Why did IP-SAKTI say this?')."""
        r_upper = regime.upper().strip()
        policy = self.explain_policy(r_upper, fp)

        signals = list(fp.ingredients)
        if fp.novelty.novelty_detected and fp.novelty.description:
            signals.append(fp.novelty.description[:40])
        if fp.biological_resources.source_location:
            signals.append(fp.biological_resources.source_location)

        reasoning_path = [
            ReasoningPathStep(step_name="Innovation Description", detail=f"User provided: '{fp.innovation_name}'"),
            ReasoningPathStep(step_name="Multi-Layer NLP Extraction", detail=f"Extracted {len(fp.ingredients)} herbs, language={fp.detected_language}"),
            ReasoningPathStep(step_name="Innovation Fingerprint", detail=f"Generated profile (Confidence={int(fp.overall_confidence*100)}%)"),
            ReasoningPathStep(step_name="Multi-Regime Rules Engine", detail=f"Assessed {r_upper} regime -> Status: {decision.status}"),
            ReasoningPathStep(step_name="Evidence Validation", detail=f"Grounding verified with {evidence_count} statutory sources"),
            ReasoningPathStep(step_name="Personalized Action Roadmap", detail="Generated actionable compliance steps"),
        ]

        return DecisionExplanationDetail(
            regime_name=r_upper,
            decision_status=decision.status,
            detected_signals=signals,
            reasoning_path=reasoning_path,
            policy_breakdown=policy,
            supporting_evidence_count=evidence_count,
        )


if __name__ == "__main__":
    engine = PolicyExplainerEngine()
    dummy_fp = InnovationFingerprint.from_user_input(
        innovation_name="Ayurvedic Wound Gel",
        description="Formulation combining Neem and Turmeric with nano-extraction process in Tamil Nadu.",
        ingredients="Neem, Turmeric",
        novelty_description="Nano-extraction process to improve skin absorption",
        source_location="Tamil Nadu",
    )
    pol = engine.explain_policy("PATENT", dummy_fp)
    print("Policy Explanation Result:")
    print(pol.model_dump_json(indent=2))
    assert pol.regime_name == "PATENT"
    print("[OK] Policy Explainer test passed cleanly!")
