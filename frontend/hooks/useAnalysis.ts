'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FullAnalysisResponse,
  InnovationFingerprint,
  DecisionMapData,
  FullActionRoadmap,
  EvidenceValidation,
  EvidenceSource,
  QuestionPrompt,
} from '../lib/types';
import {
  DEMO_FULL_ANALYSIS,
  DEMO_FINGERPRINT,
  DEMO_DECISION_MAP,
  DEMO_ROADMAP,
} from '../lib/demo-data';
import {
  analyzeInnovationDirect,
  startInterviewSession,
  submitInterviewAnswer,
  completeInterviewAndAnalyze,
  checkBackendHealth,
} from '../lib/api';
import { useTranslation } from '../context/LanguageContext';

export interface AnalysisContextType {
  sessionId: string | null;
  innovationName: string;
  description: string;
  innovationArea: string;
  interviewAnswers: Record<string, any>;
  currentQuestion: QuestionPrompt | null;
  interviewProgress: number;
  isInterviewComplete: boolean;
  fingerprint: InnovationFingerprint | null;
  decisionMap: DecisionMapData | null;
  retrievedEvidence: Record<string, { query: string; evidence: EvidenceSource[] }> | null;
  evidenceValidation: Record<string, EvidenceValidation> | null;
  roadmap: FullActionRoadmap | null;
  fullAnalysisResponse: FullAnalysisResponse | null;
  isLoading: boolean;
  isBackendConnected: boolean;
  isDemoMode: boolean;
  error: string | null;
  
  // Actions
  setInnovationInput: (name: string, desc: string, area?: string) => void;
  startInterview: () => Promise<void>;
  submitAnswer: (fieldName: string, answer: any) => Promise<void>;
  runFullAnalysis: () => Promise<void>;
  resetAnalysis: () => void;
  toggleDemoMode: (enable?: boolean) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useTranslation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [innovationName, setInnovationName] = useState<string>('Ayurvedic Wound Healing Formulation');
  const [description, setDescription] = useState<string>(
    'Topical formulation combining Neem and Turmeric with an advanced nano-extraction process to improve skin absorption.'
  );
  const [innovationArea, setInnovationArea] = useState<string>('Formulation');
  const [interviewAnswers, setInterviewAnswers] = useState<Record<string, any>>({
    ingredients: 'Neem, Turmeric',
    intended_use: 'Wound healing',
    traditional_knowledge_claimed: true,
    novelty_detected: true,
    novelty_type: ['extraction_method', 'process'],
    novelty_description: 'New nano-extraction process to improve skin absorption',
    biological_resource_used: true,
    source_location: 'Tamil Nadu',
  });
  const [currentQuestion, setCurrentQuestion] = useState<QuestionPrompt | null>(null);
  const [interviewProgress, setInterviewProgress] = useState<number>(0);
  const [isInterviewComplete, setIsInterviewComplete] = useState<boolean>(false);

  const [fingerprint, setFingerprint] = useState<InnovationFingerprint | null>(DEMO_FINGERPRINT);
  const [decisionMap, setDecisionMap] = useState<DecisionMapData | null>(DEMO_DECISION_MAP);
  const [retrievedEvidence, setRetrievedEvidence] = useState<Record<string, { query: string; evidence: EvidenceSource[] }> | null>(DEMO_FULL_ANALYSIS.retrieved_evidence);
  const [evidenceValidation, setEvidenceValidation] = useState<Record<string, EvidenceValidation> | null>(DEMO_FULL_ANALYSIS.evidence_validation);
  const [roadmap, setRoadmap] = useState<FullActionRoadmap | null>(DEMO_ROADMAP);
  const [fullAnalysisResponse, setFullAnalysisResponse] = useState<FullAnalysisResponse | null>(DEMO_FULL_ANALYSIS);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check backend health on mount
  useEffect(() => {
    async function checkHealth() {
      const isHealthy = await checkBackendHealth();
      setIsBackendConnected(isHealthy);
      if (isHealthy) {
        setIsDemoMode(false);
      }
    }
    checkHealth();
  }, []);

  const setInnovationInput = (name: string, desc: string, area: string = 'Formulation') => {
    setInnovationName(name);
    setDescription(desc);
    setInnovationArea(area);
  };

