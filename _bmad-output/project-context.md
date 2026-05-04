---
project_name: 'Global-Governance'
user_name: 'Nakko'
date: '2026-04-24'
last_edited: '2026-05-02'
sections_completed: ['technology_stack', 'language_specific_rules', 'framework_specific_rules', 'testing_rules', 'code_quality_style_rules', 'development_workflow_rules', 'critical_dont_miss_rules']
status: 'complete'
rule_count: 77
optimized_for_llm: true
existing_patterns_found: 12
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- React + TypeScript SPA foundation.
- Vite 8-generation toolchain; approved starter path is `pnpm dlx shadcn@latest init -t vite`.
- Tailwind CSS and shadcn/ui for accessible UI primitives.
- Motion as the default animation system, Lenis for scroll feel, and GSAP only for isolated showcase scenes.
- React Three Fiber and `@react-three/drei` for selective 3D or premium presentation moments.
- Vercel for frontend hosting and preview deployments.
- Django as the backend orchestration layer for chat, retrieval, validation, admin operations, and privileged source stewardship.
- Supabase for Auth, Storage, Postgres + pgvector, and CLI-driven local data workflows.
- Redis as a server-side protection layer for public-chat rate limiting, abuse counters, and cooldowns.
- `pnpm` as the documented package runner.
- Do not assume Next.js as the baseline. The documented architecture is React + Vite SPA-first.

## Critical Implementation Rules

### Language-Specific Rules

- Use TypeScript for app code, shared utilities, and API contracts; avoid `any` unless a boundary is truly unavoidable.
- Treat runtime schema validation as mandatory at API, ingestion, and citation boundaries; TypeScript types alone are not enough for untrusted input.
- Use `PascalCase` for exported types and class-like constructs, and `camelCase` for functions, hooks, variables, and object fields.
- Keep JSON payloads, query parameters, and API field names in `camelCase`; use ISO 8601 strings for date and time values.
- Use explicit discriminated unions for async states such as `idle`, `loading`, `success`, `weakSupport`, `refused`, and `error`.
- Keep error objects structured with stable codes and user-safe messages; do not expose raw stack traces in app responses.
- Do not expose database naming directly in frontend contracts when a cleaner API DTO exists.
- Keep field shapes stable across endpoints; do not reuse the same field name with different data shapes.

### Framework-Specific Rules

- Use React function components and hooks; do not introduce class components.
- Keep state local by default. Use thin context only for cross-cutting concerns such as navigation, reduced motion, chat panel state, and future depth-mode toggles.
- Organize the frontend by feature boundary first: `layout`, `sections`, `modules`, `chat`, `references`, `ui`.
- Keep shadcn/ui primitives in `src/components/ui` only; build flagship composites in feature-owned folders.
- Use a single-page anchor-navigation architecture in the MVP; do not add React Router unless the product grows into separate page flows.
- Lazy-load heavy or optional code paths, including hero 3D assets, chatbot logic, and showcase animation scenes.
- Keep Motion as the default animation system, Lenis for scroll feel, and GSAP only for rare isolated sequences that truly need it.
- Preserve reduced-motion, keyboard access, and visible loading or fallback states across every interactive module.
- Keep chat presentation components free of privileged retrieval, service-role, or data-mutation logic.
- Keep non-chat content interactive if chat is loading, rate-limited, or failing.

### Testing Rules

- Keep frontend unit and component tests co-located as `*.test.ts` or `*.test.tsx`.
- Keep Django backend tests under `backend/tests` when applicable.
- Put end-to-end or smoke scripts in a dedicated top-level testing area, not inside content folders.
- Test the shared API envelope and typed async states, especially `idle`, `loading`, `success`, `weakSupport`, `refused`, and `error`.
- Cover chat-specific behavior explicitly: grounded answers, off-topic refusal, weak-support fallback, and rate-limit or cooldown states.
- Cover ingestion determinism and supported file-type handling for approved-source workflows.
- Include accessibility, reduced-motion, and responsive checks for the main learning flow and flagship modules.
- Prefer behavior and state assertions over brittle visual snapshots for motion-heavy sections.
- Keep test fixtures and mocks aligned with the repo-managed content and Supabase-managed data split.
- The exact frontend test runner is still TBD; use whatever the scaffold selects, but keep the placement and coverage rules stable.

### Code Quality & Style Rules

