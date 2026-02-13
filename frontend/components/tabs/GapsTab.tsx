'use client';

import {
  AlertCircle,
  Lightbulb,
  Quote,
  Wrench,
} from 'lucide-react';
import SeverityBadge from '@/components/ui/SeverityBadge';
import type { AnalyzeReport, Gap } from '@/lib/types';

interface Props {
  report: AnalyzeReport;
}

const CATEGORY_LABELS: Record<string, string> = {
  direct_answer_missing: 'Direct Answer Missing',
  weak_structure_for_summarization: 'Weak Structure',
  missing_definitions: 'Missing Definitions',
  missing_faq: 'Missing FAQ',
  missing_comparison: 'Missing Comparison',
  missing_trust_signals: 'Missing Trust Signals',
  missing_specificity: 'Missing Specificity',
  outdated_or_uncertain_info: 'Outdated Info',
  over_marketing_language: 'Over-Marketing Language',
};

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function GapsTab({ report }: Props) {
  const sortedGaps = [...report.gaps].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  return (
    <div className="space-y-6 stagger-children">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {(['high', 'medium', 'low'] as const).map((sev) => {
          const count = report.gaps.filter((g) => g.severity === sev).length;
          const colors = {
            high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
            medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
            low: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
          };
          return (
            <div
              key={sev}
              className={`p-4 rounded-xl border text-center ${colors[sev]}`}
            >
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs font-semibold uppercase tracking-wider mt-0.5">
                {sev}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gap cards */}
      {sortedGaps.map((gap: Gap, index: number) => (
        <div
          key={index}
          className="p-5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {CATEGORY_LABELS[gap.category] || gap.category}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {gap.what_is_missing}
                </p>
              </div>
            </div>
            <SeverityBadge severity={gap.severity} />
          </div>

          {/* Why it matters */}
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 text-sm">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span className="text-amber-800 dark:text-amber-300">
              {gap.why_it_matters_for_ai}
            </span>
          </div>

          {/* Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gap.evidence_target?.quote && gap.evidence_target.quote !== 'N/A' && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  <Quote className="w-3 h-3" />
                  Your Content ({gap.evidence_target.source_id})
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{gap.evidence_target.quote}&rdquo;
                </p>
              </div>
            )}
            {gap.evidence_other?.quote && gap.evidence_other.quote !== 'N/A' && (
              <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">
                  <Quote className="w-3 h-3" />
                  Competitor ({gap.evidence_other.source_id})
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 italic leading-relaxed">
                  &ldquo;{gap.evidence_other.quote}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Fix instruction */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
            <Wrench className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                Fix Instruction
              </span>
              <span className="text-sm text-emerald-800 dark:text-emerald-300">
                {gap.fix_instruction}
              </span>
            </div>
          </div>
        </div>
      ))}

      {sortedGaps.length === 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No gaps identified — your content looks great!</p>
        </div>
      )}
    </div>
  );
}
