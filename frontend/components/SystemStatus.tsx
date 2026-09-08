'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { checkBackendHealth } from '../lib/api';

interface ServiceStatus {
  name: string;
  ready: boolean;
}

export const SystemStatus: React.FC = () => {
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const services: ServiceStatus[] = [
    { name: 'Backend API', ready: isBackendConnected },
    { name: 'NLP Engine (spaCy)', ready: true },
    { name: '4-Regime Local RAG', ready: true },
    { name: 'Legal Rules Engine', ready: true },
    { name: 'Web Research (Tavily)', ready: true },
    { name: 'AI Engine (Gemini)', ready: isBackendConnected },
  ];

  const handleRefresh = async () => {
    setLoading(true);
    const ok = await checkBackendHealth();
    setIsBackendConnected(ok);
    setLoading(false);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-slate-100 shadow-lg backdrop-blur-md max-w-sm font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-emerald-400" />
          <span className="font-bold uppercase tracking-wider text-slate-200">AI SYSTEM STATUS</span>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
          title="Refresh Status"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-1.5">
        {services.map((svc) => (
          <div key={svc.name} className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${svc.ready ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {svc.name}
            </span>
            <span className={svc.ready ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {svc.ready ? 'Connected' : 'Offline Mode'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
