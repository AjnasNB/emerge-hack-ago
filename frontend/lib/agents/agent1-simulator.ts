import { BaseAgent } from './base-agent';
import { formatSourcesForPrompt } from '../normalize';
import type { Source, EngineMode, Agent1Output } from '../types';

// ─── Input type ─────────────────────────────────────────────

export interface Agent1Input {
  sources: Source[];
  query: string;
  engineMode: EngineMode;
}

// ─── Agent Implementation ───────────────────────────────────

class AnswerSimulatorAgent extends BaseAgent<Agent1Input, Agent1Output> {
  readonly id = 'agent1';
  readonly name = 'Answer Simulator';
  readonly role = 'Generative Answer Engine';
  readonly emoji = '🤖';
  readonly description =
    'Simulates how an AI answer engine (like ChatGPT, Perplexity, or Google SGE) would respond to the query using only the provided sources';

  protected buildSystemPrompt(): string {
    return `SYSTEM RULES:
- Output ONLY valid JSON matching the schema below.
- No markdown, no extra text outside the JSON.
- Use ONLY the provided sources. Never invent facts.
- If uncertain about something, explicitly say so.
- Cite sources using their IDs (S1, S2, etc.) in the long_answer.
- Be thorough but concise.

TASK:
You are a generative AI answer engine. Your job is to answer the user query using only the provided sources.
You must produce: a headline, short answer (2-3 sentences), detailed long answer with inline citations, and 3 follow-up questions.
For each major claim you make, track which source(s) support it.`;
  }

  protected buildUserPrompt(input: Agent1Input): string {
    const modeInstructions = {
      chat: 'Write in a conversational, helpful, and warm tone. Use natural language.',
      search_card:
        'Write in a compact, structured, factual tone. Use bullet points where appropriate.',
      enterprise:
        'Write in a formal, authoritative, policy-like tone. Be precise and comprehensive.',
    };

    return `ENGINE MODE: ${input.engineMode}
Style instruction: ${modeInstructions[input.engineMode]}

USER QUERY:
${input.query}

SOURCES:
${formatSourcesForPrompt(input.sources)}

OUTPUT JSON SCHEMA:
{
  "answer": {
    "headline": "string (concise headline answering the query)",
    "short_answer": "string (2-3 sentence summary)",
    "long_answer": "string (detailed answer with [S1], [S2] citations inline)",
    "follow_ups": ["string","string","string"]
  },
  "citations": [
    { "claim": "string (specific claim made)", "source_ids": ["S1"] }
  ],
  "sources_used": ["S1","S2"],
  "confidence": 0.85
}

Return ONLY the JSON object.`;
  }
}

// ─── Export Singleton ───────────────────────────────────────

export const answerSimulator = new AnswerSimulatorAgent();
