"""
IP-SAKTI Sahayak - FastAPI Backend Server
Provides REST API endpoints for the Ayurveda IP & Regulatory AI assistant.
"""

import json
import sys
import uuid
from pathlib import Path
from typing import List, Dict, Any, Optional, Union

from fastapi import FastAPI, HTTPException, Path as APIPath, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Support both package import and direct script execution
sys.path.append(str(Path(__file__).parent.parent))

try:
    from backend.config import get_config_summary, AI_MODE
    from backend.fingerprint_schema import InnovationFingerprint
    from backend.fingerprint_extractor import FingerprintExtractor
    from backend.interview_agent import AdaptiveInterviewAgent, QuestionPrompt
    from backend.decision_engine import DecisionEngine
    from backend.decision_map import generate_decision_map
    from backend.regime_retrieval import RegimeRetrievalEngine
    from backend.web_research import WebResearchEngine
    from backend.evidence_validator import EvidenceValidator
    from backend.roadmap_generator import RoadmapGenerator
except ImportError:
    from config import get_config_summary, AI_MODE
    from fingerprint_schema import InnovationFingerprint
    from fingerprint_extractor import FingerprintExtractor
    from interview_agent import AdaptiveInterviewAgent, QuestionPrompt
    from decision_engine import DecisionEngine
    from decision_map import generate_decision_map
    from regime_retrieval import RegimeRetrievalEngine
    from web_research import WebResearchEngine
    from evidence_validator import EvidenceValidator
    from roadmap_generator import RoadmapGenerator


