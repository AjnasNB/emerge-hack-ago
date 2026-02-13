import { BaseAgent } from './base-agent';
import type { Agent3Output, Agent4Output } from '../types';

// ─── Input type ─────────────────────────────────────────────

export interface Agent4Input {
  query: string;
  targetContent: string;
  agent3Output: Agent3Output;
}

// ─── Agent Implementation ───────────────────────────────────

class FixPackGeneratorAgent extends BaseAgent<Agent4Input, Agent4Output> {
  readonly id = 'agent4';
  readonly name = 'Fix Pack Generator';
  readonly role = 'AI-Ready Content Builder';
  readonly emoji = '🔧';
  readonly description =
    'Generates copy-paste-ready content blocks (answer block, FAQs, comparison, entity summary, schema suggestions) to fix the identified gaps';

  protected buildSystemPrompt(): string {
    return `SYSTEM RULES:
- Output ONLY valid JSON matching the schema below.
- No extra text outside JSON.
- Do NOT invent product claims. Use placeholders like [ADD PROOF: case study] or [INSERT STAT] where specific evidence is needed.
- Make all content AI-ready: clear structure, direct answers, factual tone, no marketing fluff.
- The fix pack should directly address each gap identified by the Gap Analyzer.

TASK:
You are an AI Visibility Content Engineer. Generate a complete Fix Pack for the target brand
based on the gaps analysis. Every block must be copy-paste-ready and optimized for AI answer engine citation.`;
  }

  protected buildUserPrompt(input: Agent4Input): string {
    return `USER QUERY:
${input.query}

CURRENT TARGET CONTENT (S1):
${input.targetContent}

GAPS ANALYSIS (from Agent 3):
${JSON.stringify(input.agent3Output, null, 2)}

OUTPUT JSON SCHEMA:
{
  "fix_pack": {
    "answer_block": "string (3-5 sentence AI-ready paragraph that directly answers the query)",
    "faq": [
      { "q": "string (natural question users ask)", "a": "string (concise, factual answer)" }
    ],
    "comparison_snippet": "string (neutral comparison using markdown table format)",
    "entity_summary": {
      "organization": "string",
      "product_or_service": "string",
      "ideal_for": ["string"],
      "key_features": ["string"],
      "differentiators": ["string"],
      "trust_signals_to_add": ["string (specific proof/signals to add)"]
    },
    "schema_suggestions": [
      { "type": "FAQPage|Organization|Product|Service|Article", "fields": ["string"] }
    ],
    "internal_link_anchors": ["string","string","string"]
  }
}

Generate at least 4-5 FAQ items. Return ONLY the JSON object.`;
  }
}

// ─── Export Singleton ───────────────────────────────────────

export const fixPackGenerator = new FixPackGeneratorAgent();
