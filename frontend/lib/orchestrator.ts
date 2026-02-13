import type {
  AnalyzeRequest,
  AnalyzeReport,
  Source,
  AgentMetadata,
} from './types';
import { normalizeSources } from './normalize';
import { answerSimulator } from './agents/agent1-simulator';
import { visibilityJudge } from './agents/agent2-judge';
import { gapAnalyzer } from './agents/agent3-gaps';
import { fixPackGenerator } from './agents/agent4-fixpack';
import { qualityReviewer } from './agents/agent5-quality-reviewer';
import { computeScore } from './scoring';
import { getModelName } from './llm';
import { generateSyntheticCompetitors } from './synthetic';
import type { AgentInfo, ThoughtCallback } from './agents/base-agent';

// ─── Callback Types ─────────────────────────────────────────

export interface PipelineCallbacks {
  onAgentStart: (agent: AgentInfo, step: number, total: number) => void;
  onAgentThought: (agentId: string, thought: string) => void;
  onAgentComplete: (agentId: string, duration: number) => void;
}

// ─── Agent Registry ─────────────────────────────────────────

const AGENTS = [
  answerSimulator,
  visibilityJudge,
  gapAnalyzer,
  fixPackGenerator,
  qualityReviewer,
];

export function getAgentRegistry(): AgentInfo[] {
  return AGENTS.map((a) => a.getInfo());
}

// ─── Pipeline Orchestrator ──────────────────────────────────

export async function runPipeline(
  request: AnalyzeRequest,
  requestId: string,
  callbacks: PipelineCallbacks
): Promise<AnalyzeReport> {
  const pipelineStart = Date.now();
  const totalSteps = 6; // 5 agents + scoring step
  const agentMeta: AgentMetadata[] = [];

  // Helper to create thought callback for each agent
  const makeThoughtCb = (agentId: string): ThoughtCallback => {
    return (thought: string) => callbacks.onAgentThought(agentId, thought);
  };

  // ─── Step 0: Prepare sources ────────────────────────────

  let req = { ...request };
  if (req.generate_synthetic_competitors && req.competitors.length === 0) {
    callbacks.onAgentThought('prep', 'No competitors provided — generating synthetic competitors...');
    const syntheticCompetitors = await generateSyntheticCompetitors(
      req.query,
      req.target.brand
    );
    req = { ...req, competitors: syntheticCompetitors };
    callbacks.onAgentThought('prep', `Generated ${syntheticCompetitors.length} synthetic competitors`);
  }

  const sources: Source[] = normalizeSources(req);

  // ─── Step 1: Agent 1 — Answer Engine Simulator ──────────

  callbacks.onAgentStart(answerSimulator.getInfo(), 1, totalSteps);
  const a1 = await answerSimulator.run(
    { sources, query: req.query, engineMode: req.engine_mode },
    makeThoughtCb('agent1')
  );
  callbacks.onAgentComplete('agent1', a1.duration);
  agentMeta.push({ id: a1.agentId, name: a1.agentName, emoji: a1.agentEmoji, duration: a1.duration, attempts: a1.attempts });

  // ─── Step 2: Agent 2 — Visibility Judge ─────────────────

  callbacks.onAgentStart(visibilityJudge.getInfo(), 2, totalSteps);
  const a2 = await visibilityJudge.run(
    { agent1Output: a1.output, sources },
    makeThoughtCb('agent2')
  );
  callbacks.onAgentComplete('agent2', a2.duration);
  agentMeta.push({ id: a2.agentId, name: a2.agentName, emoji: a2.agentEmoji, duration: a2.duration, attempts: a2.attempts });

  // ─── Step 3: Agent 3 — Gap Analyzer ─────────────────────

  callbacks.onAgentStart(gapAnalyzer.getInfo(), 3, totalSteps);
  const a3 = await gapAnalyzer.run(
    { query: req.query, agent1Output: a1.output, agent2Output: a2.output, sources },
    makeThoughtCb('agent3')
  );
  callbacks.onAgentComplete('agent3', a3.duration);
  agentMeta.push({ id: a3.agentId, name: a3.agentName, emoji: a3.agentEmoji, duration: a3.duration, attempts: a3.attempts });

  // ─── Step 4: Agent 4 — Fix Pack Generator ───────────────

  callbacks.onAgentStart(fixPackGenerator.getInfo(), 4, totalSteps);
  const a4 = await fixPackGenerator.run(
    { query: req.query, targetContent: req.target.content, agent3Output: a3.output },
    makeThoughtCb('agent4')
  );
  callbacks.onAgentComplete('agent4', a4.duration);
  agentMeta.push({ id: a4.agentId, name: a4.agentName, emoji: a4.agentEmoji, duration: a4.duration, attempts: a4.attempts });

  // ─── Step 5: Deterministic Scoring ──────────────────────

  callbacks.onAgentThought('scoring', 'Computing deterministic AEO score from 7 dimensions...');
  const score = computeScore(a2.output, a3.output);
  callbacks.onAgentThought('scoring', `AEO Score: ${score.aeo_total}/100`);

  // ─── Step 6: Agent 5 — Quality Reviewer ─────────────────

  callbacks.onAgentStart(qualityReviewer.getInfo(), 5, totalSteps);
  const a5 = await qualityReviewer.run(
    {
      query: req.query,
      brandName: req.target.brand,
      agent1Output: a1.output,
      agent2Output: a2.output,
      agent3Output: a3.output,
      agent4Output: a4.output,
      score,
    },
    makeThoughtCb('agent5')
  );
  callbacks.onAgentComplete('agent5', a5.duration);
  agentMeta.push({ id: a5.agentId, name: a5.agentName, emoji: a5.agentEmoji, duration: a5.duration, attempts: a5.attempts });

  // ─── Assemble Final Report ──────────────────────────────

  const totalDuration = Date.now() - pipelineStart;
  const modelName = getModelName();

  return {
    meta: {
      request_id: requestId,
      engine_mode: req.engine_mode,
      model: modelName,
      total_duration: totalDuration,
      agents: agentMeta,
    },
    simulated_answer: {
      headline: a1.output.answer.headline,
      short_answer: a1.output.answer.short_answer,
      long_answer: a1.output.answer.long_answer,
      follow_ups: a1.output.answer.follow_ups,
    },
    visibility: {
      is_cited: a2.output.is_cited,
      prominence_score: a2.output.prominence_score,
      citation_strength: a2.output.citation_strength,
      reasons: a2.output.reasons,
    },
    gaps: a3.output.gaps,
    fix_pack: a4.output.fix_pack,
    score,
    quality_review: a5.output.quality_review,
  };
}