  const startInterview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isDemoMode || !isBackendConnected) {
        setSessionId('demo-session-1');
        setCurrentQuestion({
          field_name: 'ingredients',
          question_text: language === 'ta' ? 'உங்கள் தயாரிப்பில் பயன்படுத்தப்படும் மூலிகைகள், தாதுக்கள் அல்லது மூலப்பொருள்கள் யாவை?' : language === 'hi' ? 'आपके फॉर्मूलेशन में कौन सी जड़ी-बूटियाँ, खनिज या सामग्री का उपयोग किया जाता है?' : 'What herbs, minerals, or ingredients are used in your formulation?',
          question_type: 'list',
          required: true,
          help_text: language === 'ta' ? 'எ.கா. வேம்பு, மஞ்சள்' : language === 'hi' ? 'उदा. नीम, हल्दी' : 'e.g., Neem, Turmeric',
          priority_level: 'CRITICAL',
          why_asking: language === 'ta' ? 'பாரம்பரிய அறிவு டிஜிட்டல் நூலக (TKDL) பதிவுகளை சரிபார்க்கிறது.' : language === 'hi' ? 'पारंपरिक ज्ञान डिजिटल लाइब्रेरी (TKDL) रिकॉर्ड की जाँच करता है।' : 'Required to check Traditional Knowledge Digital Library (TKDL) prior art records.',
        });
        setInterviewProgress(20);
        setIsInterviewComplete(false);
      } else {
        const res = await startInterviewSession({
          innovation_name: innovationName,
          description: description,
          product_category: innovationArea,
        }, language);
        setSessionId(res.session_id);
        setCurrentQuestion(res.next_question);
        setInterviewProgress(res.progress.percentage);
        setIsInterviewComplete(res.completed);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start interview.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (fieldName: string, answer: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedAnswers = { ...interviewAnswers, [fieldName]: answer };
      setInterviewAnswers(updatedAnswers);

      if (isDemoMode || !isBackendConnected || !sessionId) {
        setInterviewProgress((prev) => Math.min(100, prev + 25));
        if (interviewProgress >= 75) {
          setIsInterviewComplete(true);
          setCurrentQuestion(null);
        }
      } else {
        const res = await submitInterviewAnswer(sessionId, fieldName, answer, language);
        setCurrentQuestion(res.next_question);
        setInterviewProgress(res.progress.percentage);
        setIsInterviewComplete(res.completed);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer.');
    } finally {
      setIsLoading(false);
    }
  };

  const runFullAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isDemoMode || !isBackendConnected) {
        setFingerprint(DEMO_FINGERPRINT);
        setDecisionMap(DEMO_DECISION_MAP);
        setRetrievedEvidence(DEMO_FULL_ANALYSIS.retrieved_evidence);
        setEvidenceValidation(DEMO_FULL_ANALYSIS.evidence_validation);
        setRoadmap(DEMO_ROADMAP);
        setFullAnalysisResponse(DEMO_FULL_ANALYSIS);
      } else {
        let res: FullAnalysisResponse;
        if (sessionId && isInterviewComplete) {
          res = await completeInterviewAndAnalyze(sessionId, language);
        } else {
          res = await analyzeInnovationDirect({
            innovation_name: innovationName,
            description: description,
            ingredients: interviewAnswers.ingredients,
            intended_use: interviewAnswers.intended_use,
            product_category: innovationArea,
            novelty_description: interviewAnswers.novelty_description,
            novelty_types: interviewAnswers.novelty_type,
            biological_resource_used: interviewAnswers.biological_resource_used,
            source_location: interviewAnswers.source_location,
            ui_language: language,
          });
        }
        setFingerprint(res.fingerprint);
        setDecisionMap(res.decision_map);
        setRetrievedEvidence(res.retrieved_evidence);
        setEvidenceValidation(res.evidence_validation);
        setRoadmap(res.roadmap);
        setFullAnalysisResponse(res);
      }
    } catch (err: any) {
      setError(err.message || 'Error executing analysis pipeline.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSessionId(null);
    setInnovationName('');
    setDescription('');
    setInterviewAnswers({});
    setCurrentQuestion(null);
    setInterviewProgress(0);
    setIsInterviewComplete(false);
  };

  const toggleDemoMode = (enable?: boolean) => {
    const target = enable !== undefined ? enable : !isDemoMode;
    setIsDemoMode(target);
    if (target) {
      setFingerprint(DEMO_FINGERPRINT);
      setDecisionMap(DEMO_DECISION_MAP);
      setRoadmap(DEMO_ROADMAP);
      setFullAnalysisResponse(DEMO_FULL_ANALYSIS);
    }
  };

  const contextValue: AnalysisContextType = {
    sessionId,
    innovationName,
    description,
    innovationArea,
    interviewAnswers,
    currentQuestion,
    interviewProgress,
    isInterviewComplete,
    fingerprint,
    decisionMap,
    retrievedEvidence,
    evidenceValidation,
    roadmap,
    fullAnalysisResponse,
    isLoading,
    isBackendConnected,
    isDemoMode,
    error,
    setInnovationInput,
    startInterview,
    submitAnswer,
    runFullAnalysis,
    resetAnalysis,
    toggleDemoMode,
  };

  return React.createElement(AnalysisContext.Provider, { value: contextValue }, children);
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
