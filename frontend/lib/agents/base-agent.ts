import { callLLMJSON } from '../llm';

// ─── Agent Execution Result ─────────────────────────────────

export interface AgentExecution<T> {
  agentId: string;
  agentName: string;
  agentEmoji: string;
  output: T;
  duration: number;
  attempts: number;
}

// ─── Agent Info (for UI) ────────────────────────────────────

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  emoji: string;
  description: string;
}

// ─── Thought Callback ───────────────────────────────────────

export type ThoughtCallback = (thought: string) => void;

// ─── Base Agent Abstract Class ──────────────────────────────

export abstract class BaseAgent<TInput, TOutput> {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly role: string;
  abstract readonly emoji: string;
  abstract readonly description: string;

  protected maxRetries = 2;

  /** Build the system prompt for this agent. */
  protected abstract buildSystemPrompt(): string;

  /** Build the user prompt from input data. */
  protected abstract buildUserPrompt(input: TInput): string;

  /** Get agent info for UI display. */
  getInfo(): AgentInfo {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      emoji: this.emoji,
      description: this.description,
    };
  }

  /**
   * Execute this agent's task.
   * Handles retry logic and emits thoughts to the callback.
   */
  async run(
    input: TInput,
    onThought?: ThoughtCallback
  ): Promise<AgentExecution<TOutput>> {
    const start = Date.now();
    let attempts = 0;

    while (attempts <= this.maxRetries) {
      try {
        if (attempts > 0) {
          onThought?.(
            `Retry attempt ${attempts + 1}/${this.maxRetries + 1} — adjusting approach...`
          );
        }

        onThought?.('Building analysis prompt...');
        const system = this.buildSystemPrompt();
        const user = this.buildUserPrompt(input);

        onThought?.('Calling Azure GPT model...');
        const output = await callLLMJSON<TOutput>(system, user);

        onThought?.('Validating structured output...');

        const duration = Date.now() - start;
        onThought?.(`Completed in ${(duration / 1000).toFixed(1)}s`);

        return {
          agentId: this.id,
          agentName: this.name,
          agentEmoji: this.emoji,
          output,
          duration,
          attempts: attempts + 1,
        };
      } catch (err) {
        attempts++;
        const msg = err instanceof Error ? err.message : String(err);

        if (attempts > this.maxRetries) {
          throw new Error(
            `Agent "${this.name}" failed after ${attempts} attempts: ${msg}`
          );
        }

        onThought?.(
          `Error encountered: ${msg.slice(0, 80)}... Retrying in ${attempts}s`
        );

        // Exponential backoff
        await new Promise((r) => setTimeout(r, 1000 * attempts));
      }
    }

    throw new Error(`Agent "${this.name}" failed unexpectedly`);
  }
}
