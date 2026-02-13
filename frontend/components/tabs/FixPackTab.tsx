'use client';

import {
  FileText,
  HelpCircle,
  GitCompare,
  Building2,
  Code,
  Link2,
  Sparkles,
} from 'lucide-react';
import CopyButton from '@/components/ui/CopyButton';
import type { AnalyzeReport } from '@/lib/types';

interface Props {
  report: AnalyzeReport;
}

export default function FixPackTab({ report }: Props) {
  const { fix_pack } = report;

  return (
    <div className="space-y-6 stagger-children">
      {/* Intro */}
      <div className="relative p-5 rounded-xl bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-cyan-500/10 border border-violet-500/20 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center ring-1 ring-violet-500/20">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Visibility Fix Pack</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Copy-paste these blocks into your content to improve AI answer engine citations.
            </p>
          </div>
        </div>
      </div>

      {/* Answer Block */}
      <Section
        icon={<FileText className="w-4 h-4" />}
        title="Answer Block"
        description="Add this at the top of your page to directly answer the query"
        color="indigo"
      >
        <div className="relative group">
          <div className="absolute top-3 right-3 z-10">
            <CopyButton text={fix_pack.answer_block} />
          </div>
          <pre className="p-5 pr-20 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto font-sans group-hover:border-indigo-500/20 transition-colors">
            {fix_pack.answer_block}
          </pre>
        </div>
      </Section>

      {/* FAQ */}
      {fix_pack.faq && fix_pack.faq.length > 0 && (
        <Section
          icon={<HelpCircle className="w-4 h-4" />}
          title="FAQ Section"
          description="Add a structured FAQ section with these Q&A pairs"
          color="cyan"
        >
          <div className="space-y-3">
            {fix_pack.faq.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 relative group hover:border-cyan-500/20 transition-colors"
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={`Q: ${item.q}\nA: ${item.a}`} label="Copy" />
                </div>
                <p className="text-sm font-semibold text-white mb-2 pr-20">
                  Q: {item.q}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A: {item.a}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <CopyButton
              text={fix_pack.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}
              label="Copy All FAQs"
              className="w-full justify-center py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/20 transition-colors"
            />
          </div>
        </Section>
      )}

      {/* Comparison Snippet */}
      {fix_pack.comparison_snippet && (
        <Section
          icon={<GitCompare className="w-4 h-4" />}
          title="Comparison Snippet"
          description="A neutral comparison to help AI engines understand your positioning"
          color="amber"
        >
          <div className="relative group">
            <div className="absolute top-3 right-3 z-10">
              <CopyButton text={fix_pack.comparison_snippet} />
            </div>
            <pre className="p-5 pr-20 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto font-sans group-hover:border-amber-500/20 transition-colors">
              {fix_pack.comparison_snippet}
            </pre>
          </div>
        </Section>
      )}

      {/* Entity Summary */}
      {fix_pack.entity_summary && (
        <Section
          icon={<Building2 className="w-4 h-4" />}
          title="Entity Summary"
          description="Structured entity data for knowledge graph compatibility"
          color="emerald"
        >
          <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-4 relative">
            <div className="absolute top-3 right-3">
              <CopyButton
                text={JSON.stringify(fix_pack.entity_summary, null, 2)}
                label="JSON"
              />
            </div>
            <EntityField label="Organization" value={fix_pack.entity_summary.organization} />
            <EntityField label="Product / Service" value={fix_pack.entity_summary.product_or_service} />
            <EntityField label="Ideal For" value={fix_pack.entity_summary.ideal_for?.join(' · ')} />
            <EntityField label="Key Features" value={fix_pack.entity_summary.key_features?.join(' · ')} />
            <EntityField label="Differentiators" value={fix_pack.entity_summary.differentiators?.join(' · ')} />
            <EntityField label="Trust Signals to Add" value={fix_pack.entity_summary.trust_signals_to_add?.join(' · ')} highlight />
          </div>
        </Section>
      )}

      {/* Schema Suggestions */}
      {fix_pack.schema_suggestions && fix_pack.schema_suggestions.length > 0 && (
        <Section
          icon={<Code className="w-4 h-4" />}
          title="Schema Markup"
          description="Add these structured data types to your page"
          color="violet"
        >
          <div className="space-y-2">
            {fix_pack.schema_suggestions.map((schema, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-violet-500/20 transition-colors"
              >
                <span className="px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-400 text-xs font-mono font-bold ring-1 ring-violet-500/20 flex-shrink-0">
                  {schema.type}
                </span>
                <span className="text-sm text-slate-400">
                  {schema.fields?.join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Internal Link Anchors */}
      {fix_pack.internal_link_anchors && fix_pack.internal_link_anchors.length > 0 && (
        <Section
          icon={<Link2 className="w-4 h-4" />}
          title="Internal Link Anchors"
          description="Suggested anchor text for internal linking"
          color="sky"
        >
          <div className="flex flex-wrap gap-2">
            {fix_pack.internal_link_anchors.map((anchor, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/40 text-sm text-slate-300 border border-slate-700/50 hover:border-sky-500/20 transition-colors"
              >
                <Link2 className="w-3 h-3 text-sky-400/50" />
                {anchor}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Helper components ──────────────────────────────────────

function Section({
  icon,
  title,
  description,
  children,
  color = 'indigo',
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  color?: string;
}) {
  const iconColors: Record<string, string> = {
    indigo: 'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/20',
    cyan: 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/20',
    amber: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20',
    emerald: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20',
    violet: 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/20',
    sky: 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/20',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColors[color]}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function EntityField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
        {label}
      </span>
      <span className={`text-sm leading-relaxed ${
        highlight ? 'text-amber-400 font-medium' : 'text-slate-300'
      }`}>
        {value}
      </span>
    </div>
  );
}
