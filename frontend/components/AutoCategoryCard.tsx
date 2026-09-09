'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Edit3, Cpu, ShieldCheck } from 'lucide-react';
import { CategoryDetectionResult } from '../lib/types';
import { detectCategory } from '../lib/api';
import { useTranslation } from '../context/LanguageContext';

interface AutoCategoryCardProps {
  innovationName: string;
  description: string;
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
}

const ALL_CATEGORIES = [
  'Ayurvedic Formulation',
  'Classical Ayurvedic Formulation',
  'Proprietary ASU Medicine',
  'Herbal Product',
  'Extraction Process',
  'Manufacturing Process',
  'Drug Delivery System',
  'Nano Formulation',
  'Cosmetic Product',
  'Ayurveda Aahara / Food Product',
  'Nutraceutical',
  'Medical Device',
  'Diagnostic Innovation',
  'Biological Resource Innovation',
  'Agricultural / Herbal Cultivation Innovation',
  'Traditional Knowledge Based Innovation',
  'Software / AI Innovation',
  'Research Process',
  'Other',
];

export const AutoCategoryCard: React.FC<AutoCategoryCardProps> = ({
  innovationName,
  description,
  selectedCategory,
  onSelectCategory,
}) => {
  const { t, language } = useTranslation();
  const [detection, setDetection] = useState<CategoryDetectionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<string | null>(selectedCategory || null);

  useEffect(() => {
    if (description && description.trim().length > 10) {
      let isMounted = true;
      setLoading(true);
      detectCategory({ innovation_name: innovationName, description, ui_language: language })
        .then((res) => {
          if (isMounted) {
            setDetection(res);
            if (!userChoice) {
              onSelectCategory(res.primary_category);
            }
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [description, innovationName, language]);

  const handleConfirm = () => {
    if (detection) {
      setUserChoice(detection.primary_category);
      onSelectCategory(detection.primary_category);
      setIsEditing(false);
    }
  };

  const handleSelectCustom = (cat: string) => {
    setUserChoice(cat);
    onSelectCategory(cat);
    setIsEditing(false);
  };

  const handleLetAiDecide = () => {
    if (detection) {
      setUserChoice(detection.primary_category);
      onSelectCategory(detection.primary_category);
      setIsEditing(false);
    }
  };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-slate-950 p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 flex items-center gap-2 text-sm">
              {t('category.title', 'AI Innovation Classification')}
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300 font-mono border border-emerald-500/30">
                {t('category.count', '19 Categories')}
              </span>
            </h4>
            <p className="text-xs text-slate-400">{t('category.subtitle', 'Automatic multi-layer category detection')}</p>
          </div>
        </div>

        {detection && (
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/40 px-2.5 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              {Math.round(detection.confidence * 100)}% {t('category.confidence', 'Confidence')}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="mt-4 flex items-center justify-center py-4 text-xs text-emerald-400">
          <Cpu className="mr-2 h-4 w-4 animate-spin" />
          {t('category.analyzing', 'Analyzing signals & text patterns...')}
        </div>
      ) : detection ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-slate-900/60 p-3.5 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {t('category.detectedCategory', 'Detected Category:')}
                </span>
                <div className="text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-2">
                  {userChoice || detection.primary_category}
                  {detection.secondary_category && (
                    <span className="text-xs text-slate-400 font-normal">
                      ({t('category.secondary', 'Secondary:')} {detection.secondary_category})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t('category.confirm', 'Confirm Category')}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      {t('category.change', 'Change')}
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-300 border-t border-slate-800/80 pt-2 leading-relaxed">
              <strong className="text-emerald-400">{t('category.aiRationale', 'AI Rationale:')} </strong>
              {detection.reason}
            </p>

            {detection.detected_signals.length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-mono">{t('category.signals', 'Signals:')}</span>
                {detection.detected_signals.map((sig, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-emerald-300 border border-slate-700/60"
                  >
                    #{sig}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="rounded-lg bg-slate-900/90 p-4 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  {t('category.selectCustom', 'Select Custom Category Override:')}
                </label>
                <button
                  type="button"
                  onClick={handleLetAiDecide}
                  className="text-xs text-emerald-400 hover:underline font-mono"
                >
                  {t('category.letAiDecide', '[ Let AI Decide ]')}
                </button>
              </div>

              <select
                value={userChoice || ''}
                onChange={(e) => handleSelectCustom(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
