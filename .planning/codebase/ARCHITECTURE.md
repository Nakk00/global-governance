# Architecture

**Analysis Date:** 2026-05-06

## Pattern Overview

**Overall:** SPA-first educational frontend with split server boundaries.

**Key Characteristics:**
- The learner experience is a single-page React app with anchor/hash navigation instead of React Router.
- Public grounded chat is still served by Supabase Edge Functions, not Django.
- Django is intentionally reserved for protected maintainer/admin orchestration and future cutover work.
- Stable academic content is checked into `src/data/`, while operational source/validation workflows live behind protected APIs.

## Layers

**Presentation Layer:**
- Purpose: render the narrative learning journey, interactive modules, and maintainer console UI.
- Contains: `src/App.tsx`, `src/components/layout/*`, `src/components/sections/*`, `src/components/modules/*`, `src/components/chat/SourceAwareChat.tsx`
- Depends on: local data modules, thin contexts, frontend API clients, and UI primitives.
- Used by: browser runtime via `src/main.tsx`.

**Client State and Navigation Layer:**
- Purpose: coordinate active chapter state, hash navigation, and session-local UI behavior.
- Contains: `src/contexts/NavigationContext.tsx`, `src/hooks/useNavigation.ts`, `src/lib/supabase/browser-client.ts`
- Depends on: browser APIs such as `window.location`, `localStorage`, and scrolling/focus behavior.
- Used by: layout, section, chat, and maintainer components.

**Frontend Integration Layer:**
- Purpose: isolate network requests and response-envelope parsing from presentation code.
- Contains: `src/lib/chat/api-client.ts`, `src/lib/chat/grounded-answer.ts`, `src/lib/maintainer/api.ts`
- Depends on: browser `fetch`, typed DTOs in `src/types/`, and backend/Edge Function response contracts.
- Used by: `SourceAwareChat`, `MaintainerDashboard`, and related tests.

**Supabase Edge Function Layer:**
- Purpose: serve public grounded chat and ingestion pipelines with server-only config.
- Contains: `supabase/functions/chat/index.ts`, `chat-retrieve/index.ts`, `ingest-content/index.ts`, `ingest-pdf/index.ts`, plus shared helpers in `supabase/functions/_shared/`
- Depends on: Deno runtime, service-role env vars, approved source bundle mirrors, and optional Redis for protection storage.
- Used by: learner-facing chat and ingestion workflows.

**Protected Django Boundary:**
- Purpose: expose authenticated maintainer APIs and future orchestration seams while keeping service-role logic off the frontend.
- Contains: `backend/config/api.py`, `backend/accounts/*`, `backend/sources/*`, `backend/validation/*`, `backend/common/*`
- Depends on: Django request handling, Supabase JWT verification, and repository calls to Supabase REST/RPC endpoints.
- Used by: maintainer frontend requests proxied through `/api/*`.

**Repository / DTO Layer:**
- Purpose: encapsulate Supabase-backed admin data access and normalize response payloads.
- Contains: `backend/sources/repository.py`, `backend/validation/repository.py`, `backend/accounts/services.py`, DTO modules such as `backend/sources/dtos.py` and `backend/validation/dtos.py`
- Depends on: service-role credentials and backend validation helpers.
- Used by: Django view functions.

## Data Flow

**Learner Narrative Flow:**
1. `src/main.tsx` mounts the app and wraps it in `ThemeProvider`.
2. `src/App.tsx` chooses between the public narrative SPA and the lazy maintainer dashboard based on `window.location.pathname`.
3. `AppShell` and `NavigationProvider` coordinate hash-based chapter navigation and progress state.
4. Narrative sections render from static content modules in `src/data/sections/*`.
5. Optional interactive modules such as `UNCommandCenter` and `WpsDossier` enrich specific sections without changing the SPA-first structure.

**Public Chat Flow:**
1. `src/components/chat/SourceAwareChat.tsx` gathers the learner question and current section context.
2. `src/lib/chat/api-client.ts` builds the request envelope and adds an anonymous session header.
3. `supabase/functions/chat/index.ts` validates the request, runs protection checks, and decides allowed/refused/cooldown behavior.
4. Shared grounding helpers retrieve approved sources and assemble a typed answer envelope.
5. The frontend renders answered, weak-support, refusal, or cooldown states inline.

