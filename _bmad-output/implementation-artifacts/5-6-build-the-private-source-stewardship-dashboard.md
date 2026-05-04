# Story 5.6: Build the Private Source Stewardship Dashboard

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a maintainer,
I want a private source stewardship surface,
so that I can review approved materials, ingestion state, and validation readiness without exposing admin tooling publicly.

## Acceptance Criteria

1. Given I access the maintainer dashboard as an authenticated maintainer, when the dashboard loads, then I can review approved sources, source metadata, and current readiness state in one private surface, and the dashboard is not linked from the public learner flow.
2. Given I need to review source changes, when I inspect a source entry, then I can see approval status, relevant metadata, and change visibility sufficient for stewardship review, and the experience supports source governance without requiring direct database access.
3. Given I need to understand how a source reached its current state, when I inspect the source history, then I can see approval lineage, change provenance, and the maintainer action trail relevant to that source, and stewardship review does not depend on hidden tribal knowledge.
4. Given I need operational visibility, when I inspect ingestion or validation records, then I can see job status, recent runs, and actionable outcomes, and the dashboard remains scoped to source stewardship rather than becoming a general public CMS.
5. Given I load the private surface directly, refresh it, or revisit it with a stale browser session, when the app resolves maintainer access, then Supabase browser auth manages the client session but `GET /api/admin/me` remains the authoritative access gate, and the UI renders explicit signed-out, unauthorized, inactive, expired-session, and revoked-session states without exposing private data.
6. Given dashboard data is loading, empty, partially unavailable, or temporarily failing, when a maintainer opens any dashboard section, then the UI shows section-level skeleton, empty, partial-data, and retryable outage states instead of blank panels or silent failure.
7. Given the private dashboard runs inside the Vite SPA, when a maintainer visits `/maintainer` by direct URL or browser refresh, then the supported deployment path resolves to the private surface without React Router, public learner navigation, or a production-only 404.
8. Given the story remains read-only, when the dashboard shows action trail or operational follow-up cues, then the UI does not expose source mutation, upload, approval, or admin-write controls in this story.

## Tasks / Subtasks

- [x] Establish the private maintainer entrypoint and auth gate (AC: 1, 4)
  - [x] Use `/maintainer` as the canonical private pathname and wire the pathname-based split in `src/App.tsx` without introducing React Router into the public learner flow.
  - [x] Document or implement the required SPA host fallback so `/maintainer` works on direct load and browser refresh in supported environments.
  - [x] Create a thin `src/lib/supabase/` browser client helper and auth/session layer using the existing browser-safe Supabase env values only for sign-in, sign-out, and session synchronization.
  - [x] Gate the private surface on `GET /api/admin/me`, treat that endpoint as the authoritative access decision, and render explicit signed-out, loading, unauthorized, inactive, expired-session, revoked-session, and retryable outage states.
  - [x] Clear browser session state and return to a safe unauthorized view if any later admin dashboard read returns `401` or `403`.
  - [x] Keep the maintainer surface out of `src/components/layout/Navbar.tsx`, `src/components/layout/SectionProgressRail.tsx`, and any public learner navigation.

- [x] Build the source stewardship dashboard views (AC: 1-4)
  - [x] Add a private dashboard shell and read-only views under an explicitly private feature boundary, likely `src/components/modules/MaintainerDashboard/` or equivalent.
  - [x] Show an overview of approved sources, current readiness, recent ingestion status, and validation state in one private surface.
  - [x] Add source list and source detail views with explicit stewardship fields: canonical `sourceId`, title, source type, lifecycle state, aliases, usage scope, provenance, ingestion readiness, latest validation outcome, and recent action trail.
  - [x] Add source history views that distinguish approval lineage, ingestion provenance, validation run history, and maintainer audit trail rather than combining them into one ambiguous timeline.
  - [x] Use accessible tables, tabs, drawers, or dialogs from the shared UI layer when they fit the dashboard flow, with explicit keyboard, reduced-motion, and mobile-safe behavior.
  - [x] Define section-level loading skeletons, empty states, partial-data messaging, and retryable outage UI for overview, source list, source detail, validation history, and audit history sections.
  - [x] Keep the experience read-only for this story; do not add source upload, mutation, approval, or admin-write UI. Actionable outcomes may link to follow-up documentation or operational guidance but must not perform writes.

