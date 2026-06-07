# Tasks: Grounded Chatbot Readiness

**Input**: Design documents from `/specs/001-grounded-chatbot-readiness/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Every behavior-changing task follows red-green-refactor. Red tests must fail for the intended missing behavior before implementation; green verification and refactoring follow while the selected suite remains green. New or materially changed executable code must reach at least 80% for every metric reported by the selected coverage tool.

**Organization**: Tasks are grouped by independently testable user story. The public Django chat cutover and shared test/coverage infrastructure block the learner stories; maintainer readiness remains independently testable through protected APIs and UI.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it targets different files and does not depend on an incomplete task
- **[Story]**: Maps the task to User Story 1, 2, or 3
- Every task names the exact file or directory it changes or verifies

## Phase 1: Setup (Shared Test And Configuration Infrastructure)

**Purpose**: Establish coverage measurement and deterministic test infrastructure before behavior changes begin.

- [X] T001 Add `@vitest/coverage-v8`, a changed-scope `test:coverage` script, and coverage include/exclude rules in `package.json`, `pnpm-lock.yaml`, and `vite.config.ts`
- [X] T002 Add `pytest-cov`, backend changed-scope coverage settings, and a `backend:test:coverage` script in `backend/requirements.txt`, `backend/pyproject.toml`, `package.json`, and `pnpm-lock.yaml`
- [X] T003 [P] Create deterministic generation, embedding, rerank, topic-guard, safety-guard, Redis, clock, and approved-source doubles in `backend/tests/chatbot_fakes.py`
- [X] T004 [P] Create shared public-chat MSW fixtures and handlers for answered, weak-support, refused, cooldown, fallback, and transport-error envelopes in `tests/support/msw/chat-fixtures.ts` and `tests/support/msw/chat-handlers.ts`
- [X] T005 Run the new coverage commands, document the initial changed-scope baseline and intended include patterns in `specs/001-grounded-chatbot-readiness/quickstart.md`, and fix configuration-only failures in `package.json`, `vite.config.ts`, or `backend/pyproject.toml`

**Checkpoint**: Frontend and backend coverage can be measured before production implementation starts.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare shared boundaries and migration controls required by both learner stories.

**CRITICAL**: User Story 1 and User Story 2 must not begin implementation until this phase is complete.

- [X] T006 Run GitNexus upstream impact analysis for `buildIngestionPayload`, `persistIngestionPayload`, `dispatch_ingest`, `public_chat`, `requestGroundedAnswer`, `parseGroundedChatEnvelope`, `SourceAwareChat`, `SupabaseStewardshipRepository`, and `ValidationRunDetailDto`, and record risk plus direct callers in `specs/001-grounded-chatbot-readiness/quickstart.md`
- [X] T007 [P] Add reusable approved-source, citation, section-context, and anonymous-session fixtures in `backend/tests/fixtures/chatbot_sources.py`
- [X] T008 [P] Add frontend render helpers for section context, depth mode, keyboard access, and reduced motion in `tests/support/render-source-aware-chat.tsx`
- [X] T009 Define the server-only NVIDIA role settings, Redis/cache policy settings, request limits, policy versions, and source-index version variables in `backend/config/settings/base.py`, `backend/.env.example`, and `.env.example`
- [X] T010 Verify private Supabase storage and Postgres remain the durable retrieval owners, and document the Django-to-Supabase repository boundary in `backend/retrieval/README.md`
- [X] T011 Add a migration guard test proving `/api/chat` resolves to Django and no public Supabase chat function is configured in `backend/tests/test_public_chat_cutover.py` and `supabase/config.toml`, then run it and confirm the intended red result
- [X] T012 Retire the Supabase public-chat registrations and chat-only helpers from `supabase/config.toml`, `supabase/functions/chat/index.ts`, `supabase/functions/chat-retrieve/index.ts`, `supabase/functions/_shared/chat-grounding.ts`, `supabase/functions/_shared/chat-protection.ts`, and `supabase/functions/_shared/approved-source-bundle.ts` while preserving non-chat ingestion functions
- [X] T013 Update the boundary validator to enforce Django public-chat ownership and reject browser or Supabase secret/model routing in `scripts/chatbot/validate-chatbot-boundaries.ts`
- [X] T014 Run `pnpm chatbot:validate-boundaries`, `pnpm test:functions`, and the cutover test from `backend/tests/test_public_chat_cutover.py`; refactor migration checks while green

**Checkpoint**: Coverage, fixtures, settings, and public-chat runtime ownership are ready for story implementation.

---

## Phase 3: Approved Source Ingestion Foundation (Blocking Prerequisite)

**Purpose**: Turn the staged approved-source corpus and protected uploads into genuinely embedded, retrieval-ready Supabase records before strong grounded answers are enabled.

**CRITICAL**: User Story 1 may build typed degraded states in parallel, but it must not claim or live-test a strong grounded `answered` outcome until this phase has persisted and activated at least one approved source.

### Red Tests For Approved Source Ingestion

- [X] T015 [P] Add failing manifest tests for all staged files, stable canonical `sourceId` mappings, duplicate revisions, missing files, unsupported types, and raw/normalized lineage in `backend/tests/test_approved_source_manifest.py`
- [X] T016 [P] Add failing pipeline tests for extraction, normalization, bounded chunking, checksums, real embedding adapter use, no synthetic production vectors, and malformed content in `backend/tests/test_ingestion_pipeline.py`
- [X] T017 [P] Add failing persistence tests for atomic document/chunk/reference/vector writes, idempotent re-ingestion, rollback on partial failure, and private metadata in `backend/tests/test_ingestion_repository.py`
- [X] T018 [P] Add failing maintainer ingest tests for queued/succeeded/failed jobs, real processing dispatch, retry safety, and activation blocking after failure in `backend/tests/test_admin_stewardship.py`
- [X] T019 Run the focused ingestion tests from `backend/tests/test_approved_source_manifest.py`, `backend/tests/test_ingestion_pipeline.py`, `backend/tests/test_ingestion_repository.py`, and `backend/tests/test_admin_stewardship.py`; record the intended red failures in `specs/001-grounded-chatbot-readiness/quickstart.md`

### Implementation For Approved Source Ingestion

- [X] T094 Add a failing schema compatibility test proving the durable ingest-job store supports `queued -> processing -> succeeded/failed` plus recorded embedding evidence fields in `backend/tests/test_admin_stewardship.py` and `supabase/migrations/`
- [X] T020 [P] Create a canonical staged-source manifest and align the existing TypeScript preparation utility to it in `archive/docs/approved-sources/manifest.json`, `scripts/chatbot/approved-source-set.ts`, and `scripts/chatbot/prepare-ingestion.ts`
- [X] T021 [P] Define validated ingestion request, manifest, document, chunk, reference, embedding, and job-result contracts in `backend/ingestion/dtos.py`
- [X] T022 Implement approved-path enforcement, Markdown/PDF extraction, normalization, bounded chunking, stable checksums, and citation construction in `backend/ingestion/pipeline.py`
- [X] T023 [P] Implement the server-only NVIDIA embedding adapter with batching, dimensions validation, bounded timeouts, and typed provider failures in `backend/chatbot/nvidia.py`
- [X] T024 [P] Implement service-role private storage upload/read support plus persistence through `persist_ingestion_document`, idempotency, and atomic failure handling in `backend/ingestion/repository.py`
- [X] T095 Implement the ingest-job schema migration for `processing` status plus recorded embedding evidence fields, and update durable stewardship DTO mappings in `supabase/migrations/`, `backend/sources/dtos.py`, and `backend/sources/repositories/`
- [X] T025 Connect manifest or protected-upload ingestion orchestration, job status transitions, retries, and activation readiness to the real pipeline in `backend/ingestion/services.py`, `backend/sources/repositories/supabase.py`, and `backend/sources/repositories/memory.py`
- [X] T096 Add compatibility tests and enforcement so retained Supabase ingestion functions cannot activate production sources with synthetic vectors, and either delegate to Django ingestion or stay dry-run only in `supabase/functions/tests/ingestion.test.ts`, `supabase/functions/ingest-content/index.ts`, and `supabase/functions/ingest-pdf/index.ts`
- [X] T026 Add `pnpm backend:ingest:approved` and a Django management command that supports dry-run and selected-source execution in `package.json` and `backend/ingestion/management/commands/ingest_approved_sources.py`
- [X] T027 Run ingestion tests to green, execute a dry run over all files in `archive/docs/approved-sources/manifest.json`, persist at least one source and its private storage object against local Supabase, verify nonzero real vectors plus document/chunk/reference links, activate it, and record evidence and the 80% changed-scope coverage result in `specs/001-grounded-chatbot-readiness/quickstart.md`

**Checkpoint**: At least one approved source is genuinely retrieval-ready and active; strong grounded-answer testing may begin.

---

## Phase 4: User Story 1 - Ask Within Scope With Trust Cues (Priority: P1) MVP

**Goal**: A learner receives a depth-aware grounded, limited-support, or refused response with visible trust cues and safe source details through Django.

**Independent Test**: Submit in-scope, low-support, off-topic, unsafe, malformed, and oversized prompts to `/api/chat`, then verify the public chat renders the matching typed state, depth cue, and safe citation details without maintainer access.

### Red Tests For User Story 1

- [X] T028 [P] [US1] Add failing Django request and envelope tests for student/expert depth, section context, malformed JSON, missing/oversized questions, response limits, and safe errors in `backend/tests/test_public_chat_contract.py`
- [X] T029 [P] [US1] Add failing orchestration tests for generation, embedding, reranking, topic guard, safety guard, strong support, weak support, refusal, unsafe prompts, provider failures, and citation packaging in `backend/tests/test_chatbot_orchestration.py`
- [X] T030 [P] [US1] Add failing retrieval tests for approved-source filtering, section scoping, support thresholds, stable source IDs, safe public URLs, and empty retrieval in `backend/tests/test_retrieval_service.py`
- [X] T031 [P] [US1] Extend failing parser and request tests for `depthMode`, `fallback`, strict successful variants, safe citations, and 429 typed-success handling in `src/lib/chat/grounded-answer.test.ts` and `src/lib/chat/api-client.test.ts`
- [X] T032 [P] [US1] Add failing component tests for depth selection, grounded/limited/refused trust labels, expandable citation rows, keyboard behavior, visible focus, and reduced motion in `src/components/chat/SourceAwareChat.test.tsx`
- [X] T033 [US1] Run the focused US1 tests from `backend/tests/test_public_chat_contract.py`, `backend/tests/test_chatbot_orchestration.py`, `backend/tests/test_retrieval_service.py`, `src/lib/chat/grounded-answer.test.ts`, `src/lib/chat/api-client.test.ts`, and `src/components/chat/SourceAwareChat.test.tsx`; record the intended red failures in `specs/001-grounded-chatbot-readiness/quickstart.md`

### Implementation For User Story 1

- [X] T034 [P] [US1] Extend learner request, depth, fallback, grounding, citation, and typed-success unions in `src/types/chat.ts`
- [X] T035 [P] [US1] Define validated Django request, outcome, grounding, citation, and provider-role DTOs in `backend/chatbot/dtos.py`
- [X] T036 [P] [US1] Implement strict request normalization and response-envelope construction for all public chat variants in `backend/chatbot/contracts.py`
- [X] T037 [P] [US1] Extend the server-only NVIDIA adapter from the ingestion embedding role to generation, query embedding, rerank, topic guard, and safety guard with bounded timeouts and typed provider errors in `backend/chatbot/nvidia.py`
- [X] T038 [P] [US1] Define approved-source retrieval protocols and Supabase/Postgres repository mapping for chunks, citations, source activation, and source-index versioning in `backend/retrieval/repositories.py`
- [X] T039 [US1] Implement candidate retrieval, section-aware filtering, embedding, reranking, support classification, and citation selection in `backend/retrieval/services.py`
- [X] T040 [US1] Implement topic guard, safety guard, retrieval, depth-aware generation, weak-support, refusal, provider-fallback, and response-size orchestration in `backend/chatbot/services.py`
- [X] T041 [US1] Replace the migration-pending response with validated orchestration and typed envelopes in `backend/chatbot/views.py` and keep the public route at `/api/chat` in `backend/chatbot/urls.py`
- [X] T042 [P] [US1] Extend browser request creation and response parsing for depth mode, fallback, 429 typed success, and safe citation URLs in `src/lib/chat/grounded-answer.ts`
- [X] T043 [US1] Send section context, depth mode, and the anonymous session header to Django while preserving typed success for HTTP 429 in `src/lib/chat/api-client.ts`
- [X] T044 [US1] Add student/expert controls, visible trust-state treatments, citation support details, refusal guidance, accessible status announcements, focus behavior, and reduced-motion handling in `src/components/chat/SourceAwareChat.tsx`
- [X] T045 [US1] Run all focused US1 tests to green, refactor the changed modules while green, and resolve ownership or naming drift in `backend/chatbot/`, `backend/retrieval/`, `src/lib/chat/`, `src/types/chat.ts`, and `src/components/chat/`
- [X] T046 [US1] Run `pnpm test:coverage` and `pnpm backend:test:coverage`, add missing edge and error coverage in `src/**/*.test.ts`, `src/**/*.test.tsx`, and `backend/tests/test_*chat*.py`, and reach at least 80% for every reported metric on US1 changed files
- [X] T047 [US1] Update the mocked learner smoke test for depth, grounded trust cues, weak support, refusal, and citation expansion in `tests/e2e/source-aware-chatbox.smoke.spec.ts`
- [X] T048 [US1] Update the minimal real Django `/api/chat` canary for one supported answer and one bounded refusal without mocking the endpoint in `tests/e2e/chat-live.spec.ts`

**Checkpoint**: User Story 1 is independently usable and is the suggested MVP release scope.

---

## Phase 5: User Story 2 - Stay In The Lesson During Degraded Chat States (Priority: P2)

**Goal**: A learner keeps using the lesson during unavailable, weak-support, throttled, abusive, cooldown, or provider-degraded chat states.

**Independent Test**: Simulate missing section context, Redis loss, provider failure, rate limits, abuse escalation, cooldown expiry, and fallback responses while verifying suggested prompts and lesson navigation remain usable.

### Red Tests For User Story 2

- [X] T049 [P] [US2] Add failing protection tests for anonymous identities, rate windows, abuse escalation, cooldown creation/expiry, clock boundaries, Redis failures, and deterministic test-only protection doubles in `backend/tests/test_chatbot_protection.py`
- [X] T050 [P] [US2] Add failing cache-policy tests for TTLs, schema/policy/model/source versions, HMAC prompt keys, no raw prompt/source text, and disabled final-answer caching in `backend/tests/test_chatbot_cache.py`
- [X] T051 [P] [US2] Add failing service and view tests for cooldown HTTP 429 typed success, provider fallback, Redis runtime-failure handling, stale/missing section context, and fallback suggestions in `backend/tests/test_chatbot_orchestration.py` and `backend/tests/test_public_chat_contract.py`
- [X] T052 [P] [US2] Add failing parser and client tests for fallback suggestions, retry timing, transport failure conversion, and session-local continuity in `src/lib/chat/grounded-answer.test.ts` and `src/lib/chat/api-client.test.ts`
- [X] T053 [P] [US2] Add failing component tests for section-aware starter prompts, fallback guidance, retry, cooldown countdown text, keyboard access, focus restoration, reduced motion, and uninterrupted lesson controls in `src/components/chat/SourceAwareChat.test.tsx`
- [X] T054 [US2] Run the focused US2 tests from `backend/tests/test_chatbot_protection.py`, `backend/tests/test_chatbot_cache.py`, `backend/tests/test_chatbot_orchestration.py`, `backend/tests/test_public_chat_contract.py`, and `src/components/chat/SourceAwareChat.test.tsx`; record the intended red failures in `specs/001-grounded-chatbot-readiness/quickstart.md`

### Implementation For User Story 2

- [X] T055 [P] [US2] Implement the protection-store protocol, required Redis store, test-only in-memory double, hashed anonymous identity, rate limits, abuse counters, cooldown state, and expiry handling in `backend/chatbot/protection.py`
- [X] T056 [P] [US2] Implement versioned HMAC cache keys, explicit TTLs, guard/query-helper cache records, source-index invalidation, and final-answer-cache exclusion in `backend/chatbot/cache.py`
- [X] T057 [US2] Integrate protection and narrow operational caches before expensive model work, returning typed cooldown or fallback outcomes without exposing internals in `backend/chatbot/services.py` and `backend/chatbot/views.py`
- [X] T058 [P] [US2] Add section-aware approved starter prompts and fallback prompt selection in `src/data/chat/source-aware-chat.ts`
- [X] T059 [US2] Render contextual starter prompts, weak-support next steps, fallback source guidance, calm cooldown/retry states, and session-preserving recovery in `src/components/chat/SourceAwareChat.tsx`
- [X] T060 [US2] Run all focused US2 tests to green, refactor protection/cache ownership while green, and keep Redis isolated from canonical retrieval data in `backend/chatbot/protection.py`, `backend/chatbot/cache.py`, `backend/chatbot/services.py`, and `src/components/chat/SourceAwareChat.tsx`
- [X] T061 [US2] Run `pnpm test:coverage` and `pnpm backend:test:coverage`, add missing boundary coverage in `src/**/*.test.ts`, `src/**/*.test.tsx`, and `backend/tests/test_chatbot_*.py`, and reach at least 80% for every reported metric on US2 changed files
- [X] T062 [US2] Add a mocked degraded-state browser journey covering provider fallback, cooldown, retry guidance, suggested prompts, and preserved lesson navigation in `tests/e2e/chat-boundary-validation.spec.ts`
- [X] T063 [US2] Extend the live Django canary with required Redis protection and one cooldown response while keeping provider calls deterministic in `tests/e2e/chat-live.spec.ts`

**Checkpoint**: User Stories 1 and 2 both work independently, and the lesson remains useful when chat degrades.

---

## Phase 5A: Public Chatbox QA Remediation (Post-Phase-5 Amendment)

**Goal**: Close the learner-facing chatbox issues found during local browser QA before continuing release validation: viewport containment, duplicate launcher visibility, multi-line composer spacing, visible transcript history, and source-aligned suggested prompts.

**Independent Test**: Open the source-aware chat in desktop and narrow viewports, submit multiple learner questions, type a multi-line prompt, click suggested prompts for each section, and verify the panel remains contained, the launcher is hidden while open, prior turns remain reviewable, and kept suggestions are answerable or intentionally bounded by approved sources.

### Red Tests For Public Chatbox QA Remediation

- [X] T100 [P] [US2] Add failing component tests for open-panel containment classes, hidden launcher while open, multi-line composer height behavior, and preserved focus in `src/components/chat/SourceAwareChat.test.tsx`
- [X] T101 [P] [US1] Add failing component tests for append-only transcript preservation across answered, weak-support, refused, cooldown, fallback, and transport-error turns in `src/components/chat/SourceAwareChat.test.tsx`
- [X] T102 [P] [US1] Add failing backend retrieval and orchestration tests proving `west-philippine-sea-dossier` chat scope includes the approved dossier evidence sources already used by the chapter, anchoring the expected source set to the existing dossier evidence/source-bundle mapping instead of a second hand-maintained list, in `backend/tests/test_retrieval_service.py` and `backend/tests/test_chatbot_orchestration.py`
- [X] T103 [P] [US2] Add failing starter-prompt readiness tests that export every prompt from `src/data/chat/source-aware-chat.ts` and flag prompts without an approved-source readiness classification in `src/data/chat/source-aware-chat.test.ts`
- [X] T104 [US2] Run the focused Phase 5A red tests from `src/components/chat/SourceAwareChat.test.tsx`, `src/data/chat/source-aware-chat.test.ts`, `backend/tests/test_retrieval_service.py`, and `backend/tests/test_chatbot_orchestration.py`; record the intended failures in `specs/001-grounded-chatbot-readiness/quickstart.md`

### Implementation For Public Chatbox QA Remediation

- [X] T105 [US2] Refactor the `SourceAwareChat` shell, launcher, scroll area, and composer layout so the open panel stays viewport-contained, the launcher is not rendered while open, and multi-line input scrolls or caps without blank space in `src/components/chat/SourceAwareChat.tsx`
- [X] T106 [US1] Replace the single `submittedQuestion` and `answerState` rendering model with append-only session-local transcript entries in `src/components/chat/SourceAwareChat.tsx` and `src/types/chat.ts`
- [X] T107 [US1] Preserve the MVP single-turn backend request contract while documenting browser-local transcript behavior and proving multi-turn UI sessions still send only the latest learner question to Django in `src/lib/chat/api-client.ts` tests and `specs/001-grounded-chatbot-readiness/contracts/public-chat.md`
- [X] T108 [US1] Expand section source scoping for `west-philippine-sea-dossier` to include approved dossier evidence already represented by the lesson, updating `backend/chatbot/services.py`, backend fixtures, and citation/source adapters only where needed
- [X] T109 [US2] Add a repeatable suggested-prompt readiness audit workflow for the frontend prompt catalog in `scripts/chatbot/audit-suggested-prompts.ts` and document its usage plus stable output schema fields `section`, `depthMode`, `prompt`, `classification`, `sourceIds`, `followUpAction`, `endpointMode`, and `notes` in `specs/001-grounded-chatbot-readiness/quickstart.md`
- [X] T110 [US2] Reconcile suggested prompts after the audit by keeping, rewording, removing, or backing prompts with approved course-relevant sources in `src/data/chat/source-aware-chat.ts` and related approved-source mapping files
- [X] T111 [US2] Add browser layout coverage for desktop and narrow viewport open-panel containment, hidden launcher, and bounded multi-line composer behavior in `tests/e2e/source-aware-chatbox.smoke.spec.ts` or a dedicated `tests/e2e/source-aware-chatbox.layout.spec.ts`
- [X] T112 [US2] Run focused Phase 5A frontend/backend tests, changed-scope coverage for touched chat files, the mocked layout lane, and a Playwright visual review using snapshots or screenshots of the open panel at desktop and narrow viewports; record the test results plus visual evidence notes in `specs/001-grounded-chatbot-readiness/quickstart.md`
- [X] T113 [US1] Run the live suggested-prompt audit against local Django `/api/chat`, classify every prompt outcome with the documented schema fields, reconcile any misses, and record the prompt-readiness table in `specs/001-grounded-chatbot-readiness/quickstart.md`

**Checkpoint**: Learner-facing chatbox QA issues are closed or explicitly deferred with documented scope, and suggested prompts are aligned with approved source support before maintainer readiness resumes.

---

## Phase 6: User Story 3 - Judge Readiness And Trust As A Maintainer (Priority: P3)

**Goal**: A protected maintainer can identify readiness, blockers, validation findings, source issues, audit evidence, and the next action within one workflow.

**Independent Test**: Load healthy, warning, failed, empty, unauthorized, retryable, and partial-data fixtures, then verify readiness is understandable and each issue navigates to its affected source or validation record.

### Red Tests For User Story 3

Before adding new red tests in this phase, audit the existing maintainer readiness test inventory in `backend/tests/test_admin_stewardship.py`, `backend/tests/test_admin_validation.py`, `src/lib/maintainer/api.test.ts`, `src/components/modules/MaintainerDashboard/**/*.test.tsx`, and `tests/e2e/maintainer-readiness.smoke.spec.ts`. Add only the missing contract or acceptance cases needed for this feature instead of duplicating already-covered behavior.

- [ ] T064 [P] [US3] Add failing protected API tests only for missing readiness summary, source health labels, blockers, next actions, partial data, auth failures, audit filters, and source/validation links in `backend/tests/test_admin_stewardship.py`
- [ ] T065 [P] [US3] Add failing validation tests only for missing itemized reasons, affected source or grounding area, remediation actions, audit evidence, empty results, and retryable failures in `backend/tests/test_admin_validation.py`
- [ ] T066 [P] [US3] Add failing frontend API contract tests only for missing readiness, partial markers, validation detail, audit filters, auth expiry, and retryable errors in `src/lib/maintainer/api.test.ts`
- [ ] T067 [P] [US3] Add failing overview and trust-state tests only for missing healthy, warning, failed, empty, loading, partial, retry, and action navigation cases in `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx`
- [ ] T068 [P] [US3] Add failing source, validation remediation, and audit filtering tests only for missing acceptance cases in `src/components/modules/MaintainerDashboard/sources/SourcesPage.test.tsx`, `src/components/modules/MaintainerDashboard/validation/ValidationRemediationQueue.test.tsx`, and `src/components/modules/MaintainerDashboard/audit-trail/AuditTrailPage.test.tsx`
- [ ] T069 [US3] Run the focused US3 tests from `backend/tests/test_admin_stewardship.py`, `backend/tests/test_admin_validation.py`, `src/lib/maintainer/api.test.ts`, and `src/components/modules/MaintainerDashboard/**/*.test.tsx`; record the intended red failures in `specs/001-grounded-chatbot-readiness/quickstart.md`

### Implementation For User Story 3

- [ ] T070 [P] [US3] Extend readiness, source-health, blocker, next-action, chatbot-trust, partial-data, and audit DTOs in `backend/sources/dtos.py`
- [ ] T071 [P] [US3] Extend validation finding, affected-area, remediation, and audit DTOs in `backend/validation/dtos.py`
- [ ] T072 [US3] Compute readiness, source labels, blockers, next actions, trust evidence, and partial-data markers for memory and Supabase repositories in `backend/sources/repositories/mappers.py`, `backend/sources/repositories/memory.py`, and `backend/sources/repositories/supabase.py`
- [ ] T073 [US3] Preserve itemized validation reasons, affected source/grounding links, remediation actions, and audit evidence in `backend/validation/repository.py` and `backend/validation/services.py`
- [ ] T074 [US3] Return the tightened protected readiness and validation contracts with existing auth/error envelopes in `backend/sources/views.py` and `backend/validation/views.py`
- [ ] T075 [P] [US3] Extend frontend maintainer types and protected API parsing for readiness, partial data, validation findings, and audit filters in `src/lib/maintainer/api.ts`, `src/lib/maintainer/source-api.ts`, and `src/lib/maintainer/validation-api.ts`
- [ ] T076 [P] [US3] Present readiness state, blockers, recent checks, and recommended next actions in `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` and `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx`
- [ ] T077 [P] [US3] Present clear source health labels and one-flow source inspection navigation in `src/components/modules/MaintainerDashboard/sources/SourcesPage.tsx` and `src/components/modules/MaintainerDashboard/sources/SourceDetailPage.tsx`
- [ ] T078 [P] [US3] Present validation reasons, affected records, remediation actions, retry states, and navigation in `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` and `src/components/modules/MaintainerDashboard/validation/ValidationRemediationQueue.tsx`
- [ ] T079 [P] [US3] Implement time/event-type audit filtering and trust-relevant event presentation in `src/components/modules/MaintainerDashboard/audit-trail/AuditTrailPage.tsx` and `src/components/modules/MaintainerDashboard/trust/ChatbotTrustPage.tsx`
- [ ] T080 [US3] Integrate loading, empty, partial, retry, auth-expired, and refreshed-dashboard states in `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` and `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`
- [ ] T081 [US3] Run all focused US3 tests to green, refactor maintainer ownership while green, and avoid duplicating stewardship or validation domains across `backend/sources/`, `backend/validation/`, `src/lib/maintainer/`, and `src/components/modules/MaintainerDashboard/`
- [ ] T082 [US3] Run `pnpm test:coverage` and `pnpm backend:test:coverage`, add missing happy/error/partial coverage in maintainer frontend and backend tests, and reach at least 80% for every reported metric on US3 changed files
- [ ] T083 [US3] Update the protected maintainer smoke journey for readiness, blockers, validation-to-source navigation, audit filters, partial data, and auth failure in `tests/e2e/maintainer-readiness.smoke.spec.ts`

**Checkpoint**: All three user stories are independently functional and testable.

---

## Phase 7: Polish And Cross-Cutting Verification

**Purpose**: Close cross-story risks, verify the documented workflow, and refresh architecture evidence.

- [ ] T084 [P] Re-run the security boundary matrix for browser secrets, private storage paths, raw prompts, Redis internals, unrestricted retrieval controls, and public source URLs in `scripts/chatbot/validate-chatbot-boundaries.ts`
- [ ] T085 [P] Confirm Supabase retains only non-chat ingestion and storage-support coverage in `supabase/functions/tests/ingestion.test.ts` and `supabase/functions/vitest.config.ts`
- [ ] T086 Confirm no skipped or disabled tests satisfy acceptance or coverage gates by auditing `src/**/*.test.ts`, `src/**/*.test.tsx`, `backend/tests/test_*.py`, and `tests/e2e/*.spec.ts`
- [ ] T087 Run the documented quickstart scenarios and update commands or expected outcomes that differ from reality in `specs/001-grounded-chatbot-readiness/quickstart.md`
- [ ] T097 Create and record the feature acceptance sets for the 20 in-scope prompts, 12 degraded prompts, 10 validation findings, 10 trust-cue examples, one three-turn transcript scenario, one dual-viewport layout scenario, and the full visible starter-prompt inventory in `specs/001-grounded-chatbot-readiness/quickstart.md`
- [ ] T098 Run the scripted acceptance measurements for SC-001, SC-002, SC-004, SC-005, SC-006, SC-009, SC-010, and SC-011, record the counts or pass/fail evidence in `specs/001-grounded-chatbot-readiness/quickstart.md`, and reconcile any misses before release
- [ ] T099 Time the maintainer readiness workflow against the scripted fixture set for SC-003, record the measured completion time in `specs/001-grounded-chatbot-readiness/quickstart.md`, and tighten blockers or next-action cues if it exceeds 2 minutes
- [ ] T088 Run `pnpm format` and `pnpm backend:format`, then review formatting-only changes in `src/`, `backend/`, and `tests/`
- [ ] T089 Run `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit`, `pnpm test:functions`, `pnpm backend:lint`, `pnpm backend:typecheck`, `pnpm backend:security`, `pnpm backend:test`, and `pnpm backend:check`; resolve failures only in feature-touched files
- [ ] T090 Run `pnpm test:e2e`, `pnpm test:chat:live`, `pnpm test:coverage`, and `pnpm backend:test:coverage`, and record release evidence in `specs/001-grounded-chatbot-readiness/quickstart.md`
- [ ] T091 Refresh the changed frontend, backend, and Supabase graph slices plus the merged graph, then review bridge and god-node changes in `graphify-out/GRAPH_REPORT.md`, `graphify-out-backend/GRAPH_REPORT.md`, `graphify-out-supabase/GRAPH_REPORT.md`, and `graphify-out-merged/GRAPH_REPORT.md`
- [ ] T092 Run GitNexus change detection and document the affected execution flows and any unexpected risk in `specs/001-grounded-chatbot-readiness/quickstart.md`
- [ ] T093 Reconcile delivered behavior, exclusions, and verification evidence with `specs/001-grounded-chatbot-readiness/spec.md`, `specs/001-grounded-chatbot-readiness/plan.md`, and `specs/001-grounded-chatbot-readiness/contracts/`

---

## Dependencies And Execution Order

### Phase Dependencies

- **Phase 1 - Setup**: Starts immediately.
- **Phase 2 - Foundational**: Depends on Phase 1 and blocks ingestion and learner story implementation.
- **Phase 3 - Approved Source Ingestion**: Depends on Phase 2 and blocks strong grounded-answer implementation, acceptance testing, and release claims.
- **Phase 4 - US1**: Depends on Phase 3 and is the grounded-chat MVP.
- **Phase 5 - US2**: Depends on Phase 2 and the public chat contracts established in US1; it must preserve US1 behavior.
- **Phase 5A - Public Chatbox QA Remediation**: Depends on Phase 5 and should complete before Phase 6 on this branch because the findings are learner-facing public-chat acceptance blockers.
- **Phase 6 - US3**: Depends on Phase 3, Phase 5A for this branch, and the impact report in T006 because readiness and activation consume completed ingestion evidence and shared stewardship repositories.
- **Phase 7 - Polish**: Depends on every phase selected for the release.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on the Phase 3 ingestion checkpoint so strong support is proven against real retrieval-ready material.
- **User Story 2 (P2)**: Reuses the public chat contracts established by US1, but its protection and lesson-continuity behavior remains independently testable.
- **Phase 5A Amendment (US1/US2)**: Reuses US1/US2 chat contracts and closes QA gaps discovered after Phase 5; transcript reviewability belongs to the frontend MVP unless semantic follow-up support is deliberately added later.
- **User Story 3 (P3)**: No behavioral dependency on US1 or US2, but it depends on Phase 3 because it consumes protected ingestion readiness evidence and shared stewardship repository state.

### Within Each User Story

- Run GitNexus impact analysis before editing any named existing symbol.
- Complete and run red tests before production implementation.
- Implement boundary types and validation before orchestration and UI wiring.
- Implement the minimum behavior required for green.
- Refactor only while focused tests remain green.
- Reach the 80% changed-scope coverage gate before browser confidence tests count as release evidence.

## Parallel Opportunities

- T003 and T004 can run in parallel after T001-T002 are assigned.
- T007 and T008 can run in parallel; T009 and T010 can proceed in parallel with fixture work.
- Ingestion red tests T015-T018 can run in parallel by contract, pipeline, persistence, and maintainer ownership.
- Ingestion manifest T020, DTOs T021, embedding adapter T023, and persistence adapter T024 can proceed in parallel after the red failures are confirmed, while T094-T095 close the durable schema gap.
- US1 red tests T028-T032 can run in parallel by layer.
- US1 backend adapters T035, T037, and T038 can run in parallel after their contracts are agreed; frontend T034 can proceed independently.
- US2 red tests T049-T053 can run in parallel by layer.
- US2 protection T055, cache T056, and frontend prompt data T058 can run in parallel.
- Phase 5A red tests T100-T103 can run in parallel by frontend shell, transcript behavior, backend retrieval scope, and prompt catalog readiness.
- Phase 5A implementation T105-T109 can start after red confirmation, with T105-T107 kept sequential when they touch `SourceAwareChat.tsx` and shared chat types.
- US3 red tests T064-T068 can run in parallel by backend/frontend ownership.
- US3 DTO work T070-T071 and frontend presentation work T076-T079 can run in parallel once their corresponding contracts are stable.
- US3 frontend fixture and presentation tests can begin early, but repository-backed readiness integration should wait until Phase 3 closes the ingestion evidence and schema work.

## Parallel Example: User Story 1

```text
Task T028: Backend request/envelope contract tests
Task T029: Backend orchestration and five-role tests
Task T030: Retrieval policy tests
Task T031: Frontend parser/client tests
Task T032: Chat component tests

After contracts stabilize:
Task T035: Django DTOs
Task T037: NVIDIA adapters
Task T038: Retrieval repository
Task T034: Frontend chat types
```

## Parallel Example: User Story 2

```text
Task T049: Protection state tests
Task T050: Cache policy tests
Task T052: Frontend parser/client degraded-state tests
Task T053: Chat component continuity tests

After red confirmation:
Task T055: Redis protection store and test-only double
Task T056: Narrow operational cache
Task T058: Section-aware starter prompt data
```

## Parallel Example: Phase 5A

```text
Task T100: Chatbox shell and composer regression tests
Task T101: Transcript preservation tests
Task T102: WPS retrieval scope tests
Task T103: Starter-prompt readiness tests

After red confirmation:
Task T105: Shell, launcher, and composer implementation
Task T106: Transcript state implementation
Task T108: Section source-scope implementation
Task T109: Prompt audit workflow
```

## Parallel Example: User Story 3

```text
Task T064: Stewardship API tests
Task T065: Validation API tests
Task T066: Frontend maintainer API tests
Task T067: Dashboard state tests
Task T068: Source, validation, and audit UI tests

After contracts stabilize:
Task T070: Readiness DTOs
Task T071: Validation DTOs
Task T076: Overview presentation
Task T077: Source presentation
Task T078: Validation presentation
Task T079: Audit and trust presentation
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 and verify at least one real approved source is persisted and active.
3. Complete User Story 1 through T048.
4. Complete User Story 2 through T063.
5. Complete Phase 5A through T113 so public-chat layout, transcript, and prompt-source alignment issues are closed before maintainer readiness resumes.
6. Stop and validate the Django public chat path, visible trust states, citation safety, changed-scope coverage, mocked smoke journey, and live canary.
7. Demo or release the bounded grounded-chat MVP if learner-facing acceptance is sufficient.

### Incremental Delivery

1. Operationalize approved-source ingestion and activate the first retrieval-ready source.
2. Add US1 for trustworthy depth-aware answers.
3. Add US2 for protection controls and lesson continuity.
4. Add Phase 5A for the post-Phase-5 public chatbox QA remediation.
5. Add US3 for protected readiness and remediation after ingestion evidence and public chatbox QA are trustworthy.
6. Complete Phase 7 for full release evidence and architecture refresh.

### Suggested Team Split

1. Shared setup and cutover foundation: T001-T014.
2. Approved-source ingestion owner: T015-T027 plus T094-T096.
3. Learner contract and frontend owner: T031-T034, T042-T048, T052-T054, T058-T063, T100-T101, T103-T107, T109-T113.
4. Django chat and retrieval owner: T028-T030, T035-T041, T049-T051, T055-T057, T102, T108.
5. Maintainer readiness owner: T064-T083.

## Notes

- `[P]` means different files and no dependency on an unfinished task; tasks that touch the same file must remain sequential.
- T100-T113 are a post-Phase-5 amendment block added after Phase 6/7 task IDs already existed; do not renumber older tasks just to make the amendment appear sequential.
- Refusal, weak support, cooldown, and fallback are typed learner-visible successes, not generic transport failures.
- Redis is Django-owned short-lived operational state and never the canonical store for sources, chunks, embeddings, citations, validation evidence, or final answers.
- Browser code must not receive NVIDIA keys/model routing, private storage paths, raw cache keys, prompt hashes, or unrestricted retrieval controls.
- Existing user changes in the dirty worktree must be preserved and incorporated rather than reverted.
- Commit after a coherent green task group, not after red-only states that leave the branch intentionally failing.

