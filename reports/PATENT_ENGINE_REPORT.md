# PATENT ENGINE REPORT
## Phase 8: Patent Engine Verification — IP-SAKTI Sahayak
**Generated**: 2026-09-07  |  **Result Type**: LOCAL RESULT

---

## Test Cases

**E1: Novel Turmeric Nanoformulation** (Patent recommended)
- Input: Novel nano-emulsion of Curcuma longa with enhanced bioavailability
- Novelty: nano-emulsion self-assembly process
- Expected: `POSSIBLE`  |  Actual: `POSSIBLE`  |  **PASS**

**E2: Ancient Neem Preparation** (Patent denied)
- Input: Traditional Neem decoction as per Charaka Samhita
- No novel process claimed
- Expected: `HIGH_RISK`  |  Actual: `HIGH_RISK`  |  **PASS**

---

## 3-Part Patent Test Compliance
| Check | Status |
|-------|--------|
| Section 3(p) TK exclusion | PASS — Checked via `traditional_knowledge_claimed` |
| Section 3(e) mere-admixture | PASS — Triggers when no novelty |
| Novelty detection | PASS — Uses `fp.novelty.novelty_detected` |
| Novel process override | PASS — Shifts status to `POSSIBLE` |

---

## Evaluation Accuracy (30 test cases)
| Metric | Score |
|--------|-------|
| Patent Accuracy | 100.0% |
| Patent Precision | 100.0% |
| Patent Recall | 100.0% |
| Patent F1 | 1.000 |

---

## Verdict
**PATENT ENGINE: PASS — 100% accuracy**
