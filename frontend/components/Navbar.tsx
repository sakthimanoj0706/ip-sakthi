'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Leaf, Menu, X } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../context/LanguageContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isDemoMode, isBackendConnected, toggleDemoMode } = useAnalysis();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <span className="text-xs bg-slate-800 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-slate-700 font-mono">
                Sahayak
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              {t('tagline', 'Ayurveda IP & Regulatory Intelligence Platform')}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === '/' ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('nav.overview', 'Overview')}
          </Link>
          <a
            href="#how-it-works"
            className="text-slate-300 hover:text-white transition-colors"
          >
            {t('nav.howItWorks', 'How It Works')}
          </a>
          <a
            href="#knowledge-areas"
            className="text-slate-300 hover:text-white transition-colors"
          >
            {t('nav.knowledge', 'Knowledge Areas')}
          </a>
          <Link
            href="/analyze"
            className={`transition-colors ${
              pathname.startsWith('/analyze') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('nav.analyze', 'Analyze Innovation')}
          </Link>
          <Link
            href="/evaluation"
            className={`transition-colors ${
              pathname.startsWith('/evaluation') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('nav.dashboard', 'Evaluation Dashboard')}
          </Link>
        </nav>

        {/* Action Controls, i18n & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Connection / Demo Status Pill */}
          <button
            onClick={() => toggleDemoMode()}
            className={`text-xs px-2.5 py-1 rounded-full border flex items-center space-x-1.5 transition-colors font-mono hidden sm:flex ${
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
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span>{t('nav.startAnalysis', 'Start Analysis')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-emerald-400 py-1"
          >
            {t('nav.overview', 'Overview')}
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-emerald-400 py-1"
          >
            {t('nav.howItWorks', 'How It Works')}
          </a>
          <a
            href="#knowledge-areas"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-emerald-400 py-1"
          >
            {t('nav.knowledge', 'Knowledge Areas')}
          </a>
          <Link
            href="/analyze"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-emerald-400 py-1"
          >
            {t('nav.analyze', 'Analyze Innovation')}
          </Link>
          <Link
            href="/evaluation"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-emerald-400 py-1"
          >
            {t('nav.dashboard', 'Evaluation Dashboard')}
          </Link>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <Link
              href="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold rounded-lg bg-emerald-600 text-white shadow-sm"
            >
              <span>{t('nav.startAnalysis', 'Start Analysis')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
