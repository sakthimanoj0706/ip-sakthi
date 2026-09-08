'use client';

import React from 'react';
import { Sparkles, ArrowUpRight, Beaker, Leaf, Shield, Cpu, Flame, Layers } from 'lucide-react';

export interface ExampleScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  ingredients: string;
  novelty: string;
  location: string;
  icon: React.ReactNode;
  tag: string;
}

export const PRESET_EXAMPLES: ExampleScenario[] = [
  {
    id: 'ex1',
    title: 'Neem & Turmeric Nano-Gel',
    category: 'Nano Formulation',
    description: 'Topical wound healing formulation using Neem and Turmeric with a nano-extraction process to improve dermal absorption.',
    ingredients: 'Neem, Turmeric',
    novelty: 'Nano-extraction process to enhance bioavailability',
    location: 'Tamil Nadu',
    icon: <Sparkles className="h-5 w-5 text-emerald-400" />,
    tag: 'Section 3(p) Process Novelty',
  },
  {
    id: 'ex2',
    title: 'Ashwagandha & Brahmi Liposomal Syrup',
    category: 'Drug Delivery System',
    description: 'Controlled-release liposomal memory booster syrup combining Ashwagandha and Brahmi sourced from Kerala.',
    ingredients: 'Ashwagandha, Brahmi',
    novelty: 'Liposomal micro-encapsulation delivery system',
    location: 'Kerala',
    icon: <Beaker className="h-5 w-5 text-blue-400" />,
    tag: 'Form 8 NBA Compliance',
  },
  {
    id: 'ex3',
    title: 'Supercritical CO2 Withanolide Extract',
    category: 'Extraction Process',
    description: 'Standardized phytopharmaceutical extract of Withania somnifera using green supercritical CO2 solventless extraction.',
    ingredients: 'Ashwagandha',
    novelty: 'Supercritical CO2 solvent-free extraction process',
    location: 'Madhya Pradesh',
    icon: <Leaf className="h-5 w-5 text-purple-400" />,
    tag: 'Phytopharmaceutical Rule 158-B',
  },
  {
    id: 'ex4',
    title: 'Ayurveda Aahara Chyawanprash Energy Bar',
    category: 'Ayurveda Aahara / Food Product',
    description: 'Nutritional food supplement bar incorporating classical Chyawanprash herbs for immunity without therapeutic claims.',
    ingredients: 'Amla, Guduchi, Pippali',
    novelty: 'Edible food format combining classical rasayana herbs',
    location: 'Uttarakhand',
    icon: <Flame className="h-5 w-5 text-amber-400" />,
    tag: 'FSSAI Food Regulation 2022',
  },
  {
    id: 'ex5',
    title: 'Traditional Siddha Nilavembu Decoction',
    category: 'Classical Ayurvedic Formulation',
    description: 'Traditional polyherbal Kudineer powder formulation prepared following classical Siddha text recipes.',
    ingredients: 'Nilavembu, Pepper, Ginger',
    novelty: 'Classical textual recipe without process modification',
    location: 'Tamil Nadu',
    icon: <Shield className="h-5 w-5 text-teal-400" />,
    tag: 'TKDL Defensive Prior Art',
  },
  {
    id: 'ex6',
    title: 'AI-Driven Prakriti Diagnostic Sensor',
    category: 'Medical Device',
    description: 'Non-invasive biometric wrist transducer and AI algorithm for digital Nadi Pariksha and Prakriti assessment.',
    ingredients: 'Hardware Sensor & AI Model',
    novelty: 'Machine learning algorithm for Ayurvedic pulse diagnosis',
    location: 'Karnataka',
    icon: <Cpu className="h-5 w-5 text-rose-400" />,
    tag: 'Software / Medical Device Patent',
  },
];

interface ExampleInnovationsProps {
  onSelectExample: (scenario: ExampleScenario) => void;
}

export const ExampleInnovations: React.FC<ExampleInnovationsProps> = ({ onSelectExample }) => {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            Preset Test Scenarios
          </h3>
          <p className="text-xs text-slate-400">Click any scenario to instantly test the pipeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_EXAMPLES.map((sc) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => onSelectExample(sc)}
            className="group text-left rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-emerald-500/50 hover:bg-slate-900/90 shadow-md backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 group-hover:border-emerald-500/30">
                  {sc.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                    {sc.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">{sc.category}</span>
                </div>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {sc.description}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
              <span className="rounded bg-emerald-950/60 px-2 py-0.5 font-mono text-emerald-300 border border-emerald-500/30">
                {sc.tag}
              </span>
              <span className="text-slate-400 font-mono">Src: {sc.location}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
