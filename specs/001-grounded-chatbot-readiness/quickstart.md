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
- `100%` of visible suggested starter prompts from `src/data/chat/source-aware-chat.ts` classified by the prompt-readiness audit before release

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

## Phase 3 Ingestion Red Baseline

Recorded on 2026-06-06 for T015-T019 and T094.

Command:

```powershell
backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml backend\tests\test_approved_source_manifest.py backend\tests\test_ingestion_pipeline.py backend\tests\test_ingestion_repository.py backend\tests\test_admin_stewardship.py -q
```

Intended red result:

- Pytest collected the four focused Phase 3 files and stopped with four import errors.
- `backend/tests/test_approved_source_manifest.py` failed because `ingestion.pipeline` did not exist.
- `backend/tests/test_ingestion_pipeline.py`, `backend/tests/test_ingestion_repository.py`, and `backend/tests/test_admin_stewardship.py` failed because `ingestion.dtos` did not exist.
- These failures identify the missing manifest, pipeline, persistence, and ingest-job contracts targeted by T020-T025 and T095 rather than unrelated fixture or environment failures.

## Phase 3 Ingestion Implementation Evidence

Recorded on 2026-06-06 after T020-T026 and T095-T096.

Commands and results:

```powershell
pnpm chatbot:prepare-ingestion
pnpm backend:ingest:approved -- --dry-run
pnpm test:functions
pnpm backend:test
pnpm backend:typecheck
pnpm backend:check
pnpm typecheck
pnpm chatbot:validate-boundaries
```

- The canonical manifest covers all `8` staged Markdown files.
- The Django dry run processed all `8` files into `437` bounded chunks and `8` references using explicit deterministic dry-run vectors.
- Retained Supabase ingestion tests passed `8` tests and prove both functions are dry-run only, cannot activate sources, and do not call production persistence helpers.
- The backend suite passed `120` tests on Django `5.2.15`.
- MyPy passed all `81` backend source files.
- Ruff, Django system checks, the Python dependency audit, frontend lint/typecheck/build,
  and the chatbot boundary validator passed.
- Local Supabase migration `0014_operationalize_source_ingest_jobs.sql` applied successfully and the durable table exposes `processing`, document/count evidence, embedding model, and embedding dimension fields.
- Local Supabase migration `0015_repair_ingestion_vector_persistence.sql` repairs older
  applied RPC bodies, requires complete stored vector evidence, and returns vector count
  plus dimensions to Django.

Changed-scope coverage command:

```powershell
backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml --cov=ingestion --cov=chatbot.nvidia --cov-branch --cov-report=term-missing --cov-fail-under=80 backend\tests\test_approved_source_manifest.py backend\tests\test_ingestion_pipeline.py backend\tests\test_ingestion_repository.py backend\tests\test_ingestion_services.py backend\tests\test_admin_stewardship.py -q
```

Result:

- `57` tests and `5` subtests passed.
- Phase 3 changed-scope coverage reached `89.76%`.
- The broader `pnpm backend:test:coverage` command passed all `103` tests that were present at that run but remained below its inherited cross-feature gate at `73.23%`, primarily because untouched `sources/repositories/supabase.py` and `validation/repository.py` remain below the Phase 1 baseline target.

Live persistence and activation evidence:

```powershell
pnpm backend:ingest:approved -- --source-id gg-src-un-charter-institutions
```

- The first credential attempt reached NVIDIA and failed with HTTP `403` before any
  document, chunk, or reference write.
- A working server-only credential then exposed an older applied
  `persist_ingestion_document` function that inserted chunks without vectors.
- Migration `0015` restored vector insertion, added database-side count/dimension checks,
  and the Django repository now rejects incomplete RPC evidence.
- Re-ingestion persisted document
  `doc-gg-src-un-charter-institutions-5cee7a602e1f1579`, `62` chunks, `1` reference,
  and all `62` real NVIDIA vectors at exactly `384` dimensions with nonzero norms.
- The private object exists in `processed-exports` at
  `approved-sources/raw/topic-3-united-nations-purpose-structure-knowledge.md`; the
  reference links to all `62` chunks.
