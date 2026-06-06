# Implementation Plan: Grounded Chatbot Readiness

**Branch**: `[001-grounded-chatbot-readiness]` | **Date**: 2026-06-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-grounded-chatbot-readiness/spec.md`

## Summary

Extend the existing source-aware chat and maintainer stewardship surfaces so the public chatbot can deliver depth-aware grounded answers, visible trust states, explicit fallback behavior, and Redis-backed protection through Django, while the protected maintainer workflow surfaces readiness, source validation, audit evidence, and next actions through the Django-admin-backed stewardship APIs that already exist in the repo. This feature includes retiring the existing Supabase-owned public chat runtime so Django becomes the public chatbot backend and Redis protection owner.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19 and Vite 7 for browser-facing surfaces; Python 3 with Django for public chat and protected admin APIs; Deno TypeScript remains available only for non-chat Supabase ingestion functions

**Primary Dependencies**: React, motion, lucide-react, Django public chat APIs, Django admin APIs, existing maintainer API clients, Supabase Storage/Postgres/pgvector data access, Redis for Django-owned protection state, server-side NVIDIA Build/NIM adapters

**Storage**: Supabase Storage and Postgres for approved sources, chunks, embeddings, citations, and source metadata; Redis owned by Django only for short-lived public-chat protection state when configured; browser session/local storage only for anonymous chat session identity

**Redis Architecture**: Redis is a Django-owned operational protection layer, not a retrieval or content layer. It may hold short-lived state such as rate-limit windows, abuse counters, cooldown markers, temporary request fingerprints, and narrowly scoped operational cache entries when explicitly justified. Redis MUST NOT become the source of truth for approved documents, source chunks, embeddings, citations, validation records, or any other durable knowledge objects. When Redis is unavailable, local development and basic test paths should degrade to deterministic in-memory protection behavior rather than blocking the entire chatbot stack.

**Caching Strategy**: Redis caching is allowed only as a short-lived Django runtime optimization with explicit TTLs, versioned keys, and no raw private source content. The MVP cache policy is:

| Cache class | Default | TTL target | Key ingredients | Notes |
|---|---|---|---|---|
| Protection state | Enabled when Redis is configured | 60 seconds to 15 minutes | Hashed anonymous session, coarse network fingerprint, policy version | Rate windows, abuse counters, cooldown markers, challenge markers |
| Guard decision cache | Optional | 5 to 15 minutes | HMAC of normalized prompt, section, guard model, policy version | Topic/safety precheck results for repeated identical prompts; never store raw prompts |
| Query helper cache | Optional | 5 to 10 minutes | HMAC of normalized prompt, section, depth mode, model version | Query embedding or rerank helper outputs may be cached only if they do not become canonical knowledge |
| Retrieval result cache | Post-MVP by default | 2 to 10 minutes | Prompt hash, section, depth mode, active source index version, retrieval policy version | May cache chunk IDs and scores, not private chunk text as the source of truth |
| Final grounded-answer cache | Disabled by default | N/A for MVP | N/A | Broad answer caching is excluded from MVP because citation integrity, section context, source freshness, and trust cues matter more than cache hit rate |

All cache keys that depend on learner text must use a server-side HMAC or equivalent non-reversible hash. Cache values must carry a schema version and, where retrieval is involved, an active source index/version marker so source activation, re-ingestion, validation policy changes, or model changes invalidate stale entries. Cache telemetry may be exposed to protected maintainer observability later, but anonymous learner responses should not expose raw cache keys or private cache internals.

**Model Role Architecture**: The public chat workflow MUST preserve five distinct model responsibilities: generation for final learner-facing answers, embedding for source and query vectors, reranking for retrieved context ordering, topic guard for project-scope checks before expensive answer drafting, and safety guard for final output screening. These responsibilities do not have to be five separate vendors or five separate live calls in the MVP, but contracts, module boundaries, and tests must keep the responsibilities distinct.

**NVIDIA Model Source Decision**: The MVP will source model calls through server-side NVIDIA Build/NIM provider adapters owned by the Django public chat runtime. Browser code MUST NOT know NVIDIA API keys, provider routing, or raw model configuration. Default role-to-model mapping:

| Role | NVIDIA model | MVP use |
|---|---|---|
| Generation | `nvidia/llama-3.1-nemotron-nano-8b-v1` | Default learner-facing answer drafting for Student and Expert modes |
| Embedding | `nvidia/llama-nemotron-embed-1b-v2` | Source chunk and query embeddings for retrieval |
| Rerank | `nvidia/llama-nemotron-rerank-1b-v2` | Query-passage relevance ordering after candidate retrieval |
| Topic guard | `nvidia/llama-3.1-nemoguard-8b-topic-control` | Project-scope classification before expensive retrieval/generation |
| Safety guard | `nvidia/llama-3.1-nemotron-safety-guard-8b-v3` | Prompt and final-response safety classification |

`nvidia/llama-3.3-nemotron-super-49b-v1.5` is reserved as a future upgrade candidate for heavier expert-mode evaluation or high-quality review runs, not the MVP default.

**Testing**: Mandatory red-green-refactor using frontend Vitest + React Testing Library + MSW, Django pytest with deterministic Redis/NVIDIA doubles, non-chat Supabase Function Vitest for ingestion changes, focused Playwright smoke coverage, and a minimal Django live-chat canary. Foundational work MUST add `pnpm test:coverage` with `@vitest/coverage-v8` and `pnpm backend:test:coverage` with `pytest-cov`; each reported metric for new or materially changed executable code MUST meet 80%. Standard verification remains `pnpm test:unit`, `pnpm backend:test`, `pnpm test:e2e`, `pnpm test:chat:live`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and relevant backend checks.

**Target Platform**: Public browser SPA, Django public chat APIs, protected Django maintainer/admin APIs, and Supabase data/storage services

**Project Type**: Multi-runtime monorepo with Vite React SPA, Django public/protected backend surfaces, and Supabase data plus non-chat ingestion functions

**Performance Goals**: Keep public chat interactions responsive enough for classroom/demo use, preserve the lesson flow when chat degrades, avoid blocking page rendering, and keep maintainer readiness views scannable under partial-data conditions

**Constraints**: Public chat remains scoped to approved materials; browser code cannot own privileged retrieval, secrets, or source access; typed successful chat states must cover refusal, weak support, cooldown, and fallback; Django owns public chat orchestration and Redis protection state; Supabase no longer owns a public chat backend in this feature; no React Router, global store, learner accounts, public admin surface, broad answer caching, or additional public-chat runtime migration beyond the Django cutover

**Scale/Scope**: Touches the existing chat UI and client contracts in `src/components/chat`, `src/lib/chat`, and `src/types`; the Django public chat route, future chatbot orchestration, retrieval policy, Redis protection, and NVIDIA adapter ownership under `backend/chatbot`, `backend/retrieval`, and shared backend utilities; removal of the Supabase public chat functions and chat-specific shared helpers; and the protected readiness, source, validation, and audit experience in `src/components/modules/MaintainerDashboard`, `src/lib/maintainer`, `backend/sources`, and `backend/validation`

## Information Flow

The chatbot's information pipeline for MVP is:

1. Approved source materials begin in the repo-local staging area under `archive/docs/approved-sources/`.
2. Original files such as official PDFs live in `archive/docs/approved-sources/raw/`.
3. Cleaned markdown, extracted text, or normalized working copies live in `archive/docs/approved-sources/normalized/`.
4. Approved source files are uploaded into private Supabase storage and registered with stable source metadata.
5. Server-side ingestion extracts and normalizes source text, splits it into retrieval chunks, and associates chunk/citation metadata with canonical `sourceId` values.
6. The embedding role creates vectors for approved chunks and stores them in Supabase/Postgres alongside citations, source metadata, and retrieval-ready records.
7. At chat time, the Django public chat runtime receives the learner prompt and optional section/depth context, applies Redis-backed protection and topic guard checks, retrieves candidate chunks from the approved-source store, reranks them, and passes the selected context to the generation role.
8. The safety guard screens the final answer before the browser receives a typed learner-visible response plus safe citation details.

The browser never reads raw private source files directly and never performs privileged retrieval itself. The browser only receives bounded chat responses and source-support details that are safe to display. Redis is outside this knowledge path and exists only to help Django make short-lived operational protection decisions around that path.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Runtime Boundaries**: PASS. Public learner chat remains a React SPA client backed by Django public chat APIs, while protected readiness and stewardship data remain owned by Django admin APIs. Supabase remains the private storage/Postgres data layer rather than the public chat runtime.
- **Runtime-Appropriate Ownership**: PASS. React owns learner chat presentation and maintainer workflow presentation, Django owns public chat protection, Redis state, grounding policies, source stewardship, and validation data contracts, and Supabase owns durable approved-source storage/data services.
- **Composition Roots**: PASS. The plan keeps `SourceAwareChat`, Django chat views, and protected Django views as orchestration/composition points rather than moving business rules into app shells.
- **Privileged Logic Boundary**: PASS. Approved-source retrieval, private source access, cache keys, rate limiting state, and any secret-bearing operations remain outside browser-facing `src/`.
- **Shared Modules and Abstractions**: PASS. The plan extends existing stable contracts in `src/types/chat.ts`, `src/lib/maintainer/api`, `backend/sources/dtos.py`, and `backend/validation/dtos.py` instead of introducing broad new shared layers.
- **Typed Boundary States**: PASS. Chat success envelopes will continue to model `answered`, `weakSupport`, `refused`, and `cooldown`, and the plan adds an explicit `fallback` success state so degraded responses stop collapsing into generic client errors.
- **Cohesion and Styling Ownership**: PASS. Public chat UI changes stay in `src/components/chat`, maintainer workflow UI changes stay in `src/components/modules/MaintainerDashboard`, and server-side policy changes stay close to their existing runtime owners.
- **Accessible Resilience**: PASS. The plan preserves keyboard access, reduced motion, visible focus, section-aware prompts, and learner-safe fallback behavior across public chat and maintainer states.
- **TDD Sequence**: PASS. Every implementation slice starts with user-visible or contract-level red tests, proceeds with minimum code to green, and includes a refactor checkpoint while the focused suite remains green.
- **Test Layer**: PASS. Frontend Vitest/MSW covers UI, parsing, and browser-request contracts; backend pytest covers Django chat, Redis protection, model adapters, grounding, stewardship, and validation; Supabase Function tests cover only non-chat ingestion; focused Playwright and live-chat checks cover critical user-visible wiring.
- **Coverage Gate**: PASS. Foundational work adds frontend and backend coverage commands, and each story verifies at least 80% for every metric reported over its new or materially changed executable scope.
- **Verification and Delivery**: PASS. The plan names the exact `pnpm` and backend checks for changed surfaces and avoids introducing any constitution violation that would require complexity tracking.

## TDD And Coverage Plan

All behavior-changing work follows this sequence:

1. Write the smallest focused test for the story's observable behavior and relevant edge, error, or boundary cases.
2. Run the focused test and record that it fails for the intended missing behavior, not for setup or fixture errors.
3. Implement the minimum production code needed to make the focused test pass.
4. Refactor naming, ownership, and duplication only while the focused suite remains green.
5. Run the story suite and coverage command, closing gaps until every reported metric for changed executable code is at least 80%.

### Story-first red test map

| Story | First red tests | Fastest primary layer | Critical higher-level proof |
|---|---|---|---|
| US1 trusted scoped answers | Django request/envelope tests for depth, five model roles, grounding, weak support, refusal, provider failure, malformed/oversized input; frontend parser/rendering tests for trust and citation states | `pnpm backend:test`, `pnpm test:unit` with MSW where the real fetch boundary matters | One mocked learner smoke journey and one minimal live Django chat canary |
| US2 degraded lesson continuity | Django protection tests for rate windows, abuse escalation, cooldown expiry, Redis failure, and in-memory fallback; frontend tests for suggestions, cooldown, fallback, retry, keyboard, and reduced-motion behavior | `pnpm backend:test`, `pnpm test:unit` | One mocked degraded-state browser journey |
| US3 maintainer readiness | Django API tests for auth, partial data, blockers, validation detail, audit filters, and action links; frontend tests for healthy/warning/failed/empty/retry states | `pnpm backend:test`, `pnpm test:unit` | One protected maintainer smoke journey |

### Coverage scope and commands

- Frontend changed scope: executable files added or materially changed under `src/components/chat`, `src/lib/chat`, `src/types/chat.ts`, and the touched `MaintainerDashboard` modules.
- Backend changed scope: executable files added or materially changed under `backend/chatbot`, `backend/retrieval`, and touched `backend/sources` or `backend/validation` modules.
- Non-chat Supabase ingestion code is included only when this feature materially changes it.
- Foundational tasks MUST add `pnpm test:coverage` and `pnpm backend:test:coverage` before story implementation. The commands MUST fail below 80% for every metric they report on the changed scope.
- Playwright results do not substitute for instrumented frontend/backend coverage. They provide critical-journey confidence after lower test layers are green.
- Skipped or disabled tests cannot satisfy story acceptance or coverage gates without a documented reason and removal condition.

## Project Structure

### Documentation (this feature)

```text
specs/001-grounded-chatbot-readiness/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── maintainer-readiness.md
│   └── public-chat.md
└── tasks.md                    # Created later by /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── chat/
│   │   ├── SourceAwareChat.tsx
│   │   └── SourceAwareChat.test.tsx
│   └── modules/
│       └── MaintainerDashboard/
│           ├── MaintainerDashboard.tsx
│           ├── hooks/useMaintainerDashboardData.ts
│           ├── overview/
│           ├── sources/
│           ├── trust/
│           ├── validation/
│           ├── audit-trail/
│           └── shared/
├── data/chat/
├── lib/
│   ├── chat/
│   └── maintainer/
└── types/chat.ts

