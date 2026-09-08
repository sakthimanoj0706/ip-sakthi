# ABS ENGINE REPORT
## Phase 10: ABS Engine Verification — IP-SAKTI Sahayak
**Generated**: 2026-09-07  |  **Result Type**: LOCAL RESULT

---

## Test Cases

**E3: Wild Herb from Western Ghats** (ABS triggered)
- `biological_resource_used=True`, `source_location="Western Ghats"`
- Expected: `REVIEW_REQUIRED`  |  Actual: `REVIEW_REQUIRED`  |  **PASS**

**E5: Synthetic Compound** (No ABS)
- `biological_resource_used=False`
- Expected: `LOW_RISK`  |  Actual: `LOW_RISK`  |  **PASS**

---

## ABS Engine Logic
- `biological_resource_used=True` → `REVIEW_REQUIRED`
- Source location cited in reason
- NBA Form 8 registration requirement stated
- BMC Certificate of Origin exemption mentioned
- Section 7 SBB intimation exemption covered

Legal references: Biological Diversity (Amendment) Act 2023

---

## Evaluation Accuracy (30 test cases)
| Metric | Score |
|--------|-------|
| ABS Accuracy | 100.0% |
| ABS Precision | 100.0% |
| ABS Recall | 100.0% |
| ABS F1 | 1.000 |

---

## Verdict
**ABS ENGINE: PASS — 100% accuracy**
BDA 2023 cited. NBA Form 8 and SBB intimation requirements included.
