'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Mic, Globe } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import { AutoCategoryCard } from './AutoCategoryCard';
import { ComplexityBadge } from './ComplexityBadge';
import { ExampleInnovations, ExampleScenario } from './ExampleInnovations';
import { analyzeComplexity } from '../lib/api';
import { ComplexityAnalysisResult } from '../lib/types';
import { useTranslation } from '../context/LanguageContext';

export const InnovationInput: React.FC = () => {
  const router = useRouter();
  const { setInnovationInput, startInterview } = useAnalysis();
  const { t, language } = useTranslation();

  const [name, setName] = useState<string>('Ayurvedic Wound Healing Formulation');
  const [description, setDescription] = useState<string>(
    'I developed an Ayurvedic wound healing formulation using Neem and Turmeric. The ingredients are traditionally known, but I use a new nano-extraction process to improve skin absorption. The biological materials are sourced from Tamil Nadu.'
  );
  const [area, setArea] = useState<string>('Ayurvedic Formulation');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [complexity, setComplexity] = useState<ComplexityAnalysisResult | undefined>();
  const [voiceNotice, setVoiceNotice] = useState<boolean>(false);

  // Simple language detection heuristic for input indicator
  const detectedInputLanguage = useMemo(() => {
    let rawLang = 'English';
    if (description) {
      if (/[\u0B80-\u0BFF]/.test(description)) rawLang = 'Tamil';
      else if (/[\u0900-\u097F]/.test(description)) rawLang = 'Hindi';
    }
    if (language === 'ta') {
      if (rawLang === 'Tamil') return 'தமிழ்';
      if (rawLang === 'Hindi') return 'இந்தி';
      return 'ஆங்கிலம்';
    }
    if (language === 'hi') {
      if (rawLang === 'Tamil') return 'तमिल';
      if (rawLang === 'Hindi') return 'हिंदी';
      return 'अंग्रेज़ी';
    }
    return rawLang;
  }, [description, language]);

  const handleSelectExample = (scenario: ExampleScenario) => {
    setName(scenario.title);
    setDescription(scenario.description);
    setArea(scenario.category);
    analyzeComplexity({
      innovation_name: scenario.title,
      description: scenario.description,
      ingredients: scenario.ingredients,
      novelty_description: scenario.novelty,
      biological_resource_used: true,
      source_location: scenario.location,
      ui_language: language,
    }).then((res) => setComplexity(res));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setInnovationInput(name, description, area);
    await startInterview();
    setIsSubmitting(false);
    router.push('/interview');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="text-center mb-4">
        <span className="inline-block px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-500/40 mb-3 font-mono">
          STEP 1 OF 5 — INNOVATION ENTRY
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          {t('input.title', 'Tell Us About Your Innovation')}
        </h1>
        <p className="mt-2 text-sm text-slate-300 font-medium">
          Describe your formulation, herbs, and novel process in English, Tamil, Hindi, or Tanglish.
        </p>
      </div>

      {/* Preset Example Trigger Cards */}
      <ExampleInnovations onSelectExample={handleSelectExample} />

      {/* Main Form Card */}
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-6 sm:p-8 text-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Innovation Name */}
          <div>
            <label htmlFor="innovation-name" className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-1.5 font-mono">
              {t('input.nameLabel', 'Innovation Title')} <span className="text-amber-400">*</span>
            </label>
            <input
              id="innovation-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('input.namePlaceholder', 'e.g. Ayurvedic Nano-Curcumin Wound Gel')}
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>

          {/* Description Textarea with Voice Prep & Language Indicator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="innovation-description" className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 font-mono">
                {t('input.descLabel', 'Innovation Description')} <span className="text-amber-400">*</span>
              </label>

              {/* Detected Language Indicator */}
              <span className="text-[11px] font-mono text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>{t('input.detectedLang', 'Detected:')} {detectedInputLanguage}</span>
              </span>
            </div>

            <div className="relative">
              <textarea
                id="innovation-description"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('input.descPlaceholder', 'Describe ingredients (e.g. Neem, Turmeric), biological sources (e.g. Tamil Nadu), extraction process, and intended use...')}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors leading-relaxed"
              />

              {/* Voice Feature Microphone Icon Prep */}
              <button
                type="button"
                onClick={() => setVoiceNotice(true)}
                className="absolute right-3 bottom-3 p-1.5 text-slate-400 hover:text-emerald-400 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
                title={t('input.micTooltip', 'Voice Input (Coming Soon)')}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {voiceNotice && (
              <p className="mt-1 text-[11px] text-amber-400 font-mono flex items-center gap-1">
                🎙️ Voice Input architecture enabled. Voice-to-Text streaming coming soon in next version update.
              </p>
            )}
          </div>

          {/* Auto Category Detector Card */}
          {description.trim().length > 10 && (
            <AutoCategoryCard
              innovationName={name}
              description={description}
              selectedCategory={area}
              onSelectCategory={(cat) => setArea(cat)}
            />
          )}

          {/* Complexity Badge */}
          {complexity && <ComplexityBadge complexity={complexity} />}

          {/* Privacy Note */}
          <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero Data Storage: Your details remain private for this session under SIH 2026 guidelines.</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !description.trim()}
            className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>{t('interview.processing', 'IP-SAKTI is analyzing your innovation...')}</span>
            ) : (
              <>
                <span>{t('button.start', 'Start Innovation Analysis')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
