'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isDemoMode, isBackendConnected, toggleDemoMode } = useAnalysis();

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-500 transition-colors">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight text-white">IP-SAKTI</span>
              <span className="text-xs bg-slate-800 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-slate-700">
                Sahayak
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Ayurveda IP & Regulatory Intelligence Platform
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === '/' ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </Link>
          <a
            href="#how-it-works"
            className="text-slate-300 hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="#knowledge-areas"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Knowledge Areas
          </a>
          <Link
            href="/analyze"
            className={`transition-colors ${
              pathname.startsWith('/analyze') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Analyze Innovation
          </Link>
          <Link
            href="/evaluation"
            className={`transition-colors ${
              pathname.startsWith('/evaluation') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Evaluation Dashboard
          </Link>
        </nav>

        {/* Action Controls & Backend Status */}
        <div className="flex items-center space-x-4">
          
          {/* Connection / Demo Status Pill */}
          <button
            onClick={() => toggleDemoMode()}
            className={`text-xs px-2.5 py-1 rounded-full border flex items-center space-x-1.5 transition-colors ${
              isBackendConnected && !isDemoMode
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                : 'bg-amber-950/80 text-amber-300 border-amber-700/50'
            }`}
            title="Click to toggle Demo Mode vs Live API Mode"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendConnected && !isDemoMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isBackendConnected && !isDemoMode ? 'API Connected' : 'Demo Mode'}</span>
          </button>

          {/* Primary CTA */}
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

      </div>
    </header>
  );
};
