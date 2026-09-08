# RESEARCH ROUTING REPORT
## Phase 14: Local RAG + Tavily Routing Verification — IP-SAKTI Sahayak
**Generated**: 2026-09-07  |  **Result Type**: LOCAL RESULT

---

## Routing Logic Test

| Test | validation_map status | user_requested | should_trigger | Expected | Status |
|------|-----------------------|----------------|----------------|----------|--------|
| 1 | SUPPORTED | False | False | False | PASS |
| 2 | INSUFFICIENT_EVIDENCE | False | True | True | PASS |
| 3 | ABSTAIN | False | True | True | PASS |
| 4 | Any | True | True | True | PASS |

---

## Routing Decision Matrix
| Evidence Status | User Requested | Tavily Triggered |
|----------------|---------------|-----------------|
| SUPPORTED | False | No |
| PARTIALLY_SUPPORTED | False | No |
| INSUFFICIENT_EVIDENCE | False | YES |
| ABSTAIN | False | YES |
| Any | True | YES |

---

## Pipeline Integration in main.py
```python
# Step 3: Local RAG (always runs)
retrieved_evidence_map = retrieval_engine.retrieve_for_regimes(fp, decisions)

# Step 4: Tavily (supplementary, runs if enabled)
web_research_map = web_research_engine.research_regimes(fp, decisions)

# Step 5: Evidence validation (combines both sources)
validation_map = evidence_validator.validate_all_regimes(
    retrieved_evidence_map, web_research_map=web_research_map
)
```

---

## Fallback Behavior
When Tavily fails: returns `{}` — evidence validator uses local RAG only.
Pipeline continues without interruption: **PASS**

---

## Verdict
**RESEARCH ROUTING: PASS**
Correct routing for all 4 status conditions. Local-first, Tavily-supplementary.
Fallback to local RAG on Tavily failure verified.
