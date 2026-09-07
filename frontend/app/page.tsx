'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  Brain,
  Dna,
  Compass,
  BookOpen,
  Leaf,
  Scale,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Small Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>SIH 2026 Innovation Platform — PS SIH26045</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Navigate Your Ayurveda Innovation <br className="hidden sm:inline" />
          with Confidence.
        </h1>

        {/* Highlight Banner */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-sm font-bold border border-emerald-200">
          <span>Idea</span>
          <span className="text-emerald-500 font-bold">→</span>
          <span>Evidence</span>
          <span className="text-emerald-500 font-bold">→</span>
          <span>Action</span>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          IP-SAKTI Sahayak helps Ayurveda innovators explore possible intellectual property, traditional knowledge, biological resource, and regulatory pathways through AI-powered guided analysis.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-base shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Innovation Analysis</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-300 shadow-xs transition-all flex items-center justify-center"
          >
            See How It Works
          </a>
        </div>

        {/* Privacy reassurance */}
        <p className="text-xs text-slate-400 flex items-center justify-center space-x-1 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Informational decision platform for Indian Ayurveda innovators</span>
        </p>

      </section>

      {/* SECTION: How IP-SAKTI Works (4 steps horizontally) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How IP-SAKTI Works
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            4 simple steps to understand your Ayurveda innovation pathways
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* STEP 1 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                STEP 1
              </span>
              <div className="w-12 h-12 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mt-4 mb-3">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Describe Your Innovation
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Tell IP-SAKTI about your Ayurveda formulation, process, or herbal product.
              </p>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                STEP 2
              </span>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 mt-4 mb-3">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Smart Guided Analysis
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Answer only the minimum questions relevant to your specific innovation.
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                STEP 3
              </span>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mt-4 mb-3">
                <Dna className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Innovation Fingerprint
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                AI structures your innovation into key attributes and legal parameters.
              </p>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                STEP 4
              </span>
              <div className="w-12 h-12 rounded-lg bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 mt-4 mb-3">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Decision & Action Roadmap
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Explore possible legal pathways, supporting citations, and next actions.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* KNOWLEDGE AREAS SECTION */}
      <section id="knowledge-areas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Multi-Regime Intelligence Coverage
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Grounded in Indian statutes, gazettes, and official legal databases
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Patent */}
          <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Patent Regime</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore potential novelty-related pathways under Section 3(p) and Section 3(e) of The Patents Act 1970.
            </p>
          </div>

          {/* Card 2: TK */}
          <div className="bg-white rounded-xl p-6 border border-orange-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              <span>Traditional Knowledge</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Identify possible traditional knowledge overlap with TKDL prior art records and classical texts.
            </p>
          </div>

          {/* Card 3: ABS */}
          <div className="bg-white rounded-xl p-6 border border-emerald-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Biological Resources</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand when NBA Form 8 registration or SBB intimation is required under BDA 2023.
            </p>
          </div>

          {/* Card 4: Regulatory */}
          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span>Regulatory Classification</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore product classification considerations under Drugs & Cosmetics Rules or FSSAI.
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
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-md transition-all space-x-2"
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
