import { callLLMJSON } from './llm';
import type { CompetitorInput } from './types';

const SYSTEM_PROMPT = `SYSTEM RULES:
- Output ONLY valid JSON matching the schema.
- No extra text.
- Generate realistic, well-structured competitor content.
- Each competitor should have content that is AI-friendly: clear structure, direct answers, specific details.

TASK:
Generate 2 synthetic competitor brand contents for the given query.
Make them well-structured and competitive — they should represent what good AI-optimized content looks like.`;

function buildUserPrompt(query: string, targetBrand: string): string {
  return `USER QUERY: ${query}
TARGET BRAND (to compete against): ${targetBrand}

OUTPUT JSON SCHEMA:
{
  "competitors": [
    {
      "brand": "string (realistic brand name, not a real company)",
      "content": "string (300-500 words of well-structured content with clear headings, definitions, comparisons, and trust signals)"
    },
    {
      "brand": "string",
      "content": "string"
    }
  ]
}

Return ONLY the JSON object. No other text.`;
}

export async function generateSyntheticCompetitors(
  query: string,
  targetBrand: string
): Promise<CompetitorInput[]> {
  const userPrompt = buildUserPrompt(query, targetBrand);
  const result = await callLLMJSON<{ competitors: CompetitorInput[] }>(
    SYSTEM_PROMPT,
    userPrompt
  );
  return result.competitors;
}
