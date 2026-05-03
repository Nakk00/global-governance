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

## Local Supabase Chat

The source-aware chat calls the local Supabase Edge Function through:

```txt
VITE_CHAT_FUNCTION_URL=http://127.0.0.1:54321/functions/v1/chat
```

Run the local stack and function server in separate terminals:

```bash
pnpm supabase:start
pnpm supabase:functions:chat
pnpm dev
```

`supabase:functions:chat` serves the public demo chat function with JWT verification disabled, while server-only model settings stay in `.env.local`.

## Django Backend Foundation

The Django backend lives under `backend/` and is reserved for internal bootstrap, future chat orchestration, and protected maintainer/admin work. The browser chat path still defaults to the Supabase Edge Function at `functions/v1/chat`; public Django chat cutover is intentionally deferred.

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
pnpm backend:check
pnpm backend:test
pnpm backend:dev
```

`pnpm backend:test` uses pytest with `pytest-django` and reads its Django settings from `backend/pyproject.toml`.

To start the local Supabase stack, Supabase chat Edge Function, Django service, and Vite frontend through one explicit command path on Windows PowerShell:

```bash
pnpm dev:backend-stack
```

The startup path fails before serving Django if `backend/.env` is missing, required server-only values are absent, the Python runtime is unsupported, or local Supabase is unavailable.

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
