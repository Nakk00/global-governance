# Technology Stack

**Analysis Date:** 2026-05-06

## Languages

**Primary:**
- TypeScript 5.9.x for the Vite SPA, Supabase Edge Functions, test support, and local scripts in `src/`, `supabase/functions/`, `tests/`, and `scripts/`.
- Python 3.12-3.14 for the Django backend in `backend/`.

**Secondary:**
- SQL for Supabase schema and policy changes in `supabase/migrations/`.
- CSS for Tailwind-driven styling in `src/index.css` and `src/styles/motion.css`.

## Runtime

**Environment:**
- Browser runtime for the learner-facing SPA mounted from `src/main.tsx`.
- Node.js runtime for Vite, Vitest, Playwright, and local project tooling driven by `package.json`.
- Deno runtime for Supabase Edge Functions in `supabase/functions/*/index.ts`.
- Python runtime for Django and pytest, constrained by `backend/pyproject.toml` to `>=3.12,<3.15`.

**Package Manager:**
- `pnpm` for frontend, Supabase, and browser test workflows.
- `pip`/virtualenv for backend Python dependencies under `backend/.venv`.
- Lockfiles: `pnpm-lock.yaml` is present; backend dependencies are pinned in `backend/requirements.txt`.

## Frameworks

**Core:**
- React 19 for the SPA UI in `src/`.
- Vite 7 for local dev server and production bundling via `vite.config.ts`.
- Django 5.2 for the protected backend boundary in `backend/`.
- Supabase CLI + Edge Functions for public chat, ingestion, and storage-adjacent workflows in `supabase/`.

**UI / Styling:**
- Tailwind CSS 4 through `@tailwindcss/vite`.
- shadcn/ui primitives in `src/components/ui/`.
- Radix UI primitives, `class-variance-authority`, and `tailwind-merge` for component composition.
- Motion, Lenis, and Three.js stack (`@react-three/fiber`, `@react-three/drei`, `three`) for richer presentation surfaces.

**Testing:**
- Vitest 4 + React Testing Library + MSW for frontend and Edge Function tests.
- Playwright 1.59 for browser coverage in `tests/e2e/`.
- Pytest 9 + `pytest-django` for backend coverage in `backend/tests/`.

**Build / Dev:**
- TypeScript compiler via `tsc`.
- ESLint 9 for TypeScript linting.
- Prettier 3 with `prettier-plugin-tailwindcss` for TS/TSX formatting.
- Ruff, MyPy, and `pip-audit` for backend linting, typing, and security checks.

## Key Dependencies

**Critical:**
- `react` / `react-dom` for the SPA shell and route-free page composition in `src/App.tsx`.
- `@playwright/test` for smoke, layout, journey, and live-chat browser lanes in `tests/e2e/`.
- `vitest`, `@testing-library/react`, and `msw` for fast mocked UI and function coverage.
- `Django` and `PyJWT` for protected maintainer routes and Supabase JWT verification in `backend/accounts/`.
- `supabase` CLI package for local function serving and database workflow scripts.

**Infrastructure:**
- `lucide-react` and `react-icons` for UI iconography.
- `@tailwindcss/vite`, `tailwindcss`, and `tw-animate-css` for styling infrastructure.
- `cryptography` and `PyJWT` for backend auth verification.

## Configuration

**Environment:**
- Browser-safe values live in `.env.example` as `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_CHAT_FUNCTION_URL`.
- Server-only Django values live in `backend/.env.example`, including `SUPABASE_SERVICE_ROLE_KEY`, JWT issuer/audience/JWKS settings, and optional `REDIS_URL`.
- Supabase local services are configured through `supabase/config.toml`.

**Build:**
- `vite.config.ts` sets the `@` alias to `src/`, proxies `/api` to Django, and constrains Vitest to `src/**/*.test.ts(x)`.
- `playwright.config.ts` builds the app, serves `pnpm preview`, and runs browser tests against `http://127.0.0.1:4173`.
- `backend/pyproject.toml` configures pytest, Ruff, and MyPy.

## Platform Requirements

**Development:**
- Cross-platform web stack overall, but several orchestrator scripts are PowerShell-first, especially `scripts/dev/backend-stack.ps1` and `scripts/dev/backend-python.ps1`.
- Local Supabase CLI installation is required for `pnpm supabase:*` commands.
- A Python virtual environment under `backend/.venv` is expected for backend checks and local run commands.

**Production / Deployment Shape:**
- The learner-facing app is built as a static SPA via Vite.
- Public chat and ingestion logic are designed around Supabase Edge Functions and Supabase storage/database services.
- Django is positioned as a protected orchestration/admin boundary rather than the public learner chat runtime.

---

*Stack analysis: 2026-05-06*
*Update after major dependency or runtime changes*
