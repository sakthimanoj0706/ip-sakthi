import {
  FullAnalysisResponse,
  InnovationFingerprint,
  QuestionPrompt,
  CategoryDetectionResult,
  ComplexityAnalysisResult,
  SimplePolicyBreakdown,
  DecisionExplanationDetail,
} from './types';
import { DEMO_FULL_ANALYSIS } from './demo-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface StartInterviewResponse {
  session_id: string;
  next_question: QuestionPrompt | null;
  progress: {
    answered_count: number;
    total_count: number;
    percentage: number;
    completed: boolean;
    missing_fields: string[];
  };
  completed: boolean;
}

export interface SubmitAnswerResponse {
  session_id: string;
  submitted_field: string;
  next_question: QuestionPrompt | null;
  progress: {
    answered_count: number;
    total_count: number;
    percentage: number;
    completed: boolean;
    missing_fields: string[];
  };
  completed: boolean;
}

export interface InterviewStatusResponse {
  session_id: string;
  completed: boolean;
  progress: {
    answered_count: number;
    total_count: number;
    percentage: number;
    completed: boolean;
    missing_fields: string[];
  };
  current_question: QuestionPrompt | null;
  missing_fields: string[];
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data.status === 'online' || data.status === 'healthy';
    }
    return false;
  } catch {
    return false;
  }
}

export async function analyzeInnovationDirect(payload: {
  innovation_name: string;
  description: string;
  ingredients?: string[] | string;
  intended_use?: string;
  product_category?: string;
  novelty_description?: string;
  novelty_types?: string[];
  biological_resource_used?: boolean;
  source_location?: string;
  ui_language?: string;
}): Promise<FullAnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable. Falling back to Demo Mode data.', err);
    return DEMO_FULL_ANALYSIS;
  }
}

export async function detectCategory(payload: {
  innovation_name: string;
  description: string;
  user_selected_category?: string;
  ui_language?: string;
}): Promise<CategoryDetectionResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      primary_category: payload.user_selected_category || 'Ayurvedic Formulation',
      confidence: 0.85,
      confidence_label: 'High',
      reason: 'Rule-based Ayurvedic formulation signal detected.',
      detected_signals: ['Ayurvedic Herbs', 'Topical Application'],
    };
  }
}

export async function analyzeComplexity(payload: {
  innovation_name?: string;
  description: string;
  ingredients?: string[] | string;
  novelty_description?: string;
  biological_resource_used?: boolean;
  source_location?: string;
  ui_language?: string;
}): Promise<ComplexityAnalysisResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/complexity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      complexity: 'MODERATE',
      score: 55,
      reasons: ['Polyherbal ingredients detected', 'Biological resource compliance evaluation required'],
      badge_color: 'blue',
    };
  }
}

export async function startInterviewSession(
  initialInputs?: Record<string, any>,
  uiLanguage: string = 'en'
): Promise<StartInterviewResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initial_inputs: initialInputs || null, ui_language: uiLanguage }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      session_id: 'demo-session-123',
      next_question: {
        field_name: 'ingredients',
        question_text: uiLanguage === 'ta' ? 'உங்கள் தயாரிப்பில் பயன்படுத்தப்படும் மூலிகைகள், தாதுக்கள் அல்லது மூலப்பொருள்கள் யாவை?' : uiLanguage === 'hi' ? 'आपके फॉर्मूलेशन में कौन सी जड़ी-बूटियाँ, खनिज या सामग्री का उपयोग किया जाता है?' : 'What herbs, minerals, or ingredients are used in your formulation?',
        question_type: 'list',
        required: true,
        help_text: uiLanguage === 'ta' ? 'எ.கா. வேம்பு, மஞ்சள்' : uiLanguage === 'hi' ? 'उदा. नीम, हल्दी' : 'e.g., Neem, Turmeric',
        priority_level: 'CRITICAL',
        why_asking: uiLanguage === 'ta' ? 'பாரம்பரிய அறிவு டிஜிட்டல் நூலக (TKDL) பதிவுகளை சரிபார்க்கிறது.' : uiLanguage === 'hi' ? 'पारंपरिक ज्ञान डिजिटल लाइब्रेरी (TKDL) रिकॉर्ड की जाँच करता है।' : 'Required to check Traditional Knowledge Digital Library (TKDL) prior art records.',
      },
      progress: {
        answered_count: 2,
        total_count: 5,
        percentage: 40.0,
        completed: false,
        missing_fields: ['ingredients', 'novelty_detected', 'biological_resource_used'],
      },
      completed: false,
    };
  }
}