# Initialize FastAPI app with Swagger documentation
app = FastAPI(
    title="IP-SAKTI Sahayak API",
    description="Multilingual, RAG-based AI assistant API for Ayurveda IP and regulatory guidance.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS middleware for Streamlit and Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8501", "http://127.0.0.1:8501", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory interview session store
INTERVIEW_SESSIONS: Dict[str, AdaptiveInterviewAgent] = {}

# Instantiate core engines (reusing singletons)
fingerprint_extractor = FingerprintExtractor()
decision_engine = DecisionEngine()
retrieval_engine = RegimeRetrievalEngine()
web_research_engine = WebResearchEngine()
evidence_validator = EvidenceValidator()
roadmap_generator = RoadmapGenerator()


# --- Pydantic Request & Response Schemas ---

class HealthResponse(BaseModel):
    status: str
    system: str
    version: str
    mode: str
    services: Dict[str, bool]


class AnalyzeRequest(BaseModel):
    innovation_name: Optional[str] = Field(default=None, description="Title of the Ayurveda innovation.")
    description: str = Field(..., description="Description of formulation/process (supports English, Tamil, Hindi, Tanglish).")
    ingredients: Optional[Union[List[str], str]] = Field(default=None, description="List or comma-separated string of ingredients.")
    intended_use: Optional[str] = Field(default=None, description="Therapeutic or commercial use.")
    product_category: Optional[str] = Field(default="Ayurvedic Medicine / Formulation", description="Product category.")
    traditional_knowledge_claimed: Optional[bool] = Field(default=True, description="Whether traditional knowledge is claimed.")
    novelty_description: Optional[str] = Field(default=None, description="Novel process or extraction description.")
    novelty_types: Optional[List[str]] = Field(default=None, description="Types of novelty (e.g. extraction_method).")
    biological_resource_used: Optional[bool] = Field(default=False, description="Whether Indian biological resources are used.")
    source_location: Optional[str] = Field(default=None, description="Source state or location in India.")


class FullAnalysisResponse(BaseModel):
    fingerprint: Dict[str, Any]
    decision_map: Dict[str, Any]
    retrieved_evidence: Dict[str, Any]
    web_research: Optional[Dict[str, Any]] = None
    evidence_validation: Dict[str, Any]
    roadmap: Dict[str, Any]


class StartInterviewRequest(BaseModel):
    initial_inputs: Optional[Dict[str, Any]] = Field(default=None, description="Optional pre-filled input values.")


class StartInterviewResponse(BaseModel):
    session_id: str
    next_question: Optional[QuestionPrompt]
    progress: Dict[str, Any]
    completed: bool


class SubmitAnswerRequest(BaseModel):
    field_name: str = Field(..., description="Name of the field being answered.")
    answer: Any = Field(..., description="User's answer value.")


class SubmitAnswerResponse(BaseModel):
    session_id: str
    submitted_field: str
    next_question: Optional[QuestionPrompt]
    progress: Dict[str, Any]
    completed: bool


class InterviewStatusResponse(BaseModel):
    session_id: str
    completed: bool
    progress: Dict[str, Any]
    current_question: Optional[QuestionPrompt]
    missing_fields: List[str]


# --- Helper Function: Full Pipeline Orchestrator ---

def run_pipeline(fingerprint: InnovationFingerprint) -> FullAnalysisResponse:
    """Executes the complete IP-SAKTI hybrid pipeline for a given fingerprint."""
    # 1. Multi-Regime Decision Engine Evaluation
    multi_decisions = decision_engine.evaluate(fingerprint)

    # 2. Decision Map Visualizer Transformation
    decision_map = generate_decision_map(multi_decisions.decisions, overall_summary=multi_decisions.overall_summary)

    # 3. Regime-Aware Local Hybrid RAG Evidence Retrieval
    retrieved_evidence_map = retrieval_engine.retrieve_for_regimes(fingerprint, multi_decisions.decisions)

    # 4. Live Web Research (Supplementary Tavily RAG with domain authority filtering)
    web_research_map = web_research_engine.research_regimes(fingerprint, multi_decisions.decisions)

    # 5. Evidence Validation (combines local RAG and web research sources)
    validation_map = evidence_validator.validate_all_regimes(
        retrieved_evidence_map, web_research_map=web_research_map
    )
    val_json = {r: res.model_dump() for r, res in validation_map.items()}

    # 6. Personalized Action Roadmap Generation
    roadmap = roadmap_generator.generate_roadmap(
        fingerprint=fingerprint,
        decisions=multi_decisions.decisions,
        evidence_map=retrieved_evidence_map,
        validation_results=validation_map,
    )

    return FullAnalysisResponse(
        fingerprint=fingerprint.model_to_dict(),
        decision_map=decision_map,
        retrieved_evidence=retrieved_evidence_map,
        web_research=web_research_map,
        evidence_validation=val_json,
        roadmap=roadmap,
    )


# --- REST API Endpoints ---

@app.get("/", response_model=HealthResponse, tags=["Health Check"])
@app.get("/health", response_model=HealthResponse, tags=["Health Check"])
def health_check():
    """Health check endpoint returning system status, execution mode, and active services."""
    cfg = get_config_summary()
    return HealthResponse(
        status=cfg.get("status", "healthy"),
        system="IP-SAKTI Sahayak",
        version="2.0.0",
        mode=cfg.get("ai_mode", "hybrid"),
        services=cfg.get("services", {}),
    )


@app.post("/analyze", response_model=FullAnalysisResponse, tags=["Analysis"])
def analyze_innovation(req: AnalyzeRequest):
    """
    Direct analysis endpoint. Accepts multilingual text or structured details,
    extracts an InnovationFingerprint using multi-layer NLP/AI, and runs the full IP-SAKTI pipeline.
    """
    # Use multi-layer extractor on user input
    fingerprint = fingerprint_extractor.extract_fingerprint(
        text=req.description,
        innovation_name=req.innovation_name or "Ayurvedic Innovation",
    )

    # Override/enrich with explicitly passed structured fields if provided
    if req.ingredients:
        ing_list = req.ingredients if isinstance(req.ingredients, list) else [i.strip() for i in req.ingredients.split(",") if i.strip()]
        if ing_list:
            fingerprint.ingredients = list(set(fingerprint.ingredients + ing_list))

    if req.novelty_description:
        if req.novelty_description not in fingerprint.novelty_indicators:
            fingerprint.novelty_indicators.append(req.novelty_description)

    if req.source_location:
        fingerprint.biological_resource.source_location = req.source_location
        fingerprint.biological_resource.detected = True

    return run_pipeline(fingerprint)


@app.post("/interview/start", response_model=StartInterviewResponse, tags=["Smart Interview"])
def start_interview(req: StartInterviewRequest):
    """Starts a new adaptive interview session."""
    session_id = str(uuid.uuid4())
    agent = AdaptiveInterviewAgent()
    agent.start_interview(initial_inputs=req.initial_inputs)
    
    INTERVIEW_SESSIONS[session_id] = agent
    next_q = agent.get_next_question()

    return StartInterviewResponse(
        session_id=session_id,
        next_question=next_q,
        progress=agent.get_progress(),
        completed=agent.is_complete(),
    )


@app.post("/interview/{session_id}/answer", response_model=SubmitAnswerResponse, tags=["Smart Interview"])
def submit_answer(
    session_id: str = APIPath(..., description="Active interview session ID."),
    req: SubmitAnswerRequest = ...,
):
    """Submits an answer for an active interview session and returns the next question."""
    if session_id not in INTERVIEW_SESSIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview session '{session_id}' not found.",
        )

    agent = INTERVIEW_SESSIONS[session_id]
    agent.submit_answer(req.field_name, req.answer)
    next_q = agent.get_next_question()

    return SubmitAnswerResponse(
        session_id=session_id,
        submitted_field=req.field_name,
        next_question=next_q,
        progress=agent.get_progress(),
        completed=agent.is_complete(),
    )


