"""
IP-SAKTI Sahayak - Local Evaluation System Entry Point
Allows running evaluation directly via: python evaluator.py
"""

import sys
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).parent
sys.path.append(str(BASE_DIR))
sys.path.append(str(BASE_DIR / "evaluation"))
sys.path.append(str(BASE_DIR / "backend"))

from evaluation.evaluator import LocalEvaluator

if __name__ == "__main__":
    evaluator = LocalEvaluator()
    evaluator.run_evaluation()
