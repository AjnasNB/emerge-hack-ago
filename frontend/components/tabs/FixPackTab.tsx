'use client';

import {
  FileText,
  HelpCircle,
  GitCompare,
  Building2,
  Code,
  Link2,
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
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 border border-indigo-100 dark:border-indigo-800/30">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          <span className="font-semibold">AI Visibility Fix Pack</span> — Copy-paste these blocks into your content to improve AI answer engine citations.
        </p>
      </div>

      {/* Answer Block */}
      <Section
        icon={<FileText className="w-4 h-4" />}
        title="Answer Block"
        description="Add this at the top of your page to directly answer the query"
      >
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <CopyButton text={fix_pack.answer_block} />
          </div>
          <pre className="p-4 pr-24 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
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
        >
          <div className="space-y-3">
            {fix_pack.faq.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative"
              >
                <div className="absolute top-3 right-3">
                  <CopyButton
                    text={`Q: ${item.q}\nA: ${item.a}`}
                    label="Copy Q&A"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2 pr-24">
                  Q: {item.q}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  A: {item.a}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <CopyButton
              text={fix_pack.faq
                .map((f) => `Q: ${f.q}\nA: ${f.a}`)
                .join('\n\n')}
              label="Copy All FAQs"
              className="w-full justify-center py-2"
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
        >
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <CopyButton text={fix_pack.comparison_snippet} />
            </div>
            <pre className="p-4 pr-24 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
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
        >
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 relative">
            <div className="absolute top-3 right-3">
              <CopyButton
                text={JSON.stringify(fix_pack.entity_summary, null, 2)}
                label="Copy JSON"
              />
            </div>
            <EntityField
              label="Organization"
              value={fix_pack.entity_summary.organization}
            />
            <EntityField
              label="Product / Service"
              value={fix_pack.entity_summary.product_or_service}
            />
            <EntityField
              label="Ideal For"
              value={fix_pack.entity_summary.ideal_for?.join(', ')}
            />
            <EntityField
              label="Key Features"
              value={fix_pack.entity_summary.key_features?.join(', ')}
            />
            <EntityField
              label="Differentiators"
              value={fix_pack.entity_summary.differentiators?.join(', ')}
            />
            <EntityField
              label="Trust Signals to Add"
              value={fix_pack.entity_summary.trust_signals_to_add?.join(', ')}
              highlight
            />
          </div>
        </Section>
      )}

      {/* Schema Suggestions */}
      {fix_pack.schema_suggestions && fix_pack.schema_suggestions.length > 0 && (
        <Section
          icon={<Code className="w-4 h-4" />}
          title="Schema Markup Suggestions"
          description="Add these structured data types to your page"
        >
          <div className="space-y-2">
            {fix_pack.schema_suggestions.map((schema, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-mono font-bold flex-shrink-0">
                  {schema.type}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Fields: {schema.fields?.join(', ')}
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
        >
          <div className="flex flex-wrap gap-2">
            {fix_pack.internal_link_anchors.map((anchor, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <Link2 className="w-3 h-3 text-slate-400" />
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
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
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
        {label}
      </span>
      <span
        className={`text-sm ${
          highlight
            ? 'text-amber-700 dark:text-amber-400 font-medium'
            : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
