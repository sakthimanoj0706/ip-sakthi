"""
IP-SAKTI Sahayak - End-to-End Pipeline Integration Test
Connects all backend modules from raw user input to final personalized action roadmap.
"""

import sys
import json
from pathlib import Path

# Add project root to python path for clean imports
ROOT_DIR = Path(__file__).parent.parent
sys.path.append(str(ROOT_DIR))

from backend.interview_agent import AdaptiveInterviewAgent
from backend.fingerprint_schema import InnovationFingerprint
from backend.decision_engine import DecisionEngine
from backend.regime_retrieval import RegimeRetrievalEngine
from backend.evidence_validator import EvidenceValidator
from backend.roadmap_generator import RoadmapGenerator


def run_full_pipeline_test():
    print("==================================================================")
    print("      IP-SAKTI Sahayak - Full Pipeline Integration Test           ")
    print("==================================================================\n")

    # Step 1: Raw User Input
    raw_user_input = (
        "I developed an Ayurvedic wound healing formulation using neem and turmeric. "
        "The ingredients are traditionally known, but I use a new nano-extraction process "
        "to improve absorption. The biological materials are sourced from Tamil Nadu."
    )
    print("--- 1. Raw User Input ---")
    print(f"User Input: \"{raw_user_input}\"\n")

    # Step 2: Adaptive Interview Agent & Fingerprint Generation
    print("--- 2. Innovation Fingerprint Construction ---")
    agent = AdaptiveInterviewAgent()

    # Pre-populate interview agent with parsed input
    initial_inputs = {
        "innovation_name": "Ayurvedic Wound Healing Formulation",
        "description": raw_user_input,
        "ingredients": "Neem, Turmeric",
        "intended_use": "Wound healing",
        "traditional_knowledge_claimed": True,
        "novelty_detected": True,
        "novelty_type": "extraction_method",
        "novelty_description": "New nano-extraction process to improve absorption",
        "biological_resource_used": True,
        "source_location": "Tamil Nadu",
        "product_category": "Ayurvedic Medicine / Formulation",
    }

    agent.start_interview(initial_inputs=initial_inputs)

    # Build Fingerprint from Agent
    fingerprint: InnovationFingerprint = agent.build_fingerprint()
    print("Generated Innovation Fingerprint:")
    print(json.dumps(fingerprint.model_to_dict(), indent=2))
    print()

    # Assertion 1: Fingerprint is created
    assert fingerprint is not None
    assert fingerprint.innovation_name == "Ayurvedic Wound Healing Formulation"
    assert "Neem" in fingerprint.ingredients
    assert "Turmeric" in fingerprint.ingredients

    # Step 3: Multi-Regime Decision Engine Evaluation
    print("--- 3. Multi-Regime Decision Engine Evaluation ---")
    decision_engine = DecisionEngine()
    multi_decisions = decision_engine.evaluate(fingerprint)

    print("Regime Decisions:")
    for d in multi_decisions.decisions:
        print(f"  * [{d.regime_name}] Status: {d.status}")
        print(f"    Reason: {d.reason}")
        print(f"    Triggers: {d.triggered_by}\n")

    # Assertion 2 & 3: 4 regimes exist and specific status checks
    regimes_dict = {d.regime_name: d for d in multi_decisions.decisions}
    assert len(regimes_dict) == 4, "Must contain exactly 4 regimes."

    # Patent detects novelty
    assert "PATENT" in regimes_dict
    assert regimes_dict["PATENT"].status == "POSSIBLE", f"Expected POSSIBLE, got {regimes_dict['PATENT'].status}"

    # TK detects possible overlap
    assert "TRADITIONAL_KNOWLEDGE" in regimes_dict
    assert regimes_dict["TRADITIONAL_KNOWLEDGE"].status == "OVERLAP_POSSIBLE", f"Expected OVERLAP_POSSIBLE, got {regimes_dict['TRADITIONAL_KNOWLEDGE'].status}"

    # ABS detects review/classification requirement
    assert "ABS" in regimes_dict
    assert regimes_dict["ABS"].status in ["REVIEW_REQUIRED", "CLASSIFICATION_REQUIRED"], f"Expected REVIEW_REQUIRED, got {regimes_dict['ABS'].status}"

    # Regulatory detects classification/review requirement
    assert "REGULATORY" in regimes_dict
    assert regimes_dict["REGULATORY"].status in ["CLASSIFICATION_REQUIRED", "REVIEW_REQUIRED"], f"Expected CLASSIFICATION_REQUIRED, got {regimes_dict['REGULATORY'].status}"

    # Step 4: Regime-Aware Retrieval Engine
    print("--- 4. Regime-Aware Retrieval Engine ---")
    retrieval_engine = RegimeRetrievalEngine()
    retrieved_evidence_map = retrieval_engine.retrieve_for_regimes(fingerprint, multi_decisions.decisions)

    print("Generated Search Queries & Top Evidence Sources:")
    for regime_key, reg_data in retrieved_evidence_map.items():
        print(f"  Regime: {regime_key}")
        print(f"    Targeted Query: '{reg_data['query']}'")
        evidence_list = reg_data.get("evidence", [])
        if evidence_list:
            top_ev = evidence_list[0]
            print(f"    Top Evidence Source: {top_ev['law']} ({top_ev['section']}) [ID: {top_ev['id']}] (Score: {top_ev['score']})")
        else:
            print("    Top Evidence Source: None")
        print()

    # Step 5: Evidence Validator
    print("--- 5. Evidence Validator Assessment ---")
    validator = EvidenceValidator()
    validation_map = validator.validate_all_regimes(retrieved_evidence_map)

    print("Evidence Validation Results:")
    for regime_key, val_res in validation_map.items():
        print(f"  Regime: {regime_key}")
        print(f"    Validation Status: {val_res.status}")
        print(f"    Confidence       : {val_res.confidence}")
        print(f"    Citations Count  : {len(val_res.citations)}")
        if val_res.warning:
            print(f"    Warning          : {val_res.warning}")
        print()

    # Step 6: Personalized Roadmap Generator
    print("--- 6. Personalized Action Roadmap Generation ---")
    roadmap_generator = RoadmapGenerator()
    final_roadmap = roadmap_generator.generate_roadmap(
        fingerprint=fingerprint,
        decisions=multi_decisions.decisions,
        evidence_map=retrieved_evidence_map,
        validation_results=validation_map,
    )

    print("Final Personalized Action Roadmap JSON:")
    print(json.dumps(final_roadmap, indent=2))
    print()

    # Final Roadmap Assertions
    assert final_roadmap is not None
    assert "innovation_summary" in final_roadmap
    assert "regime_roadmaps" in final_roadmap
    assert len(final_roadmap["regime_roadmaps"]) == 4
    assert "overall_next_action" in final_roadmap
    assert "disclaimer" in final_roadmap

    print("==================================================================")
    print(" [OK] Full Pipeline Integration Test Passed Successfully!")
    print("==================================================================")


if __name__ == "__main__":
    run_full_pipeline_test()
