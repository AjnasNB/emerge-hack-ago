'use client';

import { Check, Loader2, Circle } from 'lucide-react';

// ─── Agent Status (from page state) ────────────────────────

export interface AgentStatus {
  id: string;
  name: string;
  emoji: string;
  role: string;
  status: 'pending' | 'running' | 'complete';
  thought?: string;
  duration?: number;
}

// ─── Default agents (shown before streaming starts) ─────────

export const DEFAULT_AGENTS: AgentStatus[] = [
  { id: 'agent1', name: 'Answer Simulator', emoji: '🤖', role: 'Generative Answer Engine', status: 'pending' },
  { id: 'agent2', name: 'Visibility Judge', emoji: '👁️', role: 'Brand Citation Evaluator', status: 'pending' },
  { id: 'agent3', name: 'Gap Analyzer', emoji: '🔍', role: 'Content Gap Explainer', status: 'pending' },
  { id: 'agent4', name: 'Fix Pack Generator', emoji: '🔧', role: 'AI-Ready Content Builder', status: 'pending' },
  { id: 'agent5', name: 'Quality Reviewer', emoji: '✨', role: 'Multi-Agent Output Auditor', status: 'pending' },
];

// ─── Props ──────────────────────────────────────────────────

interface LoadingPipelineProps {
  agents: AgentStatus[];
}

export default function LoadingPipeline({ agents }: LoadingPipelineProps) {
  const completedCount = agents.filter((a) => a.status === 'complete').length;
  const totalCount = agents.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 mb-4 relative">
          <div className="w-8 h-8 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Multi-Agent Analysis
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {totalCount} AI agents working on your content via Azure GPT
        </p>
      </div>

      {/* Agent Pipeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`px-5 py-4 transition-all duration-300 ${
                agent.status === 'running'
                  ? 'bg-indigo-50/70 dark:bg-indigo-900/15'
                  : agent.status === 'complete'
                  ? 'bg-emerald-50/40 dark:bg-emerald-900/5'
                  : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Status indicator */}
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {agent.status === 'complete' ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  ) : agent.status === 'running' ? (
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                      </div>
                      <div className="absolute inset-0 w-7 h-7 rounded-full border-2 border-indigo-400/40 animate-pulse-ring" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Circle className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Agent emoji */}
                <span className="text-xl flex-shrink-0">{agent.emoji}</span>

                {/* Agent info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        agent.status === 'complete'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : agent.status === 'running'
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {agent.name}
                    </span>
                    <span
                      className={`text-xs ${
                        agent.status === 'pending'
                          ? 'text-slate-300 dark:text-slate-600'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {agent.role}
                    </span>
                  </div>

                  {/* Thought bubble */}
                  {agent.status === 'running' && agent.thought && (
                    <p className="mt-1 text-xs text-indigo-500 dark:text-indigo-400 truncate animate-fade-in">
                      {agent.thought}
                    </p>
                  )}
                </div>

                {/* Duration */}
                {agent.status === 'complete' && agent.duration && (
                  <span className="flex-shrink-0 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                    {(agent.duration / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Pipeline Progress
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-bold">
              {completedCount}/{totalCount} agents
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Agent architecture badge */}
      <div className="mt-6 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Multi-Agent Pipeline • BaseAgent Framework • Azure GPT
        </span>
      </div>
    </div>
  );
}
