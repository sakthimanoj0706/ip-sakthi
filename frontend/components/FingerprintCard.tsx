'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dna, Leaf, Microscope, Target, MapPin, BookOpen, ArrowRight, Info } from 'lucide-react';
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full border border-emerald-200">
            STEP 3 COMPLETE
          </span>
          {fingerprint?.detected_language && (
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-full border border-blue-200">
              Language: {fingerprint.detected_language}
            </span>
          )}
        </div>

        {/* AI Extraction Badges */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${fingerprint?.extraction_source?.gemini ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            Gemini {fingerprint?.extraction_source?.gemini ? '✓' : '○'}
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${fingerprint?.extraction_source?.spacy ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            spaCy {fingerprint?.extraction_source?.spacy ? '✓' : '○'}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Rules ✓
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center space-x-2">
          <Dna className="w-7 h-7 text-emerald-600" />
          <span>Your Innovation Fingerprint</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          A structured view of the key characteristics identified during your guided analysis.
        </p>
      </div>

      {/* Central Connected Layout Visualization */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-10 shadow-lg text-white border border-slate-800 relative overflow-hidden mb-8">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Left Column: Ingredients & Intended Use */}
          <div className="space-y-6">
            
            {/* Ingredients Card */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                <Leaf className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">INGREDIENTS</h4>
              </div>
              <ul className="text-sm font-medium text-slate-200 space-y-1">
                {ingredientsList.map((ing, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Intended Use Card */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center space-x-2 text-amber-400 mb-2">
                <Target className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">INTENDED USE</h4>
              </div>
              <p className="text-sm font-medium text-slate-200">
                {intendedUse}
              </p>
            </div>

          </div>

          {/* Center Column: Central Node */}
          <div className="flex flex-col items-center justify-center my-4 md:my-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-slate-800 border-4 border-slate-700 flex flex-col items-center justify-center shadow-xl relative group">
              <Dna className="w-10 h-10 text-white animate-pulse" />
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-300 uppercase mt-1">
                FINGERPRINT
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-3 font-medium text-center">
              {fingerprint?.innovation_name || 'Ayurvedic Innovation'}
            </span>
          </div>

          {/* Right Column: Novelty & Biological Resources */}
          <div className="space-y-6">
            
            {/* Novelty Card */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                <Microscope className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">NOVELTY CLAIMED</h4>
              </div>
              <p className="text-sm font-medium text-slate-200">
                {noveltyDesc}
              </p>
            </div>

            {/* Biological Resources Card */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                <MapPin className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">BIOLOGICAL SOURCE</h4>
              </div>
              <p className="text-sm font-medium text-slate-200">
                {location} (Indian Origin)
              </p>
            </div>

          </div>

        </div>

        {/* Bottom Connected Banner: Traditional Knowledge */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">TRADITIONAL KNOWLEDGE BASIS:</span>
            <span className="text-emerald-300 font-bold">Potentially Relevant (Codified Classical Texts)</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-slate-400">
            Validated against TKDL Metadata
          </span>
        </div>

      </div>

      {/* Explanation & Action Box */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">How This Is Used</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Your Innovation Fingerprint enables IP-SAKTI to run targeted multi-regime rules against Patent Law, TKDL, Biodiversity Act 2023, and AYUSH drug regulations.
            </p>
          </div>
        </div>

        <button
          onClick={handleAnalyzePathways}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <span>{isLoading ? 'Evaluating Pathways...' : 'Analyze Pathways'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
