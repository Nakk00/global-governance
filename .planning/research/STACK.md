# Stack Research

## Current Brownfield Stack

- **Frontend**: React 19 + TypeScript + Vite 7 SPA in `src/`
- **UI foundation**: Tailwind CSS 4, shadcn/ui, Radix primitives, Motion, Lenis, selective Three.js / React Three Fiber
- **Public chat runtime**: Supabase Edge Functions in `supabase/functions/`
- **Protected maintainer boundary**: Django 5.2 in `backend/`
- **Auth and data platform**: Supabase Auth, Storage, Postgres, and pgvector
- **Protection layer**: in-memory by default with optional Redis-backed rate limiting and cooldown state
- **Testing**: Vitest + React Testing Library + MSW, Playwright, pytest, Ruff, MyPy, pip-audit

## Why This Stack Fits The Project

- The SPA-first frontend matches the narrative scrollytelling product shape and avoids routing complexity that the MVP does not need.
- Supabase Edge Functions already serve the live public chat path, so the near-term planning baseline should optimize that reality instead of forcing an early runtime migration.
- Django is a strong fit for protected maintainer orchestration, auth verification, validation workflows, and future service-role-heavy operations.
- The current testing split already mirrors the system boundaries: frontend UI logic, Supabase function behavior, Django admin behavior, and browser-level rehearsal.

## Current Stack Risks

- Planning artifacts still contain an older assumption that Django will own public chat soon, but the repo and tests say the cutover is deferred.
- Some learner-facing rich modules are still eager-loaded, which can pressure first-render performance as the site grows.
- Maintainer orchestration is concentrated in one very large React composite and oversized repository files, which raises refactor risk.

## Recommendations For The Next MVP Wave

- Keep the runtime boundary stable: learner chat remains on Supabase Edge Functions, maintainer ops remain on Django, and browser code stays free of privileged logic.
- Add depth-mode work through content modeling and thin session state first, not through broad architectural rewrites.
- Prefer verification and performance hardening over new infrastructure expansion until the brownfield MVP is demo-stable.
- Treat CI and full-stack rehearsal as product quality work, not as optional afterthoughts.

## Build-Order Implications

1. Add a shared depth-aware content model and session state seam in the SPA.
2. Thread that depth selection through flagship content and grounded chat context.
3. Harden trust/readiness surfaces and split fragile maintainer orchestration.
4. Finish with performance and verification tightening across the full stack.

---
*Written: 2026-05-06*