@app.get("/interview/{session_id}/status", response_model=InterviewStatusResponse, tags=["Smart Interview"])
def get_interview_status(
    session_id: str = APIPath(..., description="Active interview session ID.")
):
    """Retrieves current interview session progress and missing fields."""
    if session_id not in INTERVIEW_SESSIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview session '{session_id}' not found.",
        )

    agent = INTERVIEW_SESSIONS[session_id]
    next_q = agent.get_next_question()

    return InterviewStatusResponse(
        session_id=session_id,
        completed=agent.is_complete(),
        progress=agent.get_progress(),
        current_question=next_q,
        missing_fields=agent.state.missing_fields,
    )


@app.post("/interview/{session_id}/complete", response_model=FullAnalysisResponse, tags=["Smart Interview"])
def complete_interview_and_analyze(
    session_id: str = APIPath(..., description="Active interview session ID.")
):
    """
    Finalizes the interview session, builds the InnovationFingerprint, and executes the full pipeline.
    """
    if session_id not in INTERVIEW_SESSIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview session '{session_id}' not found.",
        )

    agent = INTERVIEW_SESSIONS[session_id]
    fingerprint = agent.build_fingerprint()
    
    return run_pipeline(fingerprint)


# --- Evaluation System REST API Endpoints ---

from fastapi.staticfiles import StaticFiles
from fastapi.responses import PlainTextResponse

# Mount graphs directory for serving visualization PNGs
graphs_dir = Path(__file__).parent.parent / "evaluation" / "graphs"
graphs_dir.mkdir(parents=True, exist_ok=True)
app.mount("/evaluation/graphs_static", StaticFiles(directory=str(graphs_dir)), name="graphs_static")


@app.get("/evaluation/run", tags=["Evaluation System"])
def run_evaluation_endpoint():
    """
    Executes the 100% local evaluation pipeline across all test cases and returns results JSON.
    """
    try:
        from evaluation.evaluator import LocalEvaluator
        evaluator = LocalEvaluator()
        results = evaluator.run_evaluation()
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Evaluation pipeline failed: {str(e)}",
        )


