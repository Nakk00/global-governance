# Story 5.6a: Add Protected Source Mutation Workflows

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a maintainer,
I want protected source upload, editing, archiving, and ingest actions in the private dashboard,
so that I can keep approved materials current without leaving the authenticated stewardship flow.

## Acceptance Criteria

1. Given I am an authenticated authorized maintainer, when I open the private maintainer surface and start a protected mutation action, then the action remains behind the existing `/api/admin/me` gate, and the learner-facing experience exposes no public write path.
2. Given I upload a supported approved-source file with the required metadata, when the protected upload completes, then the source is stored through server-side Django operations, starts as draft and inactive, and does not become retrieval-eligible until review, successful ingestion, and explicit activation are complete.
3. Given I edit source metadata or archive a source from the private dashboard, when the change is submitted, then the protected admin API persists the change, prior stewardship history remains auditable, and the view remains source-stewardship scoped rather than becoming a general CMS.
4. Given I activate, disable, or archive a source, when the protected action completes, then retrieval eligibility changes only according to that lifecycle update, and an audit event records who changed what and when.
5. Given I need retrieval data to reflect a source change, when I trigger ingest or re-ingest for that source, then the job runs through the protected ingestion path, duplicate in-flight ingest requests are denied safely, and I can review job state and outcomes from the dashboard.
6. Given my session is invalid, expired, revoked, or unauthorized, when I attempt a protected source mutation, then the request is denied safely, the browser session is cleared when appropriate, and no learner-facing route or public UI gains access to the workflow.
7. Given an upload, metadata edit, lifecycle change, or ingest request fails validation, when the API responds, then the UI receives a user-safe error code, field-level recovery details when relevant, and raw server traces are never exposed.
8. Given the mutation surface renders on desktop or mobile, when I use keyboard-only navigation or reduced motion, then the forms, confirmations, and status feedback remain accessible, readable, and responsive without horizontal scrolling or motion dependence.
9. Given the read-only dashboard currently models source lifecycle as `active` and `deprecated`, when the mutation workflow is added, then the contract expands to an explicit writable lifecycle vocabulary of `draft`, `approved`, `active`, `disabled`, and `archived`, with allowed transitions documented so the maintainer can distinguish approval from retrieval eligibility.
10. Given a protected mutation succeeds, when the dashboard reloads its source inventory or detail view, then the persisted stewardship projection reflects the new lifecycle, metadata, ingest status, and audit state instead of continuing to rely only on the repo-seeded approved-source bundle.

## Tasks / Subtasks

