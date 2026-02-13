import { BaseAgent } from './base-agent';
import { formatSourcesForPrompt } from '../normalize';
import type { Source, Agent1Output, Agent2Output } from '../types';

// ─── Input type ─────────────────────────────────────────────

export interface Agent2Input {
  agent1Output: Agent1Output;
  sources: Source[];
}

// ─── Agent Implementation ───────────────────────────────────

class VisibilityJudgeAgent extends BaseAgent<Agent2Input, Agent2Output> {
  readonly id = 'agent2';
  readonly name = 'Visibility Judge';
  readonly role = 'Brand Citation Evaluator';
  readonly emoji = '👁️';
  readonly description =
    'Evaluates how prominently the target brand (S1) was cited in the simulated AI answer compared to competitors';

  protected buildSystemPrompt(): string {
    return `SYSTEM RULES:
- Output ONLY valid JSON matching the schema below.
- No extra text outside JSON.
- Be precise with numerical scores.

TASK:
You are a brand visibility analyst. Evaluate how prominently the TARGET brand (source ID "S1") appears in the simulated AI answer.
Compare S1's presence against all other sources. Score prominence from 0.0 (invisible) to 1.0 (dominant).
Explain WHY with specific reasons. Identify which sources the AI preferred over S1 and why.`;
  }

  protected buildUserPrompt(input: Agent2Input): string {
    return `TARGET SOURCE ID: "S1" (this is the brand we are evaluating)

SIMULATED ANSWER (from Agent 1):
${JSON.stringify(input.agent1Output, null, 2)}

ALL SOURCES:
${formatSourcesForPrompt(input.sources)}

OUTPUT JSON SCHEMA:
{
  "is_cited": true,
  "prominence_score": 0.0,
  "citation_strength": "weak|medium|strong",
  "reasons": ["string explaining visibility assessment"],
  "what_ai_preferred": [
    { "preferred_source_id": "S2", "why": "string explaining why AI preferred this source" }
  ]
}

Return ONLY the JSON object.`;
  }
}

// ─── Export Singleton ───────────────────────────────────────

export const visibilityJudge = new VisibilityJudgeAgent();
