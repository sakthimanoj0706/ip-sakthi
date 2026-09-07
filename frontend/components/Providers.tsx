'use client';

import React from 'react';
import { AnalysisProvider } from '../hooks/useAnalysis';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AnalysisProvider>{children}</AnalysisProvider>;
}