- [x] Add Django admin read APIs and data-access seams (AC: 1-4)
  - [x] Add route handlers under the existing `api/admin/` namespace for source inventory, source detail/history, ingestion status, validation runs, and audit logs.
  - [x] Reuse the existing `backend/accounts` auth boundary and the shared safe-envelope helpers in `backend/common/`.
  - [x] Define explicit DTOs for overview, source inventory, source detail, validation runs, and audit history so the browser contract is enumerated rather than inferred during implementation.
  - [x] Read from the current ingestion persistence model (`documents`, `chunks`, `references`, `reference_chunks`) and from any stewardship read model needed to expose provenance/history.
  - [x] Treat `src/data/source-bundles/approved-source-bundle.ts` as the canonical approved-source metadata source, join ingestion and validation status onto that inventory server-side, and expose explicit partial-data markers when downstream records are missing.
  - [x] Return stable safe-envelope responses for `401`, `403`, `404`, and `5xx` cases so the private surface can distinguish unauthorized, inactive, missing-record, and retryable outage states.
  - [x] Keep all privileged reads and any future mutations backend-side; the browser should only consume JSON DTOs.

- [x] Add or extend stewardship persistence where the dashboard needs it (AC: 3, 4)
  - [x] Introduce the missing validation and audit records needed to show job status, recent runs, and maintainer action trail.
  - [x] Define the minimum event semantics for those records: stable identifiers, source linkage, event type, actor or system origin, occurred-at timestamp, outcome status, and human-readable summary.
  - [x] If source-history data cannot be derived cleanly from the current ingestion records, add a narrow stewardship read model instead of changing the ingestion write path.
  - [x] If older validation or audit history is unavailable, explicitly support a no-backfill baseline for this story and surface that condition as an empty-history state instead of inventing synthetic lineage.
  - [x] Preserve the existing approved-source bundle and ingestion pipeline as the source of truth for the approved inventory.

- [x] Sequence implementation to reduce cross-layer ambiguity (AC: 1-8)
  - [x] Land backend DTOs and read endpoints before wiring the private dashboard shell to live data.
  - [x] Land any required validation or audit persistence before finalizing history and readiness UI.
  - [x] Keep the story slice reviewable by separating auth gate, backend reads, persistence additions, and dashboard UI into bounded commits or checkpoints when practical.

- [x] Refresh regression coverage around the private surface and public boundary (AC: 1-8)
  - [x] Add backend tests for the new admin source, ingestion, validation, and audit endpoints plus their auth failures.
  - [x] Update `backend/tests/test_admin_auth.py` so the public learner boundary assertion excludes the private maintainer feature boundary instead of scanning all of `src`.
  - [x] Add backend tests for empty dataset, partial-data, retryable `5xx`, and revoked-session `401` or `403` responses so the browser can render the intended private states safely.
  - [x] Add a Playwright e2e spec for the maintainer login/dashboard flow, direct-load or refresh on `/maintainer`, expired or revoked-session behavior, and a public-boundary check that the learner nav still exposes no maintainer links.
  - [x] Put any shared auth/session helpers under `tests/playwright/` if the dashboard spec needs them.
- [x] Cover keyboard navigation, reduced motion, and narrow-screen containment for any dashboard tables, tabs, drawers, or dialogs introduced by this story.

### Review Findings

