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

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'answer', label: 'Simulated Answer', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'visibility', label: 'Visibility', icon: <Eye className="w-4 h-4" /> },
  { id: 'gaps', label: 'Gap Analysis', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'fixpack', label: 'Fix Pack', icon: <Wrench className="w-4 h-4" /> },
  { id: 'score', label: 'AEO Score', icon: <BarChart3 className="w-4 h-4" /> },
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

  const qualityColors = {
    excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700',
    good: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700',
    needs_improvement: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700',
    poor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700',
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          New Analysis
        </button>

        <div className="flex items-center gap-4">
          <ScoreGauge score={report.score.aeo_total} size={56} label="" />
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {report.score.aeo_total}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">AEO Score</div>
          </div>
        </div>
      </div>

      {/* Quality Review Banner */}
      {report.quality_review && (
        <div
          className={`p-4 rounded-xl border mb-4 ${
            qualityColors[report.quality_review.overall_quality]
          }`}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold">Quality Review</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/50 dark:bg-black/10">
                  {report.quality_review.overall_quality.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                {report.quality_review.executive_summary}
              </p>
              {report.quality_review.key_insights.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {report.quality_review.key_insights.slice(0, 3).map((insight, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-white/40 dark:bg-black/10"
                    >
                      {insight.length > 60 ? insight.slice(0, 60) + '...' : insight}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Citation Quick Status */}
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-4 ${
          report.visibility.is_cited
            ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30'
            : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
        }`}
      >
        {report.visibility.is_cited ? (
          <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Eye className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
        <span
          className={`text-sm font-semibold ${
            report.visibility.is_cited
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-red-700 dark:text-red-300'
          }`}
        >
          {report.visibility.is_cited
            ? `Your brand is cited (${report.visibility.citation_strength} strength)`
            : 'Your brand is NOT cited in the AI answer'}
        </span>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
          {report.gaps.length} gap{report.gaps.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Agent Pipeline Metadata */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {report.meta.agents.map((agent) => (
          <span
            key={agent.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap"
          >
            <span>{agent.emoji}</span>
            <span className="font-medium">{agent.name}</span>
            <span className="text-slate-400 dark:text-slate-500 font-mono">
              {(agent.duration / 1000).toFixed(1)}s
            </span>
          </span>
        ))}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-xs text-indigo-600 dark:text-indigo-400 whitespace-nowrap font-medium">
          <Clock className="w-3 h-3" />
          Total: {(report.meta.total_duration / 1000).toFixed(1)}s
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-xs text-purple-600 dark:text-purple-400 whitespace-nowrap font-medium">
          <Bot className="w-3 h-3" />
          {report.meta.model}
        </span>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'gaps' && report.gaps.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {report.gaps.length}
                </span>
              )}
            </button>
          ))}

          {/* Export button */}
          <button
            onClick={handleExport}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 mr-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
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