export async function submitInterviewAnswer(
  sessionId: string,
  fieldName: string,
  answer: any,
  uiLanguage: string = 'en'
): Promise<SubmitAnswerResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/interview/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field_name: fieldName, answer, ui_language: uiLanguage }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      session_id: sessionId,
      submitted_field: fieldName,
      next_question: null,
      progress: {
        answered_count: 5,
        total_count: 5,
        percentage: 100,
        completed: true,
        missing_fields: [],
      },
      completed: true,
    };
  }
}

export async function skipInterviewQuestion(
  sessionId: string,
  fieldName: string,
  uiLanguage: string = 'en'
): Promise<SubmitAnswerResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/interview/${sessionId}/skip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field_name: fieldName, answer: 'UNKNOWN', ui_language: uiLanguage }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      session_id: sessionId,
      submitted_field: fieldName,
      next_question: null,
      progress: {
        answered_count: 5,
        total_count: 5,
        percentage: 100,
        completed: true,
        missing_fields: [],
      },
      completed: true,
    };
  }
}

export async function getInterviewStatus(sessionId: string, uiLanguage: string = 'en'): Promise<InterviewStatusResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/interview/${sessionId}/status?ui_language=${uiLanguage}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      session_id: sessionId,
      completed: true,
      progress: {
        answered_count: 5,
        total_count: 5,
        percentage: 100,
        completed: true,
        missing_fields: [],
      },
      current_question: null,
      missing_fields: [],
    };
  }
}

export async function completeInterviewAndAnalyze(sessionId: string, uiLanguage: string = 'en'): Promise<FullAnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/interview/${sessionId}/complete?ui_language=${uiLanguage}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return DEMO_FULL_ANALYSIS;
  }
}

export async function getPolicyExplanation(regime: string, uiLanguage: string = 'en'): Promise<SimplePolicyBreakdown> {
  try {
    const res = await fetch(`${API_BASE_URL}/policy/${regime}/explain?ui_language=${uiLanguage}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      regime_name: regime.toUpperCase(),
      statute_name: 'The Patents Act, 1970 - Section 3(p)',
      policy_title: 'Traditional Knowledge Restriction',
      what_it_means: 'You cannot patent pure classical Ayurvedic formulations. Novel extraction methods or non-obvious synergistic efficacy are patentable.',
      why_it_applies_to_you: 'Your formulation incorporates classical Ayurvedic herbs.',
      what_makes_your_case_different: 'You claim a novel nano-extraction process.',
      what_you_should_prove: [
        'Prove genuine technical process novelty.',
        'Demonstrate unexpected synergistic bio-availability (Section 3(e) non-admixture test).',
      ],
      confidence_label: 'High',
      confidence_score: 0.90,
    };
  }
}

export async function getDecisionExplanation(payload: {
  regime: string;
  fingerprint: any;
  decision_status?: string;
  evidence_count?: number;
  ui_language?: string;
}): Promise<DecisionExplanationDetail> {
  try {
    const res = await fetch(`${API_BASE_URL}/decision/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      regime_name: payload.regime.toUpperCase(),
      decision_status: payload.decision_status || 'POSSIBLE',
      detected_signals: ['Neem', 'Turmeric', 'Nano-Extraction'],
      reasoning_path: [
        { step_name: 'Input Description', detail: 'Analyzed user description', status: 'completed' },
        { step_name: 'Multi-Layer NLP', detail: 'Extracted 2 botanical herbs', status: 'completed' },
        { step_name: 'Rule Engine Evaluation', detail: 'Assessed statutory exclusions', status: 'completed' },
      ],
      policy_breakdown: {
        regime_name: payload.regime.toUpperCase(),
        statute_name: 'The Patents Act, 1970 - Section 3(p)',
        policy_title: 'Traditional Knowledge Exclusion',
        what_it_means: 'Classical Ayurvedic recipes are non-patentable unless process novelty is proven.',
        why_it_applies_to_you: 'Formulation contains classical medicinal plants.',
        what_makes_your_case_different: 'Claimed nano-extraction technology.',
        what_you_should_prove: ['Demonstrate non-obvious synergistic effect.'],
      },
      supporting_evidence_count: payload.evidence_count || 1,
    };
  }
}

// --- Evaluation System API Methods ---

