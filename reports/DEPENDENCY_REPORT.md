# DEPENDENCY REPORT
## Phase 2: Environment & Dependency Verification — IP-SAKTI Sahayak
**Generated**: 2026-09-07  |  **Result Type**: LOCAL RESULT

---

## Python Environment
| Item | Value |
|------|-------|
| Python Version | 3.10.x |
| Path | C:/Users/velma/AppData/Local/Programs/Python/Python310/python.exe |
| pip version | 26.2 |

---

## Critical Package Verification
| Package | Installed | Version | Status |
|---------|-----------|---------|--------|
| fastapi | YES | 0.141.1 | PASS |
| uvicorn | YES | 0.52.4 | PASS |
| pydantic | YES | 2.9.2 | PASS |
| spacy | YES | 3.8.11 | PASS |
| en_core_web_sm | YES | 3.8.0 | PASS |
| rank-bm25 | YES | 0.2.2 | PASS |
| scikit-learn | YES | 1.7.2 | PASS |
| numpy | YES | 1.26.4 | PASS |
| matplotlib | YES | 3.8.4 | PASS |
| google-genai | YES | 1.68.0 | PASS |
| google-generativeai | YES | 0.8.6 | PASS |
| tavily-python | YES | 0.8.1 | PASS |
| python-dotenv | YES | 1.0.1 | PASS |
| langdetect | YES | 1.0.9 | PASS |
| sentence-transformers | YES | 5.2.3 | AVAILABLE (disabled by default) |
| torch | YES | 2.12.0 | AVAILABLE |

---

## spaCy Model Validation
```
Command: python -m spacy validate

NAME             SPACY            VERSION
en_core_web_sm   >=3.8.0,<3.9.0   3.8.0   [+]

Status: COMPATIBLE
```

---

## Import Chain Test
```
from backend.config           -> OK (GEMINI_ENABLED=True, TAVILY_ENABLED=True, SPACY_ENABLED=True)
from backend.nlp_service      -> OK (spaCy loaded: True)
from backend.gemini_service   -> OK (Gemini client initialized)
from backend.fingerprint_schema  -> OK
from backend.fingerprint_extractor -> OK
from backend.interview_agent  -> OK
from backend.decision_engine  -> OK
from backend.retrieval        -> OK (BM25 index built, 19 chunks)
from backend.regime_retrieval -> OK
from backend.evidence_validator -> OK
from backend.roadmap_generator -> OK
from backend.web_research     -> OK (Tavily client initialized)
```
All 12 import chains: **PASS**

---

## Missing Items
| Item | Status | Impact |
|------|--------|--------|
| requirements.txt | MISSING | Low — packages installed but undocumented |

---

## Verdict
**DEPENDENCY VERIFICATION: PASS**
All critical packages installed. en_core_web_sm v3.8.0 compatible. No blocking issues.