- A protected stewardship re-ingest completed with `status=succeeded`, recorded
  `nvidia/llama-nemotron-embed-1b-v2/384`, and left
  `gg-src-un-charter-institutions` active.
- The temporary credential was removed from tracked `backend/.env.example` after live
  verification; `NVIDIA_API_KEY` is blank in the checked-in example.

## Phase 4 Public Chat Evidence

Recorded on 2026-06-06 for T028-T048.

### Red baseline

The first focused backend run stopped with the intended missing-module errors for
`chatbot.contracts`, `chatbot.dtos`, and `retrieval.repositories`. The first focused
frontend run reported `5` failures and `22` passes, covering missing fallback parsing,
private citation URL rejection, typed fallback client handling, expert depth selection,
and fallback rendering.

### Green implementation

- Django now validates `student` and `expert` requests and returns typed `answered`,
  `weakSupport`, `refused`, `cooldown`, and `fallback` success envelopes.
- NVIDIA adapters cover generation, query embedding, reranking, topic control, and
  safety classification with bounded inputs, timeouts, and safe provider errors.
- Migration `0016_create_approved_chunk_retrieval_rpc.sql` applied locally and passed
  `supabase db lint`; the service-role RPC returned active approved UN Charter chunks.
- The frontend sends section and depth context, rejects private citation URLs, preserves
  HTTP 429 cooldown successes, and renders depth, trust, citation, refusal, and fallback
  controls.
- Focused backend tests passed `53` tests plus `5` subtests with `86.85%` changed-scope
  coverage across `chatbot` and `retrieval`.
- Focused frontend tests passed `45` tests with `94.60%` statements, `87.12%` branches,
  `100%` functions, and `94.52%` lines.
- Ruff, MyPy, TypeScript type checking, and Supabase schema lint passed.
- The mocked smoke and live Django Playwright specs were updated for the new contract.
  The exact default `pnpm test:e2e` command was not executed in this continuation;
  the allowed mocked journey and live chat lanes are recorded in Phase 5.

### Live provider observation

The runtime-only NVIDIA credential was moved from tracked `backend/.env.example` into
ignored `backend/.env` before live checks. Query embedding, local retrieval, reranking,
topic control, safety control, and standalone generation all succeeded. An early full
supported browser request exposed provider and browser-runtime timing limits and safely
returned fallback; after Phase 5 operational caching and browser preflight handling,
the live Django canary returned an `answered` response with citations, a bounded
`refused` response, and a Redis-backed `cooldown` response.

## Phase 5 Degraded Chat Evidence

Recorded on 2026-06-07 for T049-T063.

### Red baseline

- The first focused backend US2 run failed on missing or incomplete protection,
  cache, and runtime integration surfaces targeted by `chatbot.protection`,
  `chatbot.cache`, `chatbot.services`, and `chatbot.views`.
- Frontend parser, client, starter-prompt, and component tests were extended for
  fallback suggestions, retry/cooldown copy, session-local continuity, typed
  transport conversion, focus restoration, and uninterrupted lesson controls.
- The live browser canary then exposed an additional intended route-contract gap:
  cross-origin browser requests to Django sent `OPTIONS /api/chat`, and the route
  returned HTTP `405` before the POST could run. A focused contract test reproduced
  that failure and also proved the POST response needed public-chat CORS headers.

### Green implementation

- Django now requires Redis for normal public-chat protection and uses hashed
  anonymous identities, rate windows, repeated-refusal abuse counters, cooldown
  expiry, and typed runtime fallback when protection storage is unavailable.
- Operational cache keys are HMAC/versioned, carry explicit TTLs and source-index
  invalidation markers, and keep final grounded-answer caching disabled by default.
- The public chat runtime checks protection before expensive model work, records
  refusals and successes, returns typed cooldowns as HTTP `429`, and keeps Redis out
  of canonical source, chunk, embedding, citation, and validation storage.
- The chat UI preserves section-aware starter prompts, fallback source guidance,
  cooldown/retry states, keyboard behavior, focus restoration, and lesson navigation.
