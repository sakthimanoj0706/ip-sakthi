'use client';

import React from 'react';
import { FileText, Cpu, HelpCircle, Layers, Search, ShieldCheck, FileSpreadsheet, MapPin } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const STEPS = [
    {
      num: '01',
      title: t('pipeline.step1Title', 'Multilingual Input'),
      icon: <FileText className="h-5 w-5 text-emerald-400" />,
      desc: t('pipeline.step1Desc', 'User inputs formulation details, process innovations, or biological sources in English, Tamil, Hindi, or Tanglish.'),
    },
    {
      num: '02',
      title: t('pipeline.step2Title', 'Multilingual Processing & Entity Normalization'),
      icon: <Cpu className="h-5 w-5 text-blue-400" />,
      desc: t('pipeline.step2Desc', 'spaCy NLP & Gemini extract herbs, botanical names, processes, and locations.'),
    },
    {
      num: '03',
      title: t('pipeline.step3Title', 'Smart Interview Engine'),
      icon: <HelpCircle className="h-5 w-5 text-amber-400" />,
      desc: t('pipeline.step3Desc', 'Dynamically asks targeted follow-up questions for missing critical fields.'),
    },
    {
      num: '04',
      title: t('pipeline.step4Title', 'Innovation Fingerprint Generation'),
      icon: <Layers className="h-5 w-5 text-purple-400" />,
      desc: t('pipeline.step4Desc', 'Constructs standardized structured JSON fingerprint object.'),
    },
    {
      num: '05',
      title: t('pipeline.step5Title', 'Multi-Regime Decision Engine'),
      icon: <ShieldCheck className="h-5 w-5 text-teal-400" />,
      desc: t('pipeline.step5Desc', 'Evaluates applicability across Patent, TKDL, ABS, and Regulatory regimes.'),
    },
    {
      num: '06',
      title: t('pipeline.step6Title', 'Regime-Aware Hybrid RAG'),
      icon: <Search className="h-5 w-5 text-cyan-400" />,
      desc: t('pipeline.step6Desc', 'Retrieves statutory provisions, Section 3(p), BDA 2023, and Rule 158-B rules.'),
    },
    {
      num: '07',
      title: t('pipeline.step7Title', 'Evidence Validation'),
      icon: <FileSpreadsheet className="h-5 w-5 text-indigo-400" />,
      desc: t('pipeline.step7Desc', 'Cross-checks retrieved legal sources for statutory grounding and citations.'),
    },
    {
      num: '08',
      title: t('pipeline.step8Title', 'Personalized Action Roadmap'),
      icon: <MapPin className="h-5 w-5 text-rose-400" />,
      desc: t('pipeline.step8Desc', 'Generates actionable guidance: What We Detected → Why It Matters → What to Check Next.'),
    },
  ];

  return (
    <section className="my-10 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl text-slate-100 backdrop-blur-md">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-extrabold text-slate-100 flex items-center justify-center gap-2">
          {t('pipeline.title', 'How IP-SAKTI Sahayak Works')}
        </h2>
        <p className="mt-2 text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
          {t('pipeline.subtitle', '8-Step AI Decision Support Pipeline')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((s) => (
          <div
            key={s.num}
            className="group relative rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all hover:border-emerald-500/50 hover:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-extrabold text-emerald-400">
                {s.num}
              </span>
              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800 group-hover:border-emerald-500/30">
                {s.icon}
              </div>
            </div>

            <h3 className="mt-3 text-sm font-bold text-slate-100 group-hover:text-emerald-300">
              {s.title}
            </h3>

            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
