# Story 5.4: Establish the Django Backend Foundation

Status: done

## Story

As a maintainer,
I want a dedicated Django backend foundation for the chatbot and admin stack,
so that future backend work happens behind one consistent, secure orchestration boundary.

## Acceptance Criteria

1. Given the backend foundation story is implemented, when I inspect the repository structure, then the Django project, registered backend app boundaries, shared backend utilities, pinned backend runtime metadata, and environment conventions are present in their documented locations, and the frontend remains separated from privileged backend code.
2. Given the Django service is configured, when I start the documented clean-clone workflow on the pinned backend runtime, then the frontend, Django service, and Supabase local dependencies can run together through one explicit command path, the backend can reach the intended Supabase services through server-only configuration, and startup fails fast with user-actionable guidance when required backend prerequisites are missing.
3. Given this foundation story lands before public-chat cutover, when I inspect request ownership, then the current browser chat path still defaults to the existing Supabase Edge Function route, the Django service exposes only internal bootstrap endpoints plus reserved chat and admin route scaffolding for later stories, and every Django-owned route added here returns a documented response envelope without exposing privileged model, retrieval, or service-role work to the browser.
4. Given untrusted input reaches a Django-owned external backend boundary, when chat, ingestion, citation packaging, or source metadata handling begins, then transport guards, runtime schema validation, domain-level validation, and structured user-safe errors are applied before deeper orchestration continues, and unexpected exceptions are converted into stable non-debug response envelopes instead of propagating malformed state or raw stack traces.

## Tasks / Subtasks

- [x] Scaffold the Django project boundary and shared server helpers (AC: 1, 3, 4)
  - [x] Create the `backend/` project root with `manage.py`, project settings modules, ASGI/WSGI entry points, and the top-level backend app packages defined by the approved architecture.
  - [x] Pin one backend runtime and dependency workflow for clean-clone reproducibility, including the Python version, dependency manager choice, and lockfile or equivalent checked-in metadata.
  - [x] Add `backend/common/` for response envelopes, environment loading, and schema-validation helpers used by later Django stories.
  - [x] Create minimal but real Django app packages for `chatbot`, `retrieval`, `ingestion`, `validation`, `audit`, and `sources`, including app configs and settings registration so the boundaries are wired rather than inert folders.
  - [x] Keep privileged retrieval, service-role access, and maintainer operations inside `backend/`; do not mirror them into frontend components or `supabase/functions/` for this story.
- [x] Establish environment conventions and local startup wiring (AC: 1, 2)
  - [x] Create `backend/.env.example` and update the root `.env.example` only as needed to distinguish browser-safe frontend values from server-only Django and Supabase settings.
  - [x] Document one exact clean-clone setup path that names the supported Python version, backend dependency install command, environment-file setup, and the command sequence that runs the frontend, Django service, and Supabase local stack together without manual code edits.
  - [x] Add or update `pnpm` scripts only if they wrap a clearly defined backend startup and check workflow; avoid introducing wrappers that hide missing Python, dependency, or readiness prerequisites.
  - [x] Add a fail-fast backend startup check that reports missing required server-only environment values, missing dependency setup, or unavailable local services before the browser is asked to rely on Django.
- [x] Define the transition-safe API boundary for the foundation slice (AC: 2, 3, 4)
  - [x] Keep the existing public chat browser path pointed at the current Supabase Edge Function route in this story and document that the Django public cutover is deferred.
  - [x] Add reserved Django route namespaces for future public chat and protected admin work, but keep them internal, stubbed, or explicitly non-production-facing until later stories own the cutover and auth flow.
  - [x] Define the shared Django response envelope shape and compatibility rules for later chat migration so future stories do not silently break the existing browser contract.
  - [x] Define which external boundary types require transport guards, schema validation, domain validation, timeout handling, and exception-to-envelope conversion.
- [x] Add backend bootstrap tests and service-boundary checks (AC: 1-4)
  - [x] Add backend tests under `backend/tests/` for settings import, environment separation, response-envelope helpers, and schema-validation entry points.
  - [x] Add a minimal bootstrap or health check only if it helps prove the Django service starts cleanly; keep it internal, server-side, and not publicly discoverable.
- [x] Verify malformed external payloads, wrong content types, oversized bodies, missing auth on reserved admin routes, and downstream timeout or startup failures produce structured user-safe errors and never expose raw stack traces or service-only details.
- [x] Verify server-only environment values are not read from browser-facing code paths and that Django startup selects the intended settings module explicitly.

