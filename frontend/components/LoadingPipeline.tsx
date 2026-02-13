'use client';

import { Check, Loader2, Circle, Sparkles } from 'lucide-react';

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
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const runningAgent = agents.find(a => a.status === 'running');

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 mb-5 animate-glow-pulse">
          <div className="w-10 h-10 border-[3px] border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
          <div className="absolute inset-0 rounded-2xl animate-pulse-ring border-2 border-indigo-400/20" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Multi-Agent Analysis
        </h2>
        <p className="text-sm text-slate-400">
          {totalCount} specialized AI agents analyzing your content
        </p>
        {runningAgent && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400">
            <Sparkles className="w-3 h-3" />
            <span className="font-medium">{runningAgent.name}</span>
            <span className="text-indigo-500">is thinking...</span>
          </div>
        )}
      </div>

      {/* Agent Pipeline */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-700/50 overflow-hidden shadow-2xl shadow-black/30 backdrop-blur-sm">
        <div className="divide-y divide-slate-800/80">
          {agents.map((agent, i) => (
            <div
              key={agent.id}
              className={`px-5 py-4 transition-all duration-500 ${
                agent.status === 'running'
                  ? 'bg-indigo-500/[0.07]'
                  : agent.status === 'complete'
                  ? 'bg-emerald-500/[0.03]'
                  : ''
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                {/* Status indicator */}
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center">
                  {agent.status === 'complete' ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  ) : agent.status === 'running' ? (
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center ring-1 ring-indigo-500/30">
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                      </div>
                      <div className="absolute -inset-1 rounded-xl border border-indigo-400/20 animate-pulse-ring" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center ring-1 ring-slate-700/50">
                      <Circle className="w-3 h-3 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Agent emoji */}
                <span className={`text-xl flex-shrink-0 transition-all duration-300 ${
                  agent.status === 'pending' ? 'opacity-30 grayscale' : ''
                }`}>
                  {agent.emoji}
                </span>

                {/* Agent info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        agent.status === 'complete'
                          ? 'text-emerald-400'
                          : agent.status === 'running'
                          ? 'text-indigo-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {agent.name}
                    </span>
                    <span
                      className={`text-xs transition-colors ${
                        agent.status === 'pending'
                          ? 'text-slate-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {agent.role}
                    </span>
                  </div>

                  {/* Thought bubble */}
                  {agent.status === 'running' && agent.thought && (
                    <p className="mt-1 text-xs text-indigo-400/80 truncate animate-fade-in font-mono">
                      {agent.thought}
                    </p>
                  )}
                </div>

                {/* Duration */}
                {agent.status === 'complete' && agent.duration && (
                  <span className="flex-shrink-0 text-xs font-mono text-emerald-400/80 bg-emerald-500/10 px-2.5 py-1 rounded-lg ring-1 ring-emerald-500/20">
                    {(agent.duration / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-5 py-4 bg-slate-800/30 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="text-slate-400 font-medium">
              Pipeline Progress
            </span>
            <span className="text-white font-bold tabular-nums">
              {completedCount}/{totalCount} agents
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Architecture badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Multi-Agent Pipeline &bull; BaseAgent Framework &bull; Azure GPT
        </span>
      </div>
    </div>
  );
}
