'use client';

import { Eye, EyeOff, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react';
import type { AnalyzeReport } from '@/lib/types';

interface Props {
  report: AnalyzeReport;
}

export default function VisibilityTab({ report }: Props) {
  const { visibility } = report;

  const strengthColors = {
    weak: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800/30',
    medium: 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800/30',
    strong: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800/30',
  };

  const prominencePercent = Math.round(visibility.prominence_score * 100);

  return (
    <div className="space-y-6 stagger-children">
      {/* Citation Status Banner */}
      <div
        className={`p-6 rounded-xl border-2 ${
          visibility.is_cited
            ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700'
            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              visibility.is_cited
                ? 'bg-emerald-100 dark:bg-emerald-900/40'
                : 'bg-red-100 dark:bg-red-900/40'
            }`}
          >
            {visibility.is_cited ? (
              <Eye className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <EyeOff className="w-7 h-7 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div>
            <h3
              className={`text-xl font-bold ${
                visibility.is_cited
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-red-800 dark:text-red-300'
              }`}
            >
              {visibility.is_cited ? 'Your Brand Is Cited' : 'Your Brand Is NOT Cited'}
            </h3>
            <p
              className={`text-sm ${
                visibility.is_cited
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {visibility.is_cited
                ? 'The AI answer engine referenced your content in its response.'
                : 'The AI answer engine did not reference your content. See gap analysis for fixes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Prominence Score + Citation Strength */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prominence */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Prominence Score
            </h4>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            {prominencePercent}%
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                prominencePercent >= 60
                  ? 'bg-emerald-500'
                  : prominencePercent >= 30
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${prominencePercent}%` }}
            />
          </div>
        </div>

        {/* Citation Strength */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Citation Strength
          </h4>
          <div
            className={`inline-flex items-center px-4 py-2 rounded-lg border font-bold text-lg capitalize ${
              strengthColors[visibility.citation_strength]
            }`}
          >
            {visibility.citation_strength}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            How strongly your brand is referenced relative to competitors
          </p>
        </div>
      </div>

      {/* Reasons */}
      {visibility.reasons && visibility.reasons.length > 0 && (
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Analysis Reasons
          </h4>
          <div className="space-y-2">
            {visibility.reasons.map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What AI Preferred - placeholder for future expansion */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <ArrowRight className="w-3.5 h-3.5" />
        Check the <span className="font-semibold text-indigo-600 dark:text-indigo-400">Gap Analysis</span> tab for detailed improvement recommendations
      </div>
    </div>
  );
}
