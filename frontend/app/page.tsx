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
} from 'lucide-react';
import { HowItWorks } from '../components/HowItWorks';
import { InteractiveTour } from '../components/InteractiveTour';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8 sm:py-12 text-slate-100">
      <InteractiveTour />

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* Small Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-slate-900 text-white rounded-full text-xs font-semibold shadow-md border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>SIH 2026 Innovation Platform — PS SIH26045</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Navigate Your Ayurveda Innovation <br className="hidden sm:inline" />
          with AI Confidence.
        </h1>

        {/* Highlight Banner */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-950/80 text-emerald-300 rounded-lg text-sm font-bold border border-emerald-500/30 font-mono">
          <span>IDEA</span>
          <span className="text-emerald-400 font-bold">→</span>
          <span>FINGERPRINT</span>
          <span className="text-emerald-400 font-bold">→</span>
          <span>4-REGIME RAG</span>
          <span className="text-emerald-400 font-bold">→</span>
          <span>ACTION ROADMAP</span>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          IP-SAKTI Sahayak helps Ayurveda & AYUSH innovators explore Intellectual Property, Traditional Knowledge Digital Library (TKDL), Biological Diversity Act 2023, and Regulatory Licensing pathways through AI decision support.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Innovation Analysis</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 shadow-sm transition-all flex items-center justify-center"
          >
            See How It Works
          </a>
        </div>

        {/* Privacy reassurance */}
        <p className="text-xs text-slate-400 flex items-center justify-center space-x-1 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Informational AI decision-support platform for Indian Ayurveda innovators</span>
        </p>
      </section>

      {/* SECTION: 8-Step Visual Pipeline */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowItWorks />
      </section>

      {/* KNOWLEDGE AREAS SECTION */}
      <section id="knowledge-areas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Multi-Regime Intelligence Coverage
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Grounded in Indian statutes, gazette notifications, and official legal databases
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Patent */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-amber-500/30 shadow-md hover:border-amber-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 flex items-center justify-center text-amber-400 mb-4 border border-amber-500/30">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100 mb-1 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>Patent Regime</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore novelty pathways under Section 3(p) TK exclusions and Section 3(e) synergistic efficacy tests.
            </p>
          </div>

          {/* Card 2: TK */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-orange-500/30 shadow-md hover:border-orange-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-950/80 flex items-center justify-center text-orange-400 mb-4 border border-orange-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100 mb-1 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
              <span>Traditional Knowledge</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify traditional knowledge overlap with TKDL prior art records and codified classical Ayurvedic texts.
            </p>
          </div>

          {/* Card 3: ABS */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-emerald-500/30 shadow-md hover:border-emerald-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100 mb-1 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>Biological Resources</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Determine NBA Form 8 registration and SBB intimation requirements under the Biological Diversity (Amendment) Act 2023.
            </p>
          </div>

          {/* Card 4: Regulatory */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-blue-500/30 shadow-md hover:border-blue-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100 mb-1 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
              <span>Regulatory Licensing</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assign exact regulatory track: Proprietary ASU Drug (Rule 158-B), Classical ASU Drug (Form 25D), or FSSAI Food.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Understand Your Innovation Journey?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Get structured, evidence-grounded insights into your Ayurveda innovation in minutes.
          </p>

          <div>
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg transition-all space-x-2"
            >
              <span>Start Innovation Analysis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
