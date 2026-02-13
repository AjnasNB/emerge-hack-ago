'use client';

import { Eye, EyeOff, TrendingUp, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { AnalyzeReport } from '@/lib/types';

interface Props {
  report: AnalyzeReport;
}

export default function VisibilityTab({ report }: Props) {
  const { visibility } = report;
  const prominencePercent = Math.round(visibility.prominence_score * 100);

  return (
    <div className="space-y-6 stagger-children">
      {/* Citation Status Banner */}
      <div className={`relative p-6 rounded-xl overflow-hidden ${
        visibility.is_cited
          ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20'
          : 'bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20'
      }`}>
        <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl ${
          visibility.is_cited ? 'bg-emerald-500/10' : 'bg-red-500/10'
        }`} />
        <div className="relative flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            visibility.is_cited ? 'bg-emerald-500/15 ring-1 ring-emerald-500/30' : 'bg-red-500/15 ring-1 ring-red-500/30'
          }`}>
            {visibility.is_cited ? (
              <Eye className="w-8 h-8 text-emerald-400" />
            ) : (
              <EyeOff className="w-8 h-8 text-red-400" />
            )}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${
              visibility.is_cited ? 'text-emerald-300' : 'text-red-300'
            }`}>
              {visibility.is_cited ? 'Your Brand Is Cited' : 'Your Brand Is NOT Cited'}
            </h3>
            <p className={`text-sm mt-1 ${
              visibility.is_cited ? 'text-emerald-400/70' : 'text-red-400/70'
            }`}>
              {visibility.is_cited
                ? 'The AI answer engine referenced your content in its response.'
                : 'The AI answer engine did not reference your content. See gap analysis for fixes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prominence */}
        <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Prominence Score
            </h4>
            <TrendingUp className="w-4 h-4 text-slate-500" />
          </div>
          <div className={`text-4xl font-bold mb-4 tabular-nums ${
            prominencePercent >= 60 ? 'text-emerald-400' : prominencePercent >= 30 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {prominencePercent}<span className="text-lg text-slate-500">%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                prominencePercent >= 60
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                  : prominencePercent >= 30
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${prominencePercent}%` }}
            />
          </div>
        </div>

        {/* Citation Strength */}
        <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Citation Strength
          </h4>
          <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-lg capitalize ${
            visibility.citation_strength === 'strong'
              ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20'
              : visibility.citation_strength === 'medium'
              ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20'
              : 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20'
          }`}>
            {visibility.citation_strength === 'strong' && <CheckCircle2 className="w-5 h-5" />}
            {visibility.citation_strength === 'medium' && <AlertTriangle className="w-5 h-5" />}
            {visibility.citation_strength === 'weak' && <EyeOff className="w-5 h-5" />}
            {visibility.citation_strength}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            How strongly your brand is referenced relative to competitors
          </p>
        </div>
      </div>

      {/* Reasons */}
      {visibility.reasons && visibility.reasons.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Analysis Reasons
          </h4>
          <div className="space-y-2">
            {visibility.reasons.map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-slate-700/20 border border-slate-700/30 text-sm text-slate-300"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500/70 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-indigo-500/[0.05] border border-indigo-500/15 text-sm text-slate-400 hover:text-indigo-400 transition-colors">
        <ArrowRight className="w-4 h-4 text-indigo-500" />
        Check the <span className="font-semibold text-indigo-400">Gap Analysis</span> tab for detailed improvement recommendations
      </div>
    </div>
  );
}
