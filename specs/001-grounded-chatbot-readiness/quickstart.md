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

### Full local chatbot stack

```powershell
pnpm local:dev
```

Expected outcome:

- Docker starts the repo-managed Redis container separately from Supabase at `redis://127.0.0.1:6379/0`.
- Supabase starts for private storage, Postgres, and pgvector-backed retrieval data.
- Django starts at `http://127.0.0.1:8000` after required service checks and migrations.
- Vite starts the public SPA.

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

### Required local Redis protection

Redis is a required local/runtime dependency for Django public-chat protection. Start it with the repo helper when running services separately:

```powershell
pnpm redis:start
pnpm redis:status
```

Expected outcome:

- Django uses Redis for short-lived rate limits, abuse counters, and cooldown markers.
- If Redis is absent, `pnpm backend:dev` fails fast with an actionable prerequisite error instead of silently weakening protection behavior.
- Deterministic in-memory protection doubles are limited to isolated backend tests and runtime-failure simulations.

### Redis cache checks

Use deterministic test doubles to verify cache behavior without live NVIDIA calls.

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

## Phase 1 Coverage Baseline

Recorded on 2026-06-06 while completing setup tasks T001-T005.

### Frontend changed-scope coverage

Command:

```powershell
pnpm test:coverage
```

Configured include patterns:

- `src/components/chat/**/*.{ts,tsx}`
- `src/lib/chat/**/*.{ts,tsx}`
- `src/types/chat.ts`
- `src/components/modules/MaintainerDashboard/**/*.{ts,tsx}`

Initial result:

- Vitest and `@vitest/coverage-v8` started successfully with the V8 provider.
- The command did not reach a final coverage percentage because existing MaintainerDashboard tests failed first.
- Result summary: 14 test files passed, 2 test files failed, 101 tests passed, 11 tests failed.
- Failing files: `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` and `src/components/modules/MaintainerDashboard/sources/SourceDetailPage.test.tsx`.
- The failures are assertion/UI-state mismatches in the already-modified maintainer dashboard area, not coverage dependency or configuration failures.

### Backend changed-scope coverage

Command:

```powershell
pnpm backend:test:coverage
```

Configured coverage packages:

- `chatbot`
- `retrieval`
- `ingestion`
- `sources`
- `validation`

Initial result:

- Pytest, pytest-django, and pytest-cov ran successfully.
- Result summary: 79 backend tests passed.
- Coverage total: 72.74%, below the required 80% gate.
- Lowest current coverage areas: `backend/sources/repositories/supabase.py`, `backend/validation/repository.py`, and `backend/sources/views.py`.
- HTML coverage output was written to `backend/htmlcov`.

## Phase 2 GitNexus Impact Baseline

Recorded on 2026-06-06 for T006 before foundational symbol edits.

| Symbol | Resolved target | Risk | Direct callers or importers reported by GitNexus |
|---|---|---|---|
| `buildIngestionPayload` | `supabase/functions/_shared/ingestion-pipeline.ts` | MEDIUM | `scripts/chatbot/validate-chatbot-set.ts:main`, `scripts/chatbot/prepare-ingestion.ts:main`, `ingestIntoMemoryStore`, `supabase/functions/ingest-pdf/index.ts`, `supabase/functions/ingest-content/index.ts` |
| `persistIngestionPayload` | `supabase/functions/_shared/ingestion-persistence.ts` | LOW | `supabase/functions/ingest-pdf/index.ts`, `supabase/functions/ingest-content/index.ts` |
| `dispatch_ingest` | `backend/sources/services.py` | LOW | None reported for the service function. GitNexus also found repository-method candidates in `backend/sources/repositories/base.py`, `memory.py`, and `supabase.py`; reassess those separately before editing repository implementations. |
| `public_chat` | `backend/chatbot/views.py` | LOW | None reported |
| `requestGroundedAnswer` | `src/lib/chat/api-client.ts` | LOW | None reported by GitNexus. Source inspection shows it is the default chat client imported by `SourceAwareChat`, so treat the zero-caller result as a stale-index caveat. |
| `parseGroundedChatEnvelope` | `src/lib/chat/grounded-answer.ts` | LOW | None reported by GitNexus. Source inspection shows it is used by `src/lib/chat/api-client.ts`, so treat the zero-caller result as a stale-index caveat. |
| `SourceAwareChat` | `src/components/chat/SourceAwareChat.tsx` | LOW | `src/components/layout/AppShell.tsx:AppShell`; one `AppShell` process affected |
| `SupabaseStewardshipRepository` | `backend/sources/repositories/supabase.py` | LOW | `backend/sources/repositories/__init__.py` import |
| `ValidationRunDetailDto` | `backend/validation/dtos.py` | LOW | `backend/validation/services.py` import, `backend/validation/repository.py` import |

