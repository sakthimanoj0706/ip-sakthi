import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'warning' | 'info';
  customText?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ variant = 'warning', customText }) => {
  const defaultText =
    'INFORMATIONAL GUIDANCE ONLY: IP-SAKTI Sahayak provides preliminary AI-assisted exploration of Ayurveda IP and regulatory pathways under Indian law. It does not constitute professional legal advice. Always verify with qualified patent agents, IP attorneys, or State AYUSH authorities.';

  return (
    <div
      className={`rounded-xl p-4 border text-xs leading-relaxed flex items-start space-x-3 shadow-xs ${
        variant === 'warning'
          ? 'bg-amber-50/90 border-amber-200 text-amber-900'
          : 'bg-slate-100 border-slate-200 text-slate-700'
      }`}
    >
      {variant === 'warning' ? (
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      ) : (
        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
      )}
      <div>
        <span className="font-extrabold uppercase tracking-wider block text-[11px] mb-0.5">
          Government Platform Notice
        </span>
        <p>{customText || defaultText}</p>
      </div>
    </div>
  );
};
