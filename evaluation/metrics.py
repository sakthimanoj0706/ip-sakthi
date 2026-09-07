"""
IP-SAKTI Sahayak - Evaluation Metrics Calculation Engine
Provides mathematical and statistical metrics calculation for Fingerprint, Decision Engine,
Evidence Validator, Smart Interview, RAG Retrieval, and System-wide evaluation.
"""

import math
from typing import List, Dict, Any, Set, Tuple


# --- 1. Fingerprint Metrics ---

def calculate_fingerprint_metrics(
    actual_fingerprints: List[Dict[str, Any]],
    expected_fingerprints: List[Dict[str, Any]],
    raw_inputs: List[Dict[str, Any]],
) -> Dict[str, float]:
    """
    Calculates detailed field-level extraction accuracies and overall Fingerprint Accuracy.
    """
    total = len(expected_fingerprints)
    if total == 0:
        return {
            "ingredient_accuracy": 0.0,
            "process_accuracy": 0.0,
            "intended_use_accuracy": 0.0,
            "novelty_accuracy": 0.0,
            "bio_resource_accuracy": 0.0,
            "tk_indicator_accuracy": 0.0,
            "overall_fingerprint_accuracy": 0.0,
        }

    ing_matches = 0
    proc_matches = 0
    use_matches = 0
    nov_matches = 0
    bio_matches = 0
    tk_matches = 0

    for act, exp, raw in zip(actual_fingerprints, expected_fingerprints, raw_inputs):
        # Ingredient extraction match
        expected_ings = set([i.lower().strip() for i in raw.get("ingredients", [])])
        actual_ings = set([i.lower().strip() for i in act.get("ingredients", [])])
        if (not expected_ings and not actual_ings) or (expected_ings and expected_ings.issubset(actual_ings)):
            ing_matches += 1

        # Process extraction match
        raw_proc = raw.get("process", "").strip()
        act_raw_proc = act.get("manufacturing_process") or act.get("novelty", {}).get("description") or ""
        act_proc = ", ".join(act_raw_proc) if isinstance(act_raw_proc, list) else str(act_raw_proc).strip()
        if (not raw_proc and not act_proc) or (raw_proc and len(act_proc) > 0):
            proc_matches += 1

        # Intended use match
        raw_use = raw.get("intended_use", "").strip()
        act_raw_use = act.get("intended_use") or ""
        act_use = ", ".join(act_raw_use) if isinstance(act_raw_use, list) else str(act_raw_use).strip()
        if (not raw_use and not act_use) or (raw_use and len(act_use) > 0):
            use_matches += 1

        # Novelty classification match
        exp_nov = exp.get("novelty", "other")
        act_nov_types = act.get("novelty", {}).get("novelty_type", [])
        act_nov_detected = act.get("novelty", {}).get("novelty_detected", False)
        if exp_nov in act_nov_types or (exp_nov == "other" and not act_nov_detected) or (exp_nov and any(exp_nov in t for t in act_nov_types)):
            nov_matches += 1

        # Bio resource detection match
        exp_bio = exp.get("bio_resource", False)
        act_bio = act.get("biological_resources", {}).get("biological_resource_used", False)
        if exp_bio == act_bio:
            bio_matches += 1

        # TK indicator match
        exp_tk = exp.get("tk_indicator", True)
        act_tk = act.get("traditional_knowledge_claimed", True)
        if exp_tk == act_tk:
            tk_matches += 1

    ing_acc = round(ing_matches / total, 4)
    proc_acc = round(proc_matches / total, 4)
    use_acc = round(use_matches / total, 4)
    nov_acc = round(nov_matches / total, 4)
    bio_acc = round(bio_matches / total, 4)
    tk_acc = round(tk_matches / total, 4)

    overall = round((ing_acc + proc_acc + use_acc + nov_acc + bio_acc + tk_acc) / 6.0, 4)

    return {
        "ingredient_accuracy": ing_acc,
        "process_accuracy": proc_acc,
        "intended_use_accuracy": use_acc,
        "novelty_accuracy": nov_acc,
        "bio_resource_accuracy": bio_acc,
        "tk_indicator_accuracy": tk_acc,
        "overall_fingerprint_accuracy": overall,
    }