@app.get("/evaluation/results", tags=["Evaluation System"])
def get_evaluation_results():
    """
    Returns the latest saved evaluation/results.json.
    """
    res_path = Path(__file__).parent.parent / "evaluation" / "results.json"
    if not res_path.exists():
        # Auto-run if not existing
        from evaluation.evaluator import LocalEvaluator
        evaluator = LocalEvaluator()
        return evaluator.run_evaluation()
    
    with open(res_path, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/evaluation/report", response_class=PlainTextResponse, tags=["Evaluation System"])
def get_evaluation_report():
    """
    Returns the evaluation/evaluation_report.md markdown report content.
    """
    report_path = Path(__file__).parent.parent / "evaluation" / "evaluation_report.md"
    if not report_path.exists():
        from evaluation.evaluator import LocalEvaluator
        evaluator = LocalEvaluator()
        evaluator.run_evaluation()

    with open(report_path, "r", encoding="utf-8") as f:
        return f.read()


@app.get("/evaluation/graphs", tags=["Evaluation System"])
def get_evaluation_graphs():
    """
    Returns available graph image paths and public static URLs.
    """
    graphs_path = Path(__file__).parent.parent / "evaluation" / "graphs"
    if not graphs_path.exists() or not list(graphs_path.glob("*.png")):
        from evaluation.generate_graphs import generate_all_graphs
        generate_all_graphs()

    graph_files = list(graphs_path.glob("*.png"))
    graphs = {}
    for gf in graph_files:
        name = gf.stem
        graphs[name] = {
            "file_name": gf.name,
            "local_path": str(gf),
            "url": f"/evaluation/graphs_static/{gf.name}"
        }

    return {"count": len(graphs), "graphs": graphs}


@app.get("/evaluation/retrieval_debug", tags=["Evaluation System"])
def get_retrieval_debug_log():
    """
    Returns detailed per-test-case retrieval debug records (queries, expanded terms, detected regimes, scores, hits/misses).
    """
    debug_path = Path(__file__).parent.parent / "evaluation" / "retrieval_debug.json"
    if not debug_path.exists():
        from evaluation.evaluator import LocalEvaluator
        evaluator = LocalEvaluator()
        evaluator.run_evaluation()

    with open(debug_path, "r", encoding="utf-8") as f:
        return json.load(f)



if __name__ == "__main__":
    from fastapi.testclient import TestClient

    print("=== Running FastAPI Backend Server Endpoint Tests ===\n")
    client = TestClient(app)

    # 1. Test GET /
    print("1. Testing GET / (Health Check)")
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] in ["healthy", "online"]
    print("   [OK] GET / passed cleanly!\n")

    # 2. Test POST /analyze
    print("2. Testing POST /analyze (Direct Analysis)")
    analyze_payload = {
        "innovation_name": "Ayurvedic Wound Healing Formulation",
        "description": "Topical formulation using Neem and Turmeric with nano-extraction.",
        "ingredients": "Neem, Turmeric",
        "intended_use": "Wound healing",
        "novelty_description": "Nano-extraction process to improve skin absorption",
        "novelty_types": ["extraction_method"],
        "biological_resource_used": True,
        "source_location": "Tamil Nadu",
    }
    res = client.post("/analyze", json=analyze_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["fingerprint"]["innovation_name"] == "Ayurvedic Wound Healing Formulation"
    assert len(data["decision_map"]["regimes"]) == 4
    assert len(data["roadmap"]["regime_roadmaps"]) == 4
    print("   [OK] POST /analyze passed cleanly!\n")

    # 3. Test POST /interview/start
    print("3. Testing POST /interview/start")
    start_payload = {
        "initial_inputs": {
            "innovation_name": "Ayurvedic Wound Healing Formulation",
            "description": "Topical formulation with Neem and Turmeric.",
        }
    }
    res = client.post("/interview/start", json=start_payload)
    assert res.status_code == 200
    start_data = res.json()
    session_id = start_data["session_id"]
    assert session_id is not None
    print(f"   Created Session ID: {session_id}")
    print("   [OK] POST /interview/start passed cleanly!\n")

    # 4. Test POST /interview/{session_id}/answer
    print("4. Testing POST /interview/{session_id}/answer")
    ans_payload = {"field_name": "ingredients", "answer": "Neem, Turmeric"}
    res = client.post(f"/interview/{session_id}/answer", json=ans_payload)
    assert res.status_code == 200
    assert res.json()["submitted_field"] == "ingredients"
    print("   [OK] POST /interview/{session_id}/answer passed cleanly!\n")

    # 5. Test GET /interview/{session_id}/status
    print("5. Testing GET /interview/{session_id}/status")
    res = client.get(f"/interview/{session_id}/status")
    assert res.status_code == 200
    assert res.json()["session_id"] == session_id
    print("   [OK] GET /interview/{session_id}/status passed cleanly!\n")

    # 6. Test POST /interview/{session_id}/complete
    print("6. Testing POST /interview/{session_id}/complete")
    res = client.post(f"/interview/{session_id}/complete")
    assert res.status_code == 200
    complete_data = res.json()
    assert "roadmap" in complete_data
    print("   [OK] POST /interview/{session_id}/complete passed cleanly!\n")

    # 7. Test GET /evaluation/results
    print("7. Testing GET /evaluation/results")
    res = client.get("/evaluation/results")
    assert res.status_code == 200
    assert "fingerprint_accuracy" in res.json()
    print("   [OK] GET /evaluation/results passed cleanly!\n")

    # 8. Test GET /evaluation/report
    print("8. Testing GET /evaluation/report")
    res = client.get("/evaluation/report")
    assert res.status_code == 200
    assert "# IP-SAKTI Sahayak - System Evaluation Report" in res.text
    print("   [OK] GET /evaluation/report passed cleanly!\n")

    # 9. Test GET /evaluation/graphs
    print("9. Testing GET /evaluation/graphs")
    res = client.get("/evaluation/graphs")
    assert res.status_code == 200
    assert res.json()["count"] >= 5
    print("   [OK] GET /evaluation/graphs passed cleanly!\n")

    print("[OK] ALL FastAPI Backend Endpoint Tests Passed Cleanly!")

