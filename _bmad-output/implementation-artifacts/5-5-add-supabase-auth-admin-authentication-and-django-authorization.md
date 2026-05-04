# Story 5.5: Add Supabase Auth Admin Authentication and Django Authorization

Status: done

## Story

As a maintainer,
I want private maintainer authentication and protected Django authorization,
So that approved-source operations remain restricted without adding learner accounts.

## Acceptance Criteria

1. Given I request a protected admin route without a valid Supabase access token, when Django evaluates the request, then it returns a 401 safe envelope, performs no admin lookup or mutation, and exposes no raw traceback.
2. Given I send a valid Supabase Auth access token as `Authorization: Bearer <supabase_access_token>`, when Django verifies the token, then it confirms signature, issuer, expiry, subject, audience, `role`, and `email` claims using Supabase's JWKS-backed verification path or another maintained verifier, enforces the project-specific issuer and audience configuration, and returns the current maintainer identity from the canonical admin session endpoint as a safe envelope with `userId`, `email`, `role`, and `isActive`.
3. Given the JWT is valid but the `sub` claim does not map to an active `admin_profiles` record or the profile is disabled or insufficiently privileged, when Django evaluates the request, then it returns a 403 safe envelope and does not expose protected admin data.
4. Given an administrator grants, updates, or revokes maintainer access through the documented server-side provisioning path, when the change is saved, then the next authenticated request reflects the new active or role state without any learner-facing auth changes.
5. Given the learner-facing site and public chat flows are used, when the page loads or the chat submits, then no learner sign-in is required and no admin-only route is linked or surfaced in the public navigation.
6. Given the auth boundary receives malformed headers, wrong auth schemes, blank bearer tokens, expired tokens, or unexpected request payloads, when Django rejects the request, then it returns the approved response envelope with a stable error code and no raw traceback.
7. Given the auth boundary is implemented, when I inspect the repository, then the Django accounts boundary, Supabase auth settings, admin profile storage, and tests are present in documented locations and no privileged auth logic is placed in frontend components.

## Tasks / Subtasks

- [x] Create the `backend/accounts/` auth boundary and supporting Supabase admin profile schema (AC: 2, 3, 4, 7)
  - [x] Add the `backend/accounts` Django app with auth verification, authorization helpers, protected views, and app config.
  - [x] Add a Supabase migration for `admin_profiles` with `supabase_user_id`, `email`, `display_name`, `role`, `is_active`, `last_login_at`, timestamps, restrictive browser-access policies, a unique constraint on `supabase_user_id`, and a role-domain check that allows only `owner`, `admin`, or `viewer`.
  - [x] Define the backend-only data-access seam for maintainer lookup and provisioning so Django can read and update `admin_profiles` without relying on the SQLite default app database for authorization state.
  - [x] Wire the new app into `INSTALLED_APPS`, add `GET /api/admin/me`, and keep `/_internal/admin/` as a compatibility alias that delegates to the canonical handler until downstream callers are updated.
- [x] Implement JWT verification and maintainer lookup helpers (AC: 2, 3)
  - [x] Verify Supabase Auth access tokens from the `Authorization: Bearer` header using a maintained JWKS-capable JWT verifier.
  - [x] Validate `iss`, `aud`, `exp`, `sub`, `role`, and `email` claims against the project configuration and trust only verified claims, never request-body identity fields.
  - [x] Define the stable admin auth error codes for missing token, invalid token, unavailable verifier, unauthorized maintainer, inactive maintainer, and unsupported request payload cases.
  - [x] Map the verified `sub` claim to `admin_profiles.supabase_user_id`, confirm the verified email still matches the active profile record, and load the maintainer behind a narrow repository or service abstraction.
  - [x] Use a short-lived JWKS cache and explicit key-refresh behavior so rotated keys or temporary JWKS failures fail safely instead of silently authorizing or crashing.
- [x] Add authorization responses and server-side provisioning support (AC: 1, 3, 4, 6)
  - [x] Return 401 for missing or invalid tokens and 403 for valid but unauthorized or inactive maintainers.
  - [x] Return 401 for wrong auth schemes, blank bearer tokens, and issuer or audience mismatches, and reject unexpected request bodies for `GET /api/admin/me` with a stable safe-envelope code.
  - [x] Add a documented server-side provisioning path for granting, updating, and revoking maintainer access through `backend/accounts/management/commands/provision_admin.py` or an equivalent backend-only command path with explicit operator inputs and no learner-facing auth changes.
  - [x] Make the next authenticated request reflect provisioning changes by re-reading the maintainer profile per request or invalidating any profile cache immediately after grant, update, or revoke operations.
  - [x] Keep all service-role or sensitive operations backend-only.
