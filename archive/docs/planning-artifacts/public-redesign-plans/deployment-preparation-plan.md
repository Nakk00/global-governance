# Deployment Preparation Plan

Date: 2026-06-07

## Objective

Prepare the Global Governance project for an online deployment without weakening
the runtime boundaries established by the grounded-chat readiness work.

The deployment plan must keep:

- Vite/React as the browser-facing SPA.
- Django as the owner of `/api/chat`, protected maintainer APIs, Redis-backed
  protection, retrieval policy, model routing, and citation packaging.
- Supabase as the durable data layer for Auth, private storage, Postgres,
  pgvector records, approved sources, chunks, embeddings, citations, and source
  activation state.
- Supabase Edge Functions limited to non-chat ingestion/storage-support flows.
- NVIDIA, Redis, service-role, and Django secrets out of browser-facing
  `VITE_*` variables.

## Current Deployment Shape

### Frontend

- Framework: Vite + React + TypeScript.
- Build command: `pnpm build`.
- Static output: `dist`.
- Current Vercel config: `vercel.json` rewrites `/maintainer` to
  `/index.html`.
- Browser env consumers:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_CHAT_API_URL`, optional when same-origin `/api/chat` works
- Chat client defaults to `/api/chat`.
- Maintainer clients currently call relative `/api/admin/...` paths, so a
  production frontend must either share an origin with Django APIs or proxy
  `/api/:path*` to the Django backend.

### Backend

- Framework: Django 5.2.
- Runtime owner for:
  - `/api/chat`
  - `/api/admin/me`
  - `/api/admin/sources...`
  - `/api/admin/validation...`
  - `/_internal/bootstrap/health/`
- Django reads server-only settings from environment variables.
- Local `backend/manage.py` loads `backend/.env` directly.
- Production settings exist at `backend/config/settings/production.py`.
- Deployment blocker: `backend/config/asgi.py` and `backend/config/wsgi.py`
  currently hardcode `config.settings.development`.
- Deployment blocker: `backend/requirements.txt` has Django and Redis clients,
  but no production WSGI/ASGI server dependency such as Gunicorn or Uvicorn.
- Deployment decision needed: Django currently defaults to SQLite. The app's
  canonical source/chat/admin data lives in Supabase and Redis, but we should
  explicitly confirm whether Django's local database is intentionally unused in
  production or add a managed `DATABASE_URL` path.

### Supabase

- Local migrations live in `supabase/migrations`.
- Current migrations include ingestion tables, private-source protections,
  admin profiles, stewardship history, validation workflow, ingest jobs, vector
  repair, and approved chunk retrieval RPC.
- Supabase functions remain for non-chat ingestion:
  - `supabase/functions/ingest-content`
  - `supabase/functions/ingest-pdf`
- Public chat functions are intentionally retired.
- Production deployment must apply migrations, provision private storage, create
  maintainer Auth users, grant admin profiles, and ingest/activate approved
  source records before chat is considered ready.

### Redis And NVIDIA

- Redis is required for normal Django public-chat protection.
- Redis stores short-lived operational state only: rate windows, abuse counters,
  cooldown markers, guard/query/retrieval helper cache entries.
- NVIDIA model settings and API keys are server-only Django environment values.
- Production should use fresh production secrets rather than reusing local
  development credentials.

## Recommended Topology

### Recommended First Deployment

Use Vercel for the static Vite SPA, a Python-capable backend host for Django,
hosted Supabase for durable data/storage/Auth, and managed Redis for protection
state.

This keeps the current architecture intact:

- Vercel serves `dist`.
- Vercel rewrites `/api/:path*` to the Django backend, or the app uses explicit
  backend URLs where needed.
- Django talks to Supabase, Redis, and NVIDIA with server-only secrets.
- Supabase Auth remains the browser-facing maintainer sign-in provider.

The cleanest production UX is same-origin API access through Vercel rewrites:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://<django-backend-domain>/api/:path*"
    },
    {
      "source": "/maintainer",
      "destination": "/index.html"
    }
  ]
}
```

With this approach, `VITE_CHAT_API_URL` can be omitted or left as `/api/chat`,
and maintainer relative API calls keep working.

### Alternative

