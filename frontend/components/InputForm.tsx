'use client';

import { useState } from 'react';
import {
  Search,
  Building2,
  FileText,
  Users,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Beaker,
} from 'lucide-react';
import type { AnalyzeRequest, EngineMode, CompetitorInput } from '@/lib/types';
import type { DemoPreset } from '@/lib/types';
import { DEMO_PRESETS } from '@/lib/demo-presets';

interface InputFormProps {
  onSubmit: (data: AnalyzeRequest) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [query, setQuery] = useState('');
  const [brandName, setBrandName] = useState('');
  const [targetContent, setTargetContent] = useState('');
  const [competitors, setCompetitors] = useState<CompetitorInput[]>([]);
  const [engineMode, setEngineMode] = useState<EngineMode>('chat');
  const [generateSynthetic, setGenerateSynthetic] = useState(true);
  const [showCompetitors, setShowCompetitors] = useState(false);

  const loadPreset = (preset: DemoPreset) => {
    setQuery(preset.data.query);
    setBrandName(preset.data.target.brand);
    setTargetContent(preset.data.target.content);
    setCompetitors(preset.data.competitors);
    setEngineMode(preset.data.engine_mode);
    setShowCompetitors(preset.data.competitors.length > 0);
    setGenerateSynthetic(preset.data.competitors.length === 0);
  };

  const addCompetitor = () => {
    setCompetitors([...competitors, { brand: '', content: '' }]);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index: number, field: keyof CompetitorInput, value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    setCompetitors(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      query,
      target: { brand: brandName, content: targetContent },
      competitors,
      engine_mode: engineMode,
      generate_synthetic_competitors: generateSynthetic && competitors.length === 0,
    });
  };

  const isValid = query.trim() && brandName.trim() && targetContent.trim();

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          AI Answer Engine Optimization
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          AEO/GEO{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Copilot
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Understand why AI answer engines skip your brand — and get actionable fix packs to get cited.
        </p>
      </div>

      {/* Demo Presets */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Try a demo:
        </span>
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => loadPreset(preset)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all duration-200 cursor-pointer"
          >
            <Beaker className="w-3.5 h-3.5" />
            {preset.name}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 space-y-6">
          {/* Query */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Search className="w-4 h-4 text-indigo-500" />
              User Query
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What is the best online learning platform for corporate training?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
            />
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
              The question a user would ask an AI assistant
            </p>
          </div>

          {/* Brand Name + Engine Mode row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Building2 className="w-4 h-4 text-indigo-500" />
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. LearnFlow"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Zap className="w-4 h-4 text-indigo-500" />
                Engine Mode
              </label>
              <select
                value={engineMode}
                onChange={(e) => setEngineMode(e.target.value as EngineMode)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all appearance-none cursor-pointer"
              >
                <option value="chat">Chat (Conversational)</option>
                <option value="search_card">Search Card (Compact)</option>
                <option value="enterprise">Enterprise (Formal)</option>
              </select>
            </div>
          </div>

          {/* Target Content */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Target Content
            </label>
            <textarea
              value={targetContent}
              onChange={(e) => setTargetContent(e.target.value)}
              placeholder="Paste your brand's content here (landing page copy, blog post, documentation, etc.)"
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all resize-y"
            />
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
              The content you want AI engines to cite when answering the query
            </p>
          </div>

          {/* Competitor Section */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowCompetitors(!showCompetitors)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Competitor Content
                <span className="text-xs font-normal text-slate-400">(optional)</span>
              </span>
              {showCompetitors ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showCompetitors && (
              <div className="px-4 pb-4 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                {competitors.map((comp, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Competitor {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCompetitor(index)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={comp.brand}
                      onChange={(e) => updateCompetitor(index, 'brand', e.target.value)}
                      placeholder="Competitor brand name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                    />
                    <textarea
                      value={comp.content}
                      onChange={(e) => updateCompetitor(index, 'content', e.target.value)}
                      placeholder="Paste competitor content here..."
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-y"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCompetitor}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Competitor
                </button>

                {competitors.length === 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                    <label className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generateSynthetic}
                        onChange={(e) => setGenerateSynthetic(e.target.checked)}
                        className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <Sparkles className="w-4 h-4" />
                      Auto-generate synthetic competitors using AI
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Generate Synthetic (when competitors hidden) */}
          {!showCompetitors && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
              <label className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateSynthetic}
                  onChange={(e) => setGenerateSynthetic(e.target.checked)}
                  className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Sparkles className="w-4 h-4" />
                Auto-generate synthetic competitors for comparison
              </label>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Analyze AI Visibility
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
