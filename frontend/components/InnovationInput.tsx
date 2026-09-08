'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Sparkles, Lightbulb } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import { AutoCategoryCard } from './AutoCategoryCard';
import { ComplexityBadge } from './ComplexityBadge';
import { ExampleInnovations, ExampleScenario } from './ExampleInnovations';
import { analyzeComplexity } from '../lib/api';
import { ComplexityAnalysisResult } from '../lib/types';

export const InnovationInput: React.FC = () => {
  const router = useRouter();
  const { setInnovationInput, startInterview } = useAnalysis();

  const [name, setName] = useState<string>('Ayurvedic Wound Healing Formulation');
  const [description, setDescription] = useState<string>(
    'I developed an Ayurvedic wound healing formulation using Neem and Turmeric. The ingredients are traditionally known, but I use a new nano-extraction process to improve skin absorption. The biological materials are sourced from Tamil Nadu.'
  );
  const [area, setArea] = useState<string>('Ayurvedic Formulation');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [complexity, setComplexity] = useState<ComplexityAnalysisResult | undefined>();

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
        <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-full border border-emerald-500/30 mb-3 font-mono">
          STEP 1 OF 5 — INNOVATION ENTRY
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Tell Us About Your Ayurveda Innovation
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Describe your formulation, herbs, and novel process in English, Tamil, Hindi, or Tanglish.
        </p>
      </div>

      {/* Preset Example Trigger Cards */}
      <ExampleInnovations onSelectExample={handleSelectExample} />

      {/* Main Form Card */}
      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 text-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Innovation Name */}
          <div>
            <label htmlFor="innovation-name" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Innovation Name / Title <span className="text-amber-400">*</span>
            </label>
            <input
              id="innovation-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Neem & Turmeric Topical Ointment"
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="innovation-description" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Innovation Description <span className="text-amber-400">*</span>
            </label>
            <textarea
              id="innovation-description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your formulation, herbs used, extraction process, geographical source in India, and intended therapeutic use."
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors leading-relaxed"
            />
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
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero Data Storage: Your details remain private for this analysis session under SIH 2026 guidelines.</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !description.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Initializing Guided Analysis...</span>
            ) : (
              <>
                <span>Continue to Guided Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
