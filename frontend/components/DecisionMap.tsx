'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import { DecisionCard } from './DecisionCard';
import { Disclaimer } from './Disclaimer';
import { AnalysisTimeline } from './AnalysisTimeline';
import { LegalRegimeExplorer } from './LegalRegimeExplorer';
import { SystemStatus } from './SystemStatus';

export const DecisionMap: React.FC = () => {
  const router = useRouter();
  const { decisionMap, fingerprint, runFullAnalysis, isLoading } = useAnalysis();

  const handleGenerateRoadmap = async () => {
    await runFullAnalysis();
    router.push('/roadmap');
  };

  const regimes = decisionMap?.regimes || [
    {
      name: 'PATENT',
      status: 'POSSIBLE',
      color: 'yellow',
      reason: 'Formulation uses novel nano-extraction process which may overcome Section 3(p) TK bar if synergy is established.',
      triggered_by: ['nano-extraction process', 'increased absorption'],
    },
    {
      name: 'TRADITIONAL KNOWLEDGE',
      status: 'OVERLAP_POSSIBLE',
      color: 'orange',
      reason: 'Ingredients Neem and Turmeric are cited extensively in Ayurvedic classical literature and TKDL prior art records.',
      triggered_by: ['Neem', 'Turmeric', 'Wound healing'],
    },
    {
      name: 'BIOLOGICAL RESOURCES',
      status: 'REVIEW_REQUIRED',
      color: 'yellow',
      reason: 'Biological resources sourced from Tamil Nadu require mandatory Form 8 NBA registration under BDA 2023.',
      triggered_by: ['Tamil Nadu', 'Neem', 'Turmeric'],
    },
    {
      name: 'REGULATORY',
      status: 'CLASSIFICATION_REQUIRED',
      color: 'blue',
      reason: 'Product category requires classification under Drugs & Cosmetics Act (Rule 158-B vs Form 25D) or FSSAI Ayurveda Aahara rules.',
      triggered_by: ['Ayurvedic Medicine / Formulation'],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-full border border-emerald-500/30 mb-3 font-mono">
          STEP 4 OF 5 — MULTI-REGIME EVALUATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center justify-center space-x-2">
          <Compass className="w-8 h-8 text-emerald-400" />
          <span>Your Innovation Decision Map</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
          Evaluates Section 3(p), Section 3(e), TKDL prior art, Biological Diversity Act 2023, and AYUSH Rule 158-B.
        </p>
      </div>

      {/* Visual Analysis Timeline */}
      <AnalysisTimeline currentStep={4} />

      {/* Mandatory Disclaimer */}
      <Disclaimer variant="warning" />

      {/* 2 x 2 Pathway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regimes.map((item, index) => (
          <DecisionCard
            key={index}
            item={item}
            fingerprint={fingerprint || undefined}
            onExploreEvidence={() => router.push('/roadmap')}
          />
        ))}
      </div>

      {/* Legal Regime Explorer Component */}
      <LegalRegimeExplorer />

      {/* AI System Status Panel */}
      <SystemStatus />

      {/* Bottom Call to Action Section */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 font-mono">
            FINAL STEP
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            View Your Personalized Action Roadmap
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
            Get structured, step-by-step guidance formatted as: WHAT WE DETECTED → WHY IT MATTERS → WHAT TO CHECK NEXT.
          </p>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <span>{isLoading ? 'Generating Roadmap...' : 'Generate Action Roadmap'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
