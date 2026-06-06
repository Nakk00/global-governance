# Quickstart: Grounded Chatbot Readiness

## Goal

Validate the planned feature end to end across the public Django chat flow, Django-owned Redis protection path, Supabase-approved source data layer, and protected maintainer readiness workflow.

## Prerequisites

- Project dependencies installed with `pnpm install`
- Local environment variables configured for frontend, Supabase data/storage services, Redis, and backend development
- NVIDIA Build/NIM API access configured only in server-side Django backend environment variables
- Supabase CLI available for local storage, Postgres, pgvector, and ingestion support
- Backend Python environment working through the repo scripts

## NVIDIA Model Configuration

The MVP plan assumes server-side NVIDIA Build/NIM adapters with this role map:

```text
Generation:  nvidia/llama-3.1-nemotron-nano-8b-v1
Embedding:   nvidia/llama-nemotron-embed-1b-v2
Rerank:      nvidia/llama-nemotron-rerank-1b-v2
Topic guard: nvidia/llama-3.1-nemoguard-8b-topic-control
Safety:      nvidia/llama-3.1-nemotron-safety-guard-8b-v3
```

Expected outcome:

- The NVIDIA API key and model IDs are read by Django backend code only.
- Browser-facing code never receives or stores provider secrets or raw model routing configuration.
- Unit and backend tests use deterministic doubles unless a live-chat canary explicitly opts into live provider calls.

## Start The Relevant Surfaces

### Frontend SPA

```powershell
pnpm dev
```

Expected outcome:

- The public site is available through Vite.
- The learner-facing chat trigger renders in the public experience.

### Supabase data/storage services

```powershell
pnpm supabase:start
```

Expected outcome:

- Local Supabase starts for private storage, Postgres, and pgvector-backed retrieval data.
- Supabase no longer serves a public grounded chat function.

### Django public chat and protected backend APIs

```powershell
pnpm backend:dev
```

Expected outcome:

- The public chat endpoint is available at `/api/chat`.
- Protected admin endpoints such as `/api/admin/sources` and `/api/admin/validation-runs` are available for the maintainer workflow.

### Optional local Redis protection

If you want to exercise the Redis-backed protection path instead of the in-memory fallback, start Redis separately and point Django at `REDIS_URL`.

Expected outcome:

- Django uses Redis for short-lived rate limits, abuse counters, and cooldown markers.
- If Redis is absent, local development can still run through the deterministic in-memory protection fallback.

### Optional local Redis cache checks

When Redis is configured, use deterministic test doubles to verify cache behavior without live NVIDIA calls.

Expected outcome:

- Protection cache entries expire according to their TTLs.
- Guard and query-helper caches use hashed prompt keys rather than raw learner text.
- Retrieval helper caches include source index/version markers before they can be reused.
- Final grounded-answer caching remains disabled by default.

## TDD Working Loop

Before implementing any behavior-changing slice:

1. Add the focused frontend or backend test for the next observable behavior.
2. Run only that focused test and confirm it fails for the intended missing behavior.
3. Implement the minimum code needed to make it pass.
4. Refactor while the focused suite remains green.
5. Run the story suite and changed-scope coverage commands.

Foundational task generation must add these commands before story implementation:

```powershell
pnpm test:coverage
pnpm backend:test:coverage
```

Expected outcome:

- Frontend coverage uses Vitest with `@vitest/coverage-v8`.
- Backend coverage uses pytest with `pytest-cov`.
- Every reported metric for new or materially changed executable code is at least 80%.
- No skipped or disabled test is used to satisfy an acceptance or coverage gate without a documented removal condition.

## Validation Scenarios

### 1. Public chat returns typed learner states

Run:

```powershell
pnpm backend:test
pnpm test:unit
```

Expected outcome:

- Public chat request parsing succeeds for valid prompts.
- `answered`, `weakSupport`, `refused`, `cooldown`, and `fallback` states are validated as explicit contracts.

### 2. Protection logic remains bounded and operationally separate

Run:

```powershell
pnpm chatbot:validate-boundaries
pnpm backend:test
```

Expected outcome:

- Anonymous session protection is enforced.
- Off-topic and abusive prompts are refused or cooled down without exposing privileged data.
- Redis-backed protection is owned by Django, remains optional for local development, and local fallback behavior still works when Redis is absent.
- Redis is not used as the source of truth for approved content, retrieval chunks, embeddings, or citations.
- Redis cache entries use explicit TTLs, versioned keys, and non-reversible prompt hashes.

### 3. Maintainer readiness workflow exposes actionable trust evidence

Run:

```powershell
pnpm backend:test
pnpm test:unit
```

Expected outcome:

- Stewardship dashboard, source detail, and validation contracts remain stable.
- Maintainer UI can render readiness, blockers, next actions, validation detail, and audit evidence from protected APIs.

### 4. Browser-level learner and maintainer flows still work

Run:

```powershell
pnpm test:e2e
pnpm test:chat:live
pnpm test:coverage
pnpm backend:test:coverage
```

Expected outcome:

- The learner can open chat, ask a scoped question, and see visible trust cues.
- Degraded or throttled chat states remain understandable.
- The live chat canary confirms the real local Django `/api/chat` path is the public chat owner.

## Full Verification Sweep

Run:

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm backend:test
pnpm backend:check
pnpm test:functions
pnpm test:e2e
pnpm test:chat:live
```

Expected outcome:

- Frontend, Django backend, non-chat Supabase function, and browser-facing checks all pass for the touched feature surfaces.
- Coverage reports meet the 80% changed-scope gate for every reported metric.
