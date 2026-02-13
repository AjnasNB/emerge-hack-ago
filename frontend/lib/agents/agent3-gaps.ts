import { BaseAgent } from './base-agent';
import { formatSourcesForPrompt } from '../normalize';
import type { Source, Agent1Output, Agent2Output, Agent3Output } from '../types';

// ─── Input type ─────────────────────────────────────────────

export interface Agent3Input {
  query: string;
  agent1Output: Agent1Output;
  agent2Output: Agent2Output;
  sources: Source[];
}

// ─── Agent Implementation ───────────────────────────────────

class GapAnalyzerAgent extends BaseAgent<Agent3Input, Agent3Output> {
  readonly id = 'agent3';
  readonly name = 'Gap Analyzer';
  readonly role = 'Content Gap Explainer';
  readonly emoji = '🔍';
  readonly description =
    'Identifies exactly WHY the target brand content was not selected or weakly cited, with evidence quotes and actionable fix instructions';

  protected buildSystemPrompt(): string {
    return `SYSTEM RULES:
- Output ONLY valid JSON matching the schema below.
- No extra text outside JSON.
- Provide actionable gaps with REAL evidence quotes from the actual source content.
- Be specific — reference actual phrases and structure from the sources.
- Each gap must include a concrete fix instruction.

TASK:
You are an AI visibility gap analyst. Your job is to explain why the target source S1 was NOT selected
or was only WEAKLY cited in the simulated AI answer. Compare S1 against competitor sources.
Classify each gap into a specific category and severity level.

CATEGORIES (use exactly these strings):
- direct_answer_missing
- weak_structure_for_summarization
- missing_definitions
- missing_faq
- missing_comparison
- missing_trust_signals
- missing_specificity
- outdated_or_uncertain_info
- over_marketing_language`;
  }

  protected buildUserPrompt(input: Agent3Input): string {
    return `USER QUERY:
${input.query}

SIMULATED ANSWER (from Agent 1):
${JSON.stringify(input.agent1Output, null, 2)}

VISIBILITY ASSESSMENT (from Agent 2):
${JSON.stringify(input.agent2Output, null, 2)}

ALL SOURCES:
${formatSourcesForPrompt(input.sources)}

OUTPUT JSON SCHEMA:
{
  "overall_diagnosis": "string (1-2 sentence summary of why S1 underperforms)",
  "gaps": [
    {
      "category": "one of the categories above",
      "severity": "low|medium|high",
      "what_is_missing": "string (specific thing that is missing)",
      "why_it_matters_for_ai": "string (why AI engines care about this)",
      "evidence_target": { "quote": "string (actual quote from S1 or 'N/A')", "source_id": "S1" },
      "evidence_other": { "quote": "string (actual quote from competitor or 'N/A')", "source_id": "S2" },
      "fix_instruction": "string (specific, actionable instruction)"
    }
  ],
  "top_3_quick_wins": ["string","string","string"]
}

Find at least 3-5 gaps. Be thorough. Return ONLY the JSON object.`;
  }
}

// ─── Export Singleton ───────────────────────────────────────

export const gapAnalyzer = new GapAnalyzerAgent();