Use `VITE_CHAT_API_URL=https://<django-backend-domain>/api/chat` for chat only.
This is less complete because maintainer APIs still use relative `/api/admin`
paths and would need either a rewrite or a separate frontend API base setting.

### Not Recommended For The First Pass

Deploy the full Django backend as Vercel Python Functions. Vercel does support a
Python runtime, including Django-style functions, but this project has a
stateful backend control plane, Redis protection, model-provider latency,
maintainer APIs, ingestion workflows, and production settings that are a better
fit for a normal Python web service first. We can revisit this after the safer
split deployment is stable.

## Workstreams

### 1. Release Hygiene

- Start from a clean branch and commit all intentional changes.
- Resolve current local generated/agent changes before release:
  - `.coverage`
  - `AGENTS.md`
  - `CLAUDE.md`
- Confirm ignored env files are not tracked:
  - `.env.local`
  - `backend/.env`
- Rotate any local development secrets before creating production secrets.
- Run `git status --short --branch` before every deploy rehearsal.

### 2. Frontend Deployment Readiness

- Keep root `.env.local` as local-only Vite config.
- In Vercel project settings, configure only browser-safe values:
  - `VITE_SUPABASE_URL=https://<project-ref>.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>`
  - `VITE_CHAT_API_URL=/api/chat` only if we do not rely on the default
- Update `vercel.json` to proxy `/api/:path*` to the backend once the backend
  URL exists.
- Keep `/maintainer` SPA rewrite.
- Verify Vercel project settings:
  - Framework preset: Vite
  - Build command: `pnpm build`
  - Output directory: `dist`
  - Install command: `pnpm install --frozen-lockfile`
- Confirm Vite env changes trigger a frontend rebuild.

### 3. Django Backend Production Readiness

- Update `backend/config/asgi.py` and `backend/config/wsgi.py` so production can
  honor `DJANGO_SETTINGS_MODULE=config.settings.production`.
- Add a production app server dependency and command, for example Gunicorn with
  `config.wsgi:application`, or Uvicorn with `config.asgi:application`.
- Decide whether Django needs a persistent production database:
  - If no Django ORM state is used, document that Supabase and Redis are the
    durable/operational stores and keep Django DB minimal.
  - If Django sessions/admin/auth tables are needed, add managed Postgres
    support through `DATABASE_URL`.
- Harden `backend/config/settings/production.py`:
  - Require non-empty `DJANGO_SECRET_KEY`.
  - Require explicit `DJANGO_ALLOWED_HOSTS`.
  - Configure proxy HTTPS headers for the selected host.
  - Review CSRF trusted origins if admin mutations ever use cookie auth.
  - Restrict public chat CORS if we choose direct cross-origin chat instead of
    same-origin rewrites.
- Add a production health check target:
  - `GET /_internal/bootstrap/health/`
- Confirm backend host supports Python 3.12.
- Confirm backend host can reach:
  - Supabase REST/Auth/JWKS/Storage
  - Redis
  - NVIDIA endpoints

### 4. Supabase Production Readiness

- Create or select the production Supabase project.
- Link the local project to remote Supabase with the Supabase CLI.
- Apply migrations from `supabase/migrations`.
- Verify required extensions and RPCs:
  - pgvector/vector support
  - approved chunk retrieval RPC
  - ingestion persistence RPC
- Configure Auth:
  - Production Site URL: deployed frontend URL
  - Exact production redirect URL(s)
  - Vercel preview redirect wildcard only if preview maintainer auth is needed
- Create maintainer Auth user(s).
- Grant backend-only maintainer access with Django's `provision_admin` command.
- Confirm private storage buckets and object access rules exist.
- Deploy retained non-chat Edge Functions only if we still need them online.
- Set Edge Function secrets only for non-chat ingestion functions, not public
  chat model routing.

### 5. Approved Source Ingestion

- Treat `archive/docs/approved-sources` as staging, not production retrieval.
- Run production ingestion through Django after Supabase is ready.
- Verify every suggested prompt section has active approved source coverage.
- Confirm each source has:
  - private storage object
  - document record
  - chunk records
  - citation/reference records
  - nonzero real embeddings
  - active `source_records`
  - succeeded `source_ingest_jobs`
- Run the suggested prompt audit against the production or staging backend.

### 6. Redis Production Readiness

