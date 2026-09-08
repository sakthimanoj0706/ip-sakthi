'use client';

import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const LANGUAGES: Array<{ code: SupportedLanguage; label: string; flag: string }> = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  ];

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800 text-xs font-semibold text-slate-200">
        <Globe className="h-4 w-4 text-emerald-400" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} className="bg-slate-900 text-slate-200">
              {l.flag} {l.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
