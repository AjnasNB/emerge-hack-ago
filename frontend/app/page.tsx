'use client';

import { useState, useCallback } from 'react';
import InputForm from '@/components/InputForm';
import LoadingPipeline, {
  DEFAULT_AGENTS,
  type AgentStatus,
} from '@/components/LoadingPipeline';
import ResultsDashboard from '@/components/ResultsDashboard';
import type { AnalyzeRequest, AnalyzeReport } from '@/lib/types';

type ViewState = 'input' | 'loading' | 'results';

export default function Home() {
  const [view, setView] = useState<ViewState>('input');
  const [agents, setAgents] = useState<AgentStatus[]>(DEFAULT_AGENTS);
  const [report, setReport] = useState<AnalyzeReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Stream event handler ─────────────────────────────────

  const handleSubmit = useCallback(async (data: AnalyzeRequest) => {
    setView('loading');
    setError(null);
    setAgents(DEFAULT_AGENTS.map((a) => ({ ...a, status: 'pending' as const })));

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Analysis failed (${response.status})`);
      }

      if (!response.body) throw new Error('No response stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data: ')) continue;

          try {
            const event = JSON.parse(line.slice(6));

            switch (event.type) {
              case 'agent_start':
                setAgents((prev) =>
                  prev.map((a) =>
                    a.id === event.agentId
                      ? { ...a, status: 'running' as const, thought: 'Starting...' }
                      : a
                  )
                );
                break;

              case 'agent_thought':
                setAgents((prev) =>
                  prev.map((a) =>
                    a.id === event.agentId
                      ? { ...a, thought: event.thought }
                      : a
                  )
                );
                break;

              case 'agent_complete':
                setAgents((prev) =>
                  prev.map((a) =>
                    a.id === event.agentId
                      ? {
                          ...a,
                          status: 'complete' as const,
                          duration: event.duration,
                          thought: undefined,
                        }
                      : a
                  )
                );
                break;

              case 'complete':
                setReport(event.report);
                setView('results');
                break;

              case 'error':
                throw new Error(event.message);
            }
          } catch (parseErr) {
            if (
              parseErr instanceof Error &&
              !parseErr.message.includes('JSON')
            ) {
              throw parseErr;
            }
          }
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setView('input');
    }
  }, []);

  const handleBack = useCallback(() => {
    setView('input');
    setReport(null);
    setError(null);
    setAgents(DEFAULT_AGENTS);
  }, []);

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-12 md:py-16">
        {/* Error toast */}
        {error && view === 'input' && (
          <div className="max-w-3xl mx-auto mb-6 animate-slide-up">
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-300">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold">Analysis Failed</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        {view === 'input' && (
          <InputForm onSubmit={handleSubmit} isLoading={false} />
        )}

        {view === 'loading' && <LoadingPipeline agents={agents} />}

        {view === 'results' && report && (
          <ResultsDashboard report={report} onBack={handleBack} />
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-slate-400 dark:text-slate-600">
        AEO/GEO Copilot — Multi-Agent System powered by Azure GPT
      </footer>
    </div>
  );
}
