'use client';

import ScoreGauge from '@/components/ui/ScoreGauge';
import type { AnalyzeReport, ScoreBreakdown } from '@/lib/types';

interface Props {
  report: AnalyzeReport;
}

const BREAKDOWN_CONFIG: {
  key: keyof ScoreBreakdown;
  label: string;
  maxScore: number;
  description: string;
}[] = [
  {
    key: 'direct_answer',
    label: 'Direct Answer',
    maxScore: 20,
    description: 'Content provides a clear, direct answer to the query',
  },
  {
    key: 'faq',
    label: 'FAQ Coverage',
    maxScore: 20,
    description: 'Structured FAQ content addressing related questions',
  },
  {
    key: 'definitions',
    label: 'Definitions',
    maxScore: 15,
    description: 'Clear concept definitions and explanations',
  },
  {
    key: 'comparison',
    label: 'Comparison',
    maxScore: 15,
    description: 'Comparison data vs alternatives for AI to reference',
  },
  {
    key: 'trust',
    label: 'Trust Signals',
    maxScore: 10,
    description: 'Authority indicators: certifications, reviews, awards',
  },
  {
    key: 'structure',
    label: 'Structure',
    maxScore: 10,
    description: 'Content is well-structured for AI summarization',
  },
  {
    key: 'citation',
    label: 'Citation',
    maxScore: 10,
    description: 'Brand was actually cited in the simulated answer',
  },
];

export default function ScoreTab({ report }: Props) {
  const { score } = report;

  return (
    <div className="space-y-8 stagger-children">
      {/* Main Score */}
      <div className="flex flex-col items-center py-6">
        <ScoreGauge score={score.aeo_total} size={180} />
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
          Your AEO Score measures how well your content is optimized for AI answer engine visibility across 7 dimensions.
        </p>
      </div>

      {/* Breakdown */}
      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Score Breakdown
          </h4>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {BREAKDOWN_CONFIG.map(({ key, label, maxScore, description }) => {
            const value = score.breakdown[key];
            const percentage = (value / maxScore) * 100;
            const isZero = value === 0;

            return (
              <div key={key} className="px-5 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {label}
                    </span>
                    {isZero && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        NEEDS FIX
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold font-mono ${
                      isZero
                        ? 'text-red-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {value}/{maxScore}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      percentage >= 100
                        ? 'bg-emerald-500'
                        : percentage > 0
                        ? 'bg-amber-500'
                        : 'bg-red-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          Full score
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          Partial
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          Needs fix
        </div>
      </div>
    </div>
  );
}
