# Story 5.6C: Run Admin Validation Checks

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a maintainer,
I want to run validation sets and inspect validation history from the private admin surface,
so that I can verify grounded, weak-support, refusal, and citation behavior before demo.

## Acceptance Criteria

1. Given I select a validation set from the private admin surface, when I trigger a validation run, then the run executes through protected Django workflows, duplicate in-flight launches are rejected safely, and the system stores transactionally aligned summary and per-question outcomes for later review.
2. Given a validation run completes, when I inspect the results, then I can review `pass`, `weakSupport`, `refused`, `failed`, and `error` outcomes, and I can inspect question text, expected state, actual state, answer preview, retrieved source support, citation support, support score when available, latency, notes, and timestamps.
3. Given a validation run surfaces weak support, refusal mismatches, or failures, when I review the result history, then I can identify which questions need source, ingestion, or policy follow-up, the dashboard keeps the result history understandable over multiple immutable runs, and each run remains traceable to the validation-set version and source snapshot it executed against.
4. Given validation data is empty, stale, partially unavailable, temporarily failing, or refers to a missing set or run id, when I open the validation area, then the UI presents explicit empty, stale, partial-data, not-found, retryable, and outage states, and the maintainer can still distinguish readiness uncertainty from total system breakage.
5. Given the private validation surface is opened on desktop, tablet, or keyboard-only navigation, when I use the set picker, run controls, summary cards, tables, and detail overlays, then they remain readable, focusable, and responsive without motion dependence or horizontal scrolling.
6. Given a validation run is launched, when the backend starts work, then Django records the selected set, set version, summary counts, per-question rows, run timestamps, and audit events through a protected admin workflow, and the browser never talks directly to privileged validation storage.
7. Given the validation surface is opened on a fresh clone with only the seeded baseline, when the workbench loads, then a default demo-readiness set is available and auto-selected so the maintainer can run validation without creating seed data by hand.
8. Given a validation run is queued or processing, when I refresh or reopen the private surface, then the canonical `GET /api/admin/validation-runs` and `GET /api/admin/validation-runs/{runId}` contracts expose stable polling-safe status fields so the UI can resume without inventing local state.

## Tasks / Subtasks

- [x] Establish the validation set, run, and result contracts in Django
  - [x] Add a dedicated `backend/validation/` app boundary for validation sets, validation runs, and validation result DTOs.
  - [x] Mount the canonical validation endpoints from `backend/config/urls.py` so `GET /api/admin/validation-sets`, `POST /api/admin/validation-runs`, `GET /api/admin/validation-runs`, and `GET /api/admin/validation-runs/{runId}` are served from the dedicated `backend/validation/` boundary instead of remaining trapped behind the current `backend/sources/` alias.
  - [x] Keep the browser on typed JSON DTOs and safe envelopes only; do not let the frontend talk directly to privileged validation storage.
  - [x] Preserve the existing source-level validation history trail only as a legacy stewardship view; make the set/run/result workflow the canonical readiness contract and document whether `/api/admin/validation` remains as a read-only compatibility alias or is retired.
  - [x] Define the canonical validation run lifecycle explicitly as `queued`, `processing`, `completed`, and `failed`; define the question outcome vocabulary explicitly as `pass`, `weakSupport`, `refused`, `failed`, and `error`; and document how those contracts coexist with or replace the older `StewardshipEvent` `queued | warning | failed | succeeded` vocabulary.
  - [x] Add a field matrix for `GET /api/admin/validation-runs/{runId}` and its DTOs: run id, validation-set id, set name, set version, status, total/pass/weak-support/refused/failed/error counts, average latency, created by, created/start/completed timestamps, source snapshot identifiers, and per-question rows with stable ids, question text, expected state, actual state, outcome, answer preview, retrieved source ids, citation ids, support score when available, latency, notes, and created timestamp.
  - [x] Persist validation runs transactionally so summary counts and per-question rows cannot drift on partial failure, and reject duplicate launches with a safe `409` when a run for the same set is already `queued` or `processing`.
  - [x] Snapshot the executed validation-set version and question content into each run so historical results stay reproducible even if question text or expectations change later.
  - [x] Emit audit events for validation run launch, completion, and terminal failure so the readiness workflow stays traceable in the protected admin trail.

