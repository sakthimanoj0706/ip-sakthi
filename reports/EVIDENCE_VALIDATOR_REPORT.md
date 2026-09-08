# EVIDENCE VALIDATOR REPORT
## Phase 15: Evidence Validator Verification — IP-SAKTI Sahayak
**Generated**: 2026-09-07  |  **Result Type**: LOCAL RESULT

---

## EvidenceValidator Test

**Test Input**: Neem + Turmeric nano-extraction formulation

**Actual Output** (LOCAL RESULT):
```
Regime: PATENT
  Status:     PARTIALLY_SUPPORTED
  Confidence: medium
  Citations:  2
  Warning:    "Guidance partially supported. Verify with primary gazette text."

Regime: TRADITIONAL_KNOWLEDGE
  Status:     PARTIALLY_SUPPORTED | Confidence: medium | Citations: 2

Regime: ABS
  Status:     PARTIALLY_SUPPORTED | Confidence: medium | Citations: 2

Regime: REGULATORY
  Status:     PARTIALLY_SUPPORTED | Confidence: medium | Citations: 2
```

---

## Confidence Scoring
| Status | Confidence Level | Score Threshold |
|--------|-----------------|-----------------|
| SUPPORTED | high | score >= 0.7 |
| PARTIALLY_SUPPORTED | medium | score >= 0.4 |
| INSUFFICIENT_EVIDENCE | low | score < 0.4 |
| ABSTAIN | none | no evidence |

---

## Abstention Logic
- ABSTAIN triggered: 2 cases (TC015 "Quantum Entangled Herb", TC029 synthetic non-Ayurveda)
- INSUFFICIENT_EVIDENCE: 1 case
- Abstention rate: 6.7%
- Abstention triggered correctly for non-Ayurveda / junk inputs: **PASS**

---

## Evidence Distribution (30 test cases)
| Status | Count |
|--------|-------|
| SUPPORTED | 23 (76.7%) |
| PARTIALLY_SUPPORTED | 4 (13.3%) |
| INSUFFICIENT_EVIDENCE | 1 (3.3%) |
| ABSTAIN | 2 (6.7%) |

---

## Evaluation Accuracy
| Metric | Score |
|--------|-------|
| Evidence Classification Accuracy | 100.0% |
| Average Confidence | 70.9% |

---

## Verdict
**EVIDENCE VALIDATOR: PASS (100.0% accuracy)**
Confidence scoring correct. ABSTAIN triggered correctly. Citations populated.
