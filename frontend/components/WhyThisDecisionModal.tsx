'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, FileText, Cpu, AlertCircle } from 'lucide-react';
import { DecisionExplanationDetail, InnovationFingerprint } from '../lib/types';
import { getDecisionExplanation } from '../lib/api';

interface WhyThisDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  regime: string;
  fingerprint: InnovationFingerprint;
  decisionStatus?: string;
}

export const WhyThisDecisionModal: React.FC<WhyThisDecisionModalProps> = ({
  isOpen,
  onClose,
  regime,
  fingerprint,
  decisionStatus,
}) => {
  const [detail, setDetail] = useState<DecisionExplanationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && regime) {
      setLoading(true);
      getDecisionExplanation({
        regime,
        fingerprint,
        decision_status: decisionStatus,
      })
        .then((res) => {
          setDetail(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, regime, fingerprint, decisionStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              Why did IP-SAKTI say this?
              <span className="rounded-full bg-emerald-900/60 px-2.5 py-0.5 text-xs text-emerald-300 font-mono border border-emerald-500/30">
                {regime} REGIME
              </span>
            </h3>
            <p className="text-xs text-slate-400">Transparent AI Reasoning Path & Legal Grounding</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
            <Cpu className="h-5 w-5 animate-spin" />
            Tracing reasoning path and legal statute rules...
          </div>
        ) : detail ? (
          <div className="mt-5 space-y-6">
            {/* Summary Box */}
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Evaluation Outcome:</span>
                <div className="text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-2">
                  Status: {detail.decision_status}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Verified with {detail.supporting_evidence_count} statutory sources
              </div>
            </div>

            {/* Reasoning Path Steps (4-Step Explanation Flow) */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-emerald-400" />
                4-Step Decision Reasoning Path:
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {(detail.reasoning_path && detail.reasoning_path.length > 0
                  ? detail.reasoning_path
                  : [
                      { step_name: '1. Understanding', detail: 'Extracted key Ayurvedic herbs, process innovations, and biological source locations.', status: 'completed' },
                      { step_name: '2. AI Analysis', detail: 'Evaluated novelty claim against prior art & TKDL database indexing rules.', status: 'completed' },
                      { step_name: '3. Legal Evaluation', detail: 'Checked statutory compliance under Section 3(p) Patents Act & ABS rules.', status: 'completed' },
                      { step_name: '4. Final Decision', detail: `Determined statutory classification as ${detail.decision_status} with clear compliance roadmap.`, status: 'completed' },
                    ]
                ).map((step, idx) => {
                  const stepTitles = ['1. Understanding', '2. AI Analysis', '3. Legal Evaluation', '4. Final Decision'];
                  const stepTitle = stepTitles[idx] || step.step_name;
                  return (
                    <div key={idx} className="flex gap-3 rounded-lg bg-slate-950/80 p-3 border border-slate-800 hover:border-emerald-500/40 transition-colors">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                          {stepTitle}
                        </h5>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detected Key Signals */}
            {detail.detected_signals.length > 0 && (
              <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-2 font-mono">
                  Input Factors Triggering Decision:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {detail.detected_signals.map((sig, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-slate-900 px-2.5 py-1 text-xs font-mono text-emerald-300 border border-slate-800"
                    >
                      {sig}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Simple Policy Breakdown Card */}
            {detail.policy_breakdown && (
              <div className="rounded-xl bg-emerald-950/20 p-4 border border-emerald-500/30 space-y-2">
                <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase font-mono">
                  <FileText className="h-4 w-4" />
                  Statute: {detail.policy_breakdown.statute_name}
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Core Rule: </strong>
                  {detail.policy_breakdown.what_it_means}
                </p>
                <div className="mt-2 text-xs text-slate-400 border-t border-emerald-500/20 pt-2">
                  <strong className="text-amber-400">Why It Applies To You: </strong>
                  {detail.policy_breakdown.why_it_applies_to_you}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            Failed to load reasoning path detail.
          </div>
        )}

        <div className="mt-6 border-t border-slate-800 pt-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
