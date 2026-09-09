'use client';

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Zap, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { ComplexityAnalysisResult } from '../lib/types';
import { useTranslation } from '../context/LanguageContext';

interface ComplexityBadgeProps {
  complexity?: ComplexityAnalysisResult;
}

export const ComplexityBadge: React.FC<ComplexityBadgeProps> = ({ complexity }) => {
  const { t } = useTranslation();
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  if (!complexity) return null;

  const level = complexity.complexity || 'MODERATE';
  const score = complexity.score || 50;

  const getStyle = () => {
    switch (level) {
      case 'SIMPLE':
        return {
          bg: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />,
        };
      case 'COMPLEX':
        return {
          bg: 'bg-purple-950/60 border-purple-500/30 text-purple-300',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: <Zap className="h-4 w-4 text-purple-400" />,
        };
      case 'MODERATE':
      default:
        return {
          bg: 'bg-blue-950/60 border-blue-500/30 text-blue-300',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: <ShieldAlert className="h-4 w-4 text-blue-400" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`rounded-xl border p-3.5 shadow-sm transition-all ${style.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {style.icon}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">
                {t('complexity.rating', 'Innovation Complexity Rating:')}
              </span>
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border font-mono ${style.badgeBg}`}>
                {level} ({score}/100)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t('complexity.evaluates', 'Evaluates multi-regime legal complexity and statutory risks')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDrawer(!showDrawer)}
          className="inline-flex items-center gap-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800"
        >
          {showDrawer ? t('complexity.hideDetails', 'Hide Details') : t('complexity.viewFactors', 'View Factors')}
          {showDrawer ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {showDrawer && complexity.reasons && complexity.reasons.length > 0 && (
        <div className="mt-3 border-t border-slate-800/80 pt-3 space-y-2">
          <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            {t('complexity.factors', 'Detected Risk & Complexity Factors:')}
          </span>
          <ul className="space-y-1.5 pl-2">
            {complexity.reasons.map((reason, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
