# External Integrations

**Analysis Date:** 2026-05-06

## APIs & External Services

**Public Chat Runtime:**
- Supabase Edge Functions power the public grounded chat endpoint at `/functions/v1/chat`.
  - Entry point: `supabase/functions/chat/index.ts`
  - Frontend client: `src/lib/chat/api-client.ts`
  - Auth: public browser requests plus an anonymous session header; no learner login required.
  - Behaviors: answered, weak-support, refusal, and cooldown states are returned as typed success envelopes.

**Protected Maintainer APIs:**
- Django provides protected maintainer/admin endpoints under `/api/admin/*`.
  - Routes: `backend/config/urls.py`, `backend/accounts/urls.py`, `backend/sources/urls.py`, `backend/validation/urls.py`
  - Frontend client: `src/lib/maintainer/api.ts`
  - Auth: Supabase Auth bearer token verified server-side against issuer, audience, role, expiry, subject, email, and JWKS.

**Local Supabase REST / RPC Calls from Server Code:**
- Django repositories call Supabase REST endpoints using the service role key.
  - Examples: `backend/accounts/services.py`, `backend/sources/repository.py`, `backend/validation/repository.py`
  - Auth: `SUPABASE_SERVICE_ROLE_KEY`
  - Timeout control: `SUPABASE_REST_TIMEOUT_SECONDS`

## Data Storage

**Databases:**
- Supabase Postgres is the authoritative external store for admin profiles, source stewardship data, ingestion payloads, validation workflow records, and reference chunks/citations.
  - Migrations: `supabase/migrations/0001_create_ingestion_documents.sql` through `0013_create_validation_workflow.sql`
  - Access patterns: Supabase REST/RPC from Django and Edge Functions
- Django uses local SQLite as its configured app database in `backend/config/settings/base.py`.
  - File: `backend/db.sqlite3`
  - Role: local framework state and bootstrap compatibility, not the main course/source system of record.

**File Storage:**
- Supabase Storage stores private source uploads for ingestion.
  - Shared helper: `supabase/functions/_shared/ingestion-persistence.ts`
  - Bucket contract shown in code: `project-source-pdfs`
  - Operations: upload, delete, and persistence RPC packaging use the service role key.

**Caching / Rate Limiting:**
- Chat protection defaults to an in-memory store but can switch to Redis when `REDIS_URL` is configured.
  - Shared logic: `supabase/functions/_shared/chat-protection.ts`
  - Current fallback: in-memory rate-limit and abuse-cooldown tracking.

## Authentication & Identity

**Auth Provider:**
- Supabase Auth is the identity source for maintainer access.
  - Frontend sign-in path: `src/lib/supabase/browser-client.ts`
  - Backend verification: `backend/accounts/auth.py`
  - Token storage: maintainer session is kept in browser `localStorage` under `global-governance-maintainer-session`.

**Authorization Model:**
- Learner-facing SPA remains login-free.
- Maintainer access is server-authorized against the backend-only `admin_profiles` table and related repository logic in `backend/accounts/services.py`.
- Provisioning commands run through `backend/accounts/management/commands/provision_admin.py`.

## Monitoring & Observability

**Application Logging:**
- No dedicated observability vendor is wired in the checked-in code.
- Failures are surfaced primarily as typed JSON envelopes, thrown errors, test assertions, and local terminal output.

**Health / Bootstrap Checks:**
- Django exposes `_internal/bootstrap/health/` via `backend/config/api.py`.
- `scripts/dev/backend-stack.ps1` runs a backend preflight before launching Django, Supabase chat, and Vite together.

## CI/CD & Deployment

**Hosting Shape:**
- The checked-in code assumes a static Vite frontend plus server-side Supabase/Django boundaries.
- `vercel.json` is present, suggesting a static-hosting-friendly deployment path for the SPA.

**CI Pipeline:**
- No `.github/workflows/` directory is present in the current repository snapshot.
- Verification is driven locally through `pnpm` and backend Python scripts instead of a checked-in CI workflow.

## Environment Configuration

**Development:**
- Frontend: `.env.example`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_CHAT_FUNCTION_URL`
- Backend: `backend/.env.example`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_JWT_ISSUER`
  - `SUPABASE_JWT_AUDIENCE`
  - `SUPABASE_JWT_ROLE`
  - `SUPABASE_JWKS_URL`
  - `SUPABASE_JWKS_CACHE_SECONDS`
  - `SUPABASE_REST_TIMEOUT_SECONDS`
  - optional `REDIS_URL`, `NVIDIA_*`
- Supabase local project config: `supabase/config.toml`

**Staging / Production Signals:**
- Public chat cutover to Django is explicitly deferred via `PUBLIC_CHAT_CUTOVER_STATUS = "deferred-supabase-edge-function-default"` in `backend/config/settings/base.py`.
- Service-role and JWT validation settings are designed to move cleanly from local Supabase to hosted environments.

## Webhooks & Callbacks

**Incoming:**
- None are implemented as checked-in HTTP webhook handlers.

**Outgoing:**
- Supabase REST and storage calls are made from Django repositories and Edge Function helpers rather than through webhook dispatchers.

---

*Integration audit: 2026-05-06*
*Update when external services, auth providers, or storage patterns change*
