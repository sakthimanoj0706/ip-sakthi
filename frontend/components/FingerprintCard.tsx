'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dna, Leaf, Microscope, Target, MapPin, BookOpen, ArrowRight, Info, ShieldCheck, Tag } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';

export const FingerprintCard: React.FC = () => {
  const router = useRouter();
  const { fingerprint, runFullAnalysis, isLoading } = useAnalysis();

  const handleAnalyzePathways = async () => {
    await runFullAnalysis();
    router.push('/decision');
  };

  const ingredientsList = fingerprint?.ingredients || ['Neem', 'Turmeric'];
  const noveltyDesc = fingerprint?.novelty?.description || 'Nano-extraction process to improve absorption';
  const intendedUse = fingerprint?.intended_use || 'Wound healing';
  const location = fingerprint?.biological_resources?.source_location || 'Tamil Nadu';
  const confidence = fingerprint?.overall_confidence ? Math.round(fingerprint.overall_confidence * 100) : 85;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-full border border-emerald-500/30">
            INNOVATION INTELLIGENCE PROFILE
          </span>
          {fingerprint?.detected_language && (
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 font-semibold text-xs rounded-full border border-blue-500/30">
              Language: {fingerprint.detected_language}
            </span>
          )}
          <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 font-semibold text-xs rounded-full border border-purple-500/30 font-mono">
            Completeness: {confidence}%
          </span>
        </div>

        {/* Provenance Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
            <Tag className="h-3 w-3" /> USER PROVIDED
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-mono">
            <Tag className="h-3 w-3" /> AI DETECTED
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-mono">
            <Tag className="h-3 w-3" /> KNOWLEDGE BASE
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-500/30 flex items-center gap-1 font-mono">
            <Tag className="h-3 w-3" /> WEB VALIDATED
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center justify-center space-x-2">
          <Dna className="w-7 h-7 text-emerald-400" />
          <span>Your Innovation Fingerprint</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Structured multi-layer extraction metadata & botanical provenance map.
        </p>
      </div>

      {/* Central Connected Layout Visualization */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-10 shadow-xl text-white border border-slate-800 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left Column: Ingredients & Intended Use */}
          <div className="space-y-6">
            {/* Ingredients Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Leaf className="w-5 h-5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono">INGREDIENTS</h4>
                </div>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  BOTANICAL
                </span>
              </div>
              <ul className="text-sm font-medium text-slate-200 space-y-1">
                {ingredientsList.map((ing, i) => (
                  <li key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{ing}</span>
                    </div>
                    {fingerprint?.scientific_names && fingerprint.scientific_names[i] && (
                      <span className="text-[10px] font-mono text-slate-400 italic">
                        ({fingerprint.scientific_names[i]})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Intended Use Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Target className="w-5 h-5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono">INTENDED USE</h4>
                </div>
                <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  THERAPEUTIC
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200">
                {intendedUse}
              </p>
            </div>
          </div>

          {/* Center Column: Central Node */}
          <div className="flex flex-col items-center justify-center my-4 md:my-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-slate-900 border-4 border-emerald-500/50 flex flex-col items-center justify-center shadow-xl relative group">
              <Dna className="w-10 h-10 text-white animate-pulse" />
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-300 uppercase mt-1 font-mono">
                PROFILE
              </span>
            </div>
            <span className="text-xs text-slate-300 mt-3 font-semibold text-center max-w-[180px]">
              {fingerprint?.innovation_name || 'Ayurvedic Innovation'}
            </span>
          </div>

          {/* Right Column: Novelty & Biological Resources */}
          <div className="space-y-6">
            {/* Novelty Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Microscope className="w-5 h-5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono">NOVELTY CLAIMED</h4>
                </div>
                <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                  PROCESS
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200">
                {noveltyDesc}
              </p>
            </div>

            {/* Biological Resources Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono">BIOLOGICAL SOURCE</h4>
                </div>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  BDA 2023
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200">
                {location} (Indian Origin)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">TRADITIONAL KNOWLEDGE BASIS:</span>
            <span className="text-emerald-300 font-bold">Potentially Relevant (Codified Classical Texts)</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
            Validated against TKDL Metadata
          </span>
        </div>
      </div>

      {/* Explanation & Action Box */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-100">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-slate-100">Multi-Regime Analysis Ready</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Your Innovation Fingerprint triggers targeted multi-regime rules against Patents, TKDL, Biological Diversity Act 2023, and AYUSH drug regulations.
            </p>
          </div>
        </div>

        <button
          onClick={handleAnalyzePathways}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <span>{isLoading ? 'Evaluating Pathways...' : 'Analyze Pathways'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
