'use client';

import React from 'react';
import { AnalysisProvider } from '../hooks/useAnalysis';
import { LanguageProvider } from '../context/LanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AnalysisProvider>{children}</AnalysisProvider>
    </LanguageProvider>
  );
}
