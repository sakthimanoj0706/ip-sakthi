'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowLeft, ArrowRight, Sparkles, FlaskConical, Microscope, Pill, Settings, HelpCircle, SkipForward, ShieldAlert, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import { skipInterviewQuestion } from '../lib/api';
import { ExtractionConfirmation } from './ExtractionConfirmation';

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
    fingerprint,
  } = useAnalysis();

  // Local states
  const [selectedNoveltyTypes, setSelectedNoveltyTypes] = useState<string[]>(['extraction_method']);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [booleanAnswer, setBooleanAnswer] = useState<string>('Yes');
  const [multiSelectAnswers, setMultiSelectAnswers] = useState<string[]>([]);
  const [entityList, setEntityList] = useState<string[]>(['Neem', 'Turmeric']);
  const [newEntityInput, setNewEntityInput] = useState<string>('');
  const [showExtractionConfirm, setShowExtractionConfirm] = useState<boolean>(false);

  // Reset local state on field change
  useEffect(() => {
    setTextAnswer('');
    setBooleanAnswer('Yes');
    setMultiSelectAnswers([]);
  }, [currentQuestion?.field_name]);

  const handleOptionToggle = (id: string) => {
    if (selectedNoveltyTypes.includes(id)) {
      setSelectedNoveltyTypes(selectedNoveltyTypes.filter((t) => t !== id));
    } else {
      setSelectedNoveltyTypes([...selectedNoveltyTypes, id]);
    }
  };

  const handleMultiSelectToggle = (val: string) => {
    if (multiSelectAnswers.includes(val)) {
      setMultiSelectAnswers(multiSelectAnswers.filter((v) => v !== val));
    } else {
      setMultiSelectAnswers([...multiSelectAnswers, val]);
    }
  };

  const handleAddEntity = () => {
    if (newEntityInput.trim() && !entityList.includes(newEntityInput.trim())) {
      setEntityList([...entityList, newEntityInput.trim()]);
      setNewEntityInput('');
    }
  };

  const handleRemoveEntity = (item: string) => {
    setEntityList(entityList.filter((e) => e !== item));
  };

  const handleNext = async () => {
    const fieldName = currentQuestion?.field_name || 'novelty_type';
    let val: any = selectedNoveltyTypes;

    if (currentQuestion?.question_type === 'boolean') {
      val = booleanAnswer === 'Yes';
    } else if (currentQuestion?.question_type === 'multiselect') {
      val = multiSelectAnswers.length > 0 ? multiSelectAnswers : ['None'];
    } else if (currentQuestion?.question_type === 'entity_input') {
      val = entityList;
    } else if (currentQuestion?.question_type === 'text' || currentQuestion?.question_type === 'list') {
      val = textAnswer.trim() || 'UNKNOWN';
    } else if (currentQuestion?.options && currentQuestion.options.length > 0) {
      val = textAnswer.trim() || currentQuestion.options[0];
    }

    await submitAnswer(fieldName, val);

    if (isInterviewComplete || interviewProgress >= 80) {
      setShowExtractionConfirm(true);
    }
  };

  const handleSkip = async () => {
    const fieldName = currentQuestion?.field_name || 'novelty_type';
    await submitAnswer(fieldName, 'UNKNOWN');

    if (isInterviewComplete || interviewProgress >= 80) {
      setShowExtractionConfirm(true);
    }
  };

  const handleConfirmExtractionAndAnalyze = async () => {
    await runFullAnalysis();
    router.push('/fingerprint');
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  if (showExtractionConfirm && fingerprint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ExtractionConfirmation
          fingerprint={fingerprint}
          onConfirm={handleConfirmExtractionAndAnalyze}
          onEdit={() => setShowExtractionConfirm(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Completeness & Progress Meter */}
      <div className="mb-8 rounded-xl bg-slate-900 p-4 border border-slate-800 shadow-sm text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
            {Math.round(interviewProgress)}%
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Profile Completeness
            </span>
            <span className="text-sm font-bold text-slate-100">
              {interviewProgress >= 80 ? 'Sufficient Information Gathered' : 'Adaptive Priority Interview in Progress'}
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(15, interviewProgress)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Known vs Needed Fields Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
            <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
              Active Innovation Profile
            </span>
            <h3 className="font-bold text-lg text-white mt-1 leading-snug">
              {innovationName || 'Ayurvedic Innovation'}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Smart interview state manager eliminates duplicate questions.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-6 shadow-sm border border-slate-800 text-slate-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Known vs Needed Fields</span>
              <span className="text-[10px] font-mono text-emerald-400">Zero Duplicates</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                  ✓ Verified Extracted Signals:
                </span>
                <ul className="space-y-1 text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Ingredients: {fingerprint?.ingredients?.join(', ') || 'Extracted from input'}</span>
                  </li>
                  {fingerprint?.biological_resources?.source_location && (
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Origin: {fingerprint.biological_resources.source_location}</span>
                    </li>
                  )}
                  {fingerprint?.novelty?.description && (
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Claimed Novelty: {fingerprint.novelty.description.slice(0, 35)}...</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                  ! Current Targeted Gap:
                </span>
                <p className="text-slate-300 font-semibold">
                  {currentQuestion?.field_name || 'Evaluating novelty & regulatory classification'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Question Card */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 sm:p-8 text-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full font-mono">
                QUESTION {currentQuestion?.current_dynamic_step || Math.ceil((interviewProgress / 100) * 5) || 2} OF {currentQuestion?.total_dynamic_questions || 5}
              </span>

              {currentQuestion?.priority_level && (
                <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full font-mono uppercase ${getPriorityBadge(currentQuestion.priority_level)}`}>
                  Priority: {currentQuestion.priority_level}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              {currentQuestion?.question_text || 'What novel aspect does your innovation introduce?'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-4">
              {currentQuestion?.help_text || 'Select the novel features or enter details to refine your Innovation Fingerprint.'}
            </p>

            {/* "Why are we asking this?" Explanation Box */}
            {currentQuestion?.why_asking && (
              <div className="mb-6 rounded-lg bg-slate-950/80 p-3.5 border border-emerald-500/30 text-xs text-slate-300 flex items-start gap-2.5">
                <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-400 font-mono uppercase">Why are we asking this? </strong>
                  {currentQuestion.why_asking}
                </div>
              </div>
            )}

            {/* INPUT TYPE 1: BOOLEAN ([ Yes ] [ No ] [ Not Sure ]) */}
            {currentQuestion?.question_type === 'boolean' ? (
              <div className="flex flex-wrap gap-3 mb-8">
                {['Yes', 'No', 'Not Sure'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBooleanAnswer(opt)}
                    className={`px-6 py-3 rounded-xl border text-sm font-bold transition-all ${
                      booleanAnswer === opt
                        ? 'border-emerald-500 bg-emerald-600 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    [ {opt} ]
                  </button>
                ))}
              </div>
            ) : currentQuestion?.question_type === 'multiselect' ? (
              /* INPUT TYPE 2: MULTISELECT (Checkboxes) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {currentQuestion.options?.map((opt) => {
                  const isChecked = multiSelectAnswers.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleMultiSelectToggle(opt)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span>☐ {opt}</span>
                      {isChecked && <Check className="h-4 w-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            ) : currentQuestion?.question_type === 'entity_input' ? (
              /* INPUT TYPE 3: ENTITY CHIPS (+ Add Ingredient) */
              <div className="mb-8 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {entityList.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/80 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/30"
                    >
                      🌿 {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveEntity(item)}
                        className="hover:text-rose-400 text-slate-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newEntityInput}
                    onChange={(e) => setNewEntityInput(e.target.value)}
                    placeholder="Add another ingredient..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddEntity}
                    className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
              </div>
            ) : (!currentQuestion || currentQuestion.question_type === 'select') ? (
              /* INPUT TYPE 4: SELECT CARDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {NOVELTY_OPTION_CARDS.map((card) => {
                  const isSelected = selectedNoveltyTypes.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => handleOptionToggle(card.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/50'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          {card.icon}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-slate-100 mt-3">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* INPUT TYPE 5: TEXT AREA */
              <div className="mb-8 space-y-3">
                <textarea
                  rows={4}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your answer in detail..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none leading-relaxed"
                />
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => router.push('/analyze')}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center space-x-1.5"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Skip for now</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Processing...' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
