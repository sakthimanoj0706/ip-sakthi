'use client';

import React from 'react';
import { ShieldAlert, Lightbulb, BookOpen, Leaf, Scale, ArrowRight, Tag } from 'lucide-react';
import { DecisionResultItem } from '../lib/types';

interface DecisionCardProps {
  item: DecisionResultItem;
  onExploreEvidence?: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ item, onExploreEvidence }) => {
  // Determine color styling based on regime and status
  const getColorStyles = (color: string) => {
    switch (color) {
      case 'yellow':
        return {
          border: 'border-amber-300',
          bg: 'bg-amber-50/50',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <Lightbulb className="w-5 h-5 text-amber-600" />,
        };
      case 'orange':
        return {
          border: 'border-orange-300',
          bg: 'bg-orange-50/50',
          badge: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: <BookOpen className="w-5 h-5 text-orange-600" />,
        };
      case 'blue':
        return {
          border: 'border-blue-300',
          bg: 'bg-blue-50/50',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <Scale className="w-5 h-5 text-blue-600" />,
        };
      case 'green':
        return {
          border: 'border-emerald-300',
          bg: 'bg-emerald-50/50',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <Leaf className="w-5 h-5 text-emerald-600" />,
        };
      default:
        return {
          border: 'border-slate-300',
          bg: 'bg-slate-50/50',
          badge: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: <ShieldAlert className="w-5 h-5 text-slate-600" />,
        };
    }
  };

  const style = getColorStyles(item.color);

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md bg-white`}>
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
              {style.icon}
            </div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              {item.name}
            </h3>
          </div>

          <span className={`text-[11px] font-extrabold tracking-wider px-2.5 py-1 rounded-full border ${style.badge}`}>
            {item.status.replace('_', ' ')}
          </span>
        </div>

        {/* Reason explanation */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
          {item.reason}
        </p>

        {/* Triggered By Tags */}
        {item.triggered_by && item.triggered_by.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              TRIGGERED BY:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.triggered_by.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[11px] font-medium bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                >
                  <Tag className="w-3 h-3 text-slate-400 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explore Evidence Button */}
      <div className="pt-4 border-t border-slate-100 mt-2">
        <button
          onClick={onExploreEvidence}
          className="w-full text-xs font-bold text-slate-800 hover:text-slate-950 flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <span>Explore Supporting Evidence</span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
