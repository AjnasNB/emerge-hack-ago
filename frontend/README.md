# AEO/GEO Copilot

**AI Answer Engine Optimization & Generative Engine Optimization**

> Understand why AI answer engines skip your brand — and get actionable fix packs to get cited.

AEO/GEO Copilot is a decision-support tool that helps brands understand and improve their **AI Answer Visibility**. Unlike traditional SEO tools that optimize for Google SERPs, this tool optimizes for **inclusion inside AI-generated answers** — the new frontier of discovery through ChatGPT, Perplexity, Google SGE, and enterprise AI assistants.

---

## How It Works

The system runs a **5-agent multi-agent pipeline** powered by Azure GPT. Each agent has a specialized role, and they work sequentially — each building on the previous agent's output to produce a comprehensive analysis.

### The Pipeline

```
User Input
    |
    v
[Normalizer] ── Builds canonical sources list (S1=your brand, S2..Sn=competitors)
    |
    v
[Agent 1: Answer Simulator] ── Simulates how an AI answer engine would respond
    |                           to the user query using all sources
    v
[Agent 2: Visibility Judge] ── Evaluates how prominently YOUR brand (S1) was
    |                           cited vs competitors in the simulated answer
    v
[Agent 3: Gap Analyzer] ── Identifies exactly WHY your content was skipped
    |                       or weakly cited, with evidence quotes
    v
[Agent 4: Fix Pack Generator] ── Generates copy-paste-ready content blocks
    |                              to fix every identified gap
    v
[Agent 5: Quality Reviewer] ── Audits all agent outputs for consistency,
    |                           produces executive summary & recommendations
    v
[Scoring Engine] ── Deterministic AEO Score (0-100) across 7 dimensions
    |
    v
Final Report (streamed to UI in real-time)
```

### The Agents in Detail

| # | Agent | Role | What It Does |
|---|-------|------|-------------|
| 1 | **Answer Simulator** | Generative Answer Engine | Takes the user query + all source content, and generates the answer an AI engine *would* produce — with citations, headline, short/long answer, and follow-up questions |
| 2 | **Visibility Judge** | Brand Citation Evaluator | Analyzes Agent 1's output to determine: Was your brand cited? How prominently? Which competitors were preferred and why? Returns a prominence score (0-1) and citation strength |
| 3 | **Gap Analyzer** | Content Gap Explainer | The core explainability engine. Compares your content against competitors to identify *specific* reasons your content lost: missing FAQs, no direct answer, marketing fluff, missing trust signals, etc. Each gap includes evidence quotes from both your content and competitors |
| 4 | **Fix Pack Generator** | AI-Ready Content Builder | For every gap found, generates copy-paste-ready fixes: an answer block for the top of your page, FAQ pairs, comparison snippets, entity summaries, schema markup suggestions, and internal link anchors |
| 5 | **Quality Reviewer** | Multi-Agent Output Auditor | Reviews all 4 agents' outputs for consistency and quality. Produces an executive summary, key insights, and prioritized recommendations — suitable for sharing with a marketing lead |

### BaseAgent Framework

All agents extend a shared `BaseAgent` abstract class that provides:

```
BaseAgent<TInput, TOutput>
  ├── id, name, role, emoji, description
  ├── buildSystemPrompt()      ← Agent-specific system instructions
  ├── buildUserPrompt(input)   ← Formats input data for the LLM
  ├── run(input, onThought?)   ← Executes with retry + thought streaming
  │     ├── Automatic retry (up to 3 attempts, exponential backoff)
  │     ├── Real-time thought emission (streamed to UI)
  │     └── Robust JSON parsing (handles markdown wrapping, partial JSON)
  └── getInfo()                ← Returns metadata for UI display
```

### Deterministic Scoring Engine

The AEO Score is **not** LLM-generated — it's computed deterministically from Agent 2 and Agent 3 outputs:

| Dimension | Max Points | Rule |
|-----------|-----------|------|
| Direct Answer | 20 | 0 if `direct_answer_missing` gap with severity `high` |
| FAQ Coverage | 20 | 0 if `missing_faq` gap with severity `high` |
| Definitions | 15 | 0 if `missing_definitions` gap with severity `high` |
| Comparison | 15 | 0 if `missing_comparison` gap with severity `high` |
| Trust Signals | 10 | 0 if `missing_trust_signals` gap with severity `high` |
| Structure | 10 | 0 if `weak_structure_for_summarization` gap with severity `high` |
| Citation | 10 | 10 if cited by Agent 2, else 0 |
| **Total** | **100** | |

### Real-Time Streaming

The API uses **Server-Sent Events (SSE)** to stream pipeline progress:

```
POST /api/analyze
  → SSE stream:
    data: {"type":"agent_start","agentId":"agent1","agentName":"Answer Simulator",...}
    data: {"type":"agent_thought","agentId":"agent1","thought":"Building analysis prompt..."}
    data: {"type":"agent_thought","agentId":"agent1","thought":"Calling Azure GPT model..."}
    data: {"type":"agent_complete","agentId":"agent1","duration":3200}
    data: {"type":"agent_start","agentId":"agent2",...}
    ...
    data: {"type":"complete","report":{...full report JSON...}}
```

The UI renders each agent's status, live thoughts, and completion time as events arrive.

---

## Architecture

