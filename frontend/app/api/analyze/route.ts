import { NextRequest } from 'next/server';
import type { AnalyzeRequest } from '@/lib/types';
import { runPipeline } from '@/lib/orchestrator';

export const maxDuration = 120; // Allow up to 120 seconds for 5-agent pipeline

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeRequest;

    // ─── Validate required fields ───────────────────────
    if (!body.query?.trim()) {
      return Response.json({ error: 'Query is required' }, { status: 400 });
    }
    if (!body.target?.brand?.trim()) {
      return Response.json({ error: 'Brand name is required' }, { status: 400 });
    }
    if (!body.target?.content?.trim()) {
      return Response.json({ error: 'Target content is required' }, { status: 400 });
    }

    const requestId = crypto.randomUUID();

    // ─── Create streaming response ──────────────────────
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (type: string, data: Record<string, unknown>) => {
          try {
            const json = JSON.stringify({ type, ...data });
            controller.enqueue(encoder.encode(`data: ${json}\n\n`));
          } catch {
            // Ignore encoding errors
          }
        };

        try {
          const report = await runPipeline(body, requestId, {
            onAgentStart: (agent, step, total) => {
              send('agent_start', {
                agentId: agent.id,
                agentName: agent.name,
                agentEmoji: agent.emoji,
                agentRole: agent.role,
                step,
                total,
              });
            },

            onAgentThought: (agentId, thought) => {
              send('agent_thought', { agentId, thought });
            },

            onAgentComplete: (agentId, duration) => {
              send('agent_complete', { agentId, duration });
            },
          });

          send('complete', { report });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Analysis pipeline failed';
          console.error('Pipeline error:', error);
          send('error', { message });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('Request error:', error);
    const message =
      error instanceof Error ? error.message : 'Invalid request';
    return Response.json({ error: message }, { status: 400 });
  }
}
