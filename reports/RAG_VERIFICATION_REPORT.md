# LOCAL RAG VERIFICATION REPORT
## Phase 12: Local RAG Verification — IP-SAKTI Sahayak
**Generated**: 2026-09-07  |  **Result Type**: LOCAL RESULT

---

## Knowledge Base Status
| Item | Value |
|------|-------|
| Total chunks | 19 |
| BM25 index | Built on startup |
| TF-IDF fallback | Active |
| Synonym expansion | Active (30 entries) |
| Regime metadata filtering | Active |

---

## Per-Regime Retrieval Test

**PATENT Regime**:
```
Query: "patent section 3 traditional Ayurveda herbs novelty"
[PA-3P-001] score=0.310 - Section 3(p) Patent Exclusion for Traditional Knowledge
[PPVFRA-001] score=0.270 - Protection of Plant Varieties & Farmers Rights
[PA-3P-002] score=0.189 - Section 3(p) Legislative Intent and Protection
```

**TRADITIONAL_KNOWLEDGE Regime**:
```
Query: "traditional knowledge TKDL prior art Ayurveda Charaka"
[TKDL-001]   score=0.642 - Traditional Knowledge Digital Library Prior Art Framework
[GI-001]     score=0.141 - Geographical Indications for Regional Ayurvedic Formulations
```

**ABS Regime**:
```
Query: "biological diversity NBA Form 8 biodiversity benefit sharing"
[BDA-2023-008] score=0.611 - Section 21 Benefit Sharing Framework
[BDA-2023-004] score=0.565 - Section 6(1B) Commercialization Stage Benefit Sharing
[BDA-2023-001] score=0.539 - Biological Diversity Amendment Act 2023 Overview
```

**REGULATORY Regime**:
```
Query: "AYUSH drug licensing regulatory classification Drugs Cosmetics Act"
[DCA-3H-001]       score=0.498 - Section 3(h) & Rule 158-B Proprietary ASU Medicine
[DCA-3A-001]       score=0.495 - Section 3(a) Classical ASU Drug Licensing
[FSSAI-AAHARA-001] score=0.393 - FSSAI Ayurveda Aahara Regulations 2022
```

---

## Retrieval Metrics (30 test cases)
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Hit Rate @5 | 83.3% | >= 80% | PASS |
| Recall @3 | 45.0% | — | — |
| Recall @5 | 53.3% | — | — |
| Precision @3 | 27.8% | — | — |
| MRR | 0.426 | — | — |
| NDCG | 0.386 | — | — |
| Avg Retrieval Time | 0.0021s | < 1s | PASS |

---

## Hybrid Fusion Weights
| Component | Weight |
|-----------|--------|
| BM25 score | 0.5 |
| TF-IDF cosine similarity | 0.5 |
| sentence-transformers | Disabled (falls back to TF-IDF) |

---

## Verdict
**LOCAL RAG VERIFICATION: PASS**
Hit Rate 83.3% exceeds 80% threshold. All 4 regimes returning relevant chunks.
Retrieval time < 0.01s per query.
