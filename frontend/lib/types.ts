// ─── Request Types ───────────────────────────────────────────

export type EngineMode = 'chat' | 'search_card' | 'enterprise';

export interface CompetitorInput {
  brand: string;
  content: string;
}

export interface AnalyzeRequest {
  query: string;
  target: {
    brand: string;
    content: string;
  };
  competitors: CompetitorInput[];
  engine_mode: EngineMode;
  generate_synthetic_competitors: boolean;
}

// ─── Source Types ────────────────────────────────────────────

export interface Source {
  id: string;       // "S1", "S2", etc.
  brand: string;
  content: string;
  is_target: boolean;
}

// ─── Agent 1: Answer Engine Simulator ───────────────────────

export interface Agent1Output {
  answer: {
    headline: string;
    short_answer: string;
    long_answer: string;
    follow_ups: string[];
  };
  citations: Array<{
    claim: string;
    source_ids: string[];
  }>;
  sources_used: string[];
  confidence: number;
}

// ─── Agent 2: Visibility Judge ──────────────────────────────

export interface Agent2Output {
  is_cited: boolean;
  prominence_score: number;
  citation_strength: 'weak' | 'medium' | 'strong';
  reasons: string[];
  what_ai_preferred: Array<{
    preferred_source_id: string;
    why: string;
  }>;
}

// ─── Agent 3: Gap Analyzer ──────────────────────────────────

export type GapCategory =
  | 'direct_answer_missing'
  | 'weak_structure_for_summarization'
  | 'missing_definitions'
  | 'missing_faq'
  | 'missing_comparison'
  | 'missing_trust_signals'
  | 'missing_specificity'
  | 'outdated_or_uncertain_info'
  | 'over_marketing_language';

export interface Gap {
  category: GapCategory;
  severity: 'low' | 'medium' | 'high';
  what_is_missing: string;
  why_it_matters_for_ai: string;
  evidence_target: { quote: string; source_id: string };
  evidence_other: { quote: string; source_id: string };
  fix_instruction: string;
}

export interface Agent3Output {
  overall_diagnosis: string;
  gaps: Gap[];
  top_3_quick_wins: string[];
}

// ─── Agent 4: Fix Pack Generator ────────────────────────────

export interface EntitySummary {
  organization: string;
  product_or_service: string;
  ideal_for: string[];
  key_features: string[];
  differentiators: string[];
  trust_signals_to_add: string[];
}

export interface SchemaItem {
  type: 'FAQPage' | 'Organization' | 'Product' | 'Service' | 'Article';
  fields: string[];
}

export interface FixPack {
  answer_block: string;
  faq: Array<{ q: string; a: string }>;
  comparison_snippet: string;
  entity_summary: EntitySummary;
  schema_suggestions: SchemaItem[];
  internal_link_anchors: string[];
}

export interface Agent4Output {
  fix_pack: FixPack;
}

// ─── Agent 5: Quality Reviewer ──────────────────────────────

export interface QualityReview {
  overall_quality: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  consistency_score: number;
  key_insights: string[];
  recommendations: string[];
  executive_summary: string;
}

export interface Agent5Output {
  quality_review: QualityReview;
}

// ─── Scoring ────────────────────────────────────────────────

export interface ScoreBreakdown {
  direct_answer: number;
  faq: number;
  definitions: number;
  comparison: number;
  trust: number;
  structure: number;
  citation: number;
}

export interface Score {
  aeo_total: number;
  breakdown: ScoreBreakdown;
}

// ─── Final Report ───────────────────────────────────────────

export interface AgentMetadata {
  id: string;
  name: string;
  emoji: string;
  duration: number;
  attempts: number;
}

export interface AnalyzeReport {
  meta: {
    request_id: string;
    engine_mode: EngineMode;
    model: string;
    total_duration: number;
    agents: AgentMetadata[];
  };
  simulated_answer: {
    headline: string;
    short_answer: string;
    long_answer: string;
    follow_ups: string[];
  };
  visibility: {
    is_cited: boolean;
    prominence_score: number;
    citation_strength: 'weak' | 'medium' | 'strong';
    reasons: string[];
  };
  gaps: Gap[];
  fix_pack: FixPack;
  score: Score;
  quality_review: QualityReview;
}

// ─── Streaming Event Types ──────────────────────────────────

export interface AgentStartEvent {
  type: 'agent_start';
  agentId: string;
  agentName: string;
  agentEmoji: string;
  agentRole: string;
  step: number;
  total: number;
}

export interface AgentThoughtEvent {
  type: 'agent_thought';
  agentId: string;
  thought: string;
}

export interface AgentCompleteEvent {
  type: 'agent_complete';
  agentId: string;
  duration: number;
}

export interface CompleteEvent {
  type: 'complete';
  report: AnalyzeReport;
}

export interface ErrorEvent {
  type: 'error';
  message: string;
}

export type StreamEvent =
  | AgentStartEvent
  | AgentThoughtEvent
  | AgentCompleteEvent
  | CompleteEvent
  | ErrorEvent;

// ─── Demo Preset ────────────────────────────────────────────

export interface DemoPreset {
  name: string;
  description: string;
  data: Omit<AnalyzeRequest, 'generate_synthetic_competitors'>;
}