- The live chat Playwright lane now builds a separate preview on port `4174` with
  `VITE_CHAT_API_URL=http://127.0.0.1:8000/api/chat`; `/api/chat` accepts browser
  preflight and returns route-scoped CORS headers without changing protected APIs.

### Verification

Commands and results:

```powershell
backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml backend\tests\test_chatbot_protection.py backend\tests\test_chatbot_cache.py backend\tests\test_chatbot_orchestration.py backend\tests\test_public_chat_contract.py -q
pnpm exec vitest run src/lib/chat/grounded-answer.test.ts src/lib/chat/api-client.test.ts src/components/chat/SourceAwareChat.test.tsx src/data/chat/source-aware-chat.test.ts
pnpm test:e2e:journey
pnpm test:chat:live
pnpm typecheck
pnpm backend:typecheck
pnpm backend:lint
pnpm backend:check
pnpm backend:security
pnpm chatbot:validate-boundaries
```

- Focused backend Phase 5 tests passed `32` tests.
- Focused frontend chat tests passed `48` tests.
- Mocked browser journey passed `2` tests, including fallback/retry/suggested-prompt
  recovery and preserved lesson navigation.
- Live Django chat canary passed `3` tests: one grounded answer with citations, one
  bounded refusal, and one Redis-backed cooldown.
- TypeScript type checking, MyPy, Ruff, Django system checks, the Python dependency
  audit, and the chatbot boundary validator all passed.
- The exact `pnpm test:e2e` command was not run by request; this phase used
  `pnpm test:e2e:journey` and `pnpm test:chat:live` instead.

Changed-scope coverage commands:

```powershell
backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml --cov=chatbot.protection --cov=chatbot.cache --cov=chatbot.services --cov=chatbot.views --cov-branch --cov-report=term-missing --cov-fail-under=80 backend\tests\test_chatbot_protection.py backend\tests\test_chatbot_cache.py backend\tests\test_chatbot_orchestration.py backend\tests\test_public_chat_contract.py -q
pnpm exec vitest run src/lib/chat/grounded-answer.test.ts src/lib/chat/api-client.test.ts src/components/chat/SourceAwareChat.test.tsx src/data/chat/source-aware-chat.test.ts --coverage --coverage.include=src/lib/chat/grounded-answer.ts --coverage.include=src/lib/chat/api-client.ts --coverage.include=src/components/chat/SourceAwareChat.tsx --coverage.include=src/data/chat/source-aware-chat.ts --coverage.reporter=text --coverage.reportsDirectory=coverage/frontend-us2
```

Results:

- Backend changed-scope coverage passed at `83.91%` total coverage across
  `chatbot.protection`, `chatbot.cache`, `chatbot.services`, and `chatbot.views`.
- Frontend changed-scope coverage reached `94.11%` statements, `87.05%` branches,
  `100%` functions, and `94%` lines.

## Phase 5A Public Chatbox QA Remediation

Added on 2026-06-07 from the post-Phase-5 browser QA report:
`archive/docs/planning-artifacts/public-redesign-plans/source-aware-chatbox-qa-report.md`.

This amendment merges the report findings into the active Spec Kit source of truth
without rewriting completed Phase 5 tasks. The remediation scope is tracked as
T100-T113 in `tasks.md`.

### Investigation summary

- Graphify and GitNexus review identified the affected areas as the frontend chat
  shell in `src/components/chat/SourceAwareChat.tsx`, static starter prompts in
  `src/data/chat/source-aware-chat.ts`, the browser chat client in
  `src/lib/chat/api-client.ts`, and Django section-scoped retrieval in
  `backend/chatbot/services.py` and `backend/retrieval/services.py`.
- `SourceAwareChat` currently uses a single `submittedQuestion` and single
  `answerState`, so follow-up questions replace prior reviewable content instead
  of appending to a transcript.
- The bottom-right launcher remains rendered while the chat panel is open, which
  explains the duplicate visible "Ask a question" surface under the panel.
- The composer is a plain bounded `textarea` without managed autosize behavior,
  which leaves the multi-line blank-space regression unguarded.
