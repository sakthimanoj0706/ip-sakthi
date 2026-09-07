"""
IP-SAKTI Sahayak - System Configuration & Feature Flags
Handles environment loading, API availability validation, and graceful fallback configuration.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from backend/.env or root .env
BASE_DIR = Path(__file__).parent
env_paths = [
    BASE_DIR / ".env",
    BASE_DIR.parent / ".env",
]
for p in env_paths:
    if p.exists():
        load_dotenv(dotenv_path=p, override=True)

# Raw API Key Strings
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "").strip()

# AI Execution Mode: 'local', 'hybrid', or 'api' (Default: 'hybrid')
AI_MODE = os.getenv("AI_MODE", "hybrid").lower().strip()

# Feature Flags
GEMINI_ENABLED = bool(GEMINI_API_KEY and len(GEMINI_API_KEY) > 5 and AI_MODE in ["hybrid", "api"])
TAVILY_ENABLED = bool(TAVILY_API_KEY and len(TAVILY_API_KEY) > 5 and AI_MODE in ["hybrid", "api"])
LOCAL_FALLBACK_ENABLED = True

# Check spaCy NLP Availability
SPACY_ENABLED = False
try:
    import spacy
    _nlp_test = spacy.load("en_core_web_sm")
    SPACY_ENABLED = True
except Exception:
    SPACY_ENABLED = False


def get_config_summary() -> dict:
    """Returns a safe public configuration summary for health checks and status reporting."""
    return {
        "ai_mode": AI_MODE,
        "services": {
            "gemini": GEMINI_ENABLED,
            "tavily": TAVILY_ENABLED,
            "spacy": SPACY_ENABLED,
            "local_rag": LOCAL_FALLBACK_ENABLED,
        },
        "status": "healthy" if LOCAL_FALLBACK_ENABLED else "degraded",
    }


if __name__ == "__main__":
    print("=== IP-SAKTI Configuration Summary ===")
    summary = get_config_summary()
    print(summary)
    print(f"Gemini Enabled : {GEMINI_ENABLED}")
    print(f"Tavily Enabled : {TAVILY_ENABLED}")
    print(f"spaCy Enabled  : {SPACY_ENABLED}")