- [x] Update environment, routing, and documentation surfaces (AC: 5, 7)
  - [x] Add auth-specific Supabase settings to `backend/.env.example` and the backend settings/env parsing path, including the project issuer, expected audience, JWKS URL, and any short-lived cache settings needed by the verifier.
  - [x] Update the README and local workflow notes to explain the bearer-token admin request contract and the login-free learner boundary.
- [x] Add tests for auth and authorization boundaries (AC: 1-7)
  - [x] Test missing token, wrong auth scheme, blank bearer token, malformed token, expired token, issuer mismatch, audience mismatch, unknown maintainer, inactive maintainer, disallowed role, valid maintainer, and provisioning-path behavior.
  - [x] Test that `GET /api/admin/me` returns the canonical identity shape, that `/_internal/admin/` delegates to the same auth boundary while the compatibility alias exists, and that the backend never exposes raw tracebacks.
  - [x] Test verifier-unavailable and JWKS-rotation-safe failure paths with local fakes so the suite confirms stable envelopes without live Supabase credentials.
  - [x] Test that the public learner path remains login-free and that no frontend component gains privileged auth logic.

## Dev Notes

### Current State

- `backend/` already exists from Story 5.4 with the Django scaffold, safe response envelopes, request validation helpers, and a reserved admin placeholder.
- `backend/config/api.py` still returns `admin_auth_required` and `admin_cutover_deferred` placeholder responses for the internal admin route.
- There is no `backend/accounts/` app yet, no `admin_profiles` table yet, and no Supabase JWT verification helper yet.
- `backend/.env.example` only covers the generic server-only values from the backend foundation story; it does not yet describe the auth boundary.
- `backend/config/settings/base.py` still points Django's default app database at SQLite, so this story must define a deliberate backend-only seam for reading and provisioning Supabase-backed maintainer authorization data.
- The public chat path still defaults to the Supabase Edge Function. This story should not change the public chat cutover decision.

### Story Focus

- Establish the private maintainer auth boundary for future admin dashboard and admin API work.
- Use `Authorization: Bearer <supabase_access_token>` as the request contract for protected admin calls.
- Verify Supabase JWTs server-side with a maintained verifier or JWKS-backed library. Do not hand-roll signature logic.
- Treat `admin_profiles` as the authorization source of truth: valid JWT + matching active profile + permitted role = access.
- The `admin_profiles` role model should allow `owner`, `admin`, and `viewer` even if this MVP story only authorizes `admin` initially.
- Keep this boundary bearer-token based for MVP. Do not introduce Django session or cookie auth for the admin identity endpoint in this story.
- Keep learner-facing pages and public chat login-free.

### Scope Boundaries

- No admin dashboard UI.
- No learner auth, password resets, or public sign-up flows.
- No retrieval, ingestion, or source-mutation features beyond auth gating and provisioning support.
- No browser-side privileged logic.
- No change to the public chat cutover decision.
- No broad secret-handling changes beyond auth-specific settings and server-only env vars.

### Architecture Guardrails

- `backend/accounts/` should own auth verification and authorization helpers.
- `GET /api/admin/me` should be the canonical admin identity endpoint and must return `userId`, `email`, `role`, and `isActive` inside the standard success envelope.
- Keep `/_internal/admin/` only as a temporary compatibility alias that delegates to the same `GET /api/admin/me` handler while existing tests or callers still reference it.
- Use 401 for missing or invalid tokens, and 403 for valid but unauthorized or inactive maintainers.
- Verify claims only: `iss`, `aud`, `exp`, `sub`, `role`, and `email` at minimum.
- Trust only verified token claims, not frontend-provided email addresses.
- Treat Supabase JWT `role` as an authentication claim and `admin_profiles.role` as the authorization source of truth for maintainer permissions.
- `GET /api/admin/me` should authorize only active `admin` profiles in this story; `owner` and `viewer` must remain valid stored roles but should resolve to explicit allow or deny behavior instead of implicit fallthrough.
- Reject wrong auth schemes, blank bearer tokens, duplicate or malformed authorization values, and unexpected request bodies with stable safe-envelope error codes.
- Update `last_login_at` on successful verification and keep that behavior in the provisioning and repository contract.
- Use a short-lived JWKS cache with safe refresh behavior so key rotation and temporary JWKS failures do not silently authorize or crash the boundary.
- Keep service-role credentials and profile provisioning server-side only.
- Do not widen RLS or public access on `admin_profiles`; browser roles should not read or write it directly.
- Keep Django 5.2.13 pinned. Its release notes include multipart and ASGI security fixes, so keep request and proxy assumptions conservative.
- Use an explicit helper or decorator for admin authorization rather than hiding the boundary inside browser logic or implicit middleware.
- Keep the admin-profile lookup behind a narrow repository/service interface so tests can stub it cleanly.

