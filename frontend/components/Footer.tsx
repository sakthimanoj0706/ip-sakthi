import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & SIH Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <Leaf className="w-5 h-5 text-emerald-500" />
              <span>IP-SAKTI Sahayak</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Problem Statement SIH26045 — Multilingual RAG-based AI Decision Assistant for Ayurveda Intellectual Property & Regulatory Compliance (India Scope).
            </p>
            <div className="inline-flex items-center space-x-2 text-[11px] text-emerald-400 bg-slate-800 px-3 py-1 rounded border border-slate-700">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SIH 2026 Hackathon Innovation System</span>
            </div>
          </div>

          {/* Col 2: Regulatory Scope */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 text-sm">Legal Regimes Covered</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>The Patents Act, 1970 (Sec 3(p), 3(e))</li>
              <li>Traditional Knowledge Digital Library (TKDL)</li>
              <li>Biological Diversity (Amendment) Act, 2023</li>
              <li>Drugs & Cosmetics Act, 1940 (Rule 158-B)</li>
              <li>FSSAI Ayurveda Aahara Regulations, 2022</li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 text-sm">Platform Navigation</h4>
            <ul className="space-y-1.5">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home Overview</Link></li>
              <li><Link href="/analyze" className="hover:text-emerald-400 transition-colors">Innovation Input</Link></li>
              <li><Link href="/interview" className="hover:text-emerald-400 transition-colors">Smart Guided Interview</Link></li>
              <li><Link href="/fingerprint" className="hover:text-emerald-400 transition-colors">Innovation Fingerprint</Link></li>
              <li><Link href="/decision" className="hover:text-emerald-400 transition-colors">Decision Map</Link></li>
              <li><Link href="/roadmap" className="hover:text-emerald-400 transition-colors">Action Roadmap</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 IP-SAKTI Sahayak Project. Informational Decision Platform.</p>
          <p className="mt-2 md:mt-0 text-slate-400">
            Designed for SIH 2026 | Non-binding Informational Guidance
          </p>
        </div>
      </div>
    </footer>
  );
};
