'use client';

import { MessageSquare, ArrowRight, Bot, Cpu } from 'lucide-react';
import type { AnalyzeReport } from '@/lib/types';

interface Props {
  report: AnalyzeReport;
}

export default function SimulatedAnswerTab({ report }: Props) {
  const { simulated_answer } = report;

  return (
    <div className="space-y-6 stagger-children">
      {/* Headline */}
      <div className="relative p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-cyan-500/10 border border-indigo-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0 ring-1 ring-indigo-500/20">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
              AI-Generated Headline
            </p>
            <h3 className="text-xl font-bold text-white leading-snug">
              {simulated_answer.headline}
            </h3>
          </div>
        </div>
      </div>

      {/* Short Answer */}
      <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Short Answer
        </h4>
        <p className="text-slate-300 leading-relaxed text-[15px]">
          {simulated_answer.short_answer}
        </p>
      </div>

      {/* Long Answer */}
      <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Detailed Answer
        </h4>
        <div className="text-slate-300 leading-relaxed whitespace-pre-line text-[15px]">
          {simulated_answer.long_answer}
        </div>
      </div>

      {/* Follow-up Questions */}
      {simulated_answer.follow_ups && simulated_answer.follow_ups.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Suggested Follow-ups
          </h4>
          <div className="space-y-2">
            {simulated_answer.follow_ups.map((q, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-700/50 text-sm text-slate-300 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all cursor-default group"
              >
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                {q}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engine mode info */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <Cpu className="w-3 h-3" />
          <span className="font-mono">{report.meta.engine_mode}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <MessageSquare className="w-3 h-3" />
          <span className="font-mono">{report.meta.model}</span>
        </div>
      </div>
    </div>
  );
}
