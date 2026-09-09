# IP-SAKTI Sahayak - System Evaluation Report

> **Project**: IP-SAKTI Sahayak (SIH 2026)  
> **Evaluation Mode**: 100% Local & Offline (No External APIs, No API Keys Required)  
> **Evaluated Date**: September 2026  

---

## Executive Summary

This report documents the empirical evaluation results for **IP-SAKTI Sahayak** — an AI-Powered Multilingual IP & Regulatory Guidance System for Ayurveda Innovations. The evaluation measures performance across all core pipeline modules using a benchmark dataset of **30 synthetic Ayurveda innovation test cases**.

---

## Evaluation Setup

- **Local Synthetic Dataset**: 30 structured innovation scenarios representing diverse Ayurveda formulations, extraction methods, and regulatory edge-cases.
- **Local Hybrid RAG Retrieval**: Okapi BM25 ranking + local dense vector embeddings (sentence-transformers / TF-IDF cosine fallback) + Ayurveda synonym query expansion + Regime metadata filtering.
- **Local Knowledge Base**: Operates over `ip_sakti_knowledge_base.json` (19 verified legal knowledge chunks).
- **Zero External LLM Dependency**: No OpenAI, Gemini, or paid third-party API dependencies. Runs strictly locally (`AI_MODE=local`).

---

## 1. Innovation Fingerprint Results

- **Overall Fingerprint Accuracy**: **58.3%**
- **Ingredient Extraction Accuracy**: 100.0%
- **Process Extraction Accuracy**: 3.3%
- **Intended Use Detection Accuracy**: 100.0%
- **Novelty Classification Accuracy**: 33.3%
- **Bio-Resource Detection Accuracy**: 13.3%
- **Traditional Knowledge Indicator Accuracy**: 100.0%

---

## 2. 4-Regime Decision Engine Results

- **Multi-Regime Decision Accuracy**: **97.5%**

| Regulatory Regime | Accuracy | Precision | Recall | F1 Score |
| :--- | :--- | :--- | :--- | :--- |
| **Patent Engine (Section 3p/3e)** | 100.0% | 100.0% | 100.0% | 100.0% |
| **Traditional Knowledge Engine (TKDL)** | 90.0% | 95.0% | 50.0% | 47.4% |
| **ABS Engine (BDA 2023)** | 100.0% | 100.0% | 100.0% | 100.0% |
| **Regulatory Engine (AYUSH / DCA)** | 100.0% | 100.0% | 100.0% | 100.0% |

---

## 3. Knowledge Retrieval Results (Hybrid RAG)

| Retrieval Metric | Score |
| :--- | :--- |
| **Hit Rate** | **83.3%** |
| **Recall@1** | 8.3% |
| **Recall@3** | 45.0% |
| **Recall@5** | 53.3% |
| **Precision@1** | 16.7% |
| **Precision@3** | 27.8% |
| **Precision@5** | 20.0% |
| **Mean Reciprocal Rank (MRR)** | 0.426 |
| **NDCG** | 0.386 |
| **Average Retrieval Latency** | 3.90 ms |

---

## 4. Evidence Validation Results

- **Evidence Classification Accuracy**: **100.0%**
- **Average Confidence Score**: 0.709
- **Abstention Rate**: 6.7%

---

## 5. Smart Adaptive Interview Results

- **Information Completeness Before Interview**: 15.1%
- **Information Completeness After Interview**: 53.5%
- **Interview Completion Improvement**: **+253.6%**
- **Average Questions Required per Innovation**: 5.0 questions
- **Question Efficiency**: 61.5% questions saved via adaptive branching

---

## 6. System Performance & Latency

- **System Success Rate**: **100.0%**
- **Average Processing Time per Innovation**: **4.032 seconds**
- **Total Test Cases**: 30 (30 passed, 0 failed)

---

## 7. Generated Visualizations

All evaluation charts have been generated in high resolution inside `evaluation/graphs/`:

1. `module_accuracy.png` - Overall Module Accuracy Comparison
2. `regime_accuracy.png` - 4-Regime Decision Accuracy
3. `retrieval_performance.png` - Knowledge Base Retrieval Performance
4. `evidence_status.png` - Evidence Validation Status Distribution
5. `confidence_distribution.png` - System Confidence Score Distribution
6. `interview_improvement.png` - Smart Interview Completeness Gain
7. `system_performance.png` - End-to-End System Latency and Success Rate
8. `hybrid_retrieval_comparison.png` - Hybrid Retrieval Comparison (Keyword vs Semantic vs Hybrid)

---

## 8. Limitations & Future Roadmap

> [!WARNING]
> **Synthetic Dataset Limitation**: This evaluation uses synthetic benchmark test cases. Real-world Ayurveda patent applications contain nuanced claims requiring domain expert validation.

> [!IMPORTANT]
> **No Paid LLM Requirement**: The evaluation system operates completely offline using BM25, local TF-IDF / dense embeddings, and rule-based decision trees (`AI_MODE=local`).

> [!CAUTION]
> **Disclaimer**: This evaluation report does NOT constitute legal or medical advice. Final IP patent filing decisions must be validated by a registered Indian Patent Agent.
