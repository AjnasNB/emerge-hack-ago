import type { AnalyzeRequest, Source } from './types';

const MAX_CONTENT_LENGTH = 6000; // Stay within model context limits

/**
 * Normalize request inputs into a canonical sources array.
 * S1 = target brand, S2..Sn = competitors.
 */
export function normalizeSources(request: AnalyzeRequest): Source[] {
  const sources: Source[] = [];

  // S1 = target brand
  sources.push({
    id: 'S1',
    brand: request.target.brand.trim(),
    content: trimContent(request.target.content),
    is_target: true,
  });

  // S2..Sn = competitors
  request.competitors.forEach((comp, index) => {
    if (comp.content.trim()) {
      sources.push({
        id: `S${index + 2}`,
        brand: comp.brand.trim(),
        content: trimContent(comp.content),
        is_target: false,
      });
    }
  });

  return sources;
}

/**
 * Format sources array as JSON string for LLM prompts.
 */
export function formatSourcesForPrompt(sources: Source[]): string {
  return JSON.stringify(
    sources.map((s) => ({
      source_id: s.id,
      brand: s.brand,
      content: s.content,
    })),
    null,
    2
  );
}

/**
 * Trim content to stay within context limits.
 */
function trimContent(content: string): string {
  const trimmed = content.trim();
  if (trimmed.length <= MAX_CONTENT_LENGTH) {
    return trimmed;
  }
  return trimmed.slice(0, MAX_CONTENT_LENGTH) + '\n\n[Content truncated for analysis]';
}
