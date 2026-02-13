import { BaseAgent } from './base-agent';
import type {
  Agent1Output,
  Agent2Output,
  Agent3Output,
  Agent4Output,
  Score,
  Agent5Output,
} from '../types';

// ─── Input type ─────────────────────────────────────────────

export interface Agent5Input {
  query: string;
  brandName: string;
  agent1Output: Agent1Output;
  agent2Output: Agent2Output;
  agent3Output: Agent3Output;
  agent4Output: Agent4Output;
  score: Score;
}

// ─── Agent Implementation ───────────────────────────────────

class QualityReviewerAgent extends BaseAgent<Agent5Input, Agent5Output> {
  readonly id = 'agent5';
  readonly name = 'Quality Reviewer';
  readonly role = 'Multi-Agent Output Auditor';
  readonly emoji = '✨';
  readonly description =
    'Reviews outputs from all 4 agents for consistency, quality, and actionability. Produces an executive summary and recommendations.';

  protected buildSystemPrompt(): string {
    return `SYSTEM RULES:
- Output ONLY valid JSON matching the schema below.
- No extra text outside JSON.
- Be concise but insightful.
- Focus on consistency between agent outputs and actionability of recommendations.

TASK:
You are a Quality Reviewer for a multi-agent AI analysis pipeline. You have access to:
1. The simulated AI answer (Agent 1)
2. The visibility judgment (Agent 2)
3. The gap analysis (Agent 3)
4. The fix pack (Agent 4)
5. The deterministic AEO score

Your job:
- Check if the agents' outputs are consistent with each other
- Identify the most impactful insights across all analyses
- Write an executive summary for a marketing/growth team
- Provide 3-5 prioritized recommendations
- Rate overall analysis quality`;
  }

  protected buildUserPrompt(input: Agent5Input): string {
    return `USER QUERY: ${input.query}
BRAND: ${input.brandName}
AEO SCORE: ${input.score.aeo_total}/100

AGENT 1 — SIMULATED ANSWER:
${JSON.stringify(input.agent1Output, null, 2)}

AGENT 2 — VISIBILITY JUDGMENT:
${JSON.stringify(input.agent2Output, null, 2)}

AGENT 3 — GAP ANALYSIS (${input.agent3Output.gaps.length} gaps found):
Overall: ${input.agent3Output.overall_diagnosis}
Quick wins: ${input.agent3Output.top_3_quick_wins.join('; ')}

AGENT 4 — FIX PACK:
Answer block length: ${input.agent4Output.fix_pack.answer_block.length} chars
FAQs generated: ${input.agent4Output.fix_pack.faq.length}
Schema suggestions: ${input.agent4Output.fix_pack.schema_suggestions.length}

SCORE BREAKDOWN:
${JSON.stringify(input.score.breakdown, null, 2)}

OUTPUT JSON SCHEMA:
{
  "quality_review": {
    "overall_quality": "excellent|good|needs_improvement|poor",
    "consistency_score": 0.0,
    "key_insights": ["string (top 3-5 insights from the full analysis)"],
    "recommendations": ["string (prioritized action items for the brand team)"],
    "executive_summary": "string (2-3 sentence summary suitable for a Slack message to the marketing lead)"
  }
}

Return ONLY the JSON object.`;
  }
}

// ─── Export Singleton ───────────────────────────────────────

export const qualityReviewer = new QualityReviewerAgent();
