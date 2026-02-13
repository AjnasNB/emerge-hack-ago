'use client';

import {
  AlertCircle,
  Lightbulb,
  Quote,
  Wrench,
  Shield,
  ChevronRight,
} from 'lucide-react';
import SeverityBadge from '@/components/ui/SeverityBadge';
import type { AnalyzeReport, Gap } from '@/lib/types';

interface Props {
  report: AnalyzeReport;
}

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  direct_answer_missing: { label: 'Direct Answer Missing', emoji: '🎯' },
  weak_structure_for_summarization: { label: 'Weak Structure', emoji: '🏗️' },
  missing_definitions: { label: 'Missing Definitions', emoji: '📖' },
  missing_faq: { label: 'Missing FAQ', emoji: '❓' },
  missing_comparison: { label: 'Missing Comparison', emoji: '⚖️' },
  missing_trust_signals: { label: 'Missing Trust Signals', emoji: '🛡️' },
  missing_specificity: { label: 'Missing Specificity', emoji: '🔬' },
  outdated_or_uncertain_info: { label: 'Outdated Info', emoji: '📅' },
  over_marketing_language: { label: 'Over-Marketing Language', emoji: '📢' },
};

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function GapsTab({ report }: Props) {
  const sortedGaps = [...report.gaps].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  const highCount = report.gaps.filter((g) => g.severity === 'high').length;
  const medCount = report.gaps.filter((g) => g.severity === 'medium').length;
  const lowCount = report.gaps.filter((g) => g.severity === 'low').length;

  return (
    <div className="space-y-6 stagger-children">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard count={highCount} label="Critical" color="red" />
        <StatCard count={medCount} label="Medium" color="amber" />
        <StatCard count={lowCount} label="Low" color="blue" />
      </div>

      {/* Gap Cards */}
      {sortedGaps.map((gap: Gap, index: number) => {
        const cat = CATEGORY_LABELS[gap.category] || { label: gap.category, emoji: '📋' };

        return (
          <div
            key={index}
            className={`rounded-xl overflow-hidden border ${
              gap.severity === 'high'
                ? 'border-red-500/20 bg-red-500/[0.02]'
                : gap.severity === 'medium'
                ? 'border-amber-500/20 bg-amber-500/[0.02]'
                : 'border-slate-700/50 bg-slate-800/30'
            }`}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.emoji}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {cat.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {gap.what_is_missing}
                  </p>
                </div>
              </div>
              <SeverityBadge severity={gap.severity} />
            </div>

            {/* Body */}
            <div className="px-5 pb-5 space-y-3">
              {/* Why it matters */}
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/10">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-amber-300/80 leading-relaxed">
                  {gap.why_it_matters_for_ai}
                </span>
              </div>

              {/* Evidence side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gap.evidence_target?.quote && gap.evidence_target.quote !== 'N/A' && (
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <Quote className="w-3 h-3" />
                      Your Content
                    </div>
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                      &ldquo;{gap.evidence_target.quote}&rdquo;
                    </p>
                  </div>
                )}
                {gap.evidence_other?.quote && gap.evidence_other.quote !== 'N/A' && (
                  <div className="p-4 rounded-xl bg-indigo-500/[0.05] border border-indigo-500/15">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                      <Quote className="w-3 h-3" />
                      Competitor
                    </div>
                    <p className="text-xs text-indigo-300/70 italic leading-relaxed">
                      &ldquo;{gap.evidence_other.quote}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Fix instruction */}
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/15">
                <Wrench className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                    How to Fix
                  </span>
                  <span className="text-sm text-emerald-300/80 leading-relaxed">
                    {gap.fix_instruction}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {sortedGaps.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-sm text-slate-400">No gaps identified — your content looks great!</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ count, label, color }: { count: number; label: string; color: string }) {
  const colorClasses: Record<string, string> = {
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };

  return (
    <div className={`p-4 rounded-xl border text-center ${colorClasses[color]}`}>
      <div className="text-3xl font-bold tabular-nums">{count}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">
        {label}
      </div>
    </div>
  );
}