```
frontend/
├── app/
│   ├── api/analyze/route.ts      ← SSE streaming API endpoint
│   ├── page.tsx                   ← Main page (state: input → loading → results)
│   ├── layout.tsx                 ← Root layout with Geist fonts
│   ├── globals.css                ← Tailwind v4 + custom animations
│   ├── global-error.tsx           ← Error boundary
│   └── not-found.tsx              ← 404 page
│
├── components/
│   ├── InputForm.tsx              ← Query, brand, content, competitors, engine mode
│   ├── LoadingPipeline.tsx        ← Animated agent pipeline with live thoughts
│   ├── ResultsDashboard.tsx       ← Tabbed results with quality review banner
│   ├── tabs/
│   │   ├── SimulatedAnswerTab.tsx ← AI answer display with follow-ups
│   │   ├── VisibilityTab.tsx      ← Citation status + prominence meter
│   │   ├── GapsTab.tsx            ← Gap cards sorted by severity
│   │   ├── FixPackTab.tsx         ← Copy-paste blocks with copy buttons
│   │   └── ScoreTab.tsx           ← Circular gauge + breakdown bars
│   └── ui/
│       ├── CopyButton.tsx         ← Click-to-copy with "Copied!" feedback
│       ├── ScoreGauge.tsx         ← SVG circular score visualization
│       └── SeverityBadge.tsx      ← Color-coded severity indicators
│
├── lib/
│   ├── agents/
│   │   ├── base-agent.ts         ← BaseAgent abstract class (retry, thoughts, timing)
│   │   ├── agent1-simulator.ts   ← Answer Engine Simulator
│   │   ├── agent2-judge.ts       ← Visibility Judge
│   │   ├── agent3-gaps.ts        ← Gap Analyzer
│   │   ├── agent4-fixpack.ts     ← Fix Pack Generator
│   │   └── agent5-quality-reviewer.ts ← Quality Reviewer
│   ├── llm.ts                    ← Pluggable LLM client (Azure/OpenAI/Groq/Ollama)
│   ├── normalize.ts              ← Source normalizer (S1=target, S2..Sn=competitors)
│   ├── orchestrator.ts           ← Pipeline runner with progress callbacks
│   ├── scoring.ts                ← Deterministic AEO scoring engine
│   ├── synthetic.ts              ← Synthetic competitor generator
│   ├── demo-presets.ts           ← 2 demo presets (Education SaaS, Fintech)
│   └── types.ts                  ← All TypeScript types & interfaces
│
└── .env.local                    ← Azure OpenAI credentials (not committed)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| LLM | Azure OpenAI (GPT-5-mini) |
| Icons | Lucide React |
| Fonts | Geist Sans + Geist Mono |
| Streaming | Server-Sent Events (SSE) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An Azure OpenAI deployment (or OpenAI API key)

### Setup

```bash
# Clone the repo
git clone https://github.com/AjnasNB/emerge-hack-ago.git
cd emerge-hack-ago/frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Azure OpenAI credentials
```

### Environment Variables

```env
LLM_PROVIDER=azure

# Azure OpenAI
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-5-mini
AZURE_OPENAI_API_VERSION=2025-08-07
```

**Alternative providers** (set `LLM_PROVIDER` accordingly):

| Provider | Required Vars |
|----------|--------------|
| `openai` | `OPENAI_API_KEY`, `OPENAI_MODEL` |
| `groq` | `GROQ_API_KEY`, `GROQ_MODEL` |
| `ollama` | `OLLAMA_BASE_URL`, `OLLAMA_MODEL` |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click a demo preset to try it.

---

## API Contract

### `POST /api/analyze`

**Request:**
```json
{
  "query": "What is the best online learning platform for corporate training?",
  "target": {
    "brand": "LearnFlow",
    "content": "LearnFlow is an innovative learning management system..."
  },
  "competitors": [
    { "brand": "SkillBridge", "content": "SkillBridge is an enterprise LMS..." }
  ],
  "engine_mode": "chat",
  "generate_synthetic_competitors": false
}
```

**Response:** SSE stream with events:

| Event | Payload |
|-------|---------|
| `agent_start` | `{ agentId, agentName, agentEmoji, agentRole, step, total }` |
| `agent_thought` | `{ agentId, thought }` |
| `agent_complete` | `{ agentId, duration }` |
| `complete` | `{ report: AnalyzeReport }` |
| `error` | `{ message }` |

The final `report` object contains: `meta`, `simulated_answer`, `visibility`, `gaps[]`, `fix_pack`, `score`, and `quality_review`.

---

## Demo Presets

Two pre-configured demos for instant testing:

1. **Education SaaS** — "What is the best online learning platform for corporate training?" with LearnFlow (weak content) vs SkillBridge (strong, AI-optimized content)

2. **Fintech Startup** — "What is the best payment gateway for small businesses?" with PaySimple (marketing-heavy) vs ClearPay (clear, structured, trust-signaled content)

These demonstrate how AI-unfriendly content gets skipped and what good AEO content looks like.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **5 separate agents** (not one mega-prompt) | Each agent has a focused role with strict JSON output. Easier to debug, retry individually, and iterate on prompts |
| **Deterministic scoring** (not LLM-scored) | Reproducible results. The score is a pure function of Agent 2 + Agent 3 outputs — no randomness |
| **SSE streaming** (not polling) | Users see real-time progress through each agent instead of waiting 30+ seconds with no feedback |
| **BaseAgent abstract class** | DRY framework for retry logic, thought emission, timing, and JSON parsing across all agents |
| **Synthetic competitors** | When users don't have competitor content, the system generates realistic competitors so the analysis still has comparison value |
| **Quality Reviewer (Agent 5)** | Acts as a "meta-agent" that catches inconsistencies across the 4 main agents and produces a human-readable executive summary |

---

## Target Users

- Marketing / Growth teams optimizing for AI discovery
- Founders / Product marketers who want to understand AI visibility
- Content teams (blogs, landing pages, docs) targeting AI citations
- Agencies optimizing client content for AEO/GEO

---

## License

Built for the Emergent Hackathon 2025.
