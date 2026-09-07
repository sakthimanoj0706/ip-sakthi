'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  href: string;
}

const STEPS: Step[] = [
  { id: 1, name: 'Innovation Description', href: '/analyze' },
  { id: 2, name: 'Smart Interview', href: '/interview' },
  { id: 3, name: 'Innovation Fingerprint', href: '/fingerprint' },
  { id: 4, name: 'Decision Map', href: '/decision' },
  { id: 5, name: 'Action Roadmap', href: '/roadmap' },
];

export const ProgressStepper: React.FC = () => {
  const pathname = usePathname();

  const getCurrentStepIndex = () => {
    if (pathname.startsWith('/analyze')) return 1;
    if (pathname.startsWith('/interview')) return 2;
    if (pathname.startsWith('/fingerprint')) return 3;
    if (pathname.startsWith('/decision')) return 4;
    if (pathname.startsWith('/roadmap')) return 5;
    return 1;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Desktop Stepper */}
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-between">
            {STEPS.map((step, stepIdx) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <li key={step.name} className="relative flex-1 flex items-center">
                  <div className="flex items-center space-x-2 group">
                    {/* Circle Node */}
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-slate-900 text-white ring-2 ring-emerald-500 ring-offset-2'
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                    </span>

                    {/* Step Label */}
                    <span
                      className={`text-xs font-medium hidden md:inline-block ${
                        isCurrent
                          ? 'text-slate-900 font-bold'
                          : isCompleted
                          ? 'text-slate-700 font-medium'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>

                  {/* Connecting Line */}
                  {stepIdx !== STEPS.length - 1 && (
                    <div
                      className={`hidden sm:block flex-1 h-0.5 mx-3 ${
                        step.id < currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Mobile Header indicator */}
        <div className="md:hidden flex justify-between items-center text-xs font-medium text-slate-600 mt-1">
          <span>STEP {currentStep} OF 5</span>
          <span className="font-bold text-slate-900">{STEPS[currentStep - 1]?.name}</span>
        </div>

      </div>
    </div>
  );
};
