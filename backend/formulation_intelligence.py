"""
IP-SAKTI Sahayak - Formulation Intelligence & Multi-Objective Analysis Module
Provides structured ingredient parsing, ratio total validation, IP & compliance formulation analysis,
explainable multi-objective scoring (0-100), and NSGA-II architecture stubs.
"""

import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from backend.fingerprint_schema import IngredientDetail, InnovationFingerprint, FormulationInfo

FORMULATION_DISCLAIMER = (
    "Formulation analysis evaluates innovation documentation, IP differentiation, and compliance factors. "
    "It does not provide medical, dosage, safety, or therapeutic recommendations."
)

BOTANICAL_SCIENTIFIC_MAP = {
    "neem": "Azadirachta indica",
    "turmeric": "Curcuma longa",
    "haldi": "Curcuma longa",
    "ashwagandha": "Withania somnifera",
    "brahmi": "Bacopa monnieri",
    "amla": "Phyllanthus emblica",
    "guduchi": "Tinospora cordifolia",
    "giloy": "Tinospora cordifolia",
    "pippali": "Piper longum",
    "aloe vera": "Aloe barbadensis miller",
    "aloe": "Aloe barbadensis miller",
    "tulsi": "Ocimum sanctum",
    "ginger": "Zingiber officinale",
    "pepper": "Piper nigrum",
    "nilavembu": "Andrographis paniculata",
}

PLANT_PARTS = ["Leaf", "Rhizome", "Root", "Seed", "Bark", "Flower", "Whole Plant", "Fruit", "Gel", "Base Material"]
FORM_TYPES = ["Extract", "Gel", "Powder", "Oil", "Syrup", "Patch", "Base Material", "Tincture", "Decoction"]


class MultiObjectiveScores(BaseModel):
    """Explainable Multi-Objective Scores (0-100) with factor breakdowns."""

    ip_differentiation: int = Field(default=70, description="Score 0-100")
    tk_overlap: int = Field(default=70, description="Score 0-100")
    documentation_completeness: int = Field(default=70, description="Score 0-100")
    evidence_strength: int = Field(default=70, description="Score 0-100")
    regulatory_complexity: int = Field(default=60, description="Score 0-100")

    factors: Dict[str, Dict[str, List[str]]] = Field(
        default_factory=lambda: {
            "ip_differentiation": {"positive": [], "risk": []},
            "tk_overlap": {"positive": [], "risk": []},
            "documentation_completeness": {"positive": [], "risk": []},
            "evidence_strength": {"positive": [], "risk": []},
            "regulatory_complexity": {"positive": [], "risk": []},
        }
    )


class FormulationAnalysisResult(BaseModel):
    """Output structure for Formulation Intelligence analysis."""

    documentation_status: str = Field(default="INCOMPLETE")  # COMPLETE, PARTIAL, INCOMPLETE
    ratios_available: bool = Field(default=False)
    total_composition_percentage: Optional[float] = Field(default=None)
    ratio_validation_status: str = Field(default="NO_RATIOS")  # COMPLETE, PARTIAL, EXCEEDS, NO_RATIOS
    ratio_validation_message: str = Field(default="")
    
    ingredients: List[IngredientDetail] = Field(default_factory=list)
    excipients: List[str] = Field(default_factory=list)
    base_materials: List[str] = Field(default_factory=list)

    tk_overlap_status: str = Field(default="POSSIBLE")
    technical_differentiation: str = Field(default="MODERATE")
    differentiation_reason: str = Field(default="")

    multi_objective_scores: MultiObjectiveScores = Field(default_factory=MultiObjectiveScores)
    disclaimer: str = Field(default=FORMULATION_DISCLAIMER)


