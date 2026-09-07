import React from 'react';
import { FileText, ExternalLink, ShieldCheck, AlertCircle, Bookmark } from 'lucide-react';
import { EvidenceSource } from '../lib/types';

interface EvidenceCardProps {
  regime: string;
  source?: EvidenceSource;
  warning?: string | null;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ regime, source, warning }) => {
  // If evidence is missing or warning indicates insufficient evidence
  if (!source || warning?.includes('Unable to verify')) {
    return (
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-950 block mb-0.5">Insufficient Source Evidence</span>
          <p className="leading-relaxed">
            Unable to verify this guidance from the currently available knowledge sources.
          </p>
        </div>
      </div>
    );
  }

  const isWebSource = Boolean((source as any).url);
  const authorityScore = (source as any).authority_score;
  const domain = (source as any).domain;
  const url = (source as any).url;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all space-y-3">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-md border ${isWebSource ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
            {isWebSource ? <ExternalLink className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
              {source.law || (source as any).title || 'Official Source'}
            </h4>
            <span className="text-[11px] font-semibold text-emerald-700">
              {source.section || (domain ? `Target Domain: ${domain}` : 'Statutory Reference')}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {authorityScore && (
            <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-300">
              Authority: {authorityScore}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            {regime}
          </span>
        </div>
      </div>

      {/* Snippet Excerpt */}
      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
        "{source.plain_explanation || source.text || (source as any).snippet || 'Official regulatory guidance document snippet.'}"
      </p>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Source: {isWebSource ? (domain || 'Live Government Web Research') : (source.source_note ? source.source_note.slice(0, 45) + '...' : 'Statutory Record')}</span>
        </div>

        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Visit Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="font-semibold text-slate-700">
            Confidence: <span className="text-emerald-700 font-bold">{source.confidence || 'High'}</span>
          </span>
        )}
      </div>

    </div>
  );
};
