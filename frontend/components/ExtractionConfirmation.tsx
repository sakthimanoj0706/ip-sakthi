'use client';

import React, { useState } from 'react';
import { CheckCircle2, Edit3, Sparkles, Dna, Leaf, MapPin, Microscope, Target } from 'lucide-react';
import { InnovationFingerprint } from '../lib/types';
import { useTranslation } from '../context/LanguageContext';

interface ExtractionConfirmationProps {
  fingerprint: InnovationFingerprint;
  onConfirm: () => void;
  onEdit: () => void;
}

export const ExtractionConfirmation: React.FC<ExtractionConfirmationProps> = ({
  fingerprint,
  onConfirm,
  onEdit,
}) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md max-w-2xl mx-auto my-6 text-slate-100">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 uppercase tracking-wider text-slate-100 font-mono">
            WE UNDERSTOOD YOUR INNOVATION AS:
          </h3>
          <p className="text-xs text-slate-400">
            Confirm AI extracted parameters before running 4-regime legal analysis.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
            Innovation Title:
          </span>
          <h4 className="text-base font-bold text-slate-100">{fingerprint.innovation_name}</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
              <Leaf className="h-3.5 w-3.5" /> Ingredients Detected:
            </span>
            <p className="text-xs text-slate-200 font-medium">
              {fingerprint.ingredients?.join(', ') || 'Ayurvedic Herbs'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold flex items-center gap-1">
              <Microscope className="h-3.5 w-3.5" /> Claimed Novelty:
            </span>
            <p className="text-xs text-slate-200 font-medium">
              {fingerprint.novelty?.description || 'Process Novelty'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Source Location:
            </span>
            <p className="text-xs text-slate-200 font-medium">
              {fingerprint.biological_resources?.source_location || 'India'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
              <Target className="h-3.5 w-3.5" /> Intended Use:
            </span>
            <p className="text-xs text-slate-200 font-medium">
              {fingerprint.intended_use || 'Therapeutic Use'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <Edit3 className="h-4 w-4" />
          {t('edit_information', 'Edit Information')}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4" />
          {t('looks_correct', 'Looks Correct')}
        </button>
      </div>
    </div>
  );
};