### Review Findings
- [x] [Review][Patch] Base settings still allow a dev-only signing key and localhost hosts [backend/config/settings/base.py:8-13, backend/config/settings/production.py:1-3]
- [x] [Review][Patch] Malformed `SUPABASE_URL` ports can crash startup before the custom error path runs [backend/common/env.py:60-66]
- [x] [Review][Patch] The Supabase readiness check is brittle during fresh local boots [backend/common/env.py:68-75]
- [x] [Review][Patch] The backend stack still dies on missing Django dependencies instead of a user-actionable preflight [backend/manage.py:16-28, package.json:17-20, scripts/dev/backend-stack.ps1:9-18]
- [x] [Review][Patch] Development `DEBUG = True` still leaks Django debug responses for 404/500 paths [backend/config/settings/development.py:1-3, backend/config/urls.py:13-14]
- [x] [Review][Patch] Entry points still honor inherited `DJANGO_SETTINGS_MODULE` values instead of forcing the intended backend settings [backend/manage.py:14, backend/config/asgi.py:9, backend/config/wsgi.py:9]
- [x] [Review][Patch] Method mismatches bypass the documented JSON envelope and fall back to Django's default 405 response [backend/config/api.py:17-59]
- [x] [Review][Patch] The backend stack coordinator blocks on `supabase:start` before launching the other services [package.json:11-20, scripts/dev/backend-stack.ps1:16-23]
- [x] [Review][Patch] The backend stack coordinator does not verify child-process exit codes, so a broken stack can keep running [scripts/dev/backend-stack.ps1:20-37]

## Dev Notes

### Current State

- `src/lib/chat/api-client.ts` still posts to the Supabase Edge Function chat path by default and keeps anonymous-session handling browser-side.
- `supabase/functions/chat/index.ts`, `supabase/functions/chat-retrieve/index.ts`, `supabase/functions/_shared/chat-grounding.ts`, and `supabase/functions/_shared/chat-protection.ts` still own the current live chat boundary.
- There is no `backend/` tree yet, so there is no Django project package, no `manage.py`, no backend settings split, and no backend test tree.
- The root `.env.example` only covers the frontend Vite variables plus a few generic server-only placeholders; it does not yet describe a Django-specific environment split.
- `package.json` has Vite, Supabase, Playwright, and chatbot helper scripts only; there is no backend service script or Python dependency manifest yet.
- `README.md` still documents the Supabase Edge Function chat startup path, not a Django-backed orchestration boundary.
- The 2026-05-02 sprint change proposal and updated architecture rebaseline now treat Django as the target backend boundary, so this story is the first implementation slice under the new ownership model.

### Story Focus

- Establish Django as the single orchestration boundary before deeper chatbot, ingestion, auth, or admin work starts.
- Keep the current Supabase Edge Function path alive as transitional residue until later stories move responsibilities.
- Keep the current Supabase Edge Function path as the browser-default public chat entry point in this story; do not cut traffic over to Django yet.
- Match the approved backend layout so future stories can find shared helpers and app modules without improvising paths.
- Make config, secrets, and local startup reproducible on a clean clone.
- Keep browser-facing code presentation-only and keep privileged orchestration out of `src/`.

### Scope Boundaries

- No chat UX redesign, no retrieval ranking logic, no ingestion implementation, no auth flow, and no private maintainer UI in this story.
- No public chat cutover in this story; the browser-facing chat contract and typed response states stay on the current Supabase path until a later migration story.
- No React Router, global store, or browser-side privileged orchestration.
- No migration of browser code into `backend/` and no migration of privileged backend code into `src/`.
- Keep the existing Supabase live path functioning; this story should scaffold Django without forcing a cutover.
- Keep the core learning flow usable even if the backend scaffold is incomplete while the new service is being stood up; prefer explicit degraded mode, documented no-cutover behavior, or startup refusal over partial silent takeover.

### Architecture Guardrails

