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
  Globe,
  Loader2,
  Download,
  AlertCircle,
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
  const [targetUrl, setTargetUrl] = useState('');
  const [competitors, setCompetitors] = useState<(CompetitorInput & { url?: string })[]>([]);
  const [engineMode, setEngineMode] = useState<EngineMode>('chat');
  const [generateSynthetic, setGenerateSynthetic] = useState(true);
  const [showCompetitors, setShowCompetitors] = useState(false);

  // Loading states
  const [scrapingTarget, setScrapingTarget] = useState(false);
  const [scrapingCompetitor, setScrapingCompetitor] = useState<number | null>(null);
  const [searchingCompetitors, setSearchingCompetitors] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  // ─── Demo presets ─────────────────────────────────────────
  const loadPreset = (preset: DemoPreset) => {
    setQuery(preset.data.query);
    setBrandName(preset.data.target.brand);
    setTargetContent(preset.data.target.content);
    setTargetUrl('');
    setCompetitors(preset.data.competitors);
    setEngineMode(preset.data.engine_mode);
    setShowCompetitors(preset.data.competitors.length > 0);
    setGenerateSynthetic(preset.data.competitors.length === 0);
    setScrapeError(null);
  };

  // ─── URL scraping ────────────────────────────────────────
  const scrapeTarget = async () => {
    if (!targetUrl.trim()) return;
    setScrapingTarget(true);
    setScrapeError(null);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scrape failed');
      setTargetContent(data.content);
      if (data.brand && !brandName) setBrandName(data.brand);
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : 'Failed to fetch URL');
    } finally {
      setScrapingTarget(false);
    }
  };

  const scrapeCompetitor = async (index: number) => {
    const comp = competitors[index];
    if (!comp?.url?.trim()) return;
    setScrapingCompetitor(index);
    setScrapeError(null);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: comp.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scrape failed');
      const updated = [...competitors];
      updated[index] = {
        ...updated[index],
        content: data.content,
        brand: data.brand || updated[index].brand,
      };
      setCompetitors(updated);
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : 'Failed to fetch competitor URL');
    } finally {
      setScrapingCompetitor(null);
    }
  };

  // ─── Search & import competitors ─────────────────────────
  const searchAndImportCompetitors = async () => {
    if (!query.trim()) {
      setScrapeError('Enter a query first so we know what to search for');
      return;
    }
    setSearchingCompetitors(true);
    setScrapeError(null);
    try {
      const res = await fetch('/api/search-competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, brand: brandName, count: 3 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');

      if (data.competitors && data.competitors.length > 0) {
        const newComps = data.competitors.map((c: { brand: string; content: string; url: string }) => ({
          brand: c.brand,
          content: c.content,
          url: c.url,
        }));
        setCompetitors((prev) => [...prev, ...newComps]);
        setShowCompetitors(true);
        setGenerateSynthetic(false);
      } else {
        setScrapeError('No competitors found via web search. Try pasting URLs manually or use synthetic competitors.');
      }
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : 'Competitor search failed');
    } finally {
      setSearchingCompetitors(false);
    }
  };

  // ─── Competitor CRUD ─────────────────────────────────────
  const addCompetitor = () => {
    setCompetitors([...competitors, { brand: '', content: '', url: '' }]);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index: number, field: string, value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    setCompetitors(updated);
  };

  // ─── Submit ──────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      query,
      target: { brand: brandName, content: targetContent },
      competitors: competitors.map(({ brand, content }) => ({ brand, content })),
      engine_mode: engineMode,
      generate_synthetic_competitors: generateSynthetic && competitors.length === 0,
    });
  };

  const isValid = query.trim() && brandName.trim() && targetContent.trim();

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          AI Answer Engine Optimization
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          AEO/GEO{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Copilot
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">
          Paste content or a website URL — we analyze why AI engines skip your brand and give you fix packs to get cited.
        </p>
      </div>

      {/* Demo Presets */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Try a demo:
        </span>
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => loadPreset(preset)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer"
          >
            <Beaker className="w-3.5 h-3.5" />
            {preset.name}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {scrapeError && (
        <div className="max-w-3xl mx-auto mb-4 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{scrapeError}</span>
            <button onClick={() => setScrapeError(null)} className="ml-auto text-amber-400 hover:text-amber-300 cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="bg-slate-900/70 rounded-2xl shadow-2xl shadow-black/30 border border-slate-700/50 backdrop-blur-sm p-6 md:p-8 space-y-6">
          {/* Query */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <Search className="w-4 h-4 text-indigo-500" />
              User Query
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What is the best online learning platform for corporate training?"
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              The question a user would ask an AI assistant
            </p>
          </div>

          {/* Brand Name + Engine Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                <Building2 className="w-4 h-4 text-indigo-500" />
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. LearnFlow"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                <Zap className="w-4 h-4 text-indigo-500" />
                Engine Mode
              </label>
              <select
                value={engineMode}
                onChange={(e) => setEngineMode(e.target.value as EngineMode)}
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="chat">Chat (Conversational)</option>
                <option value="search_card">Search Card (Compact)</option>
                <option value="enterprise">Enterprise (Formal)</option>
              </select>
            </div>
          </div>

          {/* Target URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              Website URL
              <span className="text-xs font-normal text-slate-500">(auto-extract content)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com/your-page"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); scrapeTarget(); } }}
              />
              <button
                type="button"
                onClick={scrapeTarget}
                disabled={!targetUrl.trim() || scrapingTarget}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap"
              >
                {scrapingTarget ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {scrapingTarget ? 'Fetching...' : 'Fetch'}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Paste a URL and click Fetch to auto-extract page content, or type/paste content below
            </p>
          </div>

          {/* Target Content */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Target Content
              {targetContent && (
                <span className="text-xs font-normal text-slate-400">
                  ({targetContent.split(/\s+/).filter(Boolean).length} words)
                </span>
              )}
            </label>
            <textarea
              value={targetContent}
              onChange={(e) => setTargetContent(e.target.value)}
              placeholder="Paste your brand's content here, or fetch it from a URL above"
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all resize-y"
            />
          </div>

          {/* Competitor Section */}
          <div className="border border-slate-700/50 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowCompetitors(!showCompetitors)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Competitor Content
                <span className="text-xs font-normal text-slate-400">(optional)</span>
                {competitors.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {competitors.length}
                  </span>
                )}
              </span>
              {showCompetitors ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showCompetitors && (
              <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50 pt-4">
                {/* Search & Import button */}
                <button
                  type="button"
                  onClick={searchAndImportCompetitors}
                  disabled={searchingCompetitors || !query.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-semibold hover:from-cyan-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {searchingCompetitors ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching the web & importing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search & Import Competitors from Web
                    </>
                  )}
                </button>

                {/* Competitor cards */}
                {competitors.map((comp, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Competitor {index + 1}
                        {comp.url && (
                          <span className="ml-2 font-normal text-indigo-500 dark:text-indigo-400">
                            {new URL(comp.url.startsWith('http') ? comp.url : 'https://' + comp.url).hostname}
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCompetitor(index)}
                        className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Competitor URL */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={comp.url || ''}
                        onChange={(e) => updateCompetitor(index, 'url', e.target.value)}
                        placeholder="https://competitor.com/page"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => scrapeCompetitor(index)}
                        disabled={!comp.url?.trim() || scrapingCompetitor === index}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 ring-1 ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap"
                      >
                        {scrapingCompetitor === index ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        Fetch
                      </button>
                    </div>

                    <input
                      type="text"
                      value={comp.brand}
                      onChange={(e) => updateCompetitor(index, 'brand', e.target.value)}
                      placeholder="Competitor brand name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                    />
                    <textarea
                      value={comp.content}
                      onChange={(e) => updateCompetitor(index, 'content', e.target.value)}
                      placeholder="Paste competitor content here or fetch from URL above..."
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-y"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCompetitor}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-700 text-sm font-medium text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Competitor Manually
                </button>

                {competitors.length === 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/15">
                    <label className="flex items-center gap-2 text-sm text-indigo-300 cursor-pointer">
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
            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/15">
              <label className="flex items-center gap-2 text-sm text-indigo-300 cursor-pointer">
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
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer"
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
