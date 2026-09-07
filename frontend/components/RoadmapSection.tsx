'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, CheckCircle2, Download, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import { EvidenceCard } from './EvidenceCard';
import { Disclaimer } from './Disclaimer';
import { RoadmapItem } from '../lib/types';

export const RoadmapSection: React.FC = () => {
  const router = useRouter();
  const { roadmap, resetAnalysis, isDemoMode } = useAnalysis();

  const handleStartNew = () => {
    resetAnalysis();
    router.push('/analyze');
  };

  const handleDownload = () => {
    const jsonStr = JSON.stringify(roadmap, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IP-SAKTI-Roadmap-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const roadmaps: RoadmapItem[] = roadmap?.regime_roadmaps || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full border border-emerald-200 mb-3">
          STEP 5 OF 5 — FINAL ACTION ROADMAP
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center space-x-2">
          <ClipboardList className="w-8 h-8 text-emerald-600" />
          <span>Your Innovation Action Roadmap</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          A structured guide to help you understand possible next areas to explore.
        </p>
      </div>

      {/* Disclaimer */}
      <Disclaimer variant="info" customText={roadmap?.disclaimer} />

      {/* Innovation Summary Header */}
      {roadmap?.innovation_summary && (
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
              EVALUATED INNOVATION
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {roadmap.innovation_summary.innovation_name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ingredients: {roadmap.innovation_summary.ingredients.join(', ')} | Source: {roadmap.innovation_summary.source_location || 'India'}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-emerald-300 rounded border border-slate-700">
            {isDemoMode ? 'Demo Mode Analysis' : 'Verified RAG Guidance'}
          </span>
        </div>
      )}

      {/* Vertical Roadmap Steps */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-slate-200 before:z-0">
        
        {roadmaps.map((item, index) => {
          const stepNumber = String(index + 1).padStart(2, '0');

          return (
            <div key={index} className="relative z-10 pl-14 sm:pl-16 space-y-4">
              
              {/* Step Circle Badge */}
              <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-slate-900 text-white font-extrabold text-sm border-4 border-slate-100 flex items-center justify-center shadow-sm">
                {stepNumber}
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                
                {/* Title & Status Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {item.regime}
                  </h3>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                {/* 1. WHAT WE DETECTED */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    WHAT WE DETECTED
                  </h4>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {item.what_we_detected}
                  </p>
                </div>

                {/* 2. WHY IT MATTERS */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    WHY IT MATTERS
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    {item.why_it_matters}
                  </p>
                </div>

                {/* 3. SUPPORTING EVIDENCE */}
                {item.sources && item.sources.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      SUPPORTING EVIDENCE
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {item.sources.map((src, idx) => (
                        <EvidenceCard
                          key={idx}
                          regime={item.regime}
                          source={{
                            id: src.id,
                            law: src.law,
                            section: src.section,
                            plain_explanation: src.excerpt,
                            confidence: 'High',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. WHAT TO CHECK NEXT */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    WHAT TO CHECK NEXT
                  </h4>
                  <ol className="space-y-2 text-xs sm:text-sm text-slate-800 font-medium">
                    {item.what_to_check_next.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* FINAL HIGHLIGHTED SECTION: Your Next Recommended Action */}
      <div className="bg-emerald-900 text-white rounded-xl p-6 sm:p-8 shadow-lg border border-emerald-800">
        <div className="flex items-center space-x-2 text-emerald-400 mb-2">
          <CheckCircle2 className="w-6 h-6" />
          <h3 className="font-extrabold text-lg text-white">Your Next Recommended Action</h3>
        </div>

        <p className="text-sm font-medium text-emerald-100 whitespace-pre-line leading-relaxed bg-emerald-950/60 p-4 rounded-lg border border-emerald-800/80 mb-6">
          {roadmap?.overall_next_action ||
            'Begin by documenting the novel technical aspects of your extraction process separately from the traditionally known ingredients.'}
        </p>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-emerald-800/80">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Analysis Report (JSON)</span>
          </button>

          <button
            onClick={handleStartNew}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Analysis</span>
          </button>
        </div>

      </div>

    </div>
  );
};
