"""
IP-SAKTI Sahayak - Decision Map Visualizer
Module for transforming multi-regime decision engine results into a frontend-friendly Decision Map.
"""

from typing import List, Dict, Any, Union, Optional
from pydantic import BaseModel, Field


# Color mapping dictionary based on regime evaluation status
COLOR_MAPPING: Dict[str, str] = {
    "POSSIBLE": "yellow",
    "OVERLAP_POSSIBLE": "orange",
    "REVIEW_REQUIRED": "yellow",
    "CLASSIFICATION_REQUIRED": "blue",
    "LOW_INDICATION": "gray",
    "HIGH_RISK": "red",
    "NOT_PATENTABLE": "red",
    "PROHIBITED": "red",
    "LOW_RISK": "green",
    "EXEMPT": "green",
    "ELIGIBLE": "green",
    "PERMITTED": "green",
    "APPROVED": "green",
}


class DecisionResult(BaseModel):
    """Represents a decision result from a single regulatory regime."""

    regime_name: str = Field(..., description="Name of the regulatory/legal regime (e.g. PATENT, TKDL).")
    status: str = Field(..., description="Evaluation status (e.g. POSSIBLE, OVERLAP_POSSIBLE).")
    reason: str = Field(..., description="Detailed explanation for the decision.")
    triggered_by: List[str] = Field(default_factory=list, description="Inputs/factors triggering this decision.")
    confidence: float = Field(default=1.0, description="Confidence score of decision (0.0 to 1.0).")
    action_items: List[str] = Field(default_factory=list, description="Recommended next actions.")


class DecisionMapRegimeItem(BaseModel):
    """Frontend-ready schema for a single regime decision visualization node."""

    name: str
    status: str
    color: str
    reason: str
    triggered_by: List[str] = Field(default_factory=list)


class DecisionMap(BaseModel):
    """Frontend-ready schema for the complete Multi-Regime Decision Map."""

    overall_summary: str
    regimes: List[DecisionMapRegimeItem]


def get_color_for_status(status: str) -> str:
    """Returns visual color mapping for a given status string."""
    normalized = status.upper().strip()
    return COLOR_MAPPING.get(normalized, "gray")


def generate_decision_map(
    decisions: Union[List[Union[DecisionResult, Dict[str, Any]]], Dict[str, Any]],
    overall_summary: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Transforms multi-regime decision engine outputs into a frontend-friendly Decision Map.

    Args:
        decisions: List of DecisionResult objects or dictionaries representing regime decisions.
        overall_summary: Optional high-level summary string. If None, auto-generates from regimes.

    Returns:
        Structured dictionary matching frontend Decision Map schema.
    """
    regime_list: List[Dict[str, Any]] = []
    
    # Handle dictionary input containing 'decisions' key
    if isinstance(decisions, dict):
        if "overall_summary" in decisions and not overall_summary:
            overall_summary = str(decisions["overall_summary"])
        raw_list = decisions.get("decisions", decisions.get("regimes", []))
    else:
        raw_list = decisions

    # Transform each regime decision
    for item in raw_list:
        if isinstance(item, DecisionResult):
            name = item.regime_name
            status = item.status
            reason = item.reason
            triggered_by = item.triggered_by
        elif isinstance(item, dict):
            name = str(item.get("regime_name", item.get("name", "UNKNOWN")))
            status = str(item.get("status", "LOW_INDICATION"))
            reason = str(item.get("reason", "No detailed reasoning provided."))
            triggered_by = item.get("triggered_by", [])
            if not isinstance(triggered_by, list):
                triggered_by = [str(triggered_by)]
        else:
            continue

        color = get_color_for_status(status)

        regime_list.append({
            "name": name,
            "status": status,
            "color": color,
            "reason": reason,
            "triggered_by": triggered_by,
        })

    # Generate synthetic summary if none provided
    if not overall_summary:
        high_attention = [r["name"] for r in regime_list if r["color"] in ["red", "orange", "yellow"]]
        if high_attention:
            overall_summary = f"Multi-regime analysis completed. Attention required across: {', '.join(high_attention)}."
        else:
            overall_summary = "Multi-regime analysis completed. All regimes indicate low risk / clearance."

    decision_map_obj = DecisionMap(
        overall_summary=overall_summary,
        regimes=[DecisionMapRegimeItem(**r) for r in regime_list],
    )

    return decision_map_obj.model_dump()


if __name__ == "__main__":
    import json

    print("=== Running Decision Map Transformation Test ===\n")

    # Sample decision outputs from 4 regimes
    sample_decisions = [
        DecisionResult(
            regime_name="PATENT",
            status="POSSIBLE",
            reason="Formulation uses novel nano-extraction process which may overcome Section 3(p) TK rejection if synergy/efficacy is proven.",
            triggered_by=["nano-extraction process", "increased absorption"],
            action_items=["Conduct comparative bio-availability study"],
        ),
        DecisionResult(
            regime_name="TKDL_PRIOR_ART",
            status="OVERLAP_POSSIBLE",
            reason="Ingredients Neem and Turmeric are cited extensively in Ayurvedic classical literature for wound healing.",
            triggered_by=["Neem", "Turmeric", "Wound healing"],
            action_items=["Search TKDL database for specific combination ratio"],
        ),
        DecisionResult(
            regime_name="AYUSH_REGULATORY",
            status="REVIEW_REQUIRED",
            reason="Commercial manufacturing requires ASU drug license under Rule 158-B of Drugs & Cosmetics Rules 1945.",
            triggered_by=["Topical formulation", "Ayurvedic Medicine"],
            action_items=["Submit Form 24-D to State Licensing Authority"],
        ),
        DecisionResult(
            regime_name="NATIONAL_BIODIVERSITY_AUTHORITY",
            status="CLASSIFICATION_REQUIRED",
            reason="Use of biological resources sourced from Tamil Nadu requires Form I clearance under Biological Diversity Act 2002.",
            triggered_by=["Tamil Nadu", "Neem", "Turmeric"],
            action_items=["Apply for Form I clearance via SBB / NBA portal"],
        ),
    ]

    # Transform decisions into Decision Map
    map_output = generate_decision_map(sample_decisions)

    print("Transformed Decision Map JSON Output:")
    print(json.dumps(map_output, indent=2))

    # Verification assertions
    assert map_output["regimes"][0]["color"] == "yellow"  # POSSIBLE -> yellow
    assert map_output["regimes"][1]["color"] == "orange"  # OVERLAP_POSSIBLE -> orange
    assert map_output["regimes"][2]["color"] == "yellow"  # REVIEW_REQUIRED -> yellow
    assert map_output["regimes"][3]["color"] == "blue"    # CLASSIFICATION_REQUIRED -> blue

    print("\n[OK] Decision Map transformation test passed cleanly!")
