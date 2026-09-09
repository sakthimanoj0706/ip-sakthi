export interface NoveltyInfo {
  novelty_detected: boolean;
  novelty_type: string[];
  description?: string | null;
}

export interface BiologicalResourceInfo {
  biological_resource_used: boolean;
  resources: string[];
  source_location?: string | null;
  source_known: boolean;
}

export interface InnovationFingerprint {
  innovation_name: string;
  description: string;
  ingredients: string[];
  scientific_names?: string[];
  ayurvedic_names?: string[];
  intended_use?: string | null;
  product_category?: string | null;
  traditional_knowledge_claimed?: boolean | null;
  novelty: NoveltyInfo;
  biological_resources: BiologicalResourceInfo;
  manufacturing_process?: string | null;
  target_users?: string | null;
  additional_notes?: string | null;
  detected_language?: string;
  overall_confidence?: number;
  extraction_source?: {
    gemini: boolean;
    spacy: boolean;
    rules: boolean;
  };
}

export interface CategoryDetectionResult {
  primary_category: string;
  secondary_category?: string | null;
  confidence: number;
  confidence_label: string;
  reason: string;
  detected_signals: string[];
}

export interface ComplexityAnalysisResult {
  complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | string;
  score: number;
  reasons: string[];
  badge_color: string;
}

export interface DecisionResultItem {
  name: string;
  status: 'POSSIBLE' | 'OVERLAP_POSSIBLE' | 'REVIEW_REQUIRED' | 'CLASSIFICATION_REQUIRED' | 'LOW_INDICATION' | 'HIGH_RISK' | 'EXEMPT' | 'SUPPORTED' | string;
  color: 'yellow' | 'orange' | 'blue' | 'gray' | 'green' | 'red' | string;
  reason: string;
  triggered_by: string[];
}

export interface DecisionMapData {
  overall_summary: string;
  regimes: DecisionResultItem[];
}

export interface QuestionPrompt {
  field_name: string;
  question_text: string;
  question_type: 'text' | 'select' | 'boolean' | 'list' | string;
  options?: string[] | null;
  required: boolean;
  help_text?: string | null;
  priority_level?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  why_asking?: string | null;
  current_dynamic_step?: number;
  total_dynamic_questions?: number;
}

export interface SimplePolicyBreakdown {
  regime_name: string;
  statute_name: string;
  policy_title: string;
  what_it_means: string;
  why_it_applies_to_you: string;
  what_makes_your_case_different: string;
  what_you_should_prove: string[];
  confidence_label?: string;
  confidence_score?: number;
}

export interface ReasoningPathStep {
  step_name: string;
  detail: string;
  status: 'completed' | 'active' | 'pending';
}

export interface DecisionExplanationDetail {
  regime_name: string;
  decision_status: string;
  detected_signals: string[];
  reasoning_path: ReasoningPathStep[];
  policy_breakdown: SimplePolicyBreakdown;
  supporting_evidence_count: number;
}

export interface EvidenceSource {
  id: string;
  law: string;
  section: string;
  jurisdiction?: string;
  text?: string;
  plain_explanation: string;
  source_note?: string;
  confidence?: string;
  score?: number;
}

export interface EvidenceValidation {
  regime: string;
  status: 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'INSUFFICIENT_EVIDENCE' | 'ABSTAIN' | string;
  confidence: string;
  evidence_count: number;
  top_score: number;
  citations: string[];
  warning?: string | null;
}

export interface RoadmapItem {
  regime: string;
  status: string;
  reason: string;
  evidence_status: string;
  what_we_detected: string;
  why_it_matters: string;
  what_to_check_next: string[];
  sources: {
    id: string;
    law: string;
    section: string;
    excerpt: string;
  }[];
  warning?: string | null;
}

export interface FullActionRoadmap {
  innovation_summary: {
    innovation_name: string;
    ingredients: string[];
    intended_use?: string | null;
    novelty_claimed?: string | null;
    biological_resources_used?: boolean;
    source_location?: string | null;
  };
  regime_roadmaps: RoadmapItem[];
  overall_next_action: string;
  disclaimer: string;
}

export interface IngredientDetail {
  common_name: string;
  scientific_name?: string | null;
  ayurvedic_name?: string | null;
  plant_part?: string | null;
  form?: string | null;
  proportion?: number | null;
  proportion_unit?: string | null;
  source_location?: string | null;
}

export interface MultiObjectiveScores {
  ip_differentiation: number;
  tk_overlap: number;
  documentation_completeness: number;
  evidence_strength: number;
  regulatory_complexity: number;
  factors: Record<string, { positive: string[]; risk: string[] }>;
}

export interface FormulationAnalysisResult {
  documentation_status: 'COMPLETE' | 'PARTIAL' | 'INCOMPLETE' | string;
  ratios_available: boolean;
  total_composition_percentage?: number | null;
  ratio_validation_status: 'COMPLETE' | 'PARTIAL' | 'EXCEEDS' | 'NO_RATIOS' | string;
  ratio_validation_message: string;
  ingredients: IngredientDetail[];
  excipients: string[];
  base_materials: string[];
  tk_overlap_status: string;
  technical_differentiation: string;
  differentiation_reason: string;
  multi_objective_scores: MultiObjectiveScores;
  disclaimer: string;
}

export interface FullAnalysisResponse {
  fingerprint: InnovationFingerprint;
  decision_map: DecisionMapData;
  retrieved_evidence: Record<string, { query: string; evidence: EvidenceSource[] }>;
  web_research?: Record<string, any>;
  evidence_validation: Record<string, EvidenceValidation>;
  roadmap: FullActionRoadmap;
  category_detection?: CategoryDetectionResult;
  complexity_analysis?: ComplexityAnalysisResult;
  policy_explanations?: Record<string, SimplePolicyBreakdown>;
  formulation_intelligence?: FormulationAnalysisResult;
}
