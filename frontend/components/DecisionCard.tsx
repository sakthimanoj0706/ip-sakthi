'use client';

import React, { useState } from 'react';
import { ShieldAlert, Lightbulb, BookOpen, Leaf, Scale, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { DecisionResultItem, InnovationFingerprint } from '../lib/types';
import { WhyThisDecisionModal } from './WhyThisDecisionModal';

interface DecisionCardProps {
  item: DecisionResultItem;
  fingerprint?: InnovationFingerprint;
  onExploreEvidence?: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ item, fingerprint, onExploreEvidence }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const getColorStyles = (color: string) => {
    switch (color) {
      case 'yellow':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <Lightbulb className="w-5 h-5 text-amber-400" />,
        };
      case 'orange':
        return {
          border: 'border-orange-500/40',
          bg: 'bg-orange-950/20',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          icon: <BookOpen className="w-5 h-5 text-orange-400" />,
        };
      case 'blue':
        return {
          border: 'border-blue-500/40',
          bg: 'bg-blue-950/20',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: <Scale className="w-5 h-5 text-blue-400" />,
        };
      case 'green':
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/20',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <Leaf className="w-5 h-5 text-emerald-400" />,
        };
      default:
        return {
          border: 'border-slate-800',
          bg: 'bg-slate-900/60',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: <ShieldAlert className="w-5 h-5 text-slate-400" />,
        };
    }
  };

  const style = getColorStyles(item.color);

  const defaultFp: InnovationFingerprint = fingerprint || {
    innovation_name: 'Ayurvedic Innovation',
    description: 'Ayurvedic formulation using classical herbs',
    ingredients: ['Neem', 'Turmeric'],
    novelty: { novelty_detected: true, novelty_type: ['extraction_method'], description: 'Nano extraction process' },
    biological_resources: { biological_resource_used: true, resources: ['Neem', 'Turmeric'], source_known: true },
  };

  return (
    <>
      <div className={`rounded-xl border ${style.border} ${style.bg} p-6 shadow-lg flex flex-col justify-between transition-all hover:border-emerald-500/50 bg-slate-900/90 text-slate-100`}>
        <div>
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                {style.icon}
              </div>
              <h3 className="font-extrabold text-base text-slate-100 tracking-tight">
                {item.name}
              </h3>
            </div>

            <span className={`text-[11px] font-extrabold tracking-wider px-2.5 py-1 rounded-full border font-mono ${style.badge}`}>
              {item.status.replace('_', ' ')}
            </span>
          </div>

          {/* Reason explanation */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            {item.reason}
          </p>

          {/* Triggered By Tags */}
          {item.triggered_by && item.triggered_by.length > 0 && (
            <div className="mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
                TRIGGERED BY FACTOR SIGNALS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.triggered_by.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[11px] font-mono bg-slate-950 text-emerald-300 px-2 py-0.5 rounded border border-slate-800"
                  >
                    <Tag className="w-3 h-3 text-slate-500 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800/80 mt-2 space-y-2">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why did IP-SAKTI say this?</span>
          </button>

          <button
            type="button"
            onClick={onExploreEvidence}
            className="w-full text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span>Explore Supporting Evidence</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      <WhyThisDecisionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        regime={item.name}
        fingerprint={defaultFp}
        decisionStatus={item.status}
      />
    </>
  );
};