# --- 2. Decision Engine Metrics ---

def calculate_classification_metrics(
    actual_labels: List[str], expected_labels: List[str]
) -> Dict[str, float]:
    """
    Calculates Accuracy, Precision, Recall, and F1 Score for a set of categorical labels.
    """
    total = len(expected_labels)
    if total == 0:
        return {"accuracy": 0.0, "precision": 0.0, "recall": 0.0, "f1_score": 0.0}

    correct = sum(1 for a, e in zip(actual_labels, expected_labels) if a == e)
    accuracy = round(correct / total, 4)

    # Calculate weighted macro precision, recall, f1
    unique_classes = set(expected_labels).union(set(actual_labels))
    precisions = []
    recalls = []
    f1s = []

    for cls in unique_classes:
        tp = sum(1 for a, e in zip(actual_labels, expected_labels) if a == cls and e == cls)
        fp = sum(1 for a, e in zip(actual_labels, expected_labels) if a == cls and e != cls)
        fn = sum(1 for a, e in zip(actual_labels, expected_labels) if a != cls and e == cls)

        p = tp / (tp + fp) if (tp + fp) > 0 else (1.0 if tp == 0 and fp == 0 else 0.0)
        r = tp / (tp + fn) if (tp + fn) > 0 else (1.0 if tp == 0 and fn == 0 else 0.0)
        f1 = (2 * p * r) / (p + r) if (p + r) > 0 else 0.0

        precisions.append(p)
        recalls.append(r)
        f1s.append(f1)

    avg_precision = round(sum(precisions) / len(precisions), 4) if precisions else 0.0
    avg_recall = round(sum(recalls) / len(recalls), 4) if recalls else 0.0
    avg_f1 = round(sum(f1s) / len(f1s), 4) if f1s else 0.0

    return {
        "accuracy": accuracy,
        "precision": avg_precision,
        "recall": avg_recall,
        "f1_score": avg_f1,
    }


