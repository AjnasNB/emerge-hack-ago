import OpenAI from 'openai';

// ─── Singleton Client Cache ─────────────────────────────────

let _client: OpenAI | null = null;
let _modelName: string = '';
let _isReasoningModel: boolean = false;

function getClient(): { client: OpenAI; model: string; isReasoning: boolean } {
  if (_client) return { client: _client, model: _modelName, isReasoning: _isReasoningModel };

  const provider = process.env.LLM_PROVIDER || 'azure';

  switch (provider) {
    case 'azure': {
      // Use standard OpenAI client with Azure base URL for maximum compatibility.
      // This works by pointing baseURL at the deployment endpoint;
      // the SDK appends /chat/completions automatically.
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-5-mini';
      const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview';
      const apiKey = process.env.AZURE_OPENAI_API_KEY!;

      // If endpoint already includes /openai/deployments/..., use it directly.
      // Otherwise build the full deployment URL.
      let baseURL: string;
      if (endpoint.includes('/openai/deployments/')) {
        // Strip trailing /chat/completions if present
        baseURL = endpoint.replace(/\/chat\/completions\/?$/, '');
      } else {
        baseURL = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}`;
      }

      _client = new OpenAI({
        apiKey,
        baseURL,
        defaultQuery: { 'api-version': apiVersion },
        defaultHeaders: { 'api-key': apiKey },
      });
      _modelName = deployment;

      // GPT-5-mini, o1, o3 etc. are reasoning models — they use max_completion_tokens
      // and don't support temperature or system role the same way
      const reasoningModels = ['gpt-5-mini', 'o1', 'o1-mini', 'o1-preview', 'o3', 'o3-mini'];
      _isReasoningModel = reasoningModels.some(m => deployment.toLowerCase().includes(m));
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

  return { client: _client, model: _modelName, isReasoning: _isReasoningModel };
}

// ─── Core LLM Call ──────────────────────────────────────────

export async function callLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const { client, model, isReasoning } = getClient();

  // Reasoning models (gpt-5-mini, o1, o3) don't support `max_tokens` or `temperature`.
  // They use `max_completion_tokens` and the system prompt goes as a developer message.
  if (isReasoning) {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'developer', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_completion_tokens: 16384,
    });
    return completion.choices[0]?.message?.content || '';
  }

  // Standard models (gpt-4o, llama, etc.)
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