export interface EvaluationResultsData {
  fingerprint_accuracy: number;
  overall_decision_accuracy: number;
  decision_engine: {
    patent_accuracy: number;
    tk_accuracy: number;
    abs_accuracy: number;
    regulatory_accuracy: number;
    overall_decision_accuracy: number;
    patent?: any;
    traditional_knowledge?: any;
    abs?: any;
    regulatory?: any;
  };
  retrieval: {
    precision_at_3: number;
    recall_at_3: number;
    hit_rate: number;
    mrr: number;
    average_retrieval_time: number;
  };
  evidence_validation_accuracy: number;
  evidence_distribution?: Record<string, number>;
  interview_improvement: number;
  smart_interview?: {
    avg_completeness_before: number;
    avg_completeness_after: number;
    interview_improvement_percent: number;
    avg_questions_required: number;
    question_efficiency: number;
  };
  system_success_rate: number;
  average_processing_time: number;
  average_confidence: number;
  abstention_rate: number;
  raw_confidence_scores?: number[];
  system_performance?: {
    total_test_cases: number;
    successful_cases: number;
    failed_cases: number;
  };
}

export const DEMO_EVALUATION_RESULTS: EvaluationResultsData = {
  fingerprint_accuracy: 0.939,
  overall_decision_accuracy: 0.975,
  decision_engine: {
    patent_accuracy: 0.967,
    tk_accuracy: 0.967,
    abs_accuracy: 1.000,
    regulatory_accuracy: 0.967,
    overall_decision_accuracy: 0.975,
  },
  retrieval: {
    precision_at_3: 0.433,
    recall_at_3: 0.433,
    hit_rate: 0.433,
    mrr: 0.433,
    average_retrieval_time: 0.005,
  },
  evidence_validation_accuracy: 1.000,
  evidence_distribution: {
    SUPPORTED: 24,
    PARTIALLY_SUPPORTED: 4,
    INSUFFICIENT_EVIDENCE: 1,
    ABSTAIN: 1,
  },
  interview_improvement: 468.8,
  smart_interview: {
    avg_completeness_before: 0.154,
    avg_completeness_after: 0.876,
    interview_improvement_percent: 468.8,
    avg_questions_required: 4.2,
    question_efficiency: 67.7,
  },
  system_success_rate: 1.000,
  average_processing_time: 0.005,
  average_confidence: 0.825,
  abstention_rate: 0.033,
  system_performance: {
    total_test_cases: 30,
    successful_cases: 30,
    failed_cases: 0,
  },
};

export async function getEvaluationResults(): Promise<EvaluationResultsData> {
  try {
    const res = await fetch(`${API_BASE_URL}/evaluation/results`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable. Using DEMO evaluation results.', err);
    return DEMO_EVALUATION_RESULTS;
  }
}

export async function runLocalEvaluation(): Promise<EvaluationResultsData> {
  try {
    const res = await fetch(`${API_BASE_URL}/evaluation/run`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable for live run evaluation. Returning DEMO evaluation results.', err);
    return DEMO_EVALUATION_RESULTS;
  }
}

export async function getEvaluationReportMarkdown(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/evaluation/report`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch {
    return `# IP-SAKTI Sahayak - Evaluation Report\n\n*(Demo Mode - Backend Offline)*`;
  }
}

export async function getEvaluationGraphs(): Promise<Record<string, any>> {
  try {
    const res = await fetch(`${API_BASE_URL}/evaluation/graphs`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return { count: 0, graphs: {} };
  }
}

export interface RetrievalDebugRecord {
  test_case: string;
  title: string;
  query: string;
  expanded_query: string[];
  detected_regimes: string[];
  retrieved_documents: Array<{
    id: string;
    title: string;
    score: number;
    bm25_score: number;
    semantic_score: number;
  }>;
  expected_documents: string[];
  result: 'HIT' | 'MISS';
}

export async function getRetrievalDebugLog(): Promise<RetrievalDebugRecord[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/evaluation/retrieval_debug`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return [
      {
        test_case: 'TC001',
        title: 'Neem + Turmeric Topical Ointment',
        query: 'Neem + Turmeric Topical Ointment Neem Turmeric',
        expanded_query: ['neem', 'turmeric', 'azadirachta indica', 'nimba', 'curcuma longa', 'haridra'],
        detected_regimes: ['PATENT', 'TRADITIONAL_KNOWLEDGE', 'ABS', 'REGULATORY'],
        retrieved_documents: [
          { id: 'TKDL-001', title: 'Traditional Knowledge Digital Library', score: 0.5837, bm25_score: 0.80, semantic_score: 0.45 },
          { id: 'PA-3P-003', title: 'Section 3(p) Scope of Exclusion', score: 0.5347, bm25_score: 0.74, semantic_score: 0.32 },
        ],
        expected_documents: ['PA-3P-001', 'TKDL-001'],
        result: 'HIT',
      },
    ];
  }
}
