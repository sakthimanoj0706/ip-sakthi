'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import taTranslations from '../locales/ta.json';
import hiTranslations from '../locales/hi.json';

export type SupportedLanguage = 'en' | 'ta' | 'hi';

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: enTranslations as any,
  ta: taTranslations as any,
  hi: hiTranslations as any,
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const saved = localStorage.getItem('ip_sakti_lang') as SupportedLanguage;
    if (saved && ['en', 'ta', 'hi'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('ip_sakti_lang', lang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict[key]) {
      return dict[key];
    }
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