- [x] Extend the private maintainer mutation UI and browser API helpers (AC: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
  - [x] Keep the existing read-only overview/detail states from Story 5.6 intact.
  - [x] Add mutation entrypoints for upload, metadata edit, lifecycle toggles, and ingest/re-ingest.
  - [x] Use shadcn/ui `Form`, `Dialog`, `Drawer`, `Table`, `Input`, `Button`, `Badge`, and destructive confirmation patterns.
  - [x] Expand local UI state unions for submitting/succeeded/failed/retryable states and explicit lifecycle badges.
  - [x] Refresh the dashboard projection after successful mutations so the maintainer sees the new persisted state instead of stale read-only data.
  - [x] Surface field-specific recovery messages from safe error envelopes, and treat invalid or non-JSON mutation responses as retryable user-safe failures.
  - [x] Use `Drawer` on narrow screens and focus-safe `Dialog` or `AlertDialog` patterns on wider screens so mutation forms and destructive confirmations preserve keyboard context, Escape handling, and focus return.
- [x] Add protected Django mutation routes and backend orchestration (AC: 1, 2, 3, 4, 5, 6, 7, 9, 10)
  - [x] Add admin source mutation handlers under `backend/sources/` and wire them into the existing `api/admin/` namespace.
  - [x] Reuse `authorize_admin_request`, the shared safe-envelope helpers, and request validation boundaries.
  - [x] Accept uploads server-side; prefer Django-mediated file handling and chunked reads for large files in the MVP.
  - [x] Define the upload contract explicitly: supported file types, non-empty file requirement, maximum size, required metadata, storage target, and safe 4xx failure codes for rejected files.
  - [x] Keep upload, metadata mutation, lifecycle changes, ingest dispatch, and audit writes transactionally aligned so partial writes do not leave orphaned files, half-written records, or misleading history.
  - [x] Keep mutation responses on one stable `{ success, data, error }` envelope with explicit idempotency or conflict behavior for duplicate submits and in-progress ingest jobs.
  - [x] Emit audit records for upload, edit, activate, disable, archive, ingest, and re-ingest actions.
- [x] Introduce or extend the stewardship write model and migrations (AC: 2, 3, 4, 5, 9, 10)
  - [x] Add the source lifecycle tables and relation records needed for draft/approved/active/disabled/archived state if they are still absent.
  - [x] Make `approved` explicit in the persistence model instead of treating it as an implied badge or overloading `active/deprecated`.
  - [x] Document the allowed lifecycle transitions, including which transitions are reversible and which actions must be denied with safe 4xx responses.
  - [x] Define whether metadata edits create a new `source_versions` row or update the current source record in place, and keep the audit trail aligned to that choice.
  - [x] Add the persisted stewardship read projection that the private dashboard will switch to once writable source state exists, including lifecycle, ingest-job, and audit visibility.
  - [x] Keep RLS and service-role-only protections for browser safety.
  - [x] Preserve the current approved-source bundle as bootstrap inventory only and do not mutate it from browser code.
- [x] Add regression coverage for auth, mutations, and boundary safety (AC: 1-10)
  - [x] Add backend tests for upload, metadata validation, lifecycle transitions, ingest trigger, audit writes, and safe 4xx/5xx envelopes.
  - [x] Add backend tests for empty-file upload, oversized upload, unsupported type, source-id or alias conflicts, invalid lifecycle transitions, duplicate in-flight ingest, and transaction-safe audit alignment.
  - [x] Extend dashboard component tests for mutation form states, confirmations, and error recovery.
  - [x] Extend dashboard component tests for 401/403 mutation recovery, focus return after confirmation dismissal, reduced-motion loaders, and narrow-screen Drawer behavior.
  - [x] Extend Playwright coverage for the happy path, denied path, direct `/maintainer` load, post-submit refresh, and public learner boundary.
  - [x] Keep any shared browser helpers under `tests/playwright/`.
- [x] Add review-driven guardrails to the story before coding (AC: 2, 3, 4, 5, 7, 8, 9, 10)
  - [x] Keep chunk/citation inspection and validation runner behavior out of scope for this story even though later retrieval eligibility may depend on those downstream workflows.
  - [x] Keep the mutation story scoped to upload, metadata, lifecycle, ingest dispatch, persisted dashboard refresh, and auditability; do not absorb Story 5.6b or 5.6c surfaces here.
  - [x] Keep the private route family and admin role expectations explicit so authorization, SPA routing, and maintainer-only access are not reinvented during implementation.
- [x] Verify story boundaries and implementation sequence before coding (AC: 1-10)
  - [x] Keep chunk/citation inspection and validation runner out of scope; they belong to Stories 5.6b and 5.6c.
  - [x] Preserve the read-only dashboard and auth gate from Story 5.6.
  - [x] Keep `/maintainer` private and leave public learner navigation unchanged.

### Review Findings

- [x] [Review][Patch] Removed validation-run ownership from the mutation acceptance contract and kept 5.6a scoped to upload, lifecycle, ingest dispatch, and persisted dashboard refresh, so Stories 5.6b and 5.6c remain the owners of chunk/citation inspection and validation-run evidence.
- [x] [Review][Patch] Added an explicit persisted stewardship projection requirement so successful writes must appear in the private dashboard instead of disappearing behind the seed-backed approved-source bundle.
- [x] [Review][Patch] Replaced the vague lifecycle expansion language with an explicit writable vocabulary and a task to document allowed transitions, reversibility, and denial behavior.
- [x] [Review][Patch] Defined the missing upload contract categories: supported types, non-empty file rule, maximum size, required metadata, storage target, and safe rejection codes.
- [x] [Review][Patch] Added transaction-alignment and idempotency requirements so upload, metadata, lifecycle, ingest, and audit writes cannot drift apart under retries or partial failure.
- [x] [Review][Patch] Required field-level recovery details and safe handling of malformed mutation responses so the UI can recover without leaking raw traces or crashing on empty HTML responses.
- [x] [Review][Patch] Added duplicate in-flight ingest denial and conflict behavior so re-ingest cannot silently enqueue overlapping jobs.
- [x] [Review][Patch] Added post-submit dashboard refresh and success-state expectations so the mutation UI cannot report success while leaving stale read-only data onscreen.
- [x] [Review][Patch] Added mobile Drawer, focus return, Escape handling, and reduced-motion guardrails so the writable surface inherits the accessibility discipline already established in Story 5.6.
- [x] [Review][Patch] Expanded regression coverage to include auth failures per mutation route, upload boundary cases, lifecycle conflicts, post-submit refresh, and mutation-happy-path browser validation.
- [x] [Review][Patch] Mutation state is still process-local and uploaded bytes are discarded [backend/sources/repository.py:174]
- [x] [Review][Patch] Migration 0012 collides with the existing audit table and leaves service writes ungranted [supabase/migrations/0012_create_source_mutation_workflow_tables.sql:56]
- [x] [Review][Patch] Blank Source ID falls back to a title slug [backend/sources/repository.py:229]
- [x] [Review][Patch] Uploaded filenames are written into storage paths verbatim [backend/sources/repository.py:272]
- [x] [Review][Patch] Queued ingest unlocks activation and readiness too early [backend/sources/repository.py:330]
- [x] [Review][Patch] Ingest jobs never reach a terminal state [backend/sources/repository.py:349]
- [x] [Review][Patch] Re-ingest is not distinguishable from first ingest in the audit trail [backend/sources/repository.py:349]
- [x] [Review][Patch] Mutation overlays are not focus-safe and destructive actions are unconfirmed [src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:977]
- [x] [Review][Patch] The inventory table still forces horizontal scrolling on narrow screens [src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:769]
- [x] [Review][Patch] Upload submit can fail silently when no file is selected [src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:640]
- [x] [Review][Patch] Malformed JSON objects can crash the maintainer response parser [src/lib/maintainer/api.ts:247]
- [x] [Review][Patch] The maintainer e2e spec does not cover the new mutation flow [tests/e2e/maintainer.spec.ts:1]

## Dev Notes

### Current State

- Story 5.6 already delivers the private `/maintainer` shell, the Supabase session transport, the authoritative `GET /api/admin/me` gate, and the read-only inventory/detail dashboard.
- `src/lib/maintainer/api.ts` only has read helpers today: `fetchAdminMe`, `fetchStewardshipDashboard`, and `fetchSourceDetail`.
- `backend/sources/views.py` and `backend/sources/urls.py` expose read-only dashboard, detail, ingestion, validation, and audit GET routes; there are no mutation endpoints yet.
- `backend/sources/repository.py` synthesizes stewardship output from approved-source seeds and empty history lists; it is not a mutable source of truth.
- `backend/sources/dtos.py` still models lifecycle as `active | deprecated` and will need an explicit writable lifecycle vocabulary or mapping for mutation states.
- `supabase/migrations/0010_create_stewardship_history.sql` and `0011_lock_down_stewardship_table_grants.sql` only cover validation and audit records; no tracked source lifecycle tables exist yet in migrations.
- `src/App.tsx` already branches `/maintainer` to `MaintainerDashboard`; keep the SPA split and do not introduce React Router for this story.
- The current dashboard read path is still seed-backed, so this story must define when persisted writable state replaces or augments that bootstrap projection.

### Story Focus

- Add the first writable maintainer slice: upload, edit metadata, archive/disable/activate, and ingest/re-ingest.
- Keep the Story 5.6 read-only dashboard intact and private.
- Keep Stories 5.6b and 5.6c out of scope.
- Make Django the only mutation and orchestration boundary; browser code should only submit forms and parse envelopes.
- Treat the approved-source bundle as bootstrap read inventory only until the persisted writable stewardship projection is connected, then switch the dashboard to the server-side projection.

### Scope Boundaries

- No validation runner UI.
- No learner auth.
- No public maintainer dashboard or public navigation link.
- No direct browser writes to Supabase Storage, retrieval tables, chunk tables, citation tables, validation records, or audit logs.
- No hard delete path for sources.
- No general CMS, analytics portal, or simulator controls.
- No chunk/citation inspection UI or validation-run evidence UI beyond the narrow lifecycle and ingest status needed to keep mutations understandable.

### Architecture Guardrails

- Keep browser-facing code in `src/` and privileged write logic in `backend/`.
- Extend the existing `api/admin/` namespace rather than inventing a new admin route family.
- Use `POST /api/admin/sources/upload`, `PATCH /api/admin/sources/{sourceId}`, `POST /api/admin/sources/{sourceId}/activate`, `POST /api/admin/sources/{sourceId}/disable`, `POST /api/admin/sources/{sourceId}/archive`, and `POST /api/admin/sources/{sourceId}/ingest` for the mutation flow.
- Keep the private route family under `/maintainer/*` when additional writable subviews are needed; do not surface those routes in learner navigation.
- Keep `GET /api/admin/me` authoritative. Supabase browser auth remains session transport only.
- Prefer Django-mediated multipart upload handling in the MVP. If a signed upload URL is chosen, document the file-size or storage constraint that justified it.
- Use `request.FILES` and chunked file handling server-side for uploads instead of reading untrusted files entirely in browser code.
- Define one stable mutation envelope and keep invalid, empty, or malformed backend responses on a user-safe fallback path in the browser.
- Keep audit writes transactionally aligned with persisted source mutations, and store enough linkage to recover who changed what, when, and against which source or version record.
- Write audit events for dangerous actions and do not fabricate pre-existing history.
- Expand DTOs and UI badges so draft, approved, active, disabled, and archived states are explicit instead of hidden inside the old read-only `active/deprecated` vocabulary.
- Do not mutate `src/data/source-bundles/approved-source-bundle.ts`; it remains bootstrap inventory only until the new write model and persisted read projection are connected.
- Keep all invalid payloads on the safe-envelope path with stable codes and user-safe messages.

### Testing Standards Summary

- Backend: auth failures, upload validation, metadata validation, lifecycle transitions, ingest trigger, audit writes, and safe 4xx/5xx envelopes.
- Frontend: mutation form states, disabled/loading/error states, destructive confirmation, malformed-response fallback, and recovery copy.
- E2E: maintainer happy path, denied path, direct `/maintainer` load, post-submit refresh, and public learner boundary checks.
- Keep shared browser helpers under `tests/playwright/` if the new mutation flows need them.
- Preserve keyboard-only operability, focus return after destructive confirmations, reduced motion behavior, and narrow-screen containment in any new dashboard surface.

### Previous Story Intelligence

- Story 5.6 established the private maintainer shell, `GET /api/admin/me`, and the read-only dashboard state machine for signed-out, expired, unauthorized, inactive, revoked, outage, empty, and ready states.
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` already centralizes auth gating and source selection. Extend it rather than rebuilding the dashboard.
- `backend/tests/test_admin_auth.py` already scopes public learner boundary checks away from the private maintainer folders; keep that exclusion strategy intact if new private helpers are added.
- `backend/tests/test_admin_stewardship.py` already asserts the read-only inventory and empty history contract. Add mutation coverage without breaking those expectations.
- The prior story used a no-backfill baseline for pre-existing history. This story should append real audit and action events for new mutations rather than inventing synthetic legacy lineage.
- Story 5.6 also left the dashboard projection seed-backed, so this story must explicitly rebaseline the read path once persisted writable state exists.

### Git Intelligence Summary

- `797d1f6 feat: add Supabase admin auth boundary` shows the repo favors explicit backend auth helpers and tests before broader feature expansion.
- `410988e feat: establish django backend foundation` shows backend work is expected to stay in Django and use the shared safe-envelope patterns.
- `29285e5 feat: validate chatbot boundaries` and `497a477 prepare ingestion pipeline and sync repo artifacts` show the repo favors bounded, reviewable slices with companion tests.
- `6298282 feat: manage approved source bundles` reinforces the source-discipline pattern this dashboard should extend instead of replacing.

### Latest Tech Notes

- React docs currently list React 19.2 as the latest version. Keep the private surface in function components and hook-based state; do not assume Next.js or server components.
- Supabase Auth docs still use `signInWithPassword()` for email/password login and `onAuthStateChange()` for client-side session sync. The JS client persists sessions by default.
- shadcn/ui docs currently cover `Form`, `Button`, `Dialog`, `Drawer`, `Table`, `Input`, and `AlertDialog`. Use `Drawer` for mobile-friendly mutation surfaces and `AlertDialog` for destructive confirmation flows.
- Django 5.2 file-upload docs store uploaded file data in `request.FILES` and recommend chunked handling for larger uploads. Treat source uploads as security-sensitive server-side work.

### Project Structure Notes

- Likely update: `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`
- Likely update: `src/lib/maintainer/api.ts`
- Likely update: `backend/sources/urls.py`
- Likely update: `backend/sources/views.py`
- Likely update or split: `backend/sources/repository.py`
- Likely update: `backend/sources/dtos.py`
- Likely add migrations under `supabase/migrations/`
- Likely add backend tests under `backend/tests/`
- Likely extend the maintainer Playwright spec under `tests/e2e/`
- Keep reusable browser helpers, if needed, under `tests/playwright/`
- Keep shadcn/ui primitives in `src/components/ui`; build any new mutation composites in the maintainer feature folder

### Open Questions / Assumptions

- Assumption: the MVP should default to Django-mediated multipart upload handling and only switch to signed upload URLs if a real file-size or storage constraint forces it.
- Assumption: the mutable source lifecycle should be represented explicitly in DTOs and UI badges rather than overloading the older `active/deprecated` read-only vocabulary.
- Assumption: `approved` is a real persisted lifecycle state in this story, not just a derived badge or review-only label.
- Assumption: if the source lifecycle write model is still absent in migrations, this story should introduce the narrow stewarded write tables plus the persisted dashboard read projection rather than mutating the approved-source bundle in place.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Story 5.6A acceptance criteria and Epic 5 boundary notes]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR35-FR41, MVP scope, and maintainer out-of-scope boundaries]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, API & Communication Patterns, Data Architecture, Authentication & Security, and File Organization Patterns]
- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-05-04-admin-side-refinement.md`, Story 5.6A split, admin route IA, and mutation-state guidance]
- [Source: `_bmad-output/project-context.md`, private maintainer boundary, backend-only privileged logic, SPA-first routing, and file organization guidance]
- [Source: `backend/sources/views.py`, `backend/sources/repository.py`, `backend/sources/dtos.py`, and `backend/sources/urls.py`, current read-only stewardship baseline]
- [Source: `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`, `src/lib/maintainer/api.ts`, and `src/App.tsx`, current private dashboard and API helper baseline]
- [Source: `backend/accounts/views.py`, `backend/accounts/services.py`, `backend/accounts/permissions.py`, and `backend/accounts/auth.py`, existing admin gate and Supabase verification boundary]
- [Source: `supabase/migrations/0010_create_stewardship_history.sql` and `0011_lock_down_stewardship_table_grants.sql`, current stewardship history and browser-deny protections]
- [Source: `backend/tests/test_admin_auth.py` and `backend/tests/test_admin_stewardship.py`, current admin auth and read-only stewardship coverage]
- [Source: `tests/e2e/maintainer.spec.ts`, current direct-load and auth-fallback coverage for the private surface]
- [Source: `archive/docs/planning-artifacts/global-governance-admin-side-proposal.md`, admin-side data model, route family, UX states, validation, and audit guidance]
- [Source: `https://react.dev/versions`, React 19.2 version guidance]
- [Source: `https://supabase.com/docs/reference/javascript/auth-signinwithpassword`, `https://supabase.com/docs/client/auth-onauthstatechange`, and `https://supabase.com/docs/reference/javascript/auth-api`, Supabase auth guidance]
- [Source: `https://ui.shadcn.com/docs/components/form`, `button`, `dialog`, `drawer`, `table`, `input`, and `alert-dialog`, current shadcn/ui primitives and confirmation patterns]
- [Source: `https://docs.djangoproject.com/en/5.2/topics/http/file-uploads/` and `https://docs.djangoproject.com/en/5.2/ref/files/uploads/`, Django file-upload handling guidance]

