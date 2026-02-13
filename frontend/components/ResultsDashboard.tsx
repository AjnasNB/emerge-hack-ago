'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Eye,
  AlertTriangle,
  Wrench,
  BarChart3,
  ArrowLeft,
  Download,
  Sparkles,
  Clock,
  Bot,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
} from 'lucide-react';
import ScoreGauge from '@/components/ui/ScoreGauge';
import SimulatedAnswerTab from '@/components/tabs/SimulatedAnswerTab';
import VisibilityTab from '@/components/tabs/VisibilityTab';
import GapsTab from '@/components/tabs/GapsTab';
import FixPackTab from '@/components/tabs/FixPackTab';
import ScoreTab from '@/components/tabs/ScoreTab';
import type { AnalyzeReport } from '@/lib/types';

interface ResultsDashboardProps {
  report: AnalyzeReport;
  onBack: () => void;
}

type TabId = 'answer' | 'visibility' | 'gaps' | 'fixpack' | 'score';

const TABS: { id: TabId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'answer', label: 'AI Answer', icon: <MessageSquare className="w-4 h-4" />, color: 'indigo' },
  { id: 'visibility', label: 'Visibility', icon: <Eye className="w-4 h-4" />, color: 'emerald' },
  { id: 'gaps', label: 'Gap Analysis', icon: <AlertTriangle className="w-4 h-4" />, color: 'amber' },
  { id: 'fixpack', label: 'Fix Pack', icon: <Wrench className="w-4 h-4" />, color: 'violet' },
  { id: 'score', label: 'Score', icon: <BarChart3 className="w-4 h-4" />, color: 'cyan' },
];

export default function ResultsDashboard({ report, onBack }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('answer');

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeo-report-${report.meta.request_id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scoreColor =
    report.score.aeo_total >= 80
      ? 'emerald'
      : report.score.aeo_total >= 60
      ? 'amber'
      : report.score.aeo_total >= 40
      ? 'orange'
      : 'red';

  const qualityColors: Record<string, string> = {
    excellent: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    good: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    needs_improvement: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400',
    poor: 'from-red-500/10 to-red-500/5 border-red-500/20 text-red-400',
  };

  const highGaps = report.gaps.filter(g => g.severity === 'high').length;
  const medGaps = report.gaps.filter(g => g.severity === 'medium').length;

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* ─── Back Button Row ───────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          New Analysis
        </button>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>

      {/* ─── Hero Score Section ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 p-8 mb-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-20 -right-20 w-60 h-60 bg-${scoreColor}-500/10 rounded-full blur-3xl`} />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Score Gauge */}
          <div className="flex-shrink-0 animate-count-up">
            <ScoreGauge score={report.score.aeo_total} size={160} />
          </div>

          {/* Score Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Analysis Complete
              </h2>
              <p className="text-slate-400 text-sm">
                {report.meta.agents.length} agents analyzed your content in{' '}
                <span className="text-indigo-400 font-medium">
                  {(report.meta.total_duration / 1000).toFixed(1)}s
                </span>
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${
                report.visibility.is_cited
                  ? 'from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20'
                  : 'from-red-500/10 to-red-500/5 border border-red-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Eye className={`w-3.5 h-3.5 ${report.visibility.is_cited ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Citation</span>
                </div>
                <p className={`text-sm font-bold ${report.visibility.is_cited ? 'text-emerald-400' : 'text-red-400'}`}>
                  {report.visibility.is_cited ? report.visibility.citation_strength : 'Not Cited'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gaps</span>
                </div>
                <p className="text-sm font-bold text-amber-400">
                  {report.gaps.length} found
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prominence</span>
                </div>
                <p className="text-sm font-bold text-violet-400">
                  {Math.round(report.visibility.prominence_score * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Quality Review Card ──────────────────────────── */}
      {report.quality_review && (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${
          qualityColors[report.quality_review.overall_quality] || qualityColors.good
        } border p-5 mb-6`}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-sm font-bold text-white">Quality Review</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80">
                  {report.quality_review.overall_quality.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                {report.quality_review.executive_summary}
              </p>
              {report.quality_review.recommendations && report.quality_review.recommendations.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {report.quality_review.recommendations.slice(0, 3).map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <ChevronRight className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Priority Alerts ──────────────────────────────── */}
      {highGaps > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6 animate-slide-up">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-red-300 font-medium">
              <span className="font-bold">{highGaps} critical gap{highGaps !== 1 ? 's' : ''}</span> found
              {medGaps > 0 ? ` and ${medGaps} medium` : ''} — check the Fix Pack tab for ready-to-use content blocks
            </p>
          </div>
          <button
            onClick={() => setActiveTab('fixpack')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-semibold hover:bg-red-500/30 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-3 h-3" />
            Fix Now
          </button>
        </div>
      )}

      {/* ─── Agent Pipeline Bar ───────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {report.meta.agents.map((agent) => (
          <span
            key={agent.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-xs text-slate-400 whitespace-nowrap border border-slate-700/50 hover:border-slate-600 transition-colors"
          >
            <span>{agent.emoji}</span>
            <span className="font-medium text-slate-300">{agent.name}</span>
            <span className="text-slate-500 font-mono text-[10px]">
              {(agent.duration / 1000).toFixed(1)}s
            </span>
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-xs text-indigo-400 whitespace-nowrap font-medium border border-indigo-500/20">
          <Bot className="w-3 h-3" />
          {report.meta.model}
        </span>
      </div>

      {/* ─── Tabbed Content ───────────────────────────────── */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-700/50 overflow-hidden shadow-2xl shadow-black/20">
        {/* Tab Bar */}
        <div className="flex items-center gap-1 p-1.5 bg-slate-800/50 border-b border-slate-700/50 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-700/80 text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'gaps' && report.gaps.length > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'gaps'
                    ? 'bg-red-500/30 text-red-300'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {report.gaps.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8 animate-fade-in" key={activeTab}>
          {activeTab === 'answer' && <SimulatedAnswerTab report={report} />}
          {activeTab === 'visibility' && <VisibilityTab report={report} />}
          {activeTab === 'gaps' && <GapsTab report={report} />}
          {activeTab === 'fixpack' && <FixPackTab report={report} />}
          {activeTab === 'score' && <ScoreTab report={report} />}
        </div>
      </div>
    </div>
  );
}