- [x] [Review][Patch] Source history is synthetic instead of honoring the no-backfill baseline [backend/sources/repository.py:146] — `get_source_detail()` fabricated approval, ingestion, validation, and audit events for every source, but the story notes explicitly call for an empty-history/no-backfill state when older history is unavailable.
- [x] [Review][Patch] Auth/config 401s are misclassified as expired sessions [src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:631] — `mapGateError()` treated every `401` as `expiredSession`, so a backend auth-verifier outage (`admin_verifier_unavailable`) could be shown as a stale browser session instead of a retryable outage.
- [x] [Review][Patch] Later dashboard reads do not return to a safe unauthorized or retryable-outage state [src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:100] — `loadDashboard()` only promoted `403` to `revokedSession`, and `loadSourceDetail()` swallowed non-403 failures into the generic empty-selection panel, so a later `401`/`5xx` could leave the maintainer on a stale or misleading view instead of the explicit state the story requires.

## Dev Notes

### Current State

- A historical chat-redesign artifact still exists as `ref-5-6-redesign-the-source-aware-chat-experience.md`, but sprint tracking now places that work at Story `5.9`; this dashboard story is the canonical Story `5.6` artifact for current implementation.
- `backend/accounts` already owns the admin auth boundary and exposes `GET /api/admin/me` plus the `/_internal/admin/` compatibility alias.
- `backend/sources`, `backend/ingestion`, `backend/validation`, and `backend/audit` currently exist only as `AppConfig` shells; they do not yet expose route handlers or models.
- `src/App.tsx`, `src/components/layout/AppShell.tsx`, `src/components/layout/Navbar.tsx`, and `src/components/layout/SectionProgressRail.tsx` are learner-only and do not mount a private maintainer surface.
- The frontend has no Supabase auth client wrapper yet, but the root `.env.example` already exposes `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `src/data/source-bundles/approved-source-bundle.ts` is the current repo-managed source inventory and explicitly states `publicMaintainerDashboard: false`.
- The current Supabase persistence model uses `documents`, `chunks`, `references`, and `reference_chunks`; validation and audit tables are not yet present in migrations.
- `backend/tests/test_admin_auth.py` currently scans the full `src` tree to assert that public frontend code does not surface admin routes or Supabase auth logic, so that test must be re-scoped once the private maintainer code lands.
- `backend/config/urls.py` currently mounts only `accounts.urls` under `api/admin/`; it does not yet expose source stewardship, ingestion, validation, or audit routes.

### Story Focus

- Build the first private maintainer surface now that the admin auth boundary exists.
- Keep the public learner SPA login-free and unchanged except for keeping maintainer links out of it.
- Use the approved source bundle and backend ingestion records as the read source for stewardship views, not direct browser database access.
- Surface source provenance, ingestion readiness, validation readiness, and action trail in a way that is clearly separate from the learner journey.
- Preserve the existing `admin_profiles` auth source of truth and the admin-only access rule for this story.
- Make the access contract explicit: Supabase browser auth owns session acquisition, while Django `GET /api/admin/me` owns the final authorization decision for the private surface.
- Make degraded states first-class: direct-load, refresh, empty data, partial data, expired session, revoked session, and retryable backend outages are all part of the story scope.

### Scope Boundaries

- No learner accounts or public maintainer dashboard.
- No React Router unless the private surface truly requires a separate route family; prefer pathname-based private branching or a separate private mount.
- No browser-side direct Supabase writes, source mutation, or privileged retrieval.
- No change to the public chat contract or learner navigation beyond ensuring maintainer links never appear there.
- No general CMS or analytics surface for learners.
- No mutation controls for source approval, source upload, validation reruns, or audit editing in this story.

### Architecture Guardrails

- Keep the private maintainer UI in an explicitly private feature boundary, likely under `src/components/modules/MaintainerDashboard/`, rather than mixing it into learner-facing story sections.
- Reuse the current safe-envelope helpers from `backend/common/responses.py` and request validation helpers from `backend/common/validation.py`.
- Extend the `api/admin/` backend namespace rather than inventing a second auth model.
- Use the existing browser-safe Supabase env values with a thin client helper; if the approved login method remains email/password, use the documented Supabase auth sign-in flow and session listener pattern.
- Treat the browser Supabase client as session transport only. Do not duplicate JWT verification or authorization rules in frontend code; `GET /api/admin/me` remains authoritative.
- Assume `/maintainer` is a supported SPA entrypoint and make its deployment fallback explicit in implementation notes or setup docs.
- Keep dashboard reads backend-side and server-authenticated; the browser should consume only DTOs and never talk directly to privileged storage.
- If the dashboard needs tables, tabs, dialogs, or drawers, use the shared shadcn/ui primitives instead of building a custom component framework.

### Testing Standards Summary

- Add backend tests for admin source, ingestion, validation, and audit endpoints, including auth failures and safe-envelope responses.
- Update the current frontend boundary test in `backend/tests/test_admin_auth.py` so it only protects the public learner boundary and does not block the private maintainer feature boundary.
- Add a Playwright spec for the private maintainer login and dashboard flow, plus a public-boundary check that the learner nav still exposes no maintainer links.
- Cover direct-load and browser-refresh behavior for `/maintainer` so the private entrypoint does not only work from in-app navigation.
- Cover signed-out, unauthorized, inactive, expired-session, revoked-session, empty-data, partial-data, and retryable outage states.
- Put any shared private-auth or dashboard test helpers under `tests/playwright/` if they are reused across specs.
- Keep assertions role-based, label-based, and state-based; avoid screenshot-only checks for the dashboard.
- Verify keyboard access, reduced motion behavior, and narrow-screen containment for any private dashboard overlays or data presentations.

### Implementation Sequence

- Step 1: define or extend backend persistence and DTOs for validation and audit visibility.
- Step 2: add `api/admin/` read endpoints with stable safe-envelope behavior for auth failures, empty datasets, partial data, and retryable outages.
- Step 3: wire the `/maintainer` shell, Supabase session transport, and authoritative `GET /api/admin/me` gate.
- Step 4: build the read-only dashboard UI against the finalized DTOs and degraded-state contract.
- Step 5: land backend and Playwright regression coverage for route access, auth transitions, and dashboard state handling.

### Previous Story Intelligence

- Story 5.5 already established the private admin auth boundary, `GET /api/admin/me`, the `admin_profiles` authorization source of truth, and the server-only provisioning path.
- The current auth boundary should be reused as-is; this story should not duplicate JWT verification in frontend code.
- Story 5.4 established the Django backend scaffold, response envelopes, validation helpers, and the admin route placeholder alias.
- The current public learner shell is intentionally separate from any private maintainer UI, so this story must keep the private surface isolated instead of folding it into the public app.

### Git Intelligence Summary

- `797d1f6 feat: add Supabase admin auth boundary` shows the repo prefers explicit backend auth helpers and tests before broader feature expansion.
- `410988e feat: establish django backend foundation` shows the backend work is expected to stay in Django and use the shared safe-envelope patterns.
- `29285e5 feat: validate chatbot boundaries` and `497a477 prepare ingestion pipeline and sync repo artifacts` show the repo favors bounded, reviewable slices with companion tests.
- `6298282 feat: manage approved source bundles` reinforces the source-discipline pattern this dashboard should surface rather than replace.

### Latest Tech Notes

- React docs currently cover the 19.2 line, so keep the private surface in function components and hook-based state.
- Supabase Auth docs support email/password sign-in with `signInWithPassword()` and session synchronization with `onAuthStateChange()`; the client persists sessions by default.
- shadcn/ui docs currently document `Table`, `Tabs`, `Dialog`, and `Drawer`, which fit the source list/detail and responsive overlay patterns this dashboard needs.
- The repo already pins `supabase` JS in `package.json`; use that client and the existing VITE env vars rather than introducing a second auth SDK.
- The backend remains on the pinned Django 5.2.13 line already established in the repo, so keep the existing safe-envelope and conservative request-handling assumptions.

### Project Structure Notes

- Likely update: `src/App.tsx`
- Likely new private feature boundary under `src/components/modules/MaintainerDashboard/`
- Likely new browser auth helper under `src/lib/supabase/`
- Likely update: `backend/config/urls.py`
- Likely update or extension of `backend/config/api.py`
- Likely new route/view/service files under `backend/sources/`, `backend/ingestion/`, `backend/validation/`, and `backend/audit/`
- Likely new or extended migrations under `supabase/migrations/`
- Likely update: `backend/tests/test_admin_auth.py`
- Likely add new backend tests under `backend/tests/`
- Likely add new browser tests under `tests/e2e/`
- Likely add private-auth helpers under `tests/playwright/`
- Read-only source inventory should continue to come from `src/data/source-bundles/approved-source-bundle.ts` and the ingestion payload helpers in `scripts/chatbot/approved-source-set.ts` and `supabase/functions/_shared/ingestion-pipeline.ts`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 5: Story 5.6: Build the Private Source Stewardship Dashboard; dependency stories 5.5, 5.7, 5.8, and 5.9]
- [Source: `_bmad-output/planning-artifacts/prd.md`, Product Scope, Journey 4, FR35-FR41, NFR6, NFR7, NFR22, and NFR25]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, Authentication & Security, Frontend Architecture, API & Communication Patterns, and Requirements to Structure Mapping]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Scope Boundaries, Form Patterns, Navigation Patterns, Responsive Design & Accessibility, and the private-maintainer boundary note in the Source-Aware Chat Panel section]
- [Source: `_bmad-output/project-context.md`, private maintainer boundary, backend-only privileged logic, SPA-first routing rule, and file organization guidance]
- [Source: `archive/docs/planning-artifacts/global-governance-supabase-auth-django-admin-dashboard-proposal.md`, Database Design, Admin APIs, Maintainer Dashboard UX, and Security Considerations]
- [Source: `backend/config/urls.py`, current `api/admin/` namespace and reserved route layout]
- [Source: `backend/config/api.py`, current safe-envelope placeholder handlers and reserved admin alias]
- [Source: `backend/accounts/views.py`, `backend/accounts/services.py`, `backend/accounts/permissions.py`, and `backend/accounts/auth.py`, current admin auth boundary and repository abstraction]
- [Source: `backend/tests/test_admin_auth.py`, current admin boundary coverage and the public learner boundary scan that must be re-scoped]
- [Source: `src/App.tsx`, `src/components/layout/AppShell.tsx`, `src/components/layout/Navbar.tsx`, and `src/components/layout/SectionProgressRail.tsx`, current learner-only shell]
- [Source: `src/data/source-bundles/approved-source-bundle.ts`, current approved-source manifest and `publicMaintainerDashboard: false` contract]
- [Source: `scripts/chatbot/approved-source-set.ts`, approved source file inventory used by ingestion prep]
- [Source: `supabase/functions/_shared/ingestion-types.ts`, `supabase/functions/_shared/ingestion-pipeline.ts`, `supabase/migrations/0001_create_ingestion_documents.sql`, and `supabase/migrations/0002_persist_ingestion_document.sql`, current ingestion document/chunk/reference persistence model]
- [Source: `tests/e2e/home.spec.ts`, `tests/e2e/chat-live.spec.ts`, and `tests/playwright/chat-boundary-cases.ts`, current browser-test conventions and public-boundary patterns]
- [Source: https://react.dev/versions, React version guidance]
- [Source: https://supabase.com/docs/guides/auth/passwords, Supabase password auth guidance]
- [Source: https://supabase.com/docs/client/auth-onauthstatechange, Supabase auth session event guidance]
- [Source: https://ui.shadcn.com/docs/components/table, shadcn/ui Table guidance]
- [Source: https://ui.shadcn.com/docs/components/tabs, shadcn/ui Tabs guidance]
- [Source: https://ui.shadcn.com/docs/components/dialog, shadcn/ui Dialog guidance]
- [Source: https://ui.shadcn.com/docs/components/base/drawer, shadcn/ui Drawer guidance]
- [Source: https://playwright.dev/docs/locators, Playwright locator guidance]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Resolved the create-story workflow and targeted Story 5.6 directly so the dashboard guide stays aligned with the current Epic 5 backlog.
- Loaded sprint tracking, Epic 5, PRD, architecture, UX spec, project-context rules, the latest backend pivot proposal, the archived dashboard proposal, the current backend auth boundary, the approved-source manifest, ingestion helpers, and the current browser test suite.
- Confirmed the first backlog story in `sprint-status.yaml` is `5-6-build-the-private-source-stewardship-dashboard`, not the older chat-redesign artifact.
- Confirmed the public learner shell is still login-free and that the private maintainer surface does not yet exist in `src`.
- Confirmed the backend source/ingestion/validation/audit apps are still shells and that the dashboard must be wired to the existing admin auth boundary.
- Confirmed the frontend boundary test in `backend/tests/test_admin_auth.py` will need re-scoping once private maintainer auth code lands in `src`.
- No code was changed in this step; this file is the implementation guide for the dashboard story.
- Implemented the Story 5.6 slice on `codex/story-5-6-private-source-stewardship-dashboard`; GitNexus impact checks for `App`, `admin_me`, backend `urlpatterns`, `PublicLearnerBoundaryTests`, `activeApprovedSourceBundle`, and `success_response` all reported LOW risk with no direct upstream callers or affected indexed flows.
- GitNexus detect-changes reported low risk and no affected execution flows after implementation; unrelated pre-existing dirty worktree files remain present outside this story slice.
- Verification completed: `pnpm format`, `pnpm backend:format`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit`, `pnpm test:e2e`, `pnpm backend:lint`, `pnpm backend:typecheck`, `pnpm backend:security`, `pnpm backend:test`, and `pnpm backend:check`.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story 5.6 is now ready for dev with a private source stewardship focus, admin-gated access, explicit public-learner isolation, and clarified degraded-state handling.
- The dashboard should expose approved-source review, ingestion readiness, validation state, and action trail without becoming a general public CMS.
- The existing admin auth boundary, approved-source manifest, and ingestion read model should be reused rather than replaced.
- The browser Supabase client is limited to session transport, while Django remains the authoritative private-access gate.
- Added the private `/maintainer` SPA branch, browser Supabase session transport, authoritative `GET /api/admin/me` gate, explicit access/degraded states, and a read-only maintainer dashboard under `src/components/modules/MaintainerDashboard/`.
- Added Django admin read endpoints for source inventory/detail, ingestion records, validation records, and audit records, with explicit DTOs and safe-envelope auth/error behavior.
- Added a stewardship history migration for validation and audit event records with browser-deny RLS policies, plus a Vercel SPA rewrite for direct `/maintainer` loads.
- Added backend and Playwright regression coverage for admin source endpoints, public/private boundary scoping, direct loads, refresh behavior, revoked/expired sessions, keyboard access, reduced motion, and narrow-screen containment.

### File List

- `_bmad-output/implementation-artifacts/5-6-build-the-private-source-stewardship-dashboard.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `backend/config/urls.py`
- `backend/sources/dtos.py`
- `backend/sources/repository.py`
- `backend/sources/urls.py`
- `backend/sources/views.py`
- `backend/tests/test_admin_auth.py`
- `backend/tests/test_admin_stewardship.py`
- `src/App.tsx`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`
- `src/lib/maintainer/api.ts`
- `src/lib/supabase/browser-client.ts`
- `supabase/migrations/0010_create_stewardship_history.sql`
- `tests/e2e/maintainer.spec.ts`
- `vercel.json`

### Change Log

- 2026-05-03: Implemented the private source stewardship dashboard, admin read APIs, stewardship history baseline, SPA fallback, and regression coverage for Story 5.6.

## Story Completion Status

done
