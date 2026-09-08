'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle, Compass, CheckCircle2 } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  targetArea: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to IP-SAKTI Sahayak',
    description: 'AI Innovation GPS for Ayurveda & AYUSH Innovators. This platform provides decision support across Indian IP laws and regulatory frameworks.',
    targetArea: 'Header Platform Overview',
  },
  {
    title: '1. Multilingual Input & Category Detection',
    description: 'Describe your formulation in English, Tamil, Hindi, or Tanglish. Our AI automatically classifies your innovation into 19 supported categories.',
    targetArea: 'Innovation Input Card',
  },
  {
    title: '2. Innovation Fingerprint Profile',
    description: 'Extracts standardized botanical Latin names, claimed novelty, biological resource usage, and assigns data provenance badges.',
    targetArea: 'Innovation Intelligence Profile',
  },
  {
    title: '3. Smart Interview Agent',
    description: 'Dynamic 1-5 step smart interview that asks high-priority missing questions without duplicate queries.',
    targetArea: 'Smart Interview Session',
  },
  {
    title: '4. Multi-Regime Decision Engine',
    description: 'Evaluates Patent Section 3(p)/3(e), Traditional Knowledge Digital Library (TKDL), Biological Diversity Act 2023, and AYUSH Rule 158-B.',
    targetArea: 'Decision Map Matrix',
  },
  {
    title: '5. Regime-Aware RAG Evidence',
    description: 'Retrieves grounded statutory evidence from Indian Acts, Gazette Notifications, and live web research.',
    targetArea: 'Evidence Validation',
  },
  {
    title: '6. Plain-Language Policy Breakdown',
    description: 'Click "Why did IP-SAKTI say this?" to view simple-language statute breakdowns and transparent decision reasoning paths.',
    targetArea: 'Policy Explainer Cards',
  },
  {
    title: '7. Personalized Action Roadmap',
    description: 'Provides structured next steps formatted as: WHAT WE DETECTED -> WHY IT MATTERS -> WHAT TO CHECK NEXT.',
    targetArea: 'Action Roadmap',
  },
];

export const InteractiveTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('ip_sakti_tour_seen');
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('ip_sakti_tour_seen', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setCurrentStepIndex(0);
          setIsOpen(true);
        }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-emerald-500 transition-all border border-emerald-400/40"
      >
        <Compass className="h-4 w-4 animate-spin-slow" />
        Interactive Guided Tour
      </button>
    );
  }

  const step = TOUR_STEPS[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <HelpCircle className="h-4 w-4" />
          <span>STEP {currentStepIndex + 1} OF {TOUR_STEPS.length}</span>
        </div>

        <h3 className="mt-2 text-lg font-bold text-slate-100 flex items-center gap-2">
          {step.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {step.description}
        </p>

        <div className="mt-4 rounded-lg bg-slate-950 p-2.5 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Target Component:</span>
          <span className="text-emerald-400">{step.targetArea}</span>
        </div>

        {/* Progress Dots */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {TOUR_STEPS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-6 bg-emerald-400'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-md"
          >
            {currentStepIndex === TOUR_STEPS.length - 1 ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Finish Tour
              </>
            ) : (
              <>
                Next Step
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