- Provision managed Redis near the Django backend.
- Set `REDIS_URL` in the backend host.
- Confirm TLS/password URL format if the provider requires it.
- Verify TTL behavior in staging:
  - rate window
  - abuse threshold
  - cooldown expiry
  - guard/query/retrieval cache TTLs
- Confirm Redis outage produces typed fallback behavior rather than leaking
  internals.

### 7. Model Provider Readiness

- Create fresh production NVIDIA credentials.
- Set only backend secrets:
  - `NVIDIA_API_KEY`
  - `NVIDIA_API_BASE_URL`
  - `NVIDIA_GENERATION_MODEL`
  - `NVIDIA_EMBEDDING_MODEL`
  - `NVIDIA_EMBEDDING_DIMENSIONS`
  - `NVIDIA_EMBEDDING_BATCH_SIZE`
  - `NVIDIA_PROVIDER_TIMEOUT_SECONDS`
  - `NVIDIA_RERANK_MODEL`
  - `NVIDIA_RETRIEVAL_API_BASE_URL`
  - `NVIDIA_TOPIC_GUARD_MODEL`
  - `NVIDIA_SAFETY_GUARD_MODEL`
- Run targeted live provider checks before public release.
- Confirm expected spend/rate limits and fallback behavior.

### 8. Environment Matrix

Frontend Vercel environment:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CHAT_API_URL=/api/chat
```

Django backend environment:

```txt
DJANGO_SETTINGS_MODULE=config.settings.production
DJANGO_SECRET_KEY=
DJANGO_ALLOWED_HOSTS=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
SUPABASE_JWT_ISSUER=
SUPABASE_JWT_AUDIENCE=authenticated
SUPABASE_JWT_ROLE=authenticated
SUPABASE_JWKS_URL=
SUPABASE_JWKS_CACHE_SECONDS=300
SUPABASE_REST_TIMEOUT_SECONDS=5
REDIS_URL=
REDIS_PROTECTION_TTL_SECONDS=900
REDIS_RATE_LIMIT_WINDOW_SECONDS=60
REDIS_RATE_LIMIT_MAX_REQUESTS=10
REDIS_ABUSE_COOLDOWN_SECONDS=300
REDIS_ABUSE_THRESHOLD=3
REDIS_GUARD_CACHE_TTL_SECONDS=600
REDIS_QUERY_HELPER_CACHE_TTL_SECONDS=600
REDIS_RETRIEVAL_CACHE_TTL_SECONDS=120
REDIS_FINAL_ANSWER_CACHE_ENABLED=false
PUBLIC_CHAT_REQUEST_BODY_MAX_BYTES=8192
PUBLIC_CHAT_QUESTION_MAX_CHARS=2000
PUBLIC_CHAT_ANSWER_MAX_CHARS=4000
PUBLIC_CHAT_VISIBLE_CITATION_LIMIT=6
PUBLIC_CHAT_POLICY_VERSION=public-chat-v1
PUBLIC_CHAT_SOURCE_INDEX_VERSION=approved-sources-production-v1
NVIDIA_API_KEY=
NVIDIA_API_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_GENERATION_MODEL=nvidia/llama-3.1-nemotron-nano-8b-v1
NVIDIA_EMBEDDING_MODEL=nvidia/llama-nemotron-embed-1b-v2
NVIDIA_EMBEDDING_DIMENSIONS=384
NVIDIA_EMBEDDING_BATCH_SIZE=16
NVIDIA_PROVIDER_TIMEOUT_SECONDS=20
NVIDIA_RERANK_MODEL=nvidia/llama-nemotron-rerank-1b-v2
NVIDIA_RETRIEVAL_API_BASE_URL=https://ai.api.nvidia.com/v1/retrieval/nvidia
NVIDIA_TOPIC_GUARD_MODEL=nvidia/llama-3.1-nemoguard-8b-topic-control
NVIDIA_SAFETY_GUARD_MODEL=nvidia/llama-3.1-nemotron-safety-guard-8b-v3
INGESTION_DRY_RUN=false
```

Supabase Edge Function secrets:

```txt
# Only if retained ingestion functions are deployed and need extra secrets.
# Do not move public chat NVIDIA model routing here.
```

## Verification Gates

### Local Release Gate

Run before deploying:

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:e2e
pnpm backend:lint
pnpm backend:typecheck
pnpm backend:security
pnpm backend:test
pnpm backend:check
pnpm chatbot:validate-boundaries
```