- The West Philippine Sea section chat scope is narrower than the approved
  chapter evidence: the backend currently relies on `gg-src-south-china-sea-award`
  while the chapter data also references approved dossier evidence such as
  `gg-src-wps-enforcement-gap-comparison`,
  `gg-src-wps-political-reality-record`, and
  `gg-src-philippines-arbitration-filing`.
- Graphify highlights the best source-alignment anchor for this remediation as the
  existing dossier evidence path through `getDossierEvidenceSources()` and
  `createWpsEvidenceRegistry()`, so the backend scope tests should verify against
  that existing evidence model instead of introducing a second manually curated
  expectation list.

### Intended red baseline

Confirmed before implementation with:

```powershell
pnpm exec vitest run src/components/chat/SourceAwareChat.test.tsx src/data/chat/source-aware-chat.test.ts
backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml backend\tests\test_retrieval_service.py backend\tests\test_chatbot_orchestration.py -q
```

The first focused Phase 5A red run failed in the intended remediation areas:

- the open panel still left the closed-state launcher visible underneath it;
- transcript rendering replaced the previous exchange instead of preserving prior turns;
- the composer assertions could not prove a stable multi-line height cap plus focus continuity;
- starter prompts were not fully classified for approved-source readiness;
- `west-philippine-sea-dossier` retrieval scope omitted approved dossier evidence already represented by the lesson.

### Green implementation evidence

Commands and results after T105-T113:

```powershell
pnpm exec vitest run src/components/chat/SourceAwareChat.test.tsx src/data/chat/source-aware-chat.test.ts src/data/source-bundles/approved-source-bundle.test.ts src/lib/chat/api-client.test.ts
backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml backend\tests\test_retrieval_service.py backend\tests\test_chatbot_orchestration.py -q
pnpm exec vitest run src/components/chat/SourceAwareChat.test.tsx src/data/chat/source-aware-chat.test.ts src/data/source-bundles/approved-source-bundle.test.ts src/lib/chat/api-client.test.ts --coverage --coverage.include=src/components/chat/SourceAwareChat.tsx --coverage.include=src/data/chat/source-aware-chat.ts --coverage.include=src/data/source-bundles/approved-source-bundle.ts --coverage.include=src/lib/chat/api-client.ts --coverage.reporter=text --coverage.reportsDirectory=coverage/frontend-phase5a
backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml --cov=chatbot.services --cov=retrieval.services --cov-branch --cov-report=term-missing --cov-fail-under=80 backend\tests\test_retrieval_service.py backend\tests\test_chatbot_orchestration.py -q
pnpm exec playwright install --dry-run
pnpm test:e2e:layout
pnpm test:chat:live
pnpm typecheck
pnpm backend:typecheck
pnpm build
```

- Focused frontend Phase 5A tests passed for shell containment, hidden-launcher behavior, append-only transcript rendering, prompt readiness metadata, source-bundle chat adapters, and single-turn request payload preservation.
- Focused backend Phase 5A tests passed for widened West Philippine Sea section scope and source-aligned citation packaging.
- Frontend changed-scope coverage reached `96.80%` statements, `86.14%` branches, `98.57%` functions, and `96.69%` lines across `SourceAwareChat.tsx`, `source-aware-chat.ts`, `approved-source-bundle.ts`, and `api-client.ts`.
- Backend changed-scope coverage reached `88.97%` total, with `chatbot.services` at `86%` and `retrieval.services` at `93%`.
- `pnpm test:e2e:layout` passed `4` mocked Playwright layout checks.
- `pnpm test:chat:live` passed `3` live Django `/api/chat` canaries.
- `pnpm exec playwright install --dry-run` confirmed Chromium was already available, so no browser install was needed.
- `pnpm typecheck`, `pnpm backend:typecheck`, and `pnpm build` passed.
- The default `pnpm test:e2e` command was intentionally not run for Phase 5A by request; this phase used the targeted layout lane plus the live chat canary instead.

Playwright visual review artifacts:

