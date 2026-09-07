'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Sparkles, Lightbulb } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';

export const InnovationInput: React.FC = () => {
  const router = useRouter();
  const { setInnovationInput, startInterview } = useAnalysis();

  const [name, setName] = useState<string>('Ayurvedic Wound Healing Formulation');
  const [description, setDescription] = useState<string>(
    'I developed an Ayurvedic wound healing formulation using Neem and Turmeric. The ingredients are traditionally known, but I use a new nano-extraction process to improve skin absorption. The biological materials are sourced from Tamil Nadu.'
  );
  const [area, setArea] = useState<string>('Formulation');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full border border-emerald-200 mb-3">
          STEP 1 OF 5
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tell Us About Your Innovation
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Start with a simple description. IP-SAKTI will guide you through the rest.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Innovation Name */}
          <div>
            <label htmlFor="innovation-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Innovation Name <span className="text-amber-600">*</span>
            </label>
            <input
              id="innovation-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Herbal Wound Healing Formulation"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="innovation-description" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Describe Your Innovation <span className="text-amber-600">*</span>
            </label>
            <textarea
              id="innovation-description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your ingredients, process, intended use, and anything you believe is new about your innovation."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors leading-relaxed"
            />
          </div>

          {/* Optional Innovation Area Select */}
          <div>
            <label htmlFor="innovation-area" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Select Innovation Category (Optional)
            </label>
            <select
              id="innovation-area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors bg-white"
            >
              <option value="Formulation">Formulation (Classical or Proprietary)</option>
              <option value="Process">Extraction / Manufacturing Process</option>
              <option value="Herbal Product">Herbal Product / Nutraceutical</option>
              <option value="Cosmetic">Ayurveda Cosmetic</option>
              <option value="Phytopharmaceutical">Phytopharmaceutical Fraction</option>
              <option value="Other">Other / Research Innovation</option>
            </select>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Your information is used only for this analysis session and is not stored or shared.</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !description.trim()}
            className="w-full py-3 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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
