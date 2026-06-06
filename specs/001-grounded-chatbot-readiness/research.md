# Research: Grounded Chatbot Readiness

## Decision: Cut public grounded chat over to Django and retire the Supabase chat runtime

**Rationale**: The feature is now an intentional public-chat runtime cutover. Django should become the single backend owner for public chatbot orchestration, Redis-backed protection state, retrieval policy, citation packaging, NVIDIA model routing, and protected maintainer workflows. Supabase remains the durable data and storage layer for approved source files, chunks, embeddings, citations, and source metadata, but it no longer owns a public chat Edge Function path. This gives the project one backend control plane for both learner-facing chat policy and maintainer-facing readiness operations.

**Alternatives considered**:

- Keep public chat on Supabase Edge Functions: rejected because the user wants the existing Supabase chat implementation removed now and future chatbot tasks generated around Django ownership.
- Call models directly from the browser: rejected because it breaks the privileged logic boundary and source-protection requirements.
- Split Redis protection between Supabase and Django: rejected because rate limits, abuse counters, and cooldown state should live with the Django public chat route that makes the final allow/refuse/cooldown decision.

## Decision: Treat `archive/docs/approved-sources/` as the human-managed staging area and Supabase as the retrieval source of truth

**Rationale**: The repo already defines `archive/docs/approved-sources/` as the staging area for approved chatbot materials, with `raw/` for original documents and `normalized/` for prepared derivatives. This is the right human-facing intake point for source stewardship, but it should not be the live retrieval layer. The bot should retrieve from private Supabase storage and Supabase/Postgres records created by server-side ingestion, because that is where chunking, embeddings, citation metadata, and canonical `sourceId` mapping can be enforced consistently.

Repository verification found that the existing Supabase helpers can validate, normalize, chunk, construct citation payloads, and persist through `persist_ingestion_document`, but the checked-in batch preparation command only prints summaries, the current vectors are deterministic synthetic values, and the protected maintainer `dispatch_ingest` path marks jobs successful without invoking content processing. The current `source_ingest_jobs` schema also does not allow the planned `processing` state. Therefore this feature must operationalize the missing bridge before strong grounded-answer acceptance: Django owns real NVIDIA embedding orchestration and ingest job truth, the schema must be aligned to the real lifecycle, and Supabase remains the private durable storage and pgvector destination.

Retained Supabase ingestion functions may remain for compatibility or storage-support behavior, but they cannot stay as an activation-capable production path that writes synthetic vectors. They must either delegate to the Django-owned ingestion workflow or be constrained to dry-run and compatibility-only use.

**Information flow**:

1. Maintainers curate approved documents in `archive/docs/approved-sources/raw/` and `archive/docs/approved-sources/normalized/`.
2. Approved materials are uploaded to private Supabase storage.
3. Server-side ingestion extracts or normalizes text, splits it into chunks, creates embeddings, and records citations/source metadata in Supabase/Postgres.
4. The Django public chat runtime retrieves only from those ingestion outputs, not from raw repo files or browser-accessible assets.

**Alternatives considered**:

- Read directly from repo-local markdown or PDFs during live chat: rejected because live chat should not depend on raw local files and cannot assume server access to repo-only paths in deployment.
- Expose source documents from `public/` and let the browser inspect them: rejected because the approved-source README and the security strategy both keep source materials out of browser-facing code.
- Skip canonical source ingestion and embed ad hoc notes only: rejected because trust, validation, and maintainer auditability depend on stable `sourceId` mapping and durable retrieval records.

## Decision: Extend the current typed-success chat envelope instead of inventing a second response model

**Rationale**: The current client/server contract already models successful learner-visible states with `answered`, `weakSupport`, `refused`, and `cooldown`. The spec adds two missing needs: depth-aware behavior and a first-class fallback outcome when chat cannot complete normally but the learner should still remain in the lesson. Extending the existing envelope to include `context.depthMode` and a `fallback` success variant preserves established parsing and UI flow while making degraded states deliberate.

**Alternatives considered**:

- Keep fallback as a transport error only: rejected because the spec requires fallback to be a user-understandable typed outcome.
- Add a separate endpoint just for fallback or prompt suggestions: rejected because the current chat flow can own that behavior without widening the API surface.

## Decision: Preserve five distinct model responsibilities without requiring five separate providers in MVP

**Rationale**: The source chatbot architecture artifact names five model roles: generation, embedding, reranking, topic guard, and safety guard. The implementation plan should preserve these as distinct responsibilities because they protect answer quality, source relevance, scope control, and public safety. For MVP, these roles may be implemented with a mix of live model calls, deterministic policy checks, existing retrieval helpers, or provider-shared services, but the contracts and tests must make the responsibilities visible so future upgrades do not blur them together.