| Viewport | Snapshot artifact | Screenshot artifact | Visual result | Notes |
|---|---|---|---|---|
| Desktop | `.playwright-cli/phase5a-desktop-final.yaml` | `.playwright-cli/phase5a-desktop-final.png` | Pass | Two completed turns remained visible, the open panel stayed inside the viewport, the closed-state launcher was absent while open, and the three-line draft stayed bounded in the composer without blank-space growth. |
| Narrow | `.playwright-cli/phase5a-narrow-final.yaml` | `.playwright-cli/phase5a-narrow-final.png` | Pass | The WPS mobile prompt set stayed section-aware, prior transcript content remained visible above the second turn, the panel remained reachable on a `430x932` viewport, and the multiline draft stayed visually capped inside the composer. |
| Corrective desktop | `.playwright-cli/phase5a-fix-after-rephrase.yaml` | `.playwright-cli/phase5a-fix-after-rephrase.png` | Pass | At `1365x768`, the fixed panel stayed within the viewport, the `UN limits` prompt chip submitted and rendered a grounded answer, and the boundary-refusal recovery button submitted a safe course-scoped answer. |

Visual success criteria:

- The open panel stays inside the visible viewport and the composer remains reachable.
- The closed-state launcher is not visible or interactive underneath the open panel.
- Prior learner and assistant turns remain readable after a later answer appears.
- The multi-line composer uses bounded height or internal scrolling without a large blank area.
- Focus, visible controls, and reduced-motion behavior remain understandable.

For the WPS retrieval-scope checks, the canonical expectation deliberately reused
the existing dossier evidence registry/source-bundle mapping through
`getDossierEvidenceSources()` and `createWpsEvidenceRegistry()` rather than a
separate hand-maintained list.

The widened approved chat scope now covers:

- `gg-src-wps-enforcement-gap-comparison`
- `gg-src-wps-political-reality-record`
- `gg-src-philippines-arbitration-filing`
- `gg-src-post-award-compliance-record`
- `gg-src-scarborough-standoff-record`
- `gg-src-south-china-sea-award`

### Prompt audit workflow

Run the audit in markdown mode:

```powershell
pnpm chatbot:audit-prompts -- --endpoint-mode live --endpoint http://127.0.0.1:8000/api/chat
```

Run the same audit in JSON mode for stable machine-readable review:

```powershell
pnpm chatbot:audit-prompts -- --json --endpoint-mode live --endpoint http://127.0.0.1:8000/api/chat
```

Stable output fields:

- `section`
- `depthMode`
- `prompt`
- `classification`
- `sourceIds`
- `followUpAction`
- `endpointMode`
- `notes`
- `isPrimaryChapter`

Strict release gate:

- `--fail-on-miss` now fails when any primary chapter row returns anything other
  than `classification=answered`.
- A primary prompt counts as `answered` only when the response state is
  `answered`, `grounding.supportLevel` is `strong`, and at least one returned
  citation source ID matches the prompt's expected source IDs.
- Supporting sections such as `governance-limits` and `conclusion-references`
  remain diagnostic and are not counted as Chapters 1-4.

### Prompt-readiness audit table

Recorded on 2026-06-07 against local Django `/api/chat` after the Phase 5A
prompt reconciliation. All visible prompts resolved to `followUpAction=keep`.

Strict prompt-coverage implementation note, 2026-06-07: the table below is
historical Phase 5A soft-audit evidence. It is superseded by the stricter
primary-chapter contract of exactly `20` primary rows, all of which must be
`classification=answered` under `--fail-on-miss`. Replace this table after the
strict live audit passes against a ready local Django/Redis/retrieval stack.