def calculate_decision_engine_metrics(
    actual_decisions: List[Dict[str, str]], expected_decisions: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    Evaluates 4 regime decision engines separately and calculates multi-regime accuracy.
    Regimes: PATENT, TRADITIONAL_KNOWLEDGE, ABS, REGULATORY.
    """
    patent_act = [d.get("patent", "HIGH_RISK") for d in actual_decisions]
    patent_exp = [d.get("patent", "HIGH_RISK") for d in expected_decisions]

    tk_act = [d.get("traditional_knowledge", "OVERLAP_POSSIBLE") for d in actual_decisions]
    tk_exp = [d.get("traditional_knowledge", "OVERLAP_POSSIBLE") for d in expected_decisions]

    abs_act = [d.get("abs", "REVIEW_REQUIRED") for d in actual_decisions]
    abs_exp = [d.get("abs", "REVIEW_REQUIRED") for d in expected_decisions]

    reg_act = [d.get("regulatory", "CLASSIFICATION_REQUIRED") for d in actual_decisions]
    reg_exp = [d.get("regulatory", "CLASSIFICATION_REQUIRED") for d in expected_decisions]

    patent_metrics = calculate_classification_metrics(patent_act, patent_exp)
    tk_metrics = calculate_classification_metrics(tk_act, tk_exp)
    abs_metrics = calculate_classification_metrics(abs_act, abs_exp)
    reg_metrics = calculate_classification_metrics(reg_act, reg_exp)

    overall_accuracy = round(
        (
            patent_metrics["accuracy"]
            + tk_metrics["accuracy"]
            + abs_metrics["accuracy"]
            + reg_metrics["accuracy"]
        )
        / 4.0,
        4,
    )

    return {
        "patent": patent_metrics,
        "traditional_knowledge": tk_metrics,
        "abs": abs_metrics,
        "regulatory": reg_metrics,
        "patent_accuracy": patent_metrics["accuracy"],
        "tk_accuracy": tk_metrics["accuracy"],
        "abs_accuracy": abs_metrics["accuracy"],
        "regulatory_accuracy": reg_metrics["accuracy"],
        "overall_decision_accuracy": overall_accuracy,
    }


# --- 3. Retrieval Metrics ---

def calculate_retrieval_metrics(
    retrieved_results: List[List[Dict[str, Any]]],
    expected_doc_ids: List[List[str]],
    retrieval_times: List[float],
) -> Dict[str, float]:
    """
    Calculates Recall@1/3/5, Precision@1/3/5, Hit Rate, Mean Reciprocal Rank (MRR), NDCG, and Average Retrieval Time.
    """
    total_queries = len(expected_doc_ids)
    if total_queries == 0:
        return {
            "recall_at_1": 0.0,
            "recall_at_3": 0.0,
            "recall_at_5": 0.0,
            "precision_at_1": 0.0,
            "precision_at_3": 0.0,
            "precision_at_5": 0.0,
            "hit_rate": 0.0,
            "mrr": 0.0,
            "ndcg": 0.0,
            "average_retrieval_time": 0.0,
        }

    r1_list, r3_list, r5_list = [], [], []
    p1_list, p3_list, p5_list = [], [], []
    reciprocal_ranks = []
    ndcg_list = []
    hits = 0

    for ret_list, exp_ids in zip(retrieved_results, expected_doc_ids):
        ret_ids = [doc.get("id") for doc in ret_list if isinstance(doc, dict) and "id" in doc]

        if not exp_ids:
            if not ret_ids:
                r1_list.append(1.0); r3_list.append(1.0); r5_list.append(1.0)
                p1_list.append(1.0); p3_list.append(1.0); p5_list.append(1.0)
                reciprocal_ranks.append(1.0)
                ndcg_list.append(1.0)
                hits += 1
            else:
                r1_list.append(0.0); r3_list.append(0.0); r5_list.append(0.0)
                p1_list.append(0.0); p3_list.append(0.0); p5_list.append(0.0)
                reciprocal_ranks.append(0.0)
                ndcg_list.append(0.0)
            continue

        exp_set = set(exp_ids)

        def get_p_r(k: int) -> Tuple[float, float]:
            sub = ret_ids[:k]
            rel = sum(1 for d in sub if d in exp_set)
            p = rel / k if k > 0 else 0.0
            r = rel / len(exp_set) if len(exp_set) > 0 else 0.0
            return p, r

        p1, r1 = get_p_r(1)
        p3, r3 = get_p_r(3)
        p5, r5 = get_p_r(5)

        p1_list.append(p1); p3_list.append(p3); p5_list.append(p5)
        r1_list.append(r1); r3_list.append(r3); r5_list.append(r5)

        # Hit Rate @5
        rel_top5 = sum(1 for d in ret_ids[:5] if d in exp_set)
        if rel_top5 > 0:
            hits += 1

        # MRR calculation
        rank = 0
        for idx, doc_id in enumerate(ret_ids, start=1):
            if doc_id in exp_set:
                rank = idx
                break
        rr = (1.0 / rank) if rank > 0 else 0.0
        reciprocal_ranks.append(rr)

        # NDCG calculation @5
        dcg = 0.0
        for idx, doc_id in enumerate(ret_ids[:5], start=1):
            rel = 1.0 if doc_id in exp_set else 0.0
            dcg += rel / math.log2(idx + 1)

        idcg = sum(1.0 / math.log2(i + 1) for i in range(1, min(len(exp_set), 5) + 1))
        ndcg = (dcg / idcg) if idcg > 0 else 0.0
        ndcg_list.append(ndcg)

    return {
        "recall_at_1": round(sum(r1_list) / total_queries, 4),
        "recall_at_3": round(sum(r3_list) / total_queries, 4),
        "recall_at_5": round(sum(r5_list) / total_queries, 4),
        "precision_at_1": round(sum(p1_list) / total_queries, 4),
        "precision_at_3": round(sum(p3_list) / total_queries, 4),
        "precision_at_5": round(sum(p5_list) / total_queries, 4),
        "hit_rate": round(hits / total_queries, 4),
        "mrr": round(sum(reciprocal_ranks) / total_queries, 4),
        "ndcg": round(sum(ndcg_list) / total_queries, 4),
        "average_retrieval_time": round(sum(retrieval_times) / total_queries, 4) if retrieval_times else 0.0,
    }


# --- 4. Evidence Validator Metrics ---

def calculate_evidence_validation_metrics(
    actual_statuses: List[str],
    expected_statuses: List[str],
    confidence_scores: List[float],
) -> Dict[str, float]:
    """
    Calculates Evidence Classification Accuracy, Average Confidence Score, and Abstention Rate.
    """
    total = len(expected_statuses)
    if total == 0:
        return {
            "evidence_classification_accuracy": 0.0,
            "average_confidence": 0.0,
            "abstention_rate": 0.0,
        }

    correct = sum(1 for a, e in zip(actual_statuses, expected_statuses) if a == e)
    accuracy = round(correct / total, 4)
    avg_conf = round(sum(confidence_scores) / len(confidence_scores), 4) if confidence_scores else 0.0
    abstentions = sum(1 for a in actual_statuses if a == "ABSTAIN")
    abstention_rate = round(abstentions / total, 4)

    return {
        "evidence_classification_accuracy": accuracy,
        "average_confidence": avg_conf,
        "abstention_rate": abstention_rate,
    }


# --- 5. Smart Interview Metrics ---

def calculate_interview_metrics(
    completeness_before: List[float],
    completeness_after: List[float],
    questions_asked: List[int],
    total_active_fields: int = 13,
) -> Dict[str, float]:
    """
    Calculates Completeness Before/After, Interview Improvement %, Question Efficiency,
    and Average Questions Required per innovation.
    """
    total = len(completeness_before)
    if total == 0:
        return {
            "avg_completeness_before": 0.0,
            "avg_completeness_after": 0.0,
            "interview_improvement_percent": 0.0,
            "avg_questions_required": 0.0,
            "question_efficiency": 0.0,
        }

    avg_before = sum(completeness_before) / total
    avg_after = sum(completeness_after) / total

    improvement_pct = ((avg_after - avg_before) / avg_before * 100.0) if avg_before > 0 else 0.0
    avg_q = sum(questions_asked) / total if total > 0 else 0.0

    # Efficiency: percentage of available fields saved from being asked
    efficiency = round(((total_active_fields - avg_q) / total_active_fields) * 100.0, 2) if total_active_fields > 0 else 0.0

    return {
        "avg_completeness_before": round(avg_before, 4),
        "avg_completeness_after": round(avg_after, 4),
        "interview_improvement_percent": round(improvement_pct, 2),
        "avg_questions_required": round(avg_q, 2),
        "question_efficiency": efficiency,
    }


# --- 6. End-to-End System Metrics ---

def calculate_system_metrics(
    total_cases: int,
    successful_cases: int,
    failed_cases: int,
    processing_times: List[float],
    confidence_scores: List[float],
    abstention_count: int,
) -> Dict[str, Any]:
    """
    Calculates End-to-End System Success Rate, Average Processing Time, Average Confidence,
    and Abstention Rate.
    """
    if total_cases == 0:
        return {
            "total_test_cases": 0,
            "successful_cases": 0,
            "failed_cases": 0,
            "system_success_rate": 0.0,
            "average_processing_time": 0.0,
            "average_confidence": 0.0,
            "abstention_rate": 0.0,
        }

    success_rate = round(successful_cases / total_cases, 4)
    avg_time = round(sum(processing_times) / total_cases, 4) if processing_times else 0.0
    avg_conf = round(sum(confidence_scores) / len(confidence_scores), 4) if confidence_scores else 0.0
    abstention_rate = round(abstention_count / total_cases, 4)

    return {
        "total_test_cases": total_cases,
        "successful_cases": successful_cases,
        "failed_cases": failed_cases,
        "system_success_rate": success_rate,
        "average_processing_time": avg_time,
        "average_confidence": avg_conf,
        "abstention_rate": abstention_rate,
    }
