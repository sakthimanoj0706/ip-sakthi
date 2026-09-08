'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  BookOpen,
  Leaf,
  Scale,
  Sparkles,
  Brain,
  Scale as ScaleIcon,
  Globe,
} from 'lucide-react';
import { HowItWorks } from '../components/HowItWorks';
import { InteractiveTour } from '../components/InteractiveTour';
import { useTranslation } from '../context/LanguageContext';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-16 py-8 sm:py-12 text-slate-900">
      <InteractiveTour />

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* SIH Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900 text-slate-100 rounded-full text-xs font-bold shadow-md border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('hero.sihBadge', 'SIH 2026 Innovation Platform — PS SIH26045')}</span>
        </div>

        {/* High-Contrast Presentation-Ready Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {t('hero.title', 'Navigate Your Ayurveda Innovation with AI Confidence.')}
        </h1>

        {/* High-Contrast Visual Pipeline Badge */}
        <div className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-emerald-400 rounded-xl text-xs sm:text-sm font-extrabold border border-emerald-500/40 shadow-md font-mono tracking-wide">
          <span>{t('hero.pipeline', 'IDEA → FINGERPRINT → 4-REGIME RAG → ACTION ROADMAP')}</span>
        </div>

        {/* High-Contrast Description Text */}
        <p className="text-base sm:text-lg text-slate-700 font-medium max-w-3xl mx-auto leading-relaxed">
          {t(
            'hero.description',
            'IP-SAKTI Sahayak helps Ayurveda & AYUSH innovators explore Intellectual Property, Traditional Knowledge Digital Library (TKDL), Biological Diversity Act 2023, and Regulatory Licensing pathways through AI decision support.'
          )}
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg hover:shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
          >
            <span>{t('hero.startBtn', 'Start Innovation Analysis')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-md transition-all flex items-center justify-center"
          >
            {t('hero.howItWorksBtn', 'See How It Works')}
          </a>
        </div>

        {/* Privacy & Presentation Reassurance */}
        <p className="text-xs text-slate-600 font-semibold flex items-center justify-center space-x-1.5 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('hero.reassurance', 'Informational AI decision-support platform for Indian Ayurveda innovators')}</span>
        </p>
      </section>

      {/* 3 HOMEPAGE FEATURE CARDS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 text-xl font-bold">
              🧠
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {t('cards.card1Title', 'AI Innovation Analysis')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t('cards.card1Desc', 'Understand the novelty and characteristics of your Ayurveda innovation.')}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 text-xl font-bold">
              ⚖️
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {t('cards.card2Title', 'Explainable Decisions')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t('cards.card2Desc', 'Understand why IP-SAKTI gives every recommendation.')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20 text-xl font-bold">
              🌐
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {t('cards.card3Title', 'Multilingual Intelligence')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t('cards.card3Desc', 'Interact with the platform in English, Tamil and Hindi.')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: 8-Step Visual Pipeline */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowItWorks />
      </section>

      {/* KNOWLEDGE AREAS SECTION */}
      <section id="knowledge-areas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('knowledge.title', 'Multi-Regime Intelligence Coverage')}
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-1">
            {t('knowledge.subtitle', 'Grounded in Indian statutes, gazette notifications, and official legal databases')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Patent */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-amber-500/40 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 flex items-center justify-center text-amber-400 border border-amber-500/30">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>{t('knowledge.patentTitle', 'Patent Regime')}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {t(
                'knowledge.patentDesc',
                'Explore novelty pathways under Section 3(p) TK exclusions and Section 3(e) synergistic efficacy tests.'
              )}
            </p>
          </div>

          {/* Card 2: TK */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-orange-500/40 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-950 flex items-center justify-center text-orange-400 border border-orange-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
              <span>{t('knowledge.tkTitle', 'Traditional Knowledge')}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {t(
                'knowledge.tkDesc',
                'Identify traditional knowledge overlap with TKDL prior art records and codified classical Ayurvedic texts.'
              )}
            </p>
          </div>

          {/* Card 3: ABS */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>{t('knowledge.absTitle', 'Biological Resources')}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {t(
                'knowledge.absDesc',
                'Determine NBA Form 8 registration and SBB intimation requirements under the Biological Diversity (Amendment) Act 2023.'
              )}
            </p>
          </div>

          {/* Card 4: Regulatory */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-blue-500/40 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
              <span>{t('knowledge.regulatoryTitle', 'Regulatory Licensing')}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {t(
                'knowledge.regulatoryDesc',
                'Assign exact regulatory track: Proprietary ASU Drug (Rule 158-B), Classical ASU Drug (Form 25D), or FSSAI Food.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center border border-slate-800 shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('cta.title', 'Ready to Understand Your Innovation Journey?')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto">
            {t('cta.subtitle', 'Get structured, evidence-grounded insights into your Ayurveda innovation in minutes.')}
          </p>

          <div>
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg transition-all space-x-2"
            >
              <span>{t('button.start', 'Start Innovation Analysis')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