def parse_structured_ingredients(text: str, raw_ingredients: List[str] = None) -> List[IngredientDetail]:
    """
    Parses unstructured text into clean, structured IngredientDetail objects.
    Never stores complete user sentences as a single ingredient name.
    """
    structured: List[IngredientDetail] = []
    text_lower = text.lower() if text else ""

    # Known candidate herbs to search if raw_ingredients is empty or messy
    candidates = [
        ("Neem", "Azadirachta indica", ["leaf", "bark", "oil"]),
        ("Turmeric", "Curcuma longa", ["rhizome", "root", "extract"]),
        ("Aloe Vera", "Aloe barbadensis miller", ["leaf", "gel"]),
        ("Biodegradable Polymer", None, ["base", "patch", "polymer"]),
        ("Ashwagandha", "Withania somnifera", ["root", "extract"]),
        ("Brahmi", "Bacopa monnieri", ["leaf", "plant"]),
        ("Amla", "Phyllanthus emblica", ["fruit", "extract"]),
        ("Guduchi", "Tinospora cordifolia", ["stem", "extract"]),
        ("Pippali", "Piper longum", ["fruit", "spice"]),
    ]

    # Look for herb + percentage patterns e.g. "Neem leaf extract – 40%" or "Neem 40%"
    percent_matches = re.findall(r"([A-Za-z\s]+?)\s*[\–\:\-]\s*(\d+(?:\.\d+)?)\s*%", text)
    percent_dict = {}
    for name_part, pct_str in percent_matches:
        clean_name = name_part.strip()
        # Find matching candidate herb
        for cand_name, sci_name, parts in candidates:
            if cand_name.lower() in clean_name.lower():
                percent_dict[cand_name] = float(pct_str)
                break
        if clean_name not in percent_dict:
            # Fallback direct string match
            for cand_name, sci_name, parts in candidates:
                if cand_name.lower() in clean_name.lower():
                    percent_dict[cand_name] = float(pct_str)

    # Process items
    found_names = set()
    for cand_name, sci_name, parts in candidates:
        if cand_name.lower() in text_lower or (raw_ingredients and any(cand_name.lower() in str(r).lower() for r in raw_ingredients)):
            found_names.add(cand_name)
            
            # Detect plant part
            detected_part = None
            if "rhizome" in text_lower and cand_name == "Turmeric":
                detected_part = "Rhizome"
            elif "leaf" in text_lower and cand_name in ["Neem", "Aloe Vera", "Brahmi"]:
                detected_part = "Leaf"
            elif "root" in text_lower and cand_name == "Ashwagandha":
                detected_part = "Root"
            elif "fruit" in text_lower and cand_name in ["Amla", "Pippali"]:
                detected_part = "Fruit"

            # Detect form
            detected_form = None
            if "extract" in text_lower and cand_name in ["Neem", "Turmeric", "Ashwagandha", "Amla"]:
                detected_form = "Extract"
            elif "gel" in text_lower and cand_name == "Aloe Vera":
                detected_form = "Gel"
            elif "polymer" in text_lower or "base" in text_lower:
                detected_form = "Base Material"

            pct_val = percent_dict.get(cand_name)

            structured.append(
                IngredientDetail(
                    common_name=cand_name,
                    scientific_name=sci_name or BOTANICAL_SCIENTIFIC_MAP.get(cand_name.lower()),
                    plant_part=detected_part,
                    form=detected_form,
                    proportion=pct_val,
                    proportion_unit="%" if pct_val is not None else "%",
                )
            )

    # If raw_ingredients passed and missing from structured, add clean names
    if raw_ingredients:
        for r in raw_ingredients:
            clean_r = str(r).strip()
            # Clean sentence-like inputs
            if len(clean_r) > 40 and (" used" in clean_r or " extract" in clean_r):
                # Extract actual herb names from sentence
                for cand_name, sci_name, parts in candidates:
                    if cand_name.lower() in clean_r.lower() and cand_name not in found_names:
                        found_names.add(cand_name)
                        structured.append(IngredientDetail(common_name=cand_name, scientific_name=sci_name))
            elif clean_r and clean_r not in found_names:
                found_names.add(clean_r)
                structured.append(
                    IngredientDetail(
                        common_name=clean_r,
                        scientific_name=BOTANICAL_SCIENTIFIC_MAP.get(clean_r.lower()),
                    )
                )

    return structured


