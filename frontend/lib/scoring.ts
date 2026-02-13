import type { Agent2Output, Agent3Output, Score, ScoreBreakdown, GapCategory } from './types';

/**
 * Deterministic AEO Scoring Engine.
 * 
 * Breakdown weights (total 100):
 *   Direct Answer Block: 20
 *   FAQ Coverage: 20
 *   Definitions/Concept clarity: 15
 *   Comparison readiness: 15
 *   Trust/Authority signals: 10
 *   Structure/Summarizability: 10
 *   Citation result: 10
 */
export function computeScore(
  agent2: Agent2Output,
  agent3: Agent3Output
): Score {
  const breakdown = computeBreakdown(agent2, agent3);

  const aeo_total =
    breakdown.direct_answer +
    breakdown.faq +
    breakdown.definitions +
    breakdown.comparison +
    breakdown.trust +
    breakdown.structure +
    breakdown.citation;

  return {
    aeo_total,
    breakdown,
  };
}

function computeBreakdown(
  agent2: Agent2Output,
  agent3: Agent3Output
): ScoreBreakdown {
  return {
    direct_answer: hasHighSeverityGap(agent3, 'direct_answer_missing') ? 0 : 20,
    faq: hasHighSeverityGap(agent3, 'missing_faq') ? 0 : 20,
    definitions: hasHighSeverityGap(agent3, 'missing_definitions') ? 0 : 15,
    comparison: hasHighSeverityGap(agent3, 'missing_comparison') ? 0 : 15,
    trust: hasHighSeverityGap(agent3, 'missing_trust_signals') ? 0 : 10,
    structure: hasHighSeverityGap(agent3, 'weak_structure_for_summarization') ? 0 : 10,
    citation: agent2.is_cited ? 10 : 0,
  };
}

function hasHighSeverityGap(
  agent3: Agent3Output,
  category: GapCategory
): boolean {
  return agent3.gaps.some(
    (gap) => gap.category === category && gap.severity === 'high'
  );
}
