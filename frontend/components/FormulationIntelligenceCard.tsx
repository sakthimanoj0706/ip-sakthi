'use client';

import React from 'react';
import { FlaskConical, AlertTriangle, CheckCircle, ShieldAlert, BarChart3, Info, Sparkles, Tag } from 'lucide-react';
import { FormulationAnalysisResult } from '../lib/types';

interface FormulationIntelligenceCardProps {
  formulation?: FormulationAnalysisResult | null;
}

export const FormulationIntelligenceCard: React.FC<FormulationIntelligenceCardProps> = ({ formulation }) => {
  if (!formulation) {
    return null;
  }

  const {
    documentation_status,
    ratios_available,
    total_composition_percentage,
    ratio_validation_status,
    ratio_validation_message,
    ingredients,
    excipients,
    base_materials,
    technical_differentiation,
    differentiation_reason,
    multi_objective_scores,
    disclaimer,
  } = formulation;

  const totalPct = total_composition_percentage !== null && total_composition_percentage !== undefined ? total_composition_percentage : 0;

  // Status badges
  const getRatioBadge = () => {
    if (ratio_validation_status === 'COMPLETE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs rounded-full border border-emerald-500/40">
          <CheckCircle className="w-3.5 h-3.5" /> 100% FORMULATION COMPLETE
        </span>
      );
    }
    if (ratio_validation_status === 'PARTIAL') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs rounded-full border border-amber-500/40">
          <AlertTriangle className="w-3.5 h-3.5" /> PARTIAL RATIOS ({totalPct}%)
        </span>
      );
    }
    if (ratio_validation_status === 'EXCEEDS') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 font-mono text-xs rounded-full border border-rose-500/40">
          <AlertTriangle className="w-3.5 h-3.5" /> EXCEEDS 100% ({totalPct}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 font-mono text-xs rounded-full border border-slate-700">
        <Info className="w-3.5 h-3.5" /> NO RATIOS PROVIDED
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    if (score >= 40) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-cyan-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const scoresList = multi_objective_scores ? [
    { key: 'ip_differentiation', label: 'IP Differentiation', score: multi_objective_scores.ip_differentiation, desc: 'Technological & process novelty vs. standard formulations' },
    { key: 'tk_overlap', label: 'TK Overlap Avoidance', score: multi_objective_scores.tk_overlap, desc: 'Avoidance of direct prior art in TKDL records' },
    { key: 'documentation_completeness', label: 'Documentation Completeness', score: multi_objective_scores.documentation_completeness, desc: 'Plant parts, extraction method, & ratio documentation' },
    { key: 'evidence_strength', label: 'Evidence & Technical Support', score: multi_objective_scores.evidence_strength, desc: 'Quality of comparative technical and process data' },
    { key: 'regulatory_complexity', label: 'Regulatory Risk Level', score: multi_objective_scores.regulatory_complexity, desc: 'Compliance burden across Rule 158-B & NBA BD Act' },
  ] : [];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-8 my-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-100">Formulation Intelligence</h3>
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold rounded-full">
                ANALYSIS MODULE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured botanical ratio validation & multi-objective IP intelligence
            </p>
          </div>
        </div>

        <div>{getRatioBadge()}</div>
      </div>

      {/* Composition Breakdown Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
            <span>Formulation Composition & Plant Parts</span>
            <span className="text-xs text-slate-400 font-normal">({ingredients.length} items parsed)</span>
          </h4>

          {ratios_available && (
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-slate-400">Total Composition:</span>
              <span className={`font-bold ${totalPct === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {totalPct}%
              </span>
            </div>
          )}
        </div>

        {/* Progress ratio bar if ratios available */}
        {ratios_available && (
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                totalPct === 100 ? 'bg-emerald-500' : totalPct > 100 ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, totalPct)}%` }}
            />
          </div>
        )}

        <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-medium">
          {ratio_validation_message}
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-300 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Ingredient / Botanical</th>
                <th className="p-3">Botanical Scientific Name</th>
                <th className="p-3">Plant Part</th>
                <th className="p-3">Form / Extract</th>
                <th className="p-3 text-right">Proportion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
              {ingredients.map((ing, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-semibold text-emerald-300 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{ing.common_name}</span>
                  </td>
                  <td className="p-3 text-slate-400 italic font-mono">
                    {ing.scientific_name || '—'}
                  </td>
                  <td className="p-3">
                    {ing.plant_part ? (
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-[11px] border border-slate-700 font-mono">
                        🌿 {ing.plant_part}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-mono text-[11px]">Unspecified</span>
                    )}
                  </td>
                  <td className="p-3">
                    {ing.form ? (
                      <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded text-[11px] border border-cyan-800 font-mono">
                        🔬 {ing.form}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-mono text-[11px]">Standard</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-100">
                    {ing.proportion !== null && ing.proportion !== undefined ? (
                      <span>{ing.proportion}%</span>
                    ) : (
                      <span className="text-slate-300 text-[11px]">Not stated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Differentiation Highlight */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">Technical Differentiation</span>
          <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
            technical_differentiation === 'HIGH'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {technical_differentiation}
          </span>
        </div>
        <p className="text-xs text-slate-300 font-medium">{differentiation_reason}</p>
      </div>

      {/* Multi-Objective Analysis Radar / Score Cards */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Explainable Multi-Objective Scoring (0–100)</span>
          </h4>
          <span className="text-[11px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
            NSGA-II ARCHITECTURE READY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoresList.map((item) => {
            const factors = multi_objective_scores?.factors?.[item.key];
            return (
              <div
                key={item.key}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{item.label}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getScoreColor(item.score)}`}>
                    {item.score} / 100
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(item.score)} transition-all duration-500`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">{item.desc}</p>

                {/* Factor Chips */}
                {factors && (factors.positive.length > 0 || factors.risk.length > 0) && (
                  <div className="pt-2 border-t border-slate-900 space-y-1.5">
                    {factors.positive.map((pos, pIdx) => (
                      <div key={pIdx} className="text-[10px] text-emerald-300 bg-emerald-950/70 px-2 py-1 rounded border border-emerald-800/50 flex items-start space-x-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pos}</span>
                      </div>
                    ))}
                    {factors.risk.map((risk, rIdx) => (
                      <div key={rIdx} className="text-[10px] text-amber-300 bg-amber-950/70 px-2 py-1 rounded border border-amber-800/50 flex items-start space-x-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety & Compliance Disclaimer Callout */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-start space-x-3 text-amber-200 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 font-mono text-[11px] uppercase tracking-wider block">
            MEDICAL & REGULATORY SAFETY BOUNDARY
          </span>
          <p className="leading-relaxed font-medium text-amber-200/90">{disclaimer}</p>
        </div>
      </div>
    </div>
  );
};
