'use client';

import React, { useState } from 'react';
import { Lightbulb, BookOpen, Leaf, Scale, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

interface PolicyTopic {
  id: string;
  name: string;
  score: number;
  icon: React.ReactNode;
  whatIsIt: string;
  whenApplies: string[];
  whenNotApplies: string[];
  howAffectsYou: string;
  whatShouldDo: string[];
  relevantSections: string[];
}

const REGIME_TOPICS: PolicyTopic[] = [
  {
    id: 'patent',
    name: 'Patent Regime',
    score: 78,
    icon: <Lightbulb className="h-5 w-5 text-amber-400" />,
    whatIsIt: 'A patent grants exclusive statutory rights for a new technical invention or novel process.',
    whenApplies: [
      'Genuine process novelty (e.g. nano-extraction, cold-press stabilization)',
      'New dosage or drug delivery system',
      'Demonstrated non-obvious synergistic efficacy (Section 3(e) test)',
    ],
    whenNotApplies: [
      'Pure classical Ayurvedic recipes without process modification',
      'Mere admixture of known herbs without synergistic effect',
      'Already codified traditional knowledge cited in classical texts',
    ],
    howAffectsYou: 'Your claimed nano-extraction process may overcome Section 3(p) prior art bars if technical synergy is proven.',
    whatShouldDo: [
      'Document the exact extraction parameters and temperature stability.',
      'Conduct comparative bio-availability and synergy studies against standard classical recipes.',
      'Perform a prior art search on the Indian Patent Office (IPO) database.',
    ],
    relevantSections: ['The Patents Act, 1970 — Section 3(p)', 'Section 3(e) Synergistic Admixture Rules'],
  },
  {
    id: 'tk',
    name: 'Traditional Knowledge (TKDL)',
    score: 92,
    icon: <BookOpen className="h-5 w-5 text-orange-400" />,
    whatIsIt: 'Traditional Knowledge Digital Library (TKDL) is India’s defensive database used globally to prevent unoriginal patents on classical Ayurveda.',
    whenApplies: [
      'Formulations containing classical herbs indexed in Charaka/Sushruta Samhita',
      'Traditional Ayurvedic therapeutic indications',
    ],
    whenNotApplies: [
      'Synthetic molecules or non-herbal medical hardware devices',
      'Completely non-traditional plant species introduced from foreign regions',
    ],
    howAffectsYou: 'Neem and Turmeric are indexed in TKDL records for wound healing, requiring clear process differentiation.',
    whatShouldDo: [
      'Search public TKDL metadata catalog for exact ingredient combinations.',
      'Highlight non-codified technological process improvements.',
    ],
    relevantSections: ['TKDL Defensive Prior Art Framework', 'Classical Ayurvedic Samhitas'],
  },
  {
    id: 'abs',
    name: 'Biological Resources (BDA 2023)',
    score: 71,
    icon: <Leaf className="h-5 w-5 text-emerald-400" />,
    whatIsIt: 'Govern access and benefit sharing (ABS) for Indian medicinal biological resources under National Biodiversity Authority (NBA) rules.',
    whenApplies: [
      'Commercial utilization of Indian biological raw materials (herbs, plants)',
      'Filing Indian patent applications by domestic or foreign entities',
    ],
    whenNotApplies: [
      'Cultivated medicinal plants accompanied by a BMC Certificate of Origin (SBB intimation exemption under Section 7)',
    ],
    howAffectsYou: 'Biological resources sourced from Tamil Nadu require mandatory Form 8 NBA registration prior to patent grant.',
    whatShouldDo: [
      'Verify whether biological raw materials are certified-cultivated or wild-harvested.',
      'Obtain BMC Certificate of Origin if raw materials are farm-cultivated.',
      'Complete Form 8 registration on the NBA portal before patent grant.',
    ],
    relevantSections: ['Biological Diversity (Amendment) Act, 2023 — Section 7 & Form 8'],
  },
  {
    id: 'regulatory',
    name: 'Regulatory Licensing',
    score: 80,
    icon: <Scale className="h-5 w-5 text-blue-400" />,
    whatIsIt: 'Governs commercial manufacturing and sale under AYUSH drug rules (Form 25D / Rule 158-B) or FSSAI food regulations.',
    whenApplies: [
      'Proprietary ASU medicines (Rule 158-B) requiring pilot observational safety studies',
      'Classical ASU drugs (Form 25D)',
      'Ayurveda Aahara food products (FSSAI 2022)',
    ],
    whenNotApplies: [
      'Non-commercial laboratory research prototypes',
    ],
    howAffectsYou: 'Your wound healing formulation requires licensing under Rule 158-B for proprietary ASU medicines or FSSAI food rules.',
    whatShouldDo: [
      'Select regulatory track: Proprietary ASU Drug or FSSAI Ayurveda Aahara.',
      'Apply for manufacturing license with State AYUSH Licensing Authority.',
    ],
    relevantSections: ['Drugs and Cosmetics Act, 1940 — Rule 158-B', 'FSSAI Ayurveda Aahara Regulations, 2022'],
  },
];

export const LegalRegimeExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('patent');

  const selected = REGIME_TOPICS.find((t) => t.id === activeTab) || REGIME_TOPICS[0];

  const getScoreBar = (score: number) => {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl text-slate-100 backdrop-blur-md my-8">
      <div className="border-b border-slate-800 pb-4 mb-6">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          Legal Regime Explorer
          <span className="rounded-full bg-emerald-950 px-2.5 py-0.5 text-xs text-emerald-300 border border-emerald-500/30 font-mono">
            Indicative AI Assessment
          </span>
        </h3>
        <p className="text-xs text-slate-400">Detailed legal regime applicability and action guidelines</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-3 scrollbar-none mb-6">
        {REGIME_TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => setActiveTab(topic.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === topic.id
                ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {topic.icon}
            <span>{topic.name}</span>
            <span className="font-mono text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">
              {topic.score}%
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Pane */}
      <div className="space-y-5">
        {/* Applicability Score Banner */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono">
          <div>
            <span className="text-[11px] text-slate-400 uppercase">Applicability Score:</span>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              {getScoreBar(selected.score)} {selected.score}%
            </div>
          </div>
          <span className="text-xs text-slate-300">
            Regime Status: <strong className="text-amber-400">APPLICABLE</strong>
          </span>
        </div>

        {/* 1. What is it */}
        <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
          <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono mb-1">
            1. What is this policy?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{selected.whatIsIt}</p>
        </div>

        {/* 2. When does it apply / not apply */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono mb-2 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> When does it apply?
            </h4>
            <ul className="space-y-1.5 pl-2">
              {selected.whenApplies.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-rose-400 uppercase font-mono mb-2 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> When does it NOT apply?
            </h4>
            <ul className="space-y-1.5 pl-2">
              {selected.whenNotApplies.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. How affects you */}
        <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
          <h4 className="text-xs font-bold text-amber-400 uppercase font-mono mb-1">
            3. How does it affect your innovation?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{selected.howAffectsYou}</p>
        </div>

        {/* 4. Action steps */}
        <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
          <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono mb-2">
            4. What should you do next?
          </h4>
          <ul className="space-y-1.5 pl-2">
            {selected.whatShouldDo.map((step, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