- [x] Add the validation workbench to the private maintainer surface
  - [x] Extend `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` with a dedicated validation section or subview for set selection, run triggering, and result review.
  - [x] Keep the workbench inside the existing private dashboard shell and add a pathname branch for `/maintainer/validation` using the existing router-free pattern in `src/App.tsx`; do not introduce React Router.
  - [x] Use accessible shadcn/ui primitives for the run form, summary surface, result table, and detail overlay.
  - [x] Show the validation set picker, current run status, aggregate counts, recent runs, and per-question outcomes without making the console feel like a general CMS.
  - [x] Make the workbench inherit the existing signed-out, expired-session, unauthorized, inactive, revoked-session, outage, and retry behavior from the private maintainer shell instead of inventing a second auth-state model.
  - [x] Keep stale, partial-data, not-found, retryable-outage, queued, processing, completed, and failed result states distinct in the UI with explicit copy explaining what each state means.
  - [x] Default the picker to the seeded `Demo Readiness v1` record when it is marked as the canonical default set and make rerun create a new immutable run record rather than mutating a prior run in place.

- [x] Add API helpers and state handling for validation runs
  - [x] Extend `src/lib/maintainer/api.ts` with helpers for listing validation sets, launching a run, listing validation runs, and opening run detail.
  - [x] Keep the existing safe-envelope parsing and session-clearing behavior for `401` and `403` responses.
  - [x] Model the validation result states explicitly as `pass`, `weakSupport`, `refused`, `failed`, and `error`, and define exactly how `failed` differs from `error`.
  - [x] Keep loading, empty, stale, partial, not-found, queued, processing, completed, failed, and retryable-outage states distinct in the UI state machine, including a safe fallback for unknown future status values so the workbench does not blank on forward-compatible enum changes.
  - [x] Poll or refresh queued and processing runs through the canonical run-list and run-detail endpoints instead of synthesizing progress state locally.

- [x] Persist the workflow and seed a default set
  - [x] Add Supabase migrations for `validation_sets`, `validation_questions`, `validation_runs`, and `validation_results`.
  - [x] Add RLS and service-role-only grants so browser clients cannot read or mutate validation tables directly.
  - [x] Seed a default `Demo Readiness v1` validation set with approved on-topic and off-topic questions so the private admin surface is runnable in a clean environment.
  - [x] Make the seed idempotent and deterministic from migrations or a protected backend seed path, mark `Demo Readiness v1` as the default set, and avoid duplicate baseline records on repeated local setup.
  - [x] Store run summary counts, per-question outcomes, expected and actual states, answer preview, retrieved source ids, citation ids, support score when available, latency, notes, timestamps, and the executed set/version snapshot.
  - [x] Store enough set and question metadata for admin use: validation-set name, description, `is_default`, created-by metadata, question tags or category, expected behavior, and stable question ids.

- [x] Add regression coverage
  - [x] Add backend tests for validation set listing, run launch, duplicate-launch conflict handling, queued-to-completed or failed lifecycle transitions, run detail, empty-set behavior, partial data, stale data, auth failures, and safe 4xx/5xx envelopes.
  - [x] Add backend tests that verify the seeded baseline set exists and that validation outcomes remain distinguishable across pass, weak support, refusal, failure, and error cases.
  - [x] Extend `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` for set selection, default-set auto-selection, run states, result history, detail overlays, keyboard focus, reduced motion, narrow-width containment, stale/partial/not-found states, and unknown-status fallbacks.
  - [x] Extend `tests/e2e/maintainer.spec.ts` for direct `/maintainer` and `/maintainer/validation` load, validation run flow, result inspection, refresh or polling behavior, and public-boundary checks.

## Dev Notes

### Current State

