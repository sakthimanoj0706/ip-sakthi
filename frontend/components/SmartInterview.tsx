'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowLeft, ArrowRight, Sparkles, FlaskConical, Microscope, Pill, Settings, HelpCircle } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';

interface OptionCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const NOVELTY_OPTION_CARDS: OptionCard[] = [
  {
    id: 'extraction_method',
    icon: <Microscope className="w-6 h-6 text-emerald-600" />,
    title: 'New Extraction Method',
    desc: 'A different extraction, nano-processing, or purification technique.',
  },
  {
    id: 'formulation',
    icon: <FlaskConical className="w-6 h-6 text-indigo-600" />,
    title: 'New Formulation',
    desc: 'A novel combination or altered ratio of classical ingredients.',
  },
  {
    id: 'application',
    icon: <Pill className="w-6 h-6 text-amber-600" />,
    title: 'New Application',
    desc: 'A new therapeutic indication or intended commercial use.',
  },
  {
    id: 'process',
    icon: <Settings className="w-6 h-6 text-blue-600" />,
    title: 'New Manufacturing Process',
    desc: 'A distinct method of producing or stabilizing the product.',
  },
];

export const SmartInterview: React.FC = () => {
  const router = useRouter();
  const {
    innovationName,
    currentQuestion,
    interviewProgress,
    isInterviewComplete,
    submitAnswer,
    runFullAnalysis,
    isLoading,
  } = useAnalysis();

  // Local state for current step answer
  const [selectedNoveltyTypes, setSelectedNoveltyTypes] = useState<string[]>(['extraction_method']);
  const [textAnswer, setTextAnswer] = useState<string>('Neem, Turmeric');

  const handleOptionToggle = (id: string) => {
    if (selectedNoveltyTypes.includes(id)) {
      setSelectedNoveltyTypes(selectedNoveltyTypes.filter((t) => t !== id));
    } else {
      setSelectedNoveltyTypes([...selectedNoveltyTypes, id]);
    }
  };

  const handleNext = async () => {
    const fieldName = currentQuestion?.field_name || 'novelty_type';
    let val: any = selectedNoveltyTypes;
    if (currentQuestion?.question_type === 'text' || currentQuestion?.question_type === 'list') {
      val = textAnswer;
    }

    await submitAnswer(fieldName, val);

    if (isInterviewComplete || interviewProgress >= 80) {
      await runFullAnalysis();
      router.push('/fingerprint');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Subtle Top Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-8">
        <div
          className="bg-emerald-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(15, interviewProgress)}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Desktop: Progress & Innovation Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
            <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
              Active Innovation
            </span>
            <h3 className="font-bold text-lg text-white mt-1 leading-snug">
              {innovationName || 'Ayurvedic Innovation'}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Guided by IP-SAKTI adaptive rules engine.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Guided Analysis Steps
            </h4>

            <ul className="space-y-3.5 text-xs font-medium">
              <li className="flex items-center space-x-3 text-emerald-700">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  ✓
                </span>
                <span>Innovation Description</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-900 font-bold">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                  ●
                </span>
                <span>Ingredients & Biological Origin</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-500">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  ○
                </span>
                <span>Novelty Indicators</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-500">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  ○
                </span>
                <span>Biological Diversity Compliance</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-500">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  ○
                </span>
                <span>Regulatory Classification</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Side: Question Card (Non-Chatbot Interface) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                QUESTION {Math.ceil((interviewProgress / 100) * 5) || 2} OF 5
              </span>
              <span className="text-xs text-slate-400">
                Adaptive Prompting
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {currentQuestion?.question_text || 'What novel aspect does your innovation introduce?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
              {currentQuestion?.help_text || 'Select the novel features or enter details to refine your Innovation Fingerprint.'}
            </p>

            {/* Selectable Cards for Novelty or Option Questions */}
            {(!currentQuestion || currentQuestion.question_type === 'select') ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {NOVELTY_OPTION_CARDS.map((card) => {
                  const isSelected = selectedNoveltyTypes.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => handleOptionToggle(card.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          {card.icon}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-3">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Text Input Fallback */
              <div className="mb-8">
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Enter details..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => router.push('/analyze')}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Processing...' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