**Alternatives considered**:

- Treat the five roles as optional implementation detail: rejected because task generation would likely collapse them into generic "chat grounding" work and miss topic/safety/rerank obligations.
- Require five separate model vendors or five separate network calls immediately: rejected because the planning artifact describes responsibilities, not a mandatory provider topology, and MVP performance/cost constraints still matter.
- Combine topic guard and safety guard into one generic moderation step: rejected because scope control before retrieval/generation and final output safety are different decisions with different failure modes.

## Decision: Use NVIDIA Build/NIM as the MVP model provider and make Nano 8B the default generation model

**Rationale**: The user has an NVIDIA Build account and API key, so the MVP should avoid multi-provider complexity and route all model responsibilities through server-side Django-owned NVIDIA provider adapters. For generation, `nvidia/llama-3.1-nemotron-nano-8b-v1` is the better default than a larger model because the chatbot is a bounded RAG assistant whose trust comes from retrieval, citations, topic control, safety control, weak-support handling, and maintainer validation. NVIDIA describes the Nano model as a reasoning/chat model for chatbots, RAG systems, and tool calling, with a strong accuracy/efficiency tradeoff, 128K context support, and commercial readiness.

**Selected model map**:

| Role | NVIDIA model | Reason |
|---|---|---|
| Generation | `nvidia/llama-3.1-nemotron-nano-8b-v1` | Best MVP balance of chat/RAG capability, latency, and cost |
| Embedding | `nvidia/llama-nemotron-embed-1b-v2` | NVIDIA retriever embedding model for multilingual long-document QA retrieval |
| Rerank | `nvidia/llama-nemotron-rerank-1b-v2` | NVIDIA retrieval reranker for scoring query-passage relevance |
| Topic guard | `nvidia/llama-3.1-nemoguard-8b-topic-control` | NVIDIA topic-control classifier for on-topic vs off-topic turns |
| Safety guard | `nvidia/llama-3.1-nemotron-safety-guard-8b-v3` | NVIDIA safety model for prompt and response moderation |

**Alternatives considered**:

- Use `nvidia/llama-3.3-nemotron-super-49b-v1.5` as default generation: rejected for MVP because it is a larger reasoning model and likely overkill for a public student-facing bounded RAG assistant. Keep it as a future upgrade candidate for expert-mode evaluation or high-quality review runs.
- Mix NVIDIA with other providers for embeddings, reranking, or guards: rejected for MVP because the user already has NVIDIA access and a single provider simplifies server-only configuration, testing, and rollout.
- Let browser code select model IDs: rejected because provider names, model routing, and API keys belong in the Django server-side chat runtime.

## Decision: Put required Redis-backed public-chat protection under Django, with test-only fallback doubles

**Rationale**: Redis should stay a protection layer, not a source-of-truth layer, but the owner of that protection layer changes with the runtime cutover. Django now owns rate limits, abuse counters, cooldown markers, and any short-lived public-chat operational state because Django owns the public chat route and final protection decision. Redis is required for normal local and runtime chatbot startup so protection behavior is exercised consistently; deterministic in-memory doubles are allowed only in isolated backend tests and failure simulations.

**Redis architecture scope**:

- Redis is for short-lived operational protection data such as request-count windows, abuse counters, cooldown timers, request fingerprints, and tightly bounded operational cache entries when explicitly justified.
- Redis is not the retrieval layer and not the content layer.
- Approved files, chunks, embeddings, citations, source metadata, and validation evidence remain in Supabase Storage plus Supabase/Postgres.
- Retrieval decisions should read canonical knowledge from the durable approved-source store, not from Redis.
- Browser code never talks to Redis directly; only Django does.

**Alternatives considered**:

- Make Redis optional for normal local development: rejected because it would hide protection-state bugs until later integration runs.
- Store protection state in Supabase tables: rejected because the spec treats Redis as operational state and keeps Supabase as the durable source-of-truth layer.
- Keep the old Supabase chat protection helper as a bridge: rejected because the user explicitly wants the Supabase chat implementation removed rather than kept as the active or fallback public-chat backend.
- Let Redis hold chunks, embeddings, or canonical citations for fast retrieval: rejected because that would blur the line between operational state and durable knowledge, weaken auditability, and complicate maintainer trust/reproducibility.

## Decision: Use narrow Redis caching only for short-lived Django runtime decisions

