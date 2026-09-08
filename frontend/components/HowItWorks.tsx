'use client';

import React from 'react';
import { FileText, Cpu, HelpCircle, Layers, Search, ShieldCheck, FileSpreadsheet, MapPin } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Multilingual Input',
    icon: <FileText className="h-5 w-5 text-emerald-400" />,
    desc: 'Input innovation details in English, Tamil, Hindi, or Tanglish.',
  },
  {
    num: '02',
    title: 'Fingerprint Extractor',
    icon: <Cpu className="h-5 w-5 text-blue-400" />,
    desc: 'Extracts herbs, scientific Latin botanical names, and process signals.',
  },
  {
    num: '03',
    title: 'Auto Classification',
    icon: <Layers className="h-5 w-5 text-purple-400" />,
    desc: 'Detects 19 official AYUSH & IP categories with confidence score.',
  },
  {
    num: '04',
    title: 'Smart Interview Agent',
    icon: <HelpCircle className="h-5 w-5 text-amber-400" />,
    desc: 'Dynamic 1-5 step priority interview to complete missing fields.',
  },
  {
    num: '05',
    title: 'Multi-Regime Decision',
    icon: <ShieldCheck className="h-5 w-5 text-teal-400" />,
    desc: 'Evaluates Patent 3(p)/3(e), TKDL, Biological Diversity 2023, & Rule 158-B.',
  },
  {
    num: '06',
    title: 'Regime-Aware RAG',
    icon: <Search className="h-5 w-5 text-cyan-400" />,
    desc: 'Retrieves grounded statutory evidence from local laws and live web.',
  },
  {
    num: '07',
    title: 'Policy Explainer',
    icon: <FileSpreadsheet className="h-5 w-5 text-indigo-400" />,
    desc: 'Translates legal jargon into simple policy cards and reasoning paths.',
  },
  {
    num: '08',
    title: 'Action Roadmap',
    icon: <MapPin className="h-5 w-5 text-rose-400" />,
    desc: 'Outputs structured next steps and compliance checklists.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="my-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-md">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
          How IP-SAKTI Sahayak Works
        </h2>
        <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed">
          8-Step AI Decision Support Pipeline designed for Ayurveda & AYUSH Innovators
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((s) => (
          <div
            key={s.num}
            className="group relative rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-emerald-500/40 hover:bg-slate-900/90"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-emerald-400">
                {s.num}
              </span>
              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800 group-hover:border-emerald-500/30">
                {s.icon}
              </div>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-200 group-hover:text-white">
              {s.title}
            </h3>

            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