| Section | Depth mode | Prompt | Classification | Source IDs | Follow-up action | Endpoint mode | Notes |
|---|---|---|---|---|---|---|---|
| `hero-narrative-frame` | `student` | `How does the course frame distinguish global governance from world government?` | `limitedSupport` | `gg-src-global-governance-course-frame` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `hero-narrative-frame` | `student` | `How do institutions coordinate global governance without becoming a world government?` | `limitedSupport` | `gg-src-global-governance-course-frame` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `hero-narrative-frame` | `student` | `Which institutions help coordinate global governance across states?` | `limitedSupport` | `gg-src-global-governance-course-frame` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `global-governance-overview` | `student` | `How does the course frame distinguish global governance from world government?` | `limitedSupport` | `gg-src-global-governance-course-frame` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `global-governance-overview` | `student` | `Where does the UN help coordinate states, and where do its enforcement limits show up?` | `answered` | `gg-src-un-charter-institutions`, `gg-src-global-governance-course-frame` | `keep` | `live` | `Returned citations: gg-src-un-charter-institutions` |
| `global-governance-overview` | `student` | `How do institutions coordinate global governance without becoming a world government?` | `limitedSupport` | `gg-src-global-governance-course-frame` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `un-command-center` | `student` | `Where does the UN help coordinate states, and where do its enforcement limits show up?` | `answered` | `gg-src-un-charter-institutions`, `gg-src-global-governance-course-frame` | `keep` | `live` | `Returned citations: gg-src-un-charter-institutions` |
| `un-command-center` | `student` | `How does the Security Council show both coordination and enforcement limits?` | `limitedSupport` | `gg-src-un-charter-institutions` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `governance-limits` | `student` | `How does the course frame distinguish global governance from world government?` | `limitedSupport` | `gg-src-global-governance-course-frame` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `governance-limits` | `student` | `How does the Security Council show both coordination and enforcement limits?` | `limitedSupport` | `gg-src-un-charter-institutions` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `west-philippine-sea-dossier` | `student` | `Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement.` | `limitedSupport` | `gg-src-south-china-sea-award`, `gg-src-wps-enforcement-gap-comparison`, `gg-src-wps-political-reality-record` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `west-philippine-sea-dossier` | `student` | `How does the West Philippine Sea ruling test the limits of institutions and enforcement?` | `limitedSupport` | `gg-src-south-china-sea-award`, `gg-src-philippines-arbitration-filing`, `gg-src-wps-enforcement-gap-comparison` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `west-philippine-sea-dossier` | `student` | `What did the ruling clarify about maritime rights?` | `limitedSupport` | `gg-src-south-china-sea-award`, `gg-src-philippines-arbitration-filing` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `conclusion-references` | `student` | `How does the course frame distinguish global governance from world government?` | `limitedSupport` | `gg-src-global-governance-course-frame` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |
| `conclusion-references` | `student` | `Where does the UN help coordinate states, and where do its enforcement limits show up?` | `answered` | `gg-src-un-charter-institutions`, `gg-src-global-governance-course-frame` | `keep` | `live` | `Returned citations: gg-src-un-charter-institutions` |
| `conclusion-references` | `student` | `Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement.` | `limitedSupport` | `gg-src-south-china-sea-award`, `gg-src-wps-enforcement-gap-comparison`, `gg-src-wps-political-reality-record` | `keep` | `live` | `Try narrowing the question to the current lesson topic.` |

Classification values:

- `answered`
- `limitedSupport`
- `boundaryRefusal`
- `weakCitation`
- `cooldown`
- `transportFailure`
- `missingSource`

Follow-up action values:

- `keep`
- `reword`
- `remove`
- `widenApprovedScope`
- `addApprovedSource`

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
- The chat transcript preserves prior learner and assistant turns during a multi-question session.
- The open chat shell remains contained and does not show the closed-state launcher underneath it.

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
- SC-005: confirm every degraded continuity case preserves at least one relevant fallback action or suggested question without leaving the lesson page
- SC-006: count correct trust-state identifications from the 10 scripted learner-state examples
- SC-009: confirm the three-turn chat transcript keeps prior typed outcomes visible
- SC-010: confirm desktop and narrow viewport chatbox containment, hidden launcher, and stable multi-line composer behavior with automated layout assertions and Playwright visual evidence
- SC-011: confirm every suggested prompt is classified and every kept prompt is answerable or intentionally bounded

Acceptance-set inventory to record alongside the results:

- The 20 in-scope learner prompts used for SC-001
- The 12 degraded or off-topic prompts used for SC-002 and SC-005
- The 10 maintainer validation findings used for SC-004
- The 10 trust-cue examples used for SC-006
- The exact three-turn transcript scenario used for SC-009
- The desktop and narrow viewport pair used for SC-010
- The complete visible suggested-prompt inventory audited for SC-011

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
