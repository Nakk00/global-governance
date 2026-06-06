# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Local Django Chat

The source-aware chat calls the Django backend through:

```txt
VITE_CHAT_API_URL=/api/chat
```

Start local Redis, Supabase data services, Django backend, and Vite frontend together:

```bash
pnpm local:dev
```

Use separate terminals when you want to run each service independently:

```bash
pnpm redis:start
pnpm supabase:start
pnpm backend:dev
pnpm dev
```

`pnpm backend:dev` starts Django only. It expects local Redis and Supabase to already be reachable, so use `pnpm local:dev` when you want the full chatbot-ready development stack.

Supabase still provides private storage and Postgres/pgvector data services. Django owns public chat orchestration, Redis-backed protection state, and server-only model settings in `backend/.env`.

## Django Backend Foundation

The Django backend lives under `backend/` and owns internal bootstrap, public chat orchestration, Redis-backed public-chat protection, and protected maintainer/admin work. The browser chat path defaults to `/api/chat`.

Clean-clone backend setup:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
cd ..
```

Fill `backend/.env` with server-only values from the local Supabase stack. Do not prefix Django secrets with `VITE_`, and do not import them from `src/`.

Backend checks and local service commands:

```bash
pnpm backend:lint
pnpm backend:format
pnpm backend:typecheck
pnpm backend:security
pnpm backend:check
pnpm backend:test
pnpm backend:dev
```

`pnpm backend:test` uses pytest with `pytest-django` and reads its Django settings from `backend/pyproject.toml`.
`pnpm backend:lint` and `pnpm backend:format` run Ruff, `pnpm backend:typecheck` runs MyPy with Django stubs, and `pnpm backend:security` runs `pip-audit` against `backend/requirements.txt`.

Local Redis is Docker-managed as a separate container from Supabase and binds only to `127.0.0.1:6379`:

```bash
pnpm redis:start
pnpm redis:status
pnpm redis:stop
```

Redis Insight is available as a separate Docker-managed admin UI:

```bash
pnpm redis:insight:start
pnpm redis:insight:status
pnpm redis:insight:stop
```

Open `http://127.0.0.1:5540` after it starts. When adding the local Redis database in Redis Insight, use host `global-governance-redis`, port `6379`, database `0`, and no username or password.

To start the same local Redis service, Supabase data services, Django service, and Vite frontend through the underlying Windows PowerShell stack helper:

```bash
pnpm dev:backend-stack
```

`pnpm local:dev` is the friendlier alias for this stack helper.

The startup path fails before serving Django if `backend/.env` is missing, required server-only values are absent, the Python runtime is unsupported, or local Redis/Supabase services are unavailable.

## Django Admin Auth Boundary

Protected maintainer calls use a Supabase Auth access token:

```bash
curl http://127.0.0.1:8000/api/admin/me `
  -H "Authorization: Bearer <supabase_access_token>"
```

`GET /api/admin/me` verifies the token against the configured Supabase issuer, audience, role, expiry, subject, email, and JWKS endpoint, then authorizes the maintainer against the backend-only `admin_profiles` table. The temporary `/_internal/admin/` route delegates to the same handler for compatibility.

Maintainer access is provisioned server-side only:

```bash
cd backend
python manage.py provision_admin grant --supabase-user-id <uuid> --email maintainer@example.com --role admin
python manage.py provision_admin update --supabase-user-id <uuid> --email maintainer@example.com --role viewer --inactive
python manage.py provision_admin revoke --supabase-user-id <uuid>
```

The learner-facing SPA and public chat remain login-free. Do not add admin links or privileged auth logic to `src/`; keep service-role credentials and `admin_profiles` mutations in Django or Supabase migrations.
