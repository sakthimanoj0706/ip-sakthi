"""
IP-SAKTI Sahayak - Innovation Complexity Analyzer
Evaluates innovation text and fingerprint parameters to determine complexity level:
SIMPLE (e.g. classical recipe combination),
MODERATE (e.g. standardized extraction / improved dosage form),
COMPLEX (e.g. AI-controlled nano formulation using biological resources from multiple states).
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

try:
    from backend.fingerprint_schema import InnovationFingerprint
except ImportError:
    from fingerprint_schema import InnovationFingerprint


class ComplexityAnalysisResult(BaseModel):
    """Structured result of innovation complexity analysis."""

    complexity: str = Field(default="MODERATE")  # SIMPLE, MODERATE, COMPLEX
    score: int = Field(default=50)  # 0 to 100
    reasons: List[str] = Field(default_factory=list)
    badge_color: str = Field(default="blue")  # green, blue, purple


class ComplexityAnalyzer:
    """
    Analyzes innovation parameters to score complexity and legal multi-regime risk.
    """

    def analyze_complexity(
        self, fp: InnovationFingerprint, text: str = ""
    ) -> ComplexityAnalysisResult:
        score = 20
        reasons: List[str] = []
        combined = f"{text} {fp.description} {fp.innovation_name}".lower()

        # 1. Number of ingredients
        num_ing = len(fp.ingredients)
        if num_ing > 3:
            score += 15
            reasons.append(f"Polyherbal formulation ({num_ing} ingredients)")
        elif num_ing > 0:
            score += 5

        # 2. Novelty signals
        if fp.novelty.novelty_detected:
            score += 20
            novel_desc = fp.novelty.description or "Novel process claimed"
            reasons.append(f"Claimed novelty: {novel_desc[:45]}")

        # 3. High-tech processes (Nano, Liposomal, Supercritical, AI, Entangled)
        tech_keywords = ["nano", "liposom", "supercritical", "ai", "machine learning", "quantum", "micro-fluid"]
        matched_tech = [t.title() for t in tech_keywords if t in combined]
        if matched_tech:
            score += 25
            reasons.append(f"Advanced technology detected: {', '.join(matched_tech)}")

        # 4. Biological resources & location
        if fp.biological_resources.biological_resource_used:
            score += 15
            loc = fp.biological_resources.source_location or "India"
            reasons.append(f"Indian biological resource compliance (Sourced from {loc})")

        # 5. Traditional Knowledge overlap
        if fp.traditional_knowledge.possible_overlap:
            score += 10
            reasons.append("Traditional Knowledge prior art overlap evaluation required")

        score = min(100, max(10, score))

        if score < 40:
            complexity = "SIMPLE"
            badge_color = "green"
            if not reasons:
                reasons = ["Single ingredient or classical formulation recipe"]
        elif score < 70:
            complexity = "MODERATE"
            badge_color = "blue"
        else:
            complexity = "COMPLEX"
            badge_color = "purple"

        return ComplexityAnalysisResult(
            complexity=complexity,
            score=score,
            reasons=reasons,
            badge_color=badge_color,
        )


if __name__ == "__main__":
    analyzer = ComplexityAnalyzer()
    dummy_fp = InnovationFingerprint.from_user_input(
        innovation_name="AI Nano Gel",
        description="Nano gel combining Neem and Turmeric using AI ratio optimization.",
        ingredients="Neem, Turmeric",
        novelty_description="Nano extraction with AI",
        biological_resource_used=True,
        source_location="Tamil Nadu",
    )
    res = analyzer.analyze_complexity(dummy_fp)
    print("Complexity Analysis Result:")
    print(res.model_dump_json(indent=2))
    assert res.complexity == "COMPLEX"
    print("[OK] Complexity Analyzer test passed cleanly!")