**Maintainer Flow:**
1. Visiting `/maintainer` lazily loads `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`.
2. `src/lib/supabase/browser-client.ts` stores a Supabase access token in browser storage after password sign-in.
3. `src/lib/maintainer/api.ts` calls Django `/api/admin/*` endpoints through the Vite `/api` proxy.
4. Django view functions validate method/body/auth, then call repository/service methods.
5. Repository classes query Supabase-backed admin data and return envelope-safe DTOs to the frontend.

**State Management:**
- Public learner state is local-component-state first, with thin React context for navigation only.
- Maintainer auth is session-local browser storage plus server verification on each protected request.
- Edge Function protection state is in-memory by default and optionally Redis-backed.

## Key Abstractions

**Content Module:**
- Purpose: encode stable course copy and section metadata as typed source files.
- Examples: `src/data/sections/core-narrative.ts`, `src/data/sections/un-command-center.ts`, `src/data/source-bundles/approved-source-bundle.ts`
- Pattern: content-as-code with typed exports.

**Shell + Feature Module:**
- Purpose: keep learner-facing composites organized by feature boundary.
- Examples: `src/components/layout/AppShell.tsx`, `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`, `src/components/modules/WpsDossier/WpsDossier.tsx`
- Pattern: composite React components backed by smaller section/UI pieces.

**API Envelope:**
- Purpose: normalize success/error handling across frontend, Edge Functions, and Django.
- Examples: `src/lib/chat/grounded-answer.ts`, `src/lib/maintainer/api.ts`, `backend/common/responses.py`
- Pattern: typed success/error envelopes instead of transport-only error signaling.

**Repository:**
- Purpose: isolate Supabase-backed data access for protected operations.
- Examples: `SupabaseStewardshipRepository` in `backend/sources/repository.py`, validation repositories in `backend/validation/repository.py`, profile repository logic in `backend/accounts/services.py`
- Pattern: repository + DTO translation, with in-memory doubles appearing in tests.

## Entry Points

**Frontend SPA Entry:**
- Location: `src/main.tsx`
- Triggers: browser load of the Vite application
- Responsibilities: mount React, theme provider, global styles

**Frontend Route Split:**
- Location: `src/App.tsx`
- Triggers: current `window.location.pathname`
- Responsibilities: choose public narrative flow vs. lazy maintainer console

**Django Entry:**
- Location: `backend/manage.py`
- Triggers: `pnpm backend:*`, direct `manage.py`, or `scripts/dev/backend-stack.ps1`
- Responsibilities: load `.env`, run preflight checks, and start Django management commands

**Supabase Edge Function Entries:**
- Location: `supabase/functions/*/index.ts`
- Triggers: HTTP requests served by Supabase CLI or hosted Edge Functions
- Responsibilities: chat handling, retrieval packaging, and ingestion request orchestration

## Error Handling

**Strategy:** fail safely at boundaries and return typed envelopes wherever possible.

**Patterns:**
- Frontend chat converts transport failures into a user-safe fallback error in `src/lib/chat/api-client.ts`.
- Django uses `error_response`, `success_response`, and request-validation helpers from `backend/common/*`.
- Edge Functions explicitly return method/validation/grounding errors instead of leaking raw exceptions.
- Tests assert contract-level error codes rather than implementation details.

## Cross-Cutting Concerns

**Validation:**
- Frontend request/response parsing is centralized in `src/lib/chat/grounded-answer.ts` and `src/lib/maintainer/api.ts`.
- Django request guards live in `backend/common/validation.py` and route handlers.
- Edge Function request validation lives in `supabase/functions/_shared/ingestion-request-validation.ts` and chat entry points.

**Authentication:**
- Public learner surfaces remain anonymous.
- Maintainer identity flows through Supabase Auth tokens verified in `backend/accounts/auth.py`.

**Reduced Motion / Accessibility:**
- The codebase preserves reduced-motion awareness through styling and interaction choices in `src/styles/motion.css`, UI components, and the anchored section flow.

**Testing as Architecture Guardrail:**
- Frontend unit tests, Supabase function tests, Django tests, and Playwright coverage are intentionally split by boundary to keep the SPA/chat/admin seams explicit.

---

*Architecture analysis: 2026-05-06*
*Update when major boundary or layering decisions change*