### Testing Standards Summary

- Add Django/backend tests under `backend/tests/`.
- Cover missing token, wrong auth scheme, blank bearer token, malformed token, expired token, issuer mismatch, audience mismatch, verifier unavailable, unknown maintainer, inactive maintainer, disallowed role, valid maintainer, and provisioning-path behavior.
- Cover safe-envelope responses and status codes for 401, 403, and 200.
- Cover the canonical `GET /api/admin/me` response shape and the temporary `/_internal/admin/` compatibility alias behavior.
- Keep the existing frontend Vitest and Playwright expectations intact.
- `pnpm backend:test`, `pnpm backend:check`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` should stay green after the story lands.
- Use local fakes or mocks for JWT claims and admin-profile lookup so the suite does not require live Supabase credentials.

### Previous Story Intelligence

- Story 5.4 created the Django backend scaffold, response envelopes, request validation, and reserved admin route placeholders.
- The current admin placeholder in `backend/config/api.py` is intentionally stubbed; this story should replace the placeholder auth behavior, not regress the safe-envelope pattern.
- Story 5.3 reinforced that backend boundaries should return typed, calm states rather than transport failures for expected protection cases.
- The repo favors bounded, test-backed slices with clear file ownership instead of broad cross-system rewrites.

### Git Intelligence Summary

- Recent work landed small, reviewable backend slices and kept the live public contract stable while adding new boundaries.
- The Django foundation commit and the chatbot boundary commits show the repo prefers adding explicit helpers and tests before broad feature expansion.
- This story should follow that pattern: add auth boundary, add tests, preserve the learner UX.

### Latest Tech Notes

- Django 5.2.13 is the pinned backend line in this repo. The official 5.2.13 release notes mention fixes for multipart base64 upload denial-of-service and ASGI body-limit bypass, so keep request handling conservative and do not relax body-size guards.
- Supabase Auth access tokens are JWTs sent in `Authorization: Bearer <jwt>`.
- Supabase publishes a JWKS endpoint at `.../auth/v1/.well-known/jwks.json`; verify signatures with that JWKS or another maintained JWT library rather than implementing signature verification yourself.
- Supabase JWT claims to verify include `iss`, `aud`, `exp`, `sub`, `role`, and `email`.
- Supabase recommends keeping JWT verification caches short-lived so key rotation and revocation remain effective.

### Project Structure Notes

- `backend/accounts/` should own auth verification, permission checks, and admin identity views.
- `backend/config/` should wire the route and settings integration without moving privileged logic into `src/`.
- `backend/common/` should continue to own shared envelopes, validation, and server-only env loading.
- `supabase/migrations/` should own the `admin_profiles` table and RLS or protection policy changes.
- `backend/tests/` should hold auth, authorization, and route-guard coverage.
- Keep the public learner experience login-free and keep frontend code out of the auth and provisioning boundary.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 5: Story 5.5, Story 5.6, and implementation enablement notes]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR35-FR41, NFR6, NFR7, NFR11, NFR22, and NFR25]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, Authentication & Security, API & Communication Patterns, File Organization Patterns, and Requirements to Structure Mapping]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Scope Boundaries, Source-Aware Chat Panel, and Security Considerations]
- [Source: `_bmad-output/implementation-artifacts/5-4-establish-the-django-backend-foundation.md`, current state, scope boundaries, architecture guardrails, and file list]
- [Source: `_bmad-output/project-context.md`, Django backend placement, private maintainer boundary, and backend test placement]
- [Source: `archive/docs/planning-artifacts/global-governance-supabase-auth-django-admin-dashboard-proposal.md`, login flow, admin_profiles schema, and Django auth responsibilities]
- [Source: `backend/config/api.py`, reserved admin route placeholder and safe-envelope behavior]
- [Source: `backend/common/responses.py`, stable success/error envelope helpers]
- [Source: `backend/common/env.py`, backend startup prerequisite checks and server-only env handling]
- [Source: `backend/config/settings/base.py`, installed apps, public chat cutover status, and conservative proxy settings]
- [Source: `backend/tests/test_route_guards.py`, current reserved admin route expectations]
- [Source: `backend/tests/test_settings_imports.py`, backend app registration expectations]
- [Source: `backend/.env.example`, current server-only environment split]
- [Source: https://docs.djangoproject.com/en/5.2/releases/5.2.13/, Django 5.2.13 security notes]
- [Source: https://supabase.com/docs/guides/auth/jwts, Supabase JWT guidance and JWKS verification path]
- [Source: https://supabase.com/docs/guides/auth/jwt-fields, Supabase JWT claims reference]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Resolved the create-story customization block with the local resolver.
- Loaded project context, sprint tracking, Epic 5, PRD, architecture, UX, the previous Story 5.4 handoff, the backend scaffold, the archived Django auth proposal, and official Django/Supabase docs.
- Confirmed the repo currently has no `backend/accounts/` scaffold and no `admin_profiles` migration yet.
- Confirmed the current internal admin route is still a placeholder and that the public chat path remains on the Supabase Edge Function.
- Ran GitNexus impact analysis before modifying `backend/config/api.py::reserved_admin` and `backend/common/env.py::validate_required_env`; both returned LOW risk.
- Implemented and verified the auth boundary with local fakes for JWT/profile behavior; no live Supabase credentials are required for tests.
- Ran GitNexus detect changes after implementation; tracked code changes reported LOW risk and no affected execution flows.

### Implementation Plan

- Replace the reserved admin placeholder with a canonical `GET /api/admin/me` handler under `backend/accounts/`.
- Keep token verification, profile lookup, login timestamp updates, and provisioning behind backend-only service abstractions.
- Store the authorization source of truth in Supabase `admin_profiles`, not Django SQLite.
- Preserve the public learner SPA and Supabase Edge Function chat path without adding frontend auth logic.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story intentionally preserves the login-free learner path and the current public chat cutover decision.
- Story positions Supabase Auth verification and `admin_profiles` authorization as the next backend boundary.
- Added the `accounts` Django app with bearer-token parsing, PyJWT/PyJWKClient-backed Supabase verification, profile authorization, `GET /api/admin/me`, and `/_internal/admin/` delegation.
- Added backend-only Supabase REST profile access and the `provision_admin` management command for grant, update, and revoke operations.
- Added the `admin_profiles` Supabase migration with role checks, unique Supabase user IDs, timestamps, `last_login_at`, service-role access, and restrictive browser policies.
- Added auth environment settings, dependency pins, README workflow documentation, and backend tests covering 401/403/200 envelopes, verifier failures, JWKS refresh failure, provisioning, and public-frontend isolation.
- Verification passed: `pnpm backend:test`, `pnpm backend:check` with temporary JWT env values, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:unit`.

