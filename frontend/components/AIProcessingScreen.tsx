'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, ShieldCheck, Database, Search, Map } from 'lucide-react';

interface ProcessingStep {
  id: string;
  label: string;
  subText: string;
  icon: React.ReactNode;
}

const STEPS: ProcessingStep[] = [
  {
    id: 'nlp',
    label: 'Multi-Layer NLP Extraction',
    subText: 'Parsing herbs, Sanskrit terms, and Latin botanical names via spaCy & Gemini...',
    icon: <Cpu className="h-4 w-4 text-emerald-400" />,
  },
  {
    id: 'fingerprint',
    label: 'Building Innovation Fingerprint',
    subText: 'Standardizing ingredients, biological resource origin, and novelty claims...',
    icon: <Sparkles className="h-4 w-4 text-blue-400" />,
  },
  {
    id: 'category',
    label: 'Auto Category & Complexity Scoring',
    subText: 'Classifying innovation type and evaluating multi-regime legal complexity...',
    icon: <ShieldCheck className="h-4 w-4 text-purple-400" />,
  },
  {
    id: 'decision',
    label: 'Multi-Regime Rule Engine Evaluation',
    subText: 'Assessing Section 3(p), Section 3(e), TKDL, BDA 2023, and Rule 158-B...',
    icon: <Database className="h-4 w-4 text-amber-400" />,
  },
  {
    id: 'rag',
    label: 'Regime-Aware Hybrid RAG & Live Web Research',
    subText: 'Querying local statutory acts, gazette notifications, and live domain RAG...',
    icon: <Search className="h-4 w-4 text-cyan-400" />,
  },
  {
    id: 'roadmap',
    label: 'Generating Personalized Action Roadmap',
    subText: 'Structuring compliance steps, policy breakdowns, and legal disclaimers...',
    icon: <Map className="h-4 w-4 text-rose-400" />,
  },
];

export const AIProcessingScreen: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          setCompletedSteps((c) => [...c, STEPS[prev].id]);
          return prev + 1;
        } else {
          setCompletedSteps((c) => Array.from(new Set([...c, STEPS[prev].id])));
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-md max-w-xl mx-auto my-12 text-slate-100">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Cpu className="h-6 w-6 animate-spin" />
        </div>
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            IP-SAKTI Intelligence Engine Active
            <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-xs text-emerald-300 border border-emerald-500/30 font-mono">
              Live Processing
            </span>
          </h3>
          <p className="text-xs text-slate-400">Executing multi-layer analysis pipeline...</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {STEPS.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const isActive = idx === activeStepIndex && !isDone;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 rounded-xl border p-3.5 transition-all ${
                isDone
                  ? 'border-emerald-500/20 bg-emerald-950/20 text-slate-200'
                  : isActive
                  ? 'border-emerald-500/50 bg-slate-900 shadow-md ring-1 ring-emerald-500/30'
                  : 'border-slate-800/60 bg-slate-950/50 text-slate-500 opacity-60'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-700 bg-slate-900" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    {step.label}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-500">
                    STEP 0{idx + 1}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                  {step.subText}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
