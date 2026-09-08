'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Cpu, HelpCircle, Layers, MapPin, Search, ShieldCheck } from 'lucide-react';

interface AnalysisTimelineProps {
  currentStep?: number; // 1 to 5
}

const STEPS = [
  { step: 1, label: 'Input Extraction', icon: <Cpu className="h-4 w-4" /> },
  { step: 2, label: 'Fingerprint Profile', icon: <Layers className="h-4 w-4" /> },
  { step: 3, label: 'Smart Interview', icon: <HelpCircle className="h-4 w-4" /> },
  { step: 4, label: '4-Regime RAG', icon: <ShieldCheck className="h-4 w-4" /> },
  { step: 5, label: 'Action Roadmap', icon: <MapPin className="h-4 w-4" /> },
];

export const AnalysisTimeline: React.FC<AnalysisTimelineProps> = ({ currentStep = 5 }) => {
  return (
    <div className="my-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2 scrollbar-none">
        {STEPS.map((s, idx) => {
          const isDone = s.step <= currentStep;
          const isActive = s.step === currentStep;

          return (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2 min-w-max">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md ring-2 ring-emerald-500/30'
                      : isDone
                      ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400'
                      : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.icon}
                </div>

                <div className="text-left">
                  <span className="block font-mono text-[10px] uppercase text-slate-500">
                    STEP 0{s.step}
                  </span>
                  <span
                    className={`block text-xs font-semibold ${
                      isDone ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </div>

              {idx < STEPS.length - 1 && (
                <ArrowRight className="h-4 w-4 text-slate-700 shrink-0 mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