**Rationale**: Redis can improve public chatbot latency and reduce repeated model/provider work, but caching must not undermine source freshness, citation integrity, privacy, or maintainer auditability. The MVP should cache protection state through the required runtime Redis service, allow short-lived guard and query helper caches where they are versioned and safe, and keep final grounded-answer caching disabled by default. Every cache key that depends on learner text should use a server-side HMAC or equivalent non-reversible hash rather than storing raw prompts in Redis.

**Cache policy**:

- Protection state is the primary MVP Redis use case and may store request-count windows, abuse counters, cooldown markers, and challenge markers.
- Topic guard, safety precheck, query embedding, and rerank helper results may be cached for repeated identical prompts only when keyed by prompt hash, section context, depth mode where relevant, model version, and policy version.
- Retrieval result caching is post-MVP by default and may cache chunk IDs plus scores only when keyed by the active source index/version and retrieval policy version.
- Redis must not store private source text, canonical chunk content, canonical embeddings, canonical citations, validation records, or broad final answers as the authoritative record.
- Broad final-answer caching remains disabled in MVP because the answer depends on current source activation, section context, depth mode, model versions, policy versions, and citation packaging.
- Cache telemetry may be used in protected maintainer observability later, but anonymous browser responses must not expose cache keys, raw prompt hashes, or private cache internals.

**Alternatives considered**:

- Cache every final answer for speed: rejected because stale citations, changed sources, wrong depth mode, and section mismatch would damage trust faster than it would improve latency.
- Cache raw prompts and raw retrieved chunks in Redis: rejected because it increases privacy and source-exposure risk.
- Avoid all caching beyond rate limits forever: rejected because short-lived guard/query helper caching can reduce repeated provider work without changing the source-of-truth model.

## Decision: Keep source support visibility anchored to the current citation-first chat surface

**Rationale**: `src/components/chat/SourceAwareChat.tsx` already renders grounded answer cues and expandable citation rows. The plan should strengthen this existing pattern by adding clearer depth-state cues and explicit fallback/limited-support messaging, rather than replacing the surface with a new citation UX. This keeps the learner-facing behavior coherent and lowers implementation risk.

**Alternatives considered**:

- Replace the current answer surface with a brand-new chat layout: rejected because the spec is about trust/readiness improvements, not a full UI rewrite.
- Hide citations behind a separate detail page: rejected because it weakens trust cues at the point where the learner needs them.

## Decision: Build maintainer readiness on the current stewardship and validation contracts

**Rationale**: The repo already exposes protected admin endpoints for stewardship dashboard, source detail, chunk/citation inspection, validation set/run listing, and validation run detail. Existing DTOs such as `StewardshipDashboardDto`, `ChatbotTrustDto`, and `ValidationRunDetailDto` already express much of the readiness model. Extending these contracts is lower risk than creating a second readiness domain.

**Alternatives considered**:

- Create a new standalone readiness backend surface: rejected because it would duplicate existing stewardship and validation concepts.
- Push readiness computation fully into the frontend: rejected because the relevant trust and audit data are already protected backend concerns.

## Decision: Require red-green-refactor with an 80% changed-scope coverage gate

**Rationale**: The feature introduces a public Django endpoint, five model-role adapters, Redis protection and fallback behavior, retrieval/citation contracts, learner trust states, and protected maintainer workflows. Each behavior-changing slice must begin with a focused failing test, proceed with the minimum implementation needed for green, and be refactored only while the focused suite remains green. Frontend Vitest/MSW and backend pytest carry the behavior, edge, error, and boundary matrices. Focused Playwright remains the critical-journey layer, while the live chat check becomes a minimal canary for the real Django `/api/chat` path. New or materially changed executable code must meet at least 80% for every metric reported by the selected frontend and backend coverage tools.

The repository does not currently expose frontend or backend coverage commands. Task generation must therefore create foundational work to add `@vitest/coverage-v8`, `pytest-cov`, `pnpm test:coverage`, and `pnpm backend:test:coverage` before production implementation begins. Coverage should be scoped to files added or materially changed by this feature so untouched legacy code does not hide feature gaps or block delivery.

**Alternatives considered**:

- Keep test-first development optional: rejected because constitution 2.0.0 makes red-green-refactor mandatory for behavior-changing work.
- Apply an unscoped global 80% gate immediately: rejected because the current repo has no established coverage baseline and unrelated untouched legacy code should not obscure this feature's evidence.
- Rely mostly on Playwright: rejected because rule matrices and envelope validation are faster and more stable in unit/function/backend layers.
- Skip live chat canary coverage permanently: rejected because this feature directly changes the public chat contract and protection behavior, even though the first cutover step may only assert the Django route ownership and migration-pending envelope.
