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
  emoji: string;
}[] = [
  { key: 'direct_answer', label: 'Direct Answer', maxScore: 20, description: 'Content provides a clear, direct answer to the query', emoji: '🎯' },
  { key: 'faq', label: 'FAQ Coverage', maxScore: 20, description: 'Structured FAQ content addressing related questions', emoji: '❓' },
  { key: 'definitions', label: 'Definitions', maxScore: 15, description: 'Clear concept definitions and explanations', emoji: '📖' },
  { key: 'comparison', label: 'Comparison', maxScore: 15, description: 'Comparison data vs alternatives for AI to reference', emoji: '⚖️' },
  { key: 'trust', label: 'Trust Signals', maxScore: 10, description: 'Authority indicators: certifications, reviews, awards', emoji: '🛡️' },
  { key: 'structure', label: 'Structure', maxScore: 10, description: 'Content is well-structured for AI summarization', emoji: '🏗️' },
  { key: 'citation', label: 'Citation', maxScore: 10, description: 'Brand was actually cited in the simulated answer', emoji: '✅' },
];

export default function ScoreTab({ report }: Props) {
  const { score } = report;

  return (
    <div className="space-y-8 stagger-children">
      {/* Main Score */}
      <div className="flex flex-col items-center py-8">
        <div className="animate-count-up">
          <ScoreGauge score={score.aeo_total} size={200} />
        </div>
        <p className="mt-5 text-sm text-slate-400 text-center max-w-md leading-relaxed">
          Your AEO Score measures how well your content is optimized for AI answer engine visibility across <span className="text-white font-medium">7 dimensions</span>.
        </p>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">
            Score Breakdown
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {score.aeo_total} / 100
          </span>
        </div>
        <div className="divide-y divide-slate-700/30">
          {BREAKDOWN_CONFIG.map(({ key, label, maxScore, description, emoji }) => {
            const value = score.breakdown[key];
            const percentage = (value / maxScore) * 100;
            const isFull = percentage >= 100;
            const isZero = value === 0;

            return (
              <div key={key} className="px-5 py-4 group hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{emoji}</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {label}
                    </span>
                    {isZero && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/15 text-red-400 ring-1 ring-red-500/20">
                        NEEDS FIX
                      </span>
                    )}
                    {isFull && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20">
                        PERFECT
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold font-mono tabular-nums ${
                      isZero
                        ? 'text-red-400'
                        : isFull
                        ? 'text-emerald-400'
                        : 'text-white'
                    }`}
                  >
                    {value}<span className="text-slate-500">/{maxScore}</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isFull
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                        : percentage > 0
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                        : 'bg-red-500/50'
                    }`}
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-gradient-to-r from-emerald-500 to-cyan-400" />
          Full score
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-gradient-to-r from-amber-500 to-orange-400" />
          Partial
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-red-500/50" />
          Needs fix
        </div>
      </div>
    </div>
  );
}