For chat/source changes, also run:

```powershell
pnpm backend:ingest:approved
pnpm chatbot:audit-prompts -- --endpoint-mode live --endpoint http://127.0.0.1:8000/api/chat --fail-on-miss
pnpm test:chat:live
```

### Backend Staging Gate

- `GET /_internal/bootstrap/health/` returns ready.
- `POST /api/chat` returns typed `answered`, `refused`, `weakSupport`,
  `cooldown`, or `fallback` envelopes.
- `OPTIONS /api/chat` succeeds if cross-origin chat is used.
- `GET /api/admin/me` rejects missing/invalid tokens.
- `GET /api/admin/me` accepts a real maintainer token and profile.
- Redis cooldown behavior works against managed Redis.
- Supabase retrieval returns active approved chunks.
- NVIDIA generation, embedding, rerank, topic guard, and safety guard paths
  succeed or fail safely.

### Vercel Preview Gate

- Preview build passes with production-like env values.
- `/` loads.
- `/maintainer` loads directly.
- `/api/chat` reaches Django through the selected rewrite or env path.
- Maintainer API calls reach Django, not Vercel static fallback.
- Source-aware chat answers every suggested prompt with matching citations in
  the live audit.
- No server-only key appears in the built frontend bundle.

### Production Release Gate

- Supabase production migrations are applied.
- Production approved sources are ingested and active.
- Production Redis is reachable.
- Production backend health check is green.
- Vercel production deployment points at the production backend and Supabase
  project.
- Supabase Auth production Site URL and redirect URLs match the final domain.
- Smoke-check public learning flow, source-aware chat, and maintainer login.

## Deployment Order

1. Freeze and clean the release branch.
2. Create production Supabase project and apply migrations.
3. Provision managed Redis.
4. Prepare Django production settings and backend host config.
5. Deploy Django backend to staging.
6. Set backend secrets in the backend host.
7. Run backend health, Supabase, Redis, NVIDIA, and chat contract checks.
8. Ingest approved sources into production Supabase.
9. Run live suggested-prompt audit against staging backend.
10. Configure Vercel project env and `/api/:path*` rewrite.
11. Deploy Vercel preview.
12. Run browser smoke, maintainer, and live chat checks through preview.
13. Promote backend and frontend to production.
14. Run production smoke checks and record deployment evidence.

## Primary Risks

- `asgi.py` and `wsgi.py` currently force development settings.
- No production Python server dependency or start command is checked in.
- `vercel.json` does not yet proxy `/api/:path*` to Django.
- Maintainer APIs are relative `/api/admin` calls, so chat-only env config is
  not enough for a full deployed app.
- Supabase production data is not created by the Vercel frontend deploy; it
  needs migrations plus ingestion/activation.
- Redis is required for normal chat protection.
- Frontend `VITE_*` values are build-time browser values and must not contain
  backend secrets.
- Current local env values are development credentials; production should use
  freshly issued secrets.

## Evidence Consulted

- `graphify-out-merged/GRAPH_REPORT.md`
- `graphify-out/GRAPH_REPORT.md`
- `graphify-out-backend/GRAPH_REPORT.md`
- `graphify-out-supabase/GRAPH_REPORT.md`
- GitNexus process query for public chat and deployment runtime boundaries
- `README.md`
- `backend/retrieval/README.md`
- `backend/config/settings/base.py`
- `backend/config/settings/production.py`
- `backend/config/asgi.py`
- `backend/config/wsgi.py`
- `backend/config/urls.py`
- `backend/chatbot/views.py`
- `backend/chatbot/urls.py`
- `src/lib/chat/api-client.ts`
- `src/lib/supabase/browser-client.ts`
- `scripts/chatbot/validate-chatbot-boundaries.ts`
- `vercel.json`
- `.env.example`
- `backend/.env.example`
- Vercel documentation for Vite env variables, external rewrites, and Python
  function runtime constraints
- Supabase documentation for migrations, Edge Function deployment/secrets, and
  Auth redirect URLs
- Django deployment checklist guidance for production settings