- Use `PascalCase` for React components, TypeScript types, and class-like constructs.
- Use `camelCase` for functions, hooks, variables, and object fields.
- Use `kebab-case` for file and folder names by default; component files may mirror exported component names when that keeps names readable.
- Prefer `PascalCase.tsx` for component files, `useThing.ts` for hooks, and `kebab-case.ts` for utilities and content/config files.
- Keep acronym formatting readable and stable, such as `UNCommandCenter.tsx` and `WpsDossierSection.tsx`.
- Organize frontend code by feature boundary first, then shared layer: `layout`, `sections`, `modules`, `chat`, `references`, `ui`.
- Keep shared UI primitives from shadcn/ui only in `src/components/ui`.
- Keep flagship composites in feature folders, not in `ui`.
- Keep source content definitions in `src/data`, not scattered inside components.
- Put shared helpers in `src/lib`; put server-only backend helpers in `backend/common`.
- Store database migrations only under `supabase/migrations`.
- Store Django backend code only under `backend/`.
- Keep Supabase project configuration and storage support material under `supabase/`.
- Keep static public assets under `public/`, and isolate heavy media or 3D assets so they can be lazy-loaded by feature modules.
- Check new architecture-relevant files against this document before merge and correct pattern violations in the active change instead of deferring them.

### Development Workflow Rules

- Use the approved starter path first: `pnpm dlx shadcn@latest init -t vite`.
- Treat frontend development as a Vite workflow and local backend/data work as a Django plus Supabase workflow.
- Keep the frontend app, Django backend, and Supabase migrations deployed independently.
- Use reviewed frontend deployments, reviewed Django deployments, and reviewed Supabase migrations instead of ad hoc dashboard edits.
- Keep browser-safe public variables separate from frontend build-time variables, server-only secrets, and local development secrets.
- Keep `.env` conventions aligned with Vercel, Django, and Supabase workflows.
- Use Vercel preview deployments and runtime visibility for frontend delivery checks.
- Use Django and Supabase logs for chat, database, auth, and ingestion debugging.
- Keep maintainer actions in protected Django admin flows plus local scripts; do not add a public maintainer dashboard in the learner-facing MVP path.
- Keep the architecture modular, but do not split the MVP into microservices.
- Treat clean-clone reproducibility as a requirement for the chatbot-related workflow and setup path.

### Critical Don't-Miss Rules

- Keep repo-managed presentation content separate from Supabase-managed chatbot knowledge data; never write chatbot corpus data from browser code.
- Keep privileged retrieval, service-role access, ingestion, citation packaging, and maintainer-only source mutations inside Django; frontend chat code may only format requests and parse responses.
- Treat the admin side as a private source-stewardship and demo-readiness console, not a CMS, learner dashboard, LMS, analytics portal, simulator control panel, or general AI playground.
- Keep admin routes under a clearly private route family such as `/maintainer/*`; never link them from public learner navigation.
- Admin browser code may call protected Django endpoints after maintainer auth, but it must never mutate Supabase Storage, retrieval tables, chunk tables, citation tables, validation records, or audit logs directly.
- Uploaded sources should not auto-activate for retrieval; they should pass review, ingestion, validation, and explicit activation.
- Dangerous source actions such as activate, disable, archive, ingest, and re-ingest should create audit records.
- Treat off-topic refusal, weak-support, and cooldown states as typed successful responses, not transport failures; use the shared response envelope consistently.
- Keep the core learning flow usable when chat, premium visuals, or showcase scenes fail; non-chat content must remain interactive.
- Keep `shadcn/ui` primitives in the shared UI layer and feature composites in feature-owned folders; do not mix the two.
- Preserve the documented naming and folder conventions exactly; do not mix `snake_case`, `camelCase`, and `PascalCase` for the same kind of artifact.
- Do not introduce a global store, React Router, or a public maintainer dashboard in the learner-facing MVP unless the architecture is explicitly updated first.
- Keep Redis server-side only and never use it as the source of truth for documents, chunks, embeddings, or citations.
- Do not broadly cache grounded chat answers in the MVP; citation integrity matters more than cache hit rate.
- Keep reduced-motion behavior and lazy-loading intact from the start; GSAP scenes and heavy media must stay isolated or optional.
- Never surface raw stack traces, mixed error formats, or inconsistent loading states in the UI.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow all rules exactly as documented.
- When in doubt, prefer the more restrictive option.
- Update this file if new patterns emerge.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update it when the technology stack changes.
- Review it quarterly for outdated rules.
- Remove rules that become obvious over time.

Last Updated: 2026-05-02