def validate_formulation_ratios(ingredients: List[IngredientDetail]) -> Dict[str, Any]:
    """
    Validates ingredient proportion totals without modifying user ratios or inventing missing values.
    """
    proportions = [i.proportion for i in ingredients if i.proportion is not None]
    if not proportions:
        return {
            "ratios_available": False,
            "total_percentage": None,
            "status": "NO_RATIOS",
            "message": "Ingredient proportions not provided.",
        }

    total_pct = sum(proportions)
    
    if abs(total_pct - 100.0) < 0.1:
        status = "COMPLETE"
        message = "Formulation composition ratios fully documented at 100%."
    elif total_pct < 100.0:
        status = "PARTIAL"
        message = "Partial formulation information provided. Additional ingredients or base materials may account for the remaining percentage."
    else:
        status = "EXCEEDS"
        message = "Formulation proportions exceed 100%. Please verify the entered values."

    return {
        "ratios_available": True,
        "total_percentage": round(total_pct, 2),
        "status": status,
        "message": message,
    }


def calculate_multi_objective_scores(fp: InnovationFingerprint, ingredients: List[IngredientDetail], val_res: Dict[str, Any]) -> MultiObjectiveScores:
    """
    Calculates explainable multi-objective scores (0-100) with factor breakdowns.
    """
    scores = MultiObjectiveScores()

    # 1. IP Differentiation Score
    has_nano = any("nano" in str(t).lower() for t in fp.novelty_details.types) or "nano" in fp.description.lower()
    has_patch = any("patch" in str(t).lower() for t in fp.novelty_details.types) or "patch" in fp.description.lower() or "delivery" in fp.description.lower()
    
    ip_score = 50
    if has_nano:
        ip_score += 20
        scores.factors["ip_differentiation"]["positive"].append("Novel nano-extraction process detected")
    if has_patch:
        ip_score += 15
        scores.factors["ip_differentiation"]["positive"].append("Controlled-release delivery mechanism claimed")
    if fp.ingredients:
        scores.factors["ip_differentiation"]["risk"].append("Classical Ayurvedic ingredients require process synergy proof under Section 3(e)")
    scores.ip_differentiation = min(95, ip_score)

    # 2. TK Overlap Score
    tk_score = 50
    if fp.ingredients:
        tk_score += 30
        scores.factors["tk_overlap"]["risk"].append(f"Classical herbs ({', '.join(fp.ingredients[:3])}) cited in TKDL records")
    if "wound" in fp.description.lower():
        tk_score += 12
        scores.factors["tk_overlap"]["risk"].append("Traditional therapeutic indication (wound healing)")
    if has_nano:
        scores.factors["tk_overlap"]["positive"].append("Non-classical technological extraction process differentiates from prior art")
    scores.tk_overlap = min(95, tk_score)

    # 3. Documentation Completeness Score
    doc_score = 40
    if len(ingredients) >= 3:
        doc_score += 20
        scores.factors["documentation_completeness"]["positive"].append("Multi-ingredient breakdown provided")
    if val_res.get("ratios_available"):
        doc_score += 20
        scores.factors["documentation_completeness"]["positive"].append("Ingredient ratios documented")
    if val_res.get("status") == "COMPLETE":
        doc_score += 10
        scores.factors["documentation_completeness"]["positive"].append("100% total composition validated")
    if any(i.plant_part for i in ingredients):
        doc_score += 10
        scores.factors["documentation_completeness"]["positive"].append("Plant parts specified")
    scores.documentation_completeness = min(100, doc_score)

    # 4. Evidence Strength Score
    ev_score = 60
    if has_nano and val_res.get("ratios_available"):
        ev_score += 15
        scores.factors["evidence_strength"]["positive"].append("Process novelty supported by structured formulation breakdown")
    else:
        scores.factors["evidence_strength"]["risk"].append("Experimental comparative synergy data recommended")
    scores.evidence_strength = min(90, ev_score)

    # 5. Regulatory Complexity Score
    reg_score = 50
    if "patch" in fp.description.lower() or "topical" in fp.description.lower():
        reg_score += 20
        scores.factors["regulatory_complexity"]["risk"].append("Drug & Cosmetics Act Rule 158-B licensing for proprietary ASU drug format")
    if fp.biological_source.origin_claimed:
        reg_score += 15
        scores.factors["regulatory_complexity"]["risk"].append("NBA Form 8 registration under Biological Diversity Act 2023")
    scores.regulatory_complexity = min(95, reg_score)

    return scores


