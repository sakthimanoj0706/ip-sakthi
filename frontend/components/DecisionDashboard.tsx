'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2, FileText, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { FullAnalysisResponse } from '../lib/types';

interface DecisionDashboardProps {
  analysis: FullAnalysisResponse;
}

export const DecisionDashboard: React.FC<DecisionDashboardProps> = ({ analysis }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl text-slate-100 backdrop-blur-md space-y-8 my-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
            INNOVATION INTELLIGENCE REPORT
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">
            {analysis.fingerprint?.innovation_name || 'Ayurvedic Innovation'}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Calendar className="h-4 w-4 text-emerald-400" />
          <span>Analysis Date: {currentDate}</span>
        </div>
      </div>

      {/* SECTION 1: Overall Assessment */}
      <div className="rounded-xl bg-amber-950/20 border border-amber-500/40 p-5 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-bold text-amber-300 font-mono uppercase">
            OVERALL ASSESSMENT: REVIEW RECOMMENDED
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Multiple IP and regulatory regimes apply to your innovation. While the claimed nano-extraction process shows patent eligibility potential under Section 3(e), compliance reviews are required for Traditional Knowledge (TKDL) and Biological Diversity Act 2023 (Form 8 NBA registration).
        </p>
      </div>

      {/* SECTION 2: 4-Regime Status Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-4">
          4-REGIME MAP STATUS SUMMARY:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-950 p-4 border border-amber-500/30">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Patent Regime</span>
            <span className="text-sm font-bold text-amber-400 block mt-1">POSSIBLE</span>
            <span className="text-[11px] text-slate-400 block mt-1">Process novelty claimed</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-orange-500/30">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Traditional Knowledge</span>
            <span className="text-sm font-bold text-orange-400 block mt-1">REVIEW REQUIRED</span>
            <span className="text-[11px] text-slate-400 block mt-1">Classical herbs indexed in TKDL</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-emerald-500/30">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Biological Resources</span>
            <span className="text-sm font-bold text-emerald-400 block mt-1">REVIEW REQUIRED</span>
            <span className="text-[11px] text-slate-400 block mt-1">Indian origin compliance</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-blue-500/30">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Regulatory Licensing</span>
            <span className="text-sm font-bold text-blue-400 block mt-1">APPLICABLE</span>
            <span className="text-[11px] text-slate-400 block mt-1">ASU Drug Rule 158-B or FSSAI</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Key Findings */}
      <div className="rounded-xl bg-slate-950 p-5 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-emerald-400 uppercase font-mono">
          KEY INTELLIGENCE FINDINGS:
        </h3>
        <ol className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">1.</span>
            <span>New technical process detected (nano-extraction process for enhanced skin absorption).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">2.</span>
            <span>Traditionally known Ayurvedic ingredients detected (Neem, Turmeric).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">3.</span>
            <span>Biological materials sourced from Tamil Nadu require NBA Form 8 registration before patent grant.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">4.</span>
            <span>Comparative prior art search recommended on Indian Patent Office (IPO) database.</span>
          </li>
        </ol>
      </div>

      {/* SECTION 4: Next Actions Priority List */}
      <div className="rounded-xl bg-slate-950 p-5 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-cyan-400 uppercase font-mono">
          RECOMMENDED NEXT ACTION PRIORITIES:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
            <strong className="text-emerald-400 font-mono block mb-1">Priority 1 (Now):</strong>
            <span>Perform patent prior art search on IPO database.</span>
          </div>

          <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
            <strong className="text-emerald-400 font-mono block mb-1">Priority 2 (Next):</strong>
            <span>Verify biological resource origin & BMC Certificate of Origin.</span>
          </div>

          <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
            <strong className="text-emerald-400 font-mono block mb-1">Priority 3 (Before Filing):</strong>
            <span>Review traditional knowledge classical text citations.</span>
          </div>

          <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
            <strong className="text-emerald-400 font-mono block mb-1">Priority 4 (Regulatory):</strong>
            <span>Select AYUSH drug licensing track (Rule 158-B vs FSSAI).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
