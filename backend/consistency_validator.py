"""
IP-SAKTI Sahayak - Single Source of Truth Decision Consistency Validator
Audits canonical decision objects against downstream summary, roadmap, and report representations.
Logs data consistency errors and enforces strict canonical status alignment.
"""

import logging
from typing import Dict, Any, List
from pydantic import BaseModel, Field

logger = logging.getLogger("IP-SAKTI.ConsistencyValidator")
logger.setLevel(logging.INFO)


class CanonicalDecisionItem(BaseModel):
    """Canonical Single Source of Truth Decision Item for a single regime."""

    status: str = Field(..., description="POSSIBLE, OVERLAP_POSSIBLE, REVIEW_REQUIRED, CLASSIFICATION_REQUIRED, etc.")
    score: int = Field(default=75)
    reasons: List[str] = Field(default_factory=list)
    triggered_factors: List[Dict[str, str]] = Field(default_factory=list, description="Structured factor objects e.g. [{'type':'ingredient', 'label':'Neem'}].")
    actions: List[str] = Field(default_factory=list)


class CanonicalDecisionObject(BaseModel):
    """Canonical Single Source of Truth Object across all 4 legal regimes."""

    PATENT: CanonicalDecisionItem
    TRADITIONAL_KNOWLEDGE: CanonicalDecisionItem
    ABS: CanonicalDecisionItem
    REGULATORY: CanonicalDecisionItem
    overall_summary: str = ""


class ConsistencyAuditResult(BaseModel):
    """Output report of consistency validation check."""

    is_consistent: bool = True
    audited_regimes: List[str] = Field(default_factory=list)
    mismatches_detected: List[Dict[str, Any]] = Field(default_factory=list)
    canonical_decisions: Dict[str, str] = Field(default_factory=dict)


def validate_decision_consistency(
    canonical_decisions: Dict[str, Any],
    summary_decisions: Dict[str, Any] = None,
    roadmap_items: List[Dict[str, Any]] = None,
    detailed_report: Dict[str, Any] = None,
) -> ConsistencyAuditResult:
    """
    Verifies that Summary Status == Detailed Status == Roadmap Status == Canonical Decision Status.
    If a mismatch occurs, logs 'DATA CONSISTENCY ERROR' and forces all outputs to conform to canonical status.
    """
    mismatches = []
    canonical_map = {}

    if isinstance(canonical_decisions, list):
        canonical_decisions = {
            getattr(d, "regime_name", d.get("regime_name") if isinstance(d, dict) else getattr(d, "name", d.get("name") if isinstance(d, dict) else "")): d
            for d in canonical_decisions
        }

    for regime in ["PATENT", "TRADITIONAL_KNOWLEDGE", "ABS", "REGULATORY"]:
        item = canonical_decisions.get(regime)
        if not item:
            continue

        c_status = item.status if hasattr(item, "status") else item.get("status", "REVIEW_REQUIRED")
        canonical_map[regime] = c_status

        # 1. Audit Summary
        if summary_decisions and regime in summary_decisions:
            sum_item = summary_decisions[regime]
            s_status = sum_item.status if hasattr(sum_item, "status") else sum_item.get("status")
            if s_status and s_status != c_status:
                logger.error(
                    f"DATA CONSISTENCY ERROR: Mismatch detected for regime {regime} in Summary view. "
                    f"Canonical: '{c_status}', Found: '{s_status}'"
                )
                mismatches.append({"regime": regime, "view": "Summary", "canonical": c_status, "found": s_status})
                # Enforce canonical status
                if hasattr(sum_item, "status"):
                    sum_item.status = c_status
                elif isinstance(sum_item, dict):
                    sum_item["status"] = c_status

        # 2. Audit Roadmap
        if roadmap_items:
            for rm in roadmap_items:
                rm_regime = rm.get("regime") if isinstance(rm, dict) else getattr(rm, "regime", None)
                if rm_regime == regime:
                    r_status = rm.get("status") if isinstance(rm, dict) else getattr(rm, "status", None)
                    if r_status and r_status != c_status:
                        logger.error(
                            f"DATA CONSISTENCY ERROR: Mismatch detected for regime {regime} in Roadmap view. "
                            f"Canonical: '{c_status}', Found: '{r_status}'"
                        )
                        mismatches.append({"regime": regime, "view": "Roadmap", "canonical": c_status, "found": r_status})
                        # Enforce canonical status
                        if isinstance(rm, dict):
                            rm["status"] = c_status
                        else:
                            rm.status = c_status

        # 3. Audit Detailed Report
        if detailed_report and regime in detailed_report:
            det_item = detailed_report[regime]
            d_status = det_item.get("status") if isinstance(det_item, dict) else getattr(det_item, "status", None)
            if d_status and d_status != c_status:
                logger.error(
                    f"DATA CONSISTENCY ERROR: Mismatch detected for regime {regime} in Detailed Report view. "
                    f"Canonical: '{c_status}', Found: '{d_status}'"
                )
                mismatches.append({"regime": regime, "view": "DetailedReport", "canonical": c_status, "found": d_status})
                # Enforce canonical status
                if isinstance(det_item, dict):
                    det_item["status"] = c_status
                else:
                    det_item.status = c_status

    return ConsistencyAuditResult(
        is_consistent=len(mismatches) == 0,
        audited_regimes=list(canonical_map.keys()),
        mismatches_detected=mismatches,
        canonical_decisions=canonical_map,
    )
