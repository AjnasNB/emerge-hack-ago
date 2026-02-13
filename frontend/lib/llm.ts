import { AzureOpenAI } from 'openai';
import OpenAI from 'openai';

// ─── Singleton Client Cache ─────────────────────────────────

let _client: OpenAI | AzureOpenAI | null = null;
let _modelName: string = '';

function getClient(): { client: OpenAI | AzureOpenAI; model: string } {
  if (_client) return { client: _client, model: _modelName };

  const provider = process.env.LLM_PROVIDER || 'azure';

  switch (provider) {
    case 'azure': {
      const client = new AzureOpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY!,
        endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
        apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2025-08-07',
      });
      _client = client;
      _modelName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-5-mini';
      break;
    }

    case 'groq': {
      _client = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      _modelName = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';
      break;
    }

    case 'ollama': {
      _client = new OpenAI({
        apiKey: 'ollama',
        baseURL: `${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/v1`,
      });
      _modelName = process.env.OLLAMA_MODEL || 'llama3.1';
      break;
    }

    case 'openai':
    default: {
      _client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      _modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      break;
    }
  }

  return { client: _client, model: _modelName };
}

// ─── Core LLM Call ──────────────────────────────────────────

export async function callLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const { client, model } = getClient();

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 4096,
  });

  return completion.choices[0]?.message?.content || '';
}

// ─── JSON-Parsed LLM Call ───────────────────────────────────

export async function callLLMJSON<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const raw = await callLLM(systemPrompt, userPrompt);
  return parseJSONResponse<T>(raw);
}

// ─── Robust JSON Parser (handles markdown wrapping, etc.) ───

function parseJSONResponse<T>(text: string): T {
  const cleaned = text.trim();

  // Direct parse
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // continue
  }

  // Extract from markdown code block
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {
      // continue
    }
  }

  // Find outermost JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
    } catch {
      // continue
    }
  }

  throw new Error(
    `Failed to parse JSON from LLM response. First 300 chars:\n${cleaned.slice(0, 300)}`
  );
}

// ─── Get Model Name ─────────────────────────────────────────

export function getModelName(): string {
  const { model } = getClient();
  return model;
}