## Dev Agent Record

### Agent Model Used
GPT-5 Codex

### Debug Log References

- Resolved the `bmad-create-story` customization and loaded the workflow inputs, checklist, and template.
- Read the active sprint tracker, Epic 5 story map, PRD, architecture, UX spec, project context, and the 2026-05-04 admin-side refinement proposal.
- Reviewed the current read-only maintainer dashboard implementation, its backend read routes, and the existing auth boundary.
- Confirmed there are no tracked source lifecycle write tables yet in `supabase/migrations/`; the mutation story needs to introduce or intentionally define that persistence path.
- Checked the recent commit pattern (`797d1f6`, `410988e`, `29285e5`, `497a477`, `6298282`) to keep the story aligned with the repo's change style.
- No code was changed while writing this story file; this is the implementation guide for Story 5.6a.
- Implemented protected Django source upload, metadata edit, lifecycle, and ingest endpoints under `api/admin`.
- Added mutable source lifecycle DTOs, a guarded stewardship projection, upload validation, ingest conflict checks, and audit events.
- Extended the maintainer dashboard with protected upload, edit, lifecycle, ingest actions, safe mutation error recovery, and post-submit projection refresh.
- Added Supabase migration `0012` for source records, ingest jobs, audit events, lifecycle constraints, and browser-deny grants.
- Verification passed: `pnpm test:unit`, `pnpm backend:test`, `pnpm backend:lint`, `pnpm backend:typecheck`, `pnpm backend:security`, `pnpm backend:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and maintainer Playwright smoke.
- `pnpm test:e2e` reported unrelated flaky home-smoke failures in parallel runs; the failed home-smoke cases passed when rerun individually, and the maintainer smoke file passed.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story 5.6a is ready for dev with protected source mutation workflows, explicit draft/inactive upload semantics, lifecycle actions, and auditability.
- The read-only Story 5.6 dashboard and `/maintainer` auth gate remain the baseline and should not regress.
- Chunk/citation inspection and validation runner are intentionally out of scope here and stay reserved for Stories 5.6b and 5.6c.
- The current dashboard DTO lifecycle vocabulary (`active` / `deprecated`) needs an explicit mutable-state expansion or mapping in the implementation.
- Protected source uploads now enter the dashboard as `draft` and inactive with audit history.
- Metadata edits, approval, activation, disable, archive, and ingest dispatch use protected Django routes and stable safe envelopes.
- Duplicate queued ingest requests return a safe conflict instead of enqueuing overlapping work.
- The private dashboard refreshes from the mutation response so persisted lifecycle, ingest, and audit state are visible immediately.
- Lifecycle persistence is documented in migration comments: draft -> approved|archived, approved -> active|disabled|archived, active -> disabled|archived, disabled -> active|archived, archived terminal.

### File List

- `_bmad-output/implementation-artifacts/5-6a-add-protected-source-mutation-workflows.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `backend/sources/urls.py`
- `backend/sources/views.py`
- `backend/sources/repository.py`
- `backend/sources/dtos.py`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`
- `src/lib/maintainer/api.ts`
- `src/lib/supabase/browser-client.ts`
- `backend/tests/test_admin_auth.py`
- `backend/tests/test_admin_stewardship.py`
- `tests/e2e/maintainer.spec.ts`
- `supabase/migrations/0010_create_stewardship_history.sql`
- `supabase/migrations/0011_lock_down_stewardship_table_grants.sql`
- `backend/accounts/views.py`
- `backend/accounts/services.py`
- `backend/accounts/permissions.py`
- `backend/accounts/auth.py`
- `backend/sources/dtos.py`
- `backend/sources/repository.py`
- `backend/sources/urls.py`
- `backend/sources/views.py`
- `backend/tests/test_admin_stewardship.py`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx`
- `src/lib/maintainer/api.ts`
- `supabase/migrations/0012_create_source_mutation_workflow_tables.sql`
- `tests/e2e/maintainer.spec.ts`
- `tsconfig.app.json`

### Change Log

- 2026-05-04: Created the protected source mutation workflow story and aligned it to the canonical Epic 5 / sprint-status split.
- 2026-05-04: Implemented protected source mutation workflows, lifecycle projection, audit/ingest guardrails, migration, UI entrypoints, and regression coverage.

## Story Completion Status

done
