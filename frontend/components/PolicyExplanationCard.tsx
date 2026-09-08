'use client';

import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ShieldAlert, Sparkles, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { SimplePolicyBreakdown } from '../lib/types';

interface PolicyExplanationCardProps {
  policy: SimplePolicyBreakdown;
  onViewReasoningPath?: () => void;
}

export const PolicyExplanationCard: React.FC<PolicyExplanationCardProps> = ({
  policy,
  onViewReasoningPath,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'simple' | 'legal'>('simple');

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-400 font-mono tracking-wide uppercase">
              {policy.regime_name} Policy Breakdown
            </h4>
            <p className="text-xs font-semibold text-slate-100">{policy.statute_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Dual-Mode Explanation Toggle */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setViewMode('simple')}
              className={`rounded px-2.5 py-1 transition-all ${
                viewMode === 'simple'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Simple Explanation
            </button>
            <button
              type="button"
              onClick={() => setViewMode('legal')}
              className={`rounded px-2.5 py-1 transition-all ${
                viewMode === 'legal'
                  ? 'bg-cyan-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Detailed Legal View
            </button>
          </div>

          {onViewReasoningPath && (
            <button
              type="button"
              onClick={onViewReasoningPath}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Why did IP-SAKTI say this?
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <span className="text-[11px] font-mono uppercase text-slate-400">Policy Objective:</span>
          <p className="mt-0.5 text-xs font-semibold text-slate-200">{policy.policy_title}</p>
        </div>

        {viewMode === 'simple' ? (
          /* Simple Explanation View */
          <>
            <div className="rounded-lg bg-slate-950/80 p-3 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold">
                What It Means (Plain English):
              </span>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {policy.what_it_means}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <span className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Why It Applies To You:
                </span>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {policy.why_it_applies_to_you}
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  What Makes Your Case Different:
                </span>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {policy.what_makes_your_case_different}
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Detailed Legal View */
          <div className="rounded-lg bg-slate-950/90 p-4 border border-cyan-500/30 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-cyan-400 font-bold uppercase">Statutory Reference</span>
              <span className="text-[10px] text-slate-400">{policy.statute_name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 block font-sans font-bold">Legal Rule Analysis:</span>
              <p className="text-xs text-slate-200 mt-1 font-sans leading-relaxed">
                {policy.what_it_means}
              </p>
            </div>
            <div className="rounded bg-slate-900 p-2.5 border border-slate-800 text-[11px] font-sans text-slate-300">
              <strong className="text-cyan-300 font-mono text-[10px] uppercase block">Jurisprudential Grounding:</strong>
              {policy.why_it_applies_to_you}
            </div>
            <div className="rounded bg-slate-900 p-2.5 border border-slate-800 text-[11px] font-sans text-slate-300">
              <strong className="text-amber-300 font-mono text-[10px] uppercase block">Statutory Distinction:</strong>
              {policy.what_makes_your_case_different}
            </div>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full rounded-lg bg-slate-950/80 p-2.5 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800"
          >
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              What You Should Prove ({policy.what_you_should_prove.length} items)
            </span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {expanded && (
            <ul className="mt-2 space-y-1.5 pl-3 border-l-2 border-emerald-500/40">
              {policy.what_you_should_prove.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400">{idx + 1}. </strong>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