supabase/
├── functions/
│   ├── ingest-content/index.ts
│   ├── ingest-pdf/index.ts
│   ├── _shared/
│   │   ├── ingestion-persistence.ts
│   │   ├── ingestion-pipeline.ts
│   │   └── ingestion-request-validation.ts
│   └── tests/

backend/
├── chatbot/
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── protection.py
│   └── nvidia.py
├── retrieval/
├── sources/
│   ├── views.py
│   ├── urls.py
│   ├── dtos.py
│   └── repositories/
├── validation/
│   ├── views.py
│   ├── urls.py
│   ├── dtos.py
│   └── repository.py
└── tests/

tests/
├── e2e/
└── support/
```

**Structure Decision**: Build on the existing chat and maintainer modules instead of creating parallel workflows. Public chat UX and parsing stay feature-owned under `src/components/chat`, `src/lib/chat`, and `src/types/chat.ts`; public chat protection, grounding policies, Redis state, retrieval orchestration, and NVIDIA model routing move into Django under `backend/chatbot` and related backend services; and readiness, source, validation, and audit workflows continue to use the current maintainer dashboard frontend backed by Django `sources` and `validation` endpoints. Supabase chat functions and chat-specific shared helpers are retired as part of this cutover.

## Delivery Strategy

### Phase 0 - Research and contract decisions

- Confirm the authoritative runtime split for learner chat, protection state, and maintainer readiness, with Django owning public chat and Redis-backed protection state.
- Preserve the five model responsibilities from the chatbot architecture artifact: generation, embedding, reranking, topic guard, and safety guard.
- Confirm the NVIDIA provider adapter configuration and server-only Django environment names for each model role.
- Confirm the approved-source ingestion path from `archive/docs/approved-sources/` into private Supabase storage and retrieval-ready Postgres records.
- Confirm the exact Redis key families, TTLs, invalidation markers, and fallback rules for rate limits, abuse counters, cooldown markers, guard decision caches, query helper caches, and any narrowly scoped operational cache entries.
- Decide how to extend the existing chat envelope to carry depth mode and fallback without breaking the current typed-success pattern.
- Confirm Redis usage remains optional, Django-owned, and limited to short-lived protection state with a no-Redis local-development fallback.

### Phase 1 - Design and contract shaping

- Add frontend and backend coverage tooling, deterministic Redis/NVIDIA test doubles, and changed-scope coverage commands before production implementation begins.
- Extend public chat request/response contracts to support section context, depth mode, explicit fallback, and visible source support.
- Define how the generation, embedding, reranking, topic guard, and safety guard responsibilities are represented in public chat contracts, Django backend services, and verification coverage.
- Define server-only adapter contracts for NVIDIA generation, embedding, rerank, topic guard, and safety guard calls, including deterministic test doubles for backend tests.
- Define Redis protection and caching contracts for rate limiting, abuse scoring, cooldown escalation, expiration behavior, cache invalidation, no-Redis fallback semantics, and protected observability without letting Redis leak into source-of-truth content ownership.
- Align maintainer readiness contracts around the current stewardship dashboard, source detail, validation, and audit DTOs instead of introducing a new dashboard model.
- Identify the exact frontend and backend owners for readiness metrics, validation detail, and audit navigation.

### Phase 2 - Implementation slices for task generation

- Slice 0: Coverage tooling and deterministic fixtures required for the 80% gate
- Slice 1: Red tests, then public chat contracts, trust labels, and learner-visible typed states
- Slice 2: Red tests, then Django public chat cutover, Redis-backed operational state, and distinct generation, embedding, reranking, topic guard, and safety guard responsibilities
- Slice 3: Red tests, then maintainer readiness, validation, and audit workflow tightening
- Slice 4: Green/refactor checkpoints, changed-scope coverage closure, focused browser smoke checks, and the minimal live-chat canary

## Complexity Tracking

No constitution violations are currently required.