No HIGH or CRITICAL risk results were reported. The merged graph report was built from commit `388cc792`, so re-run graph refresh or source inspection when the graph disagrees with obvious imports.

## Phase 2 Public Chat Cutover Guard

Recorded on 2026-06-06 for T011-T012.

Command:

```powershell
backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml backend\tests\test_public_chat_cutover.py
```

Result:

- `3` tests passed.
- `/api/chat` resolves to Django `chatbot.views.public_chat`.
- `supabase/config.toml` has no `chat` or `chat-retrieve` function registrations.
- Supabase public-chat function files and chat-only shared helpers are absent.

T011 originally expected an intentional red result before T012. That red result could not be reproduced in this worktree because the Supabase public-chat retirement had already been applied before the guard test was added.

## Phase 2 Boundary Verification

Recorded on 2026-06-06 for T013-T014.

Commands:

```powershell
pnpm chatbot:validate-boundaries
pnpm test:functions
backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml backend\tests\test_public_chat_cutover.py
```

Results:

- `pnpm chatbot:validate-boundaries`: passed 5 static boundary checks covering Django route ownership, retired Supabase public-chat functions, browser secret/model routing, Supabase model routing, and backend server-only settings.
- `pnpm test:functions`: 1 file passed, 7 tests passed.
- `backend/tests/test_public_chat_cutover.py`: 3 tests passed.

## Acceptance Sets

Use and record the same scripted samples for release evidence:

- `20` in-scope learner prompts for SC-001
- `12` degraded, off-topic, unsafe, throttled, or cooldown prompts for SC-002
- `10` maintainer validation findings for SC-004
- `10` scripted learner-state examples for SC-006

For SC-003, time a maintainer from initial protected readiness page load until they can name overall readiness, the current blocker set, and the next recommended action. Record the elapsed time in this document.

## Prepare Retrieval-Ready Approved Sources

Strong `answered` outcomes require at least one approved source to be fully processed before the public chat can use it. Files under `archive/docs/approved-sources/` are staging inputs only; their presence in the repository does not make them retrievable.

Foundational implementation must add:

```powershell
pnpm backend:ingest:approved
```

Expected outcome:

- The canonical manifest maps every staged file to a stable approved `sourceId`.
- Django extracts and normalizes content, creates bounded chunks, and requests real NVIDIA embeddings.
- Deterministic synthetic embeddings remain limited to tests and explicit dry runs.
- Documents, chunks, references, reference-to-chunk links, and vectors are persisted atomically into private Supabase/Postgres.
- Failed extraction, embedding, or persistence marks the ingest job failed and does not make the source ready or active.
- Recorded ingest evidence includes provider model identity and vector dimensions for real embeddings; deterministic vectors are valid only in dry-run or test evidence.
- At least one successfully ingested and approved source is activated before strong grounded-answer acceptance testing begins.

## Validation Scenarios

### 1. Public chat returns typed learner states

Run:

```powershell
pnpm backend:test
pnpm test:unit
```

Expected outcome:

- The initial approved-source ingestion check has succeeded for at least one active source.
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
- Redis-backed protection is owned by Django, is required for normal local/runtime chatbot startup, and uses deterministic fallback doubles only for isolated failure tests.
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
- Because GitNexus route extraction does not currently map these Django endpoints reliably in this repo, treat source inspection plus backend tests and the live canary as the authoritative ownership proof for `/api/chat` and protected ingest routes.

### 5. Acceptance measurement

Run:

```powershell
pnpm backend:test
pnpm test:unit
pnpm test:e2e
pnpm test:chat:live
```

Record:

- SC-001: count grounded or limited-support outcomes from the 20-prompt in-scope set
- SC-002: confirm all 12 degraded/off-topic prompts return bounded outcomes
- SC-003: maintainer readiness completion time
- SC-004: count one-flow validation-to-source traces from the 10-finding set
- SC-006: count correct trust-state identifications from the 10 scripted learner-state examples

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
