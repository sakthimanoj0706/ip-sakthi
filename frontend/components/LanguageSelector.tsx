'use client';

import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const LANGUAGES: Array<{ code: SupportedLanguage; label: string; flag: string }> = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  ];

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 border border-slate-700 text-xs font-semibold text-white shadow-sm hover:border-emerald-500/50 transition-colors">
        <Globe className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer pr-1 appearance-none"
          aria-label="Select Language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} className="bg-slate-900 text-white font-medium">
              {l.flag} {l.label}
            </option>
          ))}
        </select>
        <ChevronDown className="h-3 w-3 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};