- Follow the approved split: `src/` for browser presentation, `backend/` for Django orchestration, and `supabase/` for migrations and local data services.
- Keep backend utilities in `backend/common/` and backend tests in `backend/tests/`.
- Keep feature app packages at the backend root, matching the approved structure for `chatbot`, `retrieval`, `ingestion`, `validation`, `audit`, and `sources`.
- Use runtime schema validation at every external backend boundary; types alone are not enough for untrusted input.
- Keep response envelopes structured and user-safe; stable error codes only, no raw tracebacks in API payloads.
- Keep service-role credentials and privileged Supabase access server-side only.
- Keep deployment and local workflow separation intact: frontend deploys independently, Django deploys independently, and Supabase migrations stay versioned.
- Keep Django request ownership conservative in this story: internal bootstrap and reserved route scaffolding only unless a later story explicitly owns public cutover.
- Keep trusted-proxy and forwarded-header assumptions conservative in the initial ASGI/WSGI setup.

### Testing Standards Summary

- Keep backend tests under `backend/tests/`.
- Prefer Django's native project checks and test runner for the initial scaffold unless the scaffold explicitly introduces another approved Python test tool.
- Add checks that the settings modules import cleanly, environment separation is respected, and shared response helpers return the expected envelope shapes.
- Add checks that the explicit settings-module selection works for `manage.py`, ASGI, and WSGI entry points.
- Add checks that reserved admin routes reject unauthenticated access even before the real auth flow story lands.
- Add checks that wrong content types, oversized bodies, and downstream unavailability convert into stable user-safe envelopes.
- Keep frontend checks (`pnpm lint`, `pnpm typecheck`, `pnpm build`) green so the new backend scaffold does not regress the SPA.
- Validate the local startup story with the documented frontend + Django + Supabase workflow on a clean clone.

### Previous Story Intelligence

- Story 5.3 showed the repo favors bounded story slices with shared helpers, dedicated tests, and local scripts rather than trying to land a giant cross-system change at once.
- Story 5.2 established that privileged preparation logic belongs in server-side boundaries and should be backed by deterministic helpers and test coverage.
- Story 5.1 established that reviewable contracts and stable ids matter more than ad hoc runtime state.
- Story 4.4 reinforced that user-visible boundary states should be typed, calm, and server-owned rather than collapsed into generic failures.
- The implementation pattern across those stories is consistent: land the smallest stable slice, keep boundaries explicit, and do not move privileged logic into the browser.

### Git Intelligence Summary

- `29285e5 feat: validate chatbot boundaries` and `497a477 prepare ingestion pipeline and sync repo artifacts` landed bounded story slices with tests and scripts in the same change.
- `6298282 feat: manage approved source bundles` and `91797ff feat: finalize story 4.4 protection states` show the repo prefers explicit contracts, typed states, and reviewable diffs over hidden runtime behavior.
- `752e7b6 Implement grounded source-aware chat` confirms the current chat path is still a Supabase Edge Function implementation and should not be silently rewritten in this foundation story.
- The recent pattern is small, reviewable slices that preserve the live contract while preparing the next boundary.

### Latest Tech Notes

