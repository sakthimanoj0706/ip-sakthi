# DATA FLOW TRACE
## Phase 19: Data Flow Verification — IP-SAKTI Sahayak
**Generated**: 2026-09-07  |  **Result Type**: LOCAL RESULT

---

## Stage 1: User Input → Fingerprint

```
User Input (string, any language)
    |
    v  FingerprintExtractor.extract_fingerprint()
Language Detection (Tamil/Hindi/Tanglish/English)
    |
    v  NLPService.extract()
spaCy NLP + PhraseMatcher + Regex
    → ingredients, processes, uses, locations
    |
    v  GeminiService.extract_structured_fingerprint()  [API if enabled]
Gemini AI Extraction
    → ingredients, scientific_names, ayurvedic_names, process, novelty
    |
    v  Merge & Deduplicate (Python sets)
Set union of all layers + Botanical enrichment via AYURVEDA_HERB_MAP
    |
    v  InnovationFingerprint (Pydantic model)
Final fingerprint: name, ingredients, processes, novelty, bio_resource, TK, confidence
```

## Stage 2: Fingerprint → Decisions

```
InnovationFingerprint
    |
    v  DecisionEngine.evaluate()
4 parallel regime evaluations:
    _evaluate_patent_regime()         → DecisionResult(PATENT, status, reason)
    _evaluate_tk_regime()             → DecisionResult(TRADITIONAL_KNOWLEDGE, ...)
    _evaluate_abs_regime()            → DecisionResult(ABS, ...)
    _evaluate_regulatory_regime()     → DecisionResult(REGULATORY, ...)
    |
    v  MultiRegimeDecision
decisions: [patent, tk, abs, regulatory]  +  overall_summary
```

## Stage 3: Decisions → Retrieval

```
InnovationFingerprint + List[DecisionResult]
    |
    v  RegimeRetrievalEngine.retrieve_for_regimes()
For each regime:
    generate_regime_query() → targeted query string
    KnowledgeRetriever.retrieve(query, regime_filter=regime)
        BM25 score (Okapi BM25)
        TF-IDF cosine score
        Synonym expansion
        Regime metadata filter
        Hybrid fusion (0.5 BM25 + 0.5 semantic)
    |
    v  Dict[str, RegimeEvidenceGroup]
{ PATENT: {query, evidence: [{id, score, title, text}]}, ... }
```

## Stage 4: Retrieval → Evidence Validation

```
retrieved_evidence_map + optional web_research_map
    |
    v  EvidenceValidator.validate_all_regimes()
For each regime:
    Score threshold check
    Top-k citations selected
    Warning generated if partial
    ABSTAIN if no evidence
    |
    v  Dict[str, ValidationResult]
{ PATENT: ValidationResult(status, confidence, citations, warning), ... }
```

## Stage 5: Evidence → Roadmap

```
fingerprint + decisions + evidence_map + validation_results
    |
    v  RoadmapGenerator.generate_roadmap()
For each regime:
    innovation_summary + detected_risks
    recommended_actions (from decision engine)
    legal_references (from evidence)
    validation warning (if partial)
    |
    v  Final roadmap dict
{
  innovation_summary, regime_roadmaps: [4 items],
  overall_next_action, disclaimer
}
```

---

## Data Integrity Checks
| Stage | Data Preserved | No Data Loss | Status |
|-------|---------------|--------------|--------|
| Input → Fingerprint | ingredients, processes, TK flag | YES | PASS |
| Fingerprint → Decision | All fingerprint fields used | YES | PASS |
| Decision → Retrieval | regime_name used as filter key | YES | PASS |
| Retrieval → Validation | scores and IDs preserved | YES | PASS |
| Validation → Roadmap | citations included in output | YES | PASS |

---

## Verdict
**DATA FLOW VERIFICATION: PASS**
All 5 stages traced and verified. No data loss between stages. Correct types throughout.
