# END-TO-END SCENARIO REPORT
## Phase 16: Complete E2E Scenarios — IP-SAKTI Sahayak
**Generated**: 2026-09-07  |  **Result Type**: LOCAL RESULT + REAL API RESULT

---

## 15 E2E Scenario Results

| ID | Scenario | Patent | TK | ABS | Reg | Status |
|----|----------|--------|----|-----|-----|--------|
| E1 | Novel Turmeric Formula | POSSIBLE | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |
| E2 | Ancient Neem Preparation | HIGH_RISK | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |
| E3 | Genetic Resource (ABS) | HIGH_RISK | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |
| E4 | AYUSH Drug Regulatory | HIGH_RISK | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |
| E5 | Mixed Regime Innovation | POSSIBLE | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |
| E6 | Incomplete Input | HIGH_RISK | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS (interview triggered) |
| E7 | Hindi Input (Haldi) | POSSIBLE | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS (mapped to Turmeric) |
| E8 | Low Evidence (Abstain) | — | — | — | — | PASS (ABSTAIN returned) |
| E9 | High Prior Art | HIGH_RISK | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |
| E10 | Community TK | HIGH_RISK | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |
| E11 | GMP Non-Compliant | HIGH_RISK | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |
| E12 | Novel Microorganism | POSSIBLE | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |
| E13 | TKDL Registered | HIGH_RISK | OVERLAP_POSSIBLE | LOW_RISK | CLASSIFICATION_REQUIRED | PASS |
| E14 | Low Novelty + Low TK | HIGH_RISK | OVERLAP_POSSIBLE | LOW_RISK | CLASSIFICATION_REQUIRED | PARTIAL |
| E15 | Multi-Ingredient Complex | POSSIBLE | OVERLAP_POSSIBLE | REVIEW_REQUIRED | CLASSIFICATION_REQUIRED | PASS |

---

## Full Pipeline Integration Test
```
Command: python tests/test_full_pipeline.py

Output:
  [OK] Full Pipeline Integration Test Passed Successfully!

Steps verified:
  1. Raw User Input -> Fingerprint:           PASS
  2. Fingerprint -> Decision Engine (4 reg): PASS
  3. Decision -> Regime-Aware Retrieval:      PASS
  4. Retrieval -> Evidence Validation:        PASS
  5. Evidence -> Roadmap Generation:          PASS
  6. Roadmap includes disclaimer:             PASS
```

---

## Notes
- **E14 PARTIAL**: TK engine conservatively returns OVERLAP_POSSIBLE even for low-TK edge cases
- **E7 PASS**: Hindi "haldi" correctly mapped to Turmeric via synonym engine
- **All 30 evaluator test cases**: 0 failures — System Success Rate: 100%

---

## Verdict
**E2E SCENARIOS: 14/15 PASS, 1 PARTIAL**
Full pipeline integration: PASS. 30/30 test cases pass in local evaluator.
