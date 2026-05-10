# Codebase Structure

**Analysis Date:** 2026-05-06

## Directory Layout

```text
global-governance/
|- src/                  # Vite SPA source: layout, sections, modules, chat, data, hooks, contexts
|- backend/              # Django protected admin/orchestration boundary
|- supabase/             # Edge Functions, SQL migrations, local Supabase config
|- tests/                # Playwright specs and shared frontend/browser test support
|- public/               # Static assets copied as-is by Vite
|- scripts/              # PowerShell and TypeScript local automation
|- docs/                 # Supporting design/mockup artifacts
|- graphify-out*/        # Generated graph reports and caches
|- _bmad-output/         # Planning and implementation artifacts
|- package.json          # Frontend/tooling manifest
|- vite.config.ts        # Vite, alias, proxy, and Vitest config
|- playwright.config.ts  # Browser automation config
`- AGENTS.md             # Repo-specific agent workflow rules
```

## Directory Purposes

**src/**
- Purpose: browser-facing application code only.
- Contains: React components, static course content, frontend API clients, contexts, hooks, and shared types.
- Key files: `src/main.tsx`, `src/App.tsx`, `src/lib/chat/api-client.ts`, `src/lib/maintainer/api.ts`
- Subdirectories: `components/`, `data/`, `lib/`, `contexts/`, `hooks/`, `styles/`, `types/`

**backend/**
- Purpose: Django backend for protected maintainer/admin work and future orchestration boundaries.
- Contains: Django apps, config, request guards, repositories, DTOs, and backend pytest coverage.
- Key files: `backend/manage.py`, `backend/config/urls.py`, `backend/accounts/auth.py`, `backend/sources/repository.py`, `backend/validation/repository.py`
- Subdirectories: `accounts/`, `common/`, `config/`, `sources/`, `validation/`, `tests/`

**supabase/**
- Purpose: Supabase local project config, Edge Functions, and SQL migrations.
- Contains: function entry points, `_shared` helpers, migration files, and Supabase config.
- Key files: `supabase/config.toml`, `supabase/functions/chat/index.ts`, `supabase/functions/_shared/chat-grounding.ts`
- Subdirectories: `functions/`, `migrations/`, `snippets/`

**tests/**
- Purpose: checked-in browser tests and shared support code outside `src/`.
- Contains: Playwright specs, MSW handlers, render helpers, and Vitest setup files.
- Key files: `tests/e2e/home-smoke.spec.ts`, `tests/e2e/chat-live.spec.ts`, `tests/support/msw/handlers.ts`, `tests/setup/vitest.setup.ts`
- Subdirectories: `e2e/`, `playwright/`, `setup/`, `support/`

**scripts/**
- Purpose: local automation and developer bootstrap helpers.
- Contains: PowerShell runtime launchers and TypeScript scripts for chatbot ingestion/validation.
- Key files: `scripts/dev/backend-stack.ps1`, `scripts/dev/backend-python.ps1`, `scripts/chatbot/prepare-ingestion.ts`

## Key File Locations

**Entry Points:**
- `src/main.tsx` - browser mount point for the learner SPA
- `src/App.tsx` - runtime split between public flow and `/maintainer`
- `backend/manage.py` - Django management entry
- `supabase/functions/chat/index.ts` - public chat function entry

**Configuration:**
- `package.json` - JS/TS scripts and dependency graph
- `vite.config.ts` - aliasing, proxying, and Vitest scope
- `playwright.config.ts` - Playwright execution settings
- `.env.example` - browser-safe env template
- `backend/.env.example` - server-only backend env template
- `backend/pyproject.toml` - pytest, Ruff, and MyPy config
- `supabase/config.toml` - local Supabase runtime config

**Core Logic:**
- `src/components/layout/` - shell and navigation chrome
- `src/components/modules/` - feature composites such as maintainer and interactive learning modules
- `src/data/sections/` - narrative content definitions
- `src/lib/chat/` - public chat request/response shaping
- `backend/sources/` - source stewardship endpoints and repositories
- `backend/validation/` - validation run APIs and repositories
- `supabase/functions/_shared/` - shared chat/ingestion server helpers

**Testing:**
- `src/**/*.test.ts(x)` - frontend unit/component tests
- `supabase/functions/tests/` - Edge Function Vitest coverage
- `backend/tests/` - Django/pytest coverage
- `tests/e2e/` - Playwright specs
- `tests/support/msw/` - shared MSW fixtures and handlers

**Documentation / Planning:**
- `README.md` - local setup and backend boundary notes
- `AGENTS.md` - agent operating contract
- `_bmad-output/planning-artifacts/` - product, architecture, and sprint docs
- `.planning/` - generated working docs such as this codebase map

## Naming Conventions

**Files:**
- `PascalCase.tsx` for React component files such as `AppShell.tsx` and `MaintainerDashboard.tsx`.
- lowercase or kebab-flavored `.ts` files for helpers and content modules such as `source-aware-chat.ts`, `approved-source-bundle.ts`, and `navigation-context.ts`.
- `*.test.ts` / `*.test.tsx` for unit and component tests, usually co-located under `src/`.
- `index.ts` or `index.tsx` reserved for entry points and Edge Function handlers.

**Directories:**
- feature-first directories under `src/components/`: `layout`, `sections`, `modules`, `chat`, `references`, `ui`
- backend Django apps use lowercase package names such as `accounts`, `sources`, `validation`
- Supabase functions are one folder per function under `supabase/functions/`

## Where to Add New Code

**New learner-facing UI feature:**
- Primary code: `src/components/sections/` or `src/components/modules/<Feature>/`
- Supporting content: `src/data/sections/` or `src/data/source-bundles/`
- Tests: co-located `src/**/*.test.tsx` and, only if browser confidence is needed, `tests/e2e/`

**New shared frontend helper:**
- Implementation: `src/lib/` or `src/hooks/`
- Shared types: `src/types/`
- Tests: co-located `*.test.ts`

**New protected maintainer API:**
- Route wiring: `backend/*/urls.py`
- Handler: `backend/*/views.py`
- Repository / DTO changes: `backend/*/repository.py` or `backend/*/dtos.py`
- Tests: `backend/tests/`

**New public server function:**
- Entry point: `supabase/functions/<function-name>/index.ts`
- Shared helpers: `supabase/functions/_shared/`
- Tests: `supabase/functions/tests/`

## Special Directories

**graphify-out*/, `src/graphify-out/`, `backend/graphify-out/`, `supabase/graphify-out/`:**
- Purpose: generated architecture graph outputs and caches
- Source: Graphify tooling
- Committed: mixed state in the current repo; treat as generated artifacts, not hand-authored source of truth

**_bmad-output/:**
- Purpose: planning, roadmap, implementation, and readiness artifacts
- Source: BMAD / planning workflows
- Committed: yes, as project context rather than runtime code

**backend/.venv and caches:**
- Purpose: local Python environment and tool caches
- Source: developer machine state
- Committed: should be treated as local/runtime artifacts even when present in the working tree

---

*Structure analysis: 2026-05-06*
*Update when directories, test locations, or boundary ownership changes*