- The private maintainer shell already exists in `src/App.tsx` and branches only on `/maintainer`; no React Router is in use.
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` currently shows source stewardship, chunks, citations, and source-level validation history, but it does not yet provide a real validation-set runner or a per-question result browser.
- `src/lib/maintainer/api.ts` already has the read and mutation helpers for source stewardship, but it has no validation-set or validation-run helpers.
- `backend/sources/views.py` currently exposes `/api/admin/validation` as a read-only operational list, and `backend/sources/repository.py` only surfaces source-level validation events from `source_validation_runs`.
- `backend/validation/` already exists as an app boundary, but it is only a stub today.
- `supabase/migrations/0010_create_stewardship_history.sql` creates `source_validation_runs`, but there is no set/question/result model yet.
- `backend/config/settings/base.py` already registers `validation.apps.ValidationConfig`, so the app boundary is expected even though the feature has not been filled in yet.
- `backend/config/urls.py` still mounts only `accounts.urls` and `sources.urls`, so the dedicated validation boundary must be wired in explicitly before the canonical endpoints can exist.

### Story Focus

- Turn validation from a read-only history list into a real readiness workflow.
- Keep the public learner experience untouched and keep all validation orchestration behind Django.
- Keep source stewardship history and validation-run review distinct so the dashboard does not collapse into one ambiguous timeline.
- Make the seeded demo-readiness baseline runnable in a clean clone without manual data creation.
- Treat validation result states as first-class UX states, not as generic table rows.

### Scope Boundaries

- No learner auth and no public maintainer dashboard.
- No React Router unless a later route split is explicitly justified; keep the implementation aligned with the existing pathname-based private shell.
- No browser-side direct writes to validation tables, Supabase Storage, or retrieval data.
- No general CMS, analytics portal, or AI playground behavior.
- No changes to live chat orchestration in Story 5.7.
- No refactor of source mutation or chunk/citation inspection unless the validation workbench needs a shared component seam.

### Architecture Guardrails

- Prefer a dedicated `backend/validation/` app for the canonical validation-set, validation-run, and validation-result contracts.
- Keep `api/admin/` as the protected orchestration boundary and preserve the shared safe-envelope response pattern.
- Seed a default `Demo Readiness v1` set with a balanced mix of on-topic and off-topic prompts, including the project questions from the archived admin-side proposal.
- Keep run-status vocabulary explicit: `queued`, `processing`, `completed`, and `failed`.
- Keep result-state vocabulary explicit: `pass`, `weakSupport`, `refused`, `failed`, and `error`.
- Treat `failed` as an evaluated result that completed but did not satisfy the expected validation logic, and treat `error` as an execution or infrastructure failure where the expected evaluation could not complete cleanly.
- Store enough run metadata to explain readiness over time: set id, set version, run status, summary counts, average latency, created by, start/end timestamps, source snapshot identifiers, and question-level support detail.
- Define pass logic explicitly: a question passes only when actual state matches expected state, required citations exist for factual answers, cited source ids resolve to active retrieval support, the answer does not contradict approved definitions or case facts, and latency remains within the agreed demo threshold when measured.
- Keep validation history immutable per run: rerun creates a new run record, and historical question text and expectations are snapshotted with the run so later edits do not rewrite history.
- Keep the validation workbench operational rather than decorative; the maintainer should be able to answer whether the chatbot is ready for demo.
- If a compatibility alias remains for `/api/admin/validation`, keep it user-safe, explicitly label it as legacy source-level history, and avoid breaking the newer canonical validation-run contract.

### Testing Standards Summary

- Backend: validation set list, run launch, duplicate-launch conflicts, run detail, seeded baseline, empty-set handling, auth failures, stale or partial data, retryable outages, audit writes, and safe envelopes.
- Frontend unit: set selection, default-set behavior, run state, history state, detail overlays, copy or inspect affordances if present, keyboard focus, reduced motion, narrow-width containment, stale/partial/not-found states, and unknown-status fallbacks.
- E2E: direct `/maintainer` and `/maintainer/validation` load, run flow, result inspection, refresh or polling behavior, and public boundary still hidden.
- Keep assertions role-based, label-based, and state-based.
- Avoid screenshot-only validation for the workbench.

### Implementation Sequence

1. Define the validation DTOs, tables, and protected read/write endpoints.
2. Wire `backend/config/urls.py` and settle the legacy `/api/admin/validation` compatibility rule.
3. Seed the default demo-readiness validation set.
4. Add the maintainer workbench UI and result detail flow.
5. Wire the API helpers and state transitions.
6. Add backend, component, and Playwright regression coverage.

### Validation Contract

#### Canonical Endpoint Ownership

- `backend/validation/` owns `GET /api/admin/validation-sets`, `POST /api/admin/validation-runs`, `GET /api/admin/validation-runs`, and `GET /api/admin/validation-runs/{runId}`.
- `backend/sources/` may keep `/api/admin/validation` only as a legacy source-level history alias, and that route must not become the canonical validation-run source.
- `backend/config/urls.py` must mount the validation URL set explicitly so the dedicated app boundary is reachable.

#### Run Lifecycle

- `queued`: the protected request was accepted and a run record exists, but evaluation has not started.
- `processing`: Django has started evaluating questions and may still be writing per-question outcomes.
- `completed`: evaluation finished and the run summary is final.
- `failed`: the run reached a terminal error state and the UI should show a retryable or inspectable failure without pretending the results are complete.

#### Result Outcome Rules

- `pass`: expected and actual state match, required citations exist, cited source ids resolve to active retrieval evidence, no approved facts are contradicted, and latency is within threshold when measured.
- `weakSupport`: the answer stayed within safety and topic rules but retrieval or citation support was insufficient for a confident grounded pass.
- `refused`: the system correctly refused an off-topic or disallowed request when that refusal was expected.
- `failed`: the evaluation completed but the actual behavior did not meet the expected validation rule.
- `error`: the question evaluation could not complete reliably because of execution, dependency, or infrastructure failure.

#### Run Detail Field Contract

- Run summary must include: `runId`, `validationSetId`, `validationSetName`, `validationSetVersion`, `status`, `totalCount`, `passCount`, `weakSupportCount`, `refusedCount`, `failedCount`, `errorCount`, `averageLatencyMs` when available, `createdBy`, `createdAt`, `startedAt`, `completedAt`, and source snapshot identifiers used by the run.
- Per-question rows must include: stable row id, `validationQuestionId`, question text snapshot, expected state snapshot, actual state, outcome, answer preview, retrieved source ids, citation ids, support score when available, latency, notes, and `createdAt`.
- Unknown future status values must stay user-safe and render as an explicit unknown-state fallback rather than breaking the workbench.

#### State Definitions

- `empty`: no validation sets or no runs exist yet for the selected scope.
- `stale`: the visible run no longer reflects the latest active source or validation-set version and needs rerun context rather than outage copy.
- `partial`: the run exists but some expected detail fields are unavailable.
- `notFound`: the requested validation set or run id does not exist or is no longer available.
- `retryable-outage`: the protected backend contract was temporarily unavailable and the user can retry safely.

#### Persistence and Audit Rules

- Persist run summary rows and per-question rows transactionally so partial writes cannot leave orphaned question records or mismatched aggregate counts.
- Reject duplicate launches for the same set with a safe `409` when a prior run is still `queued` or `processing`.
- Snapshot the validation-set version and question content into the run record or its child rows so historical runs remain reproducible after later edits.
- Emit audit events at run launch, terminal completion, and terminal failure.

#### Seed Rules

- Seed `Demo Readiness v1` idempotently and deterministically.
- Mark `Demo Readiness v1` as the canonical default set so the picker can auto-select it.
- Include both approved on-topic prompts and off-topic refusal prompts from the archived admin-side proposal.

### Previous Story Intelligence

- Story 5.6a established the writable stewardship slice and the protected admin mutation patterns that the validation runner should reuse, not replace.
- Story 5.6b established the lazy-loaded private dashboard inspection patterns, the safe-envelope handling, and the narrow-screen detail overlays that the validation workbench should match.
- The current private dashboard already handles source selection, detail refresh, and session clearing on admin auth failure; the validation workbench should extend that state machine instead of starting a second one.
- The source-level `validationHistory` list is useful as stewardship context, but it is not enough to satisfy a real validation-set run and result-review workflow.

### Git Intelligence Summary

- `9a9a4d4 feat: inspect retrieval chunks and citations` shows the private maintainer dashboard continues to expand in reviewable slices.
- `12b9cf0 feat: showcase maintainer login motion` shows the private surface presentation keeps evolving, but it remains inside the maintainer boundary.
- `cae523f feat: ship admin stewardship and test hardening` shows the repo expects backend stewardship work to land with companion tests.
- `797d1f6 feat: add Supabase admin auth boundary` shows the repo favors explicit backend auth helpers before broader feature expansion.

### Latest Tech Notes

- React docs currently list 19.2 as the latest version, so keep the workbench in function components and hook-based state.
- Supabase Auth docs still use `signInWithPassword()` for password sign-in and `onAuthStateChange()` for session sync.
- shadcn/ui docs currently cover `Table`, `Tabs`, `Dialog`, `Drawer`, `AlertDialog`, and `Form`; use those primitives for the validation workbench rather than inventing a custom control stack.
- Django 5.2 file-upload docs still recommend `request.FILES` and chunked reads for uploaded files; this story is primarily JSON and DB driven, but the backend should keep the same server-side safety assumptions.

### Project Structure Notes

- `backend/validation/`: canonical validation-set, run, result, and orchestration app boundary.
- `backend/config/urls.py`: include the validation URLs if the canonical endpoints move out of `backend/sources/`.
- `backend/sources/views.py` and `backend/sources/urls.py`: keep or deprecate the legacy validation history alias only if it remains useful.
- `src/lib/maintainer/api.ts`: add validation-set and validation-run helpers plus typed response handling.
- `src/components/modules/MaintainerDashboard/`: add the validation workbench and any result detail subcomponents.
- `src/App.tsx`: add the explicit `/maintainer/validation` pathname branch using the existing router-free pattern.
- `supabase/migrations/0013_create_validation_workflow.sql` or equivalent: add validation sets, questions, runs, results, RLS, grants, and seed data.
- `backend/tests/` and `tests/e2e/`: add the new validation coverage without weakening the existing maintainer boundary tests.

### Open Questions / Assumptions

- Assumption: the seeded baseline should be named `Demo Readiness v1` and should include both approved on-topic prompts and off-topic refusal prompts from the archived proposal.
- Assumption: the canonical validation workflow belongs in `backend/validation/`, even if the legacy `/api/admin/validation` read alias remains for stewardship history.
- Assumption: the validation runner should stay server-side through Django and should not execute from browser code or a direct Supabase client.
- Assumption: `/maintainer/validation` should exist in MVP and should be handled with the existing pathname branch pattern, not React Router.

### Review Findings

- [x] [Review][Patch] Reconciled the dedicated `backend/validation/` app boundary with the legacy `/api/admin/validation` source-history alias so the implementation has one canonical readiness contract.
- [x] [Review][Patch] Normalized the run-status and question-outcome vocabularies and documented how they differ from the older stewardship-event status values.
- [x] [Review][Patch] Added the missing `backend/config/urls.py` wiring requirement so the new canonical validation endpoints are actually reachable.
- [x] [Review][Patch] Defined the validation run lifecycle, polling-safe states, duplicate-launch conflict rule, and immutable rerun behavior instead of leaving execution flow vague.
- [x] [Review][Patch] Added an explicit run-detail field matrix covering counts, question snapshots, answer preview, source ids, citation ids, latency, notes, timestamps, and source/version traceability.
- [x] [Review][Patch] Added idempotent default-set seeding, default-picker behavior, and question snapshot requirements so fresh-clone setup and historical runs stay reproducible.
- [x] [Review][Patch] Added pass/fail logic, stale and not-found state rules, and audit-event requirements so the validation runner can distinguish readiness problems from transport failures cleanly.
- [x] [Review][Patch] Harden validation run persistence so mid-flight failures cannot strand queued runs [backend/validation/repository.py:341]
- [x] [Review][Patch] Keep the validation set picker and active run state synchronized across refresh and history actions [src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:603]
- [x] [Review][Patch] Surface explicit missing, stale, and retryable validation states instead of collapsing everything into outage [src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:151]
- [x] [Review][Patch] Show the required run and question timestamps in the validation detail view [src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:821]
- [x] [Review][Patch] Preserve zero-valued support scores when mapping validation results [backend/validation/repository.py:793]

## References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Story 5.6C and Epic 5 maintainer-validation requirements]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR38-FR41, NFR9, NFR16, NFR22, and NFR24]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, API & Communication Patterns, Data Architecture, Authentication & Security, and File Organization Patterns]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, maintainer-console guidance, route-family guidance, and responsive/accessibility patterns]
- [Source: `_bmad-output/project-context.md`, backend-only privileged logic, private maintainer boundary, and file organization rules]
- [Source: `archive/docs/planning-artifacts/global-governance-admin-side-proposal.md`, validation flow, validation tables, default result states, and demo-readiness summary]
- [Source: `backend/validation/apps.py`, existing validation app boundary]
- [Source: `backend/sources/views.py`, current read-only validation list alias]
- [Source: `backend/sources/urls.py`, current admin route layout]
- [Source: `backend/sources/repository.py`, current source-level validation history path]
- [Source: `src/App.tsx`, current pathname-based private maintainer branch]
- [Source: `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`, existing private dashboard shell and state machine]
- [Source: `src/lib/maintainer/api.ts`, current maintainer API helper contract]
- [Source: `backend/tests/test_admin_stewardship.py`, current validation-history read coverage]
- [Source: `tests/e2e/maintainer.spec.ts`, existing private boundary and inspection test patterns]
- [Source: https://react.dev/versions, React version guidance]
- [Source: https://supabase.com/docs/guides/auth/passwords, Supabase password auth guidance]
- [Source: https://supabase.com/docs/client/auth-onauthstatechange, Supabase auth session guidance]
- [Source: https://ui.shadcn.com/docs/components/table, shadcn/ui Table guidance]
- [Source: https://ui.shadcn.com/docs/components/tabs, shadcn/ui Tabs guidance]
- [Source: https://ui.shadcn.com/docs/components/dialog, shadcn/ui Dialog guidance]
- [Source: https://ui.shadcn.com/docs/components/base/drawer, shadcn/ui Drawer guidance]
- [Source: https://ui.shadcn.com/docs/components/base/alert-dialog, shadcn/ui AlertDialog guidance]
- [Source: https://ui.shadcn.com/docs/components/form, shadcn/ui Form guidance]
- [Source: https://docs.djangoproject.com/en/5.2/topics/http/file-uploads/, Django file-upload guidance]
- [Source: https://docs.djangoproject.com/en/5.2/ref/files/uploads/, Django uploaded-file handling guidance]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Resolved the repo-local `bmad-create-story` workflow customization and loaded the project context facts.
- Read sprint tracking, Epic 5, the PRD, architecture, UX spec, project context, Story 5.6, Story 5.6a, and Story 5.6b.
- Reviewed the current maintainer dashboard implementation, its source stewardship routes, the current validation-history alias, and the private dashboard state machine.
- Inspected the archived admin-side proposal for the validation-set flow, result vocabulary, seeded baseline questions, and run-detail fields.
- Sampled the current backend validation stub, migration history, and recent commit pattern so the story stays aligned with the repo's change style.
- Verified that the current repo has source-level validation history but does not yet have a canonical validation-set/run/result workflow.
- No code was changed while writing this story file; this is the implementation guide for Story 5.6C.
- Patched the story after adversarial and edge-case review to normalize validation enums, route ownership, run lifecycle, seed behavior, auditability, and immutable run-history rules.
- Implemented Story 5.6C with GitNexus pre-edit impact checks on `MaintainerDashboard`, `fetchStewardshipDashboard`, `validation_runs`, and `App`; all reported LOW risk.
- Added backend validation DTOs, repository, views, URLs, canonical admin route wiring, Supabase migration, frontend API helpers, private dashboard validation workbench, and regression tests.
- Ran GitNexus `detect_changes(scope=all)` after implementation; it reported CRITICAL for the full dirty worktree because unrelated pre-existing files are also modified, while the story changes mapped to the expected maintainer/admin API flows.
- Verification completed: `pnpm format`, `pnpm backend:format`, `pnpm lint`, `pnpm typecheck`, `pnpm backend:lint`, `pnpm backend:typecheck`, `pnpm backend:test`, `pnpm backend:check`, `pnpm backend:security`, `pnpm test:unit`, `pnpm test:e2e`, and `pnpm build`.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story 5.6C is ready for dev with a seeded validation baseline, protected run flow, per-question result review, and explicit demo-readiness states.
- The private maintainer surface should stay readable, keyboard accessible, and private, with the validation workbench kept separate from the learner journey.
- Review-driven story hardening is complete: the canonical validation contract, legacy alias handling, `/maintainer/validation` route requirement, and transactional run-history rules are now explicit.
- Added canonical protected validation contracts in `backend/validation/` with safe envelopes, duplicate in-flight `409` handling, immutable run detail DTOs, and audit events.
- Added the `/maintainer/validation` workbench inside the existing private dashboard shell with default set selection, run triggering, summary counts, immutable history, per-question outcome table, and accessible detail overlay.
- Added deterministic `Demo Readiness v1` persistence in `supabase/migrations/0013_create_validation_workflow.sql` with service-role-only grants and direct browser access denied.
- Added backend, component, and Playwright smoke coverage for the protected validation workflow.

### File List

- `backend/config/urls.py`
- `backend/tests/test_admin_validation.py`
- `backend/validation/dtos.py`
- `backend/validation/repository.py`
- `backend/validation/urls.py`
- `backend/validation/views.py`
- `src/App.tsx`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`
- `src/lib/maintainer/api.ts`
- `supabase/migrations/0013_create_validation_workflow.sql`
- `tests/e2e/maintainer.spec.ts`
- `_bmad-output/implementation-artifacts/5-6c-run-admin-validation-checks.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-05-05: Implemented protected admin validation-set/run/result workflow, private validation workbench, persistence migration, and regression coverage.

### Story Completion Status

done