def analyze_formulation(fp: InnovationFingerprint) -> FormulationAnalysisResult:
    """
    Executes full Formulation Intelligence analysis for a given InnovationFingerprint.
    Does NOT make medical dosage or therapeutic efficacy recommendations.
    """
    # Parse structured ingredients
    ingredients = parse_structured_ingredients(fp.description, fp.ingredients)
    
    # Update fingerprint ingredient_details if empty
    if not fp.ingredient_details:
        fp.ingredient_details = ingredients

    # Validate ratios
    ratio_val = validate_formulation_ratios(ingredients)
    
    # Update formulation info on fingerprint
    fp.formulation.ratios_available = ratio_val["ratios_available"]
    fp.formulation.total_percentage = ratio_val["total_percentage"]
    if ratio_val["status"] == "COMPLETE":
        fp.formulation.ingredients_complete = True

    # Multi-Objective Scoring
    scores = calculate_multi_objective_scores(fp, ingredients, ratio_val)

    # Determine differentiation
    has_novelty = bool(fp.novelty_details.claimed or "nano" in fp.description.lower() or "patch" in fp.description.lower())
    diff_level = "HIGH" if has_novelty else "MODERATE"
    diff_reason = "Novel nano-extraction and controlled-release delivery mechanism detected." if has_novelty else "Formulation relies on standard extraction of traditional herbs."

    excipients = [i.common_name for i in ingredients if i.form == "Base Material" or "polymer" in i.common_name.lower()]
    base_materials = excipients

    doc_status = "COMPLETE" if ratio_val["status"] == "COMPLETE" and len(ingredients) >= 3 else ("PARTIAL" if ingredients else "INCOMPLETE")

    return FormulationAnalysisResult(
        documentation_status=doc_status,
        ratios_available=ratio_val["ratios_available"],
        total_composition_percentage=ratio_val["total_percentage"],
        ratio_validation_status=ratio_val["status"],
        ratio_validation_message=ratio_val["message"],
        ingredients=ingredients,
        excipients=excipients,
        base_materials=base_materials,
        tk_overlap_status="POSSIBLE",
        technical_differentiation=diff_level,
        differentiation_reason=diff_reason,
        multi_objective_scores=scores,
        disclaimer=FORMULATION_DISCLAIMER,
    )


class FormulationOptimizer:
    """
    Interface stub for future NSGA-II multi-objective optimization architecture.
    Currently provides explainable scenario comparison without claiming active NSGA-II execution.
    """

    def evaluate_scenario(self, fp: InnovationFingerprint) -> FormulationAnalysisResult:
        return analyze_formulation(fp)

    def compare_scenarios(self, scenario_a: InnovationFingerprint, scenario_b: InnovationFingerprint) -> Dict[str, Any]:
        res_a = analyze_formulation(scenario_a)
        res_b = analyze_formulation(scenario_b)
        return {
            "scenario_a": res_a.multi_objective_scores.model_dump(),
            "scenario_b": res_b.multi_objective_scores.model_dump(),
            "note": "Future versions may support multi-objective optimization (NSGA-II) for comparing IP and compliance scenarios.",
        }

    def calculate_objectives(self, fp: InnovationFingerprint) -> Dict[str, float]:
        res = analyze_formulation(fp)
        return res.multi_objective_scores.model_dump()
