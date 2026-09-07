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

export interface FullAnalysisResponse {
  fingerprint: InnovationFingerprint;
  decision_map: DecisionMapData;
  retrieved_evidence: Record<string, { query: string; evidence: EvidenceSource[] }>;
  web_research?: Record<string, any>;
  evidence_validation: Record<string, EvidenceValidation>;
  roadmap: FullActionRoadmap;
}
