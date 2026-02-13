'use client';

import { MessageSquare, ArrowRight } from 'lucide-react';
import type { AnalyzeReport } from '@/lib/types';

interface Props {
  report: AnalyzeReport;
}

export default function SimulatedAnswerTab({ report }: Props) {
  const { simulated_answer } = report;

  return (
    <div className="space-y-6 stagger-children">
      {/* Headline */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 border border-indigo-100 dark:border-indigo-800/30">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              AI-Generated Headline
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {simulated_answer.headline}
            </h3>
          </div>
        </div>
      </div>

      {/* Short Answer */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Short Answer
        </h4>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {simulated_answer.short_answer}
        </p>
      </div>

      {/* Long Answer */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Detailed Answer
        </h4>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {simulated_answer.long_answer}
        </p>
      </div>

      {/* Follow-up Questions */}
      {simulated_answer.follow_ups && simulated_answer.follow_ups.length > 0 && (
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Follow-up Questions
          </h4>
          <div className="space-y-2">
            {simulated_answer.follow_ups.map((q, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300"
              >
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                {q}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engine mode info */}
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
          {report.meta.engine_mode}
        </span>
        <span>mode</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="font-mono">{report.meta.model}</span>
      </div>
    </div>
  );
}