- Django 5.2 is the current LTS release line, and the latest patch release on that line is 5.2.13 as of April 7, 2026. Pin the scaffold to Django 5.2.13 and one explicit Python runtime, with Python 3.12 as the default local target for this repo unless a later platform decision supersedes it. [Source: https://docs.djangoproject.com/en/5.2/releases/, https://docs.djangoproject.com/en/5.2/releases/5.2.13/]
- `django-admin startproject` creates `manage.py` and the project package in the target directory; that matches the approved `backend/` root approach for this story. [Source: https://docs.djangoproject.com/en/5.2/ref/django-admin/]
- The Django docs still organize project guidance around `manage.py`, project packages, and standard app organization, so the scaffold should stay conventional rather than custom-framework-like. [Source: https://docs.djangoproject.com/en/5.2/contents/, https://docs.djangoproject.com/en/5.2/ref/django-admin/]
- The latest 5.2 patch notes include security fixes on the ASGI/header-handling line, so keep proxy and header assumptions conservative if the backend is served under ASGI. [Source: https://docs.djangoproject.com/en/5.2/releases/5.2.13/]

### Project Structure Notes

- `backend/` is the new home for Django code.
- `backend/common/` should hold shared server-side helpers and contract utilities.
- `backend/tests/` should hold backend tests.
- `src/` stays presentation-only; do not move privileged orchestration there.
- `supabase/` remains the home for migrations and the current transitional Edge Function path.
- The root `.env.example` currently mixes browser-safe and server-only placeholders; this story should make the backend-specific split explicit.
- The current repo has no `backend/` tree, so this story will create the first Python/Django scaffold rather than extending existing server code.
- The approved backend layout in the rebaselined architecture uses top-level backend app packages such as `backend/chatbot/`, `backend/retrieval/`, `backend/ingestion/`, `backend/validation/`, `backend/audit/`, and `backend/sources/`.

### Project Context Reference

- Django is the backend orchestration layer for chat, retrieval, validation, admin operations, and privileged source stewardship.
- Keep browser-facing code in `src/` and backend code in `backend/`.
- Keep maintainer actions in protected Django admin flows plus local scripts; do not add a public maintainer dashboard in the learner-facing MVP path.
- Preserve clean-clone reproducibility, separate deployment tracks, and server-side secrets.
- Keep privileged retrieval, service-role access, ingestion, citation packaging, and maintainer-only source mutations inside Django; frontend chat code may only format requests and parse responses.

### Files Likely to Create or Update

- `backend/manage.py`
- `backend/pyproject.toml`
- `backend/uv.lock` or equivalent backend lock metadata chosen by the story implementation
- `backend/.python-version` or equivalent pinned runtime file if that is the selected reproducibility mechanism
- `backend/.env.example`
- `backend/config/settings/base.py`
- `backend/config/settings/development.py`
- `backend/config/settings/production.py`
- `backend/config/urls.py`
- `backend/config/api.py` or equivalent reserved route registration file if that is the cleanest place to separate bootstrap, chat, and admin namespaces
- `backend/config/asgi.py`
- `backend/config/wsgi.py`
- `backend/common/__init__.py`
- `backend/common/env.py`
- `backend/common/responses.py`
- `backend/common/validation.py`
- `backend/chatbot/__init__.py`
- `backend/chatbot/apps.py`
- `backend/retrieval/__init__.py`
- `backend/retrieval/apps.py`
- `backend/ingestion/__init__.py`
- `backend/ingestion/apps.py`
- `backend/validation/__init__.py`
- `backend/validation/apps.py`
- `backend/audit/__init__.py`
- `backend/audit/apps.py`
- `backend/sources/__init__.py`
- `backend/sources/apps.py`
- `backend/tests/test_project_bootstrap.py`
- `backend/tests/test_common_responses.py`
- `backend/tests/test_settings_imports.py`
- `backend/tests/test_route_guards.py`
- `backend/tests/test_request_validation.py`
- `.env.example`
- `README.md`
- `package.json` if a backend script wrapper is added

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 5: Story 5.4, Story 5.5, implementation enablement notes, NFR22, and NFR25]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR35-FR41, NFR8, NFR11, NFR22, and NFR25]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, Data Architecture, API & Communication Patterns, Frontend Architecture, File Organization Patterns, Development Workflow Integration, and Requirements to Structure Mapping]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Source-Aware Chat Panel, Feedback Patterns, and Accessibility Strategy]
- [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-02.md`, PRD Analysis, Epic Coverage Validation, and Summary and Recommendations]
- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-05-02.md`, Django backend pivot, backlog re-sequencing, and ownership split]
- [Source: `_bmad-output/project-context.md`, Django backend placement, server-side secrets, browser/server split, and backend test placement]
- [Source: `_bmad-output/implementation-artifacts/5-3-validate-chatbot-boundaries.md`, Story 5.3 handoff and validation patterns]
- [Source: `_bmad-output/implementation-artifacts/5-2-prepare-sources-for-ingestion.md`, Story 5.2 server-side helper and script patterns]
- [Source: `_bmad-output/implementation-artifacts/5-1-manage-approved-source-bundles.md`, canonical contract and source governance patterns]
- [Source: `_bmad-output/implementation-artifacts/4-4-handle-refusal-and-protection-states.md`, server-owned typed boundary states]
- [Source: `src/lib/chat/api-client.ts`, current Supabase chat endpoint and anonymous-session handling]
- [Source: `supabase/functions/chat/index.ts`, current live chat orchestration boundary]
- [Source: `supabase/functions/chat-retrieve/index.ts`, current retrieval caller]
- [Source: `supabase/functions/_shared/chat-grounding.ts`, current grounding and response contract]
- [Source: `supabase/functions/_shared/chat-protection.ts`, current protection helper]
- [Source: `package.json`, current script surface]
- [Source: `README.md`, current local startup instructions]
- [Source: `archive/docs/planning-artifacts/global_governance-supabase-auth-django-admin-dashboard-proposal.md`, recommended Django backend layout]
- [Source: https://docs.djangoproject.com/en/5.2/releases/, Django 5.2 release notes and patch release listing]
- [Source: https://docs.djangoproject.com/en/5.2/releases/5.2.13/, Django 5.2.13 release notes]
- [Source: https://docs.djangoproject.com/en/5.2/ref/django-admin/, `django-admin` and `manage.py` documentation]
- [Source: https://docs.djangoproject.com/en/5.2/contents/, Django documentation contents and project organization guidance]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Resolved the create-story customization block with the local resolver.
- Loaded project context, sprint tracking, Epic 5, PRD, architecture, UX, prior stories 5.1-5.3 and 4.4, the current chat code, package scripts, repository structure, the implementation readiness report, the sprint-change proposal, and the archived Django proposal.
- Confirmed the repo currently has no `backend/` scaffold and that the current live chat path still points at Supabase Edge Functions.
- Verified official Django 5.2 release notes and `django-admin` project layout guidance before writing the story file.
- Resolved the dev-story customization block and loaded project context/config before implementation.
- Created failing backend tests first; initial red phase failed because Django/backend modules were not installed yet.
- Installed pinned backend dependencies into local ignored `backend/.venv` for verification.
- Ran GitNexus detect changes after implementation; reported low risk with no affected execution flows.
- Verified `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, `pnpm test:functions`, `pnpm build`, `pnpm backend:test`, and Django `check`.
- Switched the backend test runner decision to pytest with `pytest-django` after maintainer confirmation.

### Completion Notes List

- Implemented the Django backend foundation under `backend/` with conventional settings modules, ASGI/WSGI entry points, app configs, and registered app boundaries for chatbot, retrieval, ingestion, validation, audit, and sources.
- Added shared backend helpers for server-only environment loading, fail-fast prerequisite checks, stable response envelopes, runtime JSON/content-type/body-size validation, and exception-safe error conversion.
- Added internal bootstrap, reserved chat, and reserved admin route scaffolding that keeps public browser chat on the Supabase Edge Function path while returning documented safe envelopes for Django-owned routes.
- Added backend bootstrap and boundary tests covering settings imports, environment separation, response envelopes, schema-validation entry points, route guards, malformed payloads, oversized bodies, missing admin auth, and explicit settings selection.
- Documented the clean-clone backend setup and added `pnpm` wrappers for backend check/test/dev plus the explicit Windows PowerShell local stack coordinator.
- Updated `pnpm backend:test` to run pytest, with `pytest-django` settings configured in `backend/pyproject.toml`.

### File List

- `.env.example`
- `.gitignore`
- `README.md`
- `_bmad-output/implementation-artifacts/5-4-establish-the-django-backend-foundation.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `backend/.env.example`
- `backend/.python-version`
- `backend/audit/__init__.py`
- `backend/audit/apps.py`
- `backend/chatbot/__init__.py`
- `backend/chatbot/apps.py`
- `backend/common/__init__.py`
- `backend/common/env.py`
- `backend/common/responses.py`
- `backend/common/validation.py`
- `backend/config/__init__.py`
- `backend/config/api.py`
- `backend/config/asgi.py`
- `backend/config/settings/__init__.py`
- `backend/config/settings/base.py`
- `backend/config/settings/development.py`
- `backend/config/settings/production.py`
- `backend/config/urls.py`
- `backend/config/wsgi.py`
- `backend/ingestion/__init__.py`
- `backend/ingestion/apps.py`
- `backend/manage.py`
- `backend/pyproject.toml`
- `backend/requirements.txt`
- `backend/retrieval/__init__.py`
- `backend/retrieval/apps.py`
- `backend/sources/__init__.py`
- `backend/sources/apps.py`
- `backend/tests/__init__.py`
- `backend/tests/test_common_responses.py`
- `backend/tests/test_project_bootstrap.py`
- `backend/tests/test_request_validation.py`
- `backend/tests/test_route_guards.py`
- `backend/tests/test_settings_imports.py`
- `backend/validation/__init__.py`
- `backend/validation/apps.py`
- `eslint.config.js`
- `package.json`
- `scripts/dev/backend-stack.ps1`

### Change Log

- 2026-05-02: Implemented Django backend foundation, shared envelope/validation/env helpers, reserved internal routes, backend tests, startup docs, and local command wiring.
- 2026-05-02: Adopted pytest plus `pytest-django` as the backend test runner and verified the existing 20 backend tests through `pnpm backend:test`.

## Story Completion Status

- review