### File List

- `README.md`
- `_bmad-output/implementation-artifacts/5-5-add-supabase-auth-admin-authentication-and-django-authorization.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `backend/accounts/__init__.py`
- `backend/accounts/apps.py`
- `backend/accounts/auth.py`
- `backend/accounts/permissions.py`
- `backend/accounts/services.py`
- `backend/accounts/views.py`
- `backend/accounts/urls.py`
- `backend/accounts/management/commands/provision_admin.py`
- `backend/config/api.py`
- `backend/config/settings/base.py`
- `backend/config/urls.py`
- `backend/common/env.py`
- `backend/.env.example`
- `backend/pyproject.toml`
- `backend/requirements.txt`
- `backend/tests/test_admin_auth.py`
- `backend/tests/test_project_bootstrap.py`
- `backend/tests/test_route_guards.py`
- `backend/tests/test_settings_imports.py`
- `supabase/migrations/0009_create_admin_profiles.sql`

### Change Log

- 2026-05-03: Implemented Supabase Auth admin verification and Supabase-backed admin profile authorization boundary.
- 2026-05-03: Added server-only provisioning command, auth settings/docs, `admin_profiles` migration, and backend/front-end guard tests.

## Story Completion Status

done

### Review Findings

- [x] [Review][Patch] Owner roles are still authorized [backend/accounts/permissions.py:17]
- [x] [Review][Patch] Provisioning upsert lacks an explicit conflict target [backend/accounts/services.py:67]
- [x] [Review][Patch] Provisioning revoke assumes a row always exists [backend/accounts/services.py:83]
- [x] [Review][Patch] Supabase REST write failures can still bubble into 500s [backend/accounts/permissions.py:50]
