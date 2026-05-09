# Story 1.1: Set Up Initial Project from Starter Template

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to initialize the project from the approved starter template,
so that the learning journey begins from the documented Vite, TypeScript, Tailwind, and shadcn/ui foundation.

## Acceptance Criteria

1. Given a clean clone of the repository, when I run the approved starter-template setup path, then the frontend project is scaffolded from the documented starter approach, and the base app starts from the correct React + Vite + TypeScript foundation.
2. Given the starter setup is complete, when I inspect the project structure, then the shared UI primitives, feature folders, and environment conventions follow the documented architecture, and the setup is aligned with the approved implementation direction.
3. Given the starter setup is complete, when I inspect the app boundary and helper folders, then browser-facing code remains separated from Edge Function helpers, and no privileged retrieval or Redis logic is exposed directly to the frontend.
4. Given the project depends on approved frontend libraries, when I install the dependencies, then Motion, Lenis, shadcn/ui, React Icons, React Three Fiber, and the other documented frontend dependencies are available in the project, and the project can run locally without manual code changes to the starter foundation.
5. Given the foundation is ready, when I start the development server, then the app renders successfully and the baseline configuration supports later feature work, and the setup does not require future stories to fix the starter scaffold.

## Tasks / Subtasks

- [x] Scaffold the approved frontend starter (AC: 1, 2, 5)
  - [x] Run `pnpm dlx shadcn@latest init -t vite` from the repository root.
  - [x] Keep the generated app on the React + Vite + TypeScript path.
  - [x] Remove default demo boilerplate that is not part of the product.
  - [x] Confirm the generated config works before adding any feature code.

- [x] Normalize the project boundaries and folder skeleton (AC: 2, 3)
  - [x] Create or verify `src/components/ui`, `src/components/layout`, `src/components/sections`, `src/components/modules`, `src/components/chat`, and `src/components/references`.
  - [x] Create or verify `src/data`, `src/lib`, `src/hooks`, `src/contexts`, and `src/types`.
  - [x] Create or reserve `src/styles` for future motion and global style helpers.
  - [x] Create or verify `supabase/migrations`, `supabase/functions/_shared`, and `supabase/functions/tests`.
  - [x] Keep browser-facing code out of `supabase/` and keep privileged helpers out of `src/`.

- [x] Install and align the approved frontend dependencies (AC: 4)
  - [x] Add `motion`, `lenis`, `react-icons`, `three`, `@react-three/fiber`, and `@react-three/drei` if the scaffold does not already include them.
  - [x] Keep shadcn/ui primitives in `src/components/ui` and make sure the `@/*` alias resolves cleanly.
  - [x] Normalize the shadcn `cn` helper to the project convention if the scaffold uses a different filename.

- [x] Lock the environment and config conventions (AC: 2, 3, 5)
  - [x] Ensure `vite.config.ts`, `tsconfig.json`, and `tsconfig.app.json` support the `@/*` alias and the current shadcn Vite setup.
  - [x] Add `.env.example` with clearly separated browser-safe and server-only placeholders.
  - [x] Keep root config files at the repository root and Supabase config under `supabase/`.
  - [x] Add or verify lint and format scripts if the starter does not provide them.

- [x] Verify the base app boots cleanly (AC: 1, 5)
  - [x] Run the dev server and confirm the app renders without unresolved imports or TypeScript errors.
  - [x] Run the build and any scaffolded lint/format checks that are present.
  - [x] Leave the app in a neutral baseline state ready for later narrative sections.

## Dev Notes

- This story is the first code-bearing implementation step. The workspace currently contains planning artifacts only; there is no app scaffold yet.
- Treat this as a scaffold-and-boundaries story, not a feature story. Do not add hero content, navigation, chat, UN modules, case study logic, or Supabase business logic here.
- The approved starter path is `pnpm dlx shadcn@latest init -t vite`. Do not substitute a different framework or a router-based scaffold.
- Current shadcn Vite docs center the Vite template, CSS-variable-based theming, and the `@/*` alias setup. Keep the generated path instead of backporting older Tailwind patterns.
- Current Vite docs require Node `20.19+` or `22.12+`. Motion requires React `18.2+`. Use a compatible runtime and do not downgrade below those baselines.
- The architecture expects a themeable Tailwind + shadcn foundation with custom composites added later. Keep `src/components/ui` limited to primitives and reserve feature-owned folders for later epics.
- Keep the frontend as a single-page app. Do not add React Router, a global store, or any public maintainer dashboard.
- Keep repo-managed presentation content separate from Supabase-managed chatbot knowledge. No browser code should talk directly to privileged retrieval or Redis logic.
- Match the documented file organization:
  - frontend feature folders under `src/components/*`
  - deterministic content under `src/data`
  - shared helpers under `src/lib`
  - server-only helpers under `supabase/functions/_shared`
  - migrations under `supabase/migrations`
- If the starter generates default helper names that conflict with the architecture, normalize them now rather than carrying a mismatch into later stories.

### Project Structure Notes

- The first implementation should create the app manifest and source tree from scratch, then normalize it to the architecture tree.
- Preserve the `@` import alias so future feature modules can use `@/components/ui/*`, `@/lib/*`, and `@/data/*` imports consistently.
- Keep `src/App.tsx` and `src/main.tsx` minimal; later stories will replace the neutral shell with the learning journey.
- If empty directories need to stay in source control, use placeholder files only where necessary and keep them out of the app runtime.
- Reserve `src/styles/motion.css` for the future motion system if the scaffold does not create it automatically.
- Do not mix chatbot corpus files or Supabase Storage assets into the public frontend asset path.

### Testing Standards

- For this story, the right validation is a clean bootstrap smoke test, not a broad test suite.
- Verify the dev server, production build, and any scaffolded lint/format checks that the starter supplies.
- Do not introduce feature tests, retrieval tests, or chatbot tests yet; those belong in later stories once the app shape stabilizes.

### References

- [Source: _bmad-output/planning-artifacts/epics.md, Epic 1: Guided Learning Journey, Story 1.1 and Implementation Enablement Notes]
- [Source: _bmad-output/planning-artifacts/architecture.md, Starter Template Evaluation]
- [Source: _bmad-output/planning-artifacts/architecture.md, Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md, File Organization Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md, Development Workflow Integration]
- [Source: _bmad-output/project-context.md, Technology Stack & Versions]
- [Source: _bmad-output/project-context.md, Critical Implementation Rules]
- [Source: _bmad-output/project-context.md, Development Workflow Rules]
- [Source: _bmad-output/project-context.md, Critical Don't-Miss Rules]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Design System Choice and Implementation Approach]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Typography System and Spacing & Layout Foundation]
- [Source: archive/docs/planning-artifacts/global_governance_version_c_build_roadmap.md, Phase 1 - Project Foundation]
- [Source: https://ui.shadcn.com/docs/installation/vite]
- [Source: https://vite.dev/guide/]
- [Source: https://motion.dev/docs/react-installation]
- [Source: https://github.com/darkroomengineering/lenis]
- [Source: https://r3f.docs.pmnd.rs/getting-started/installation]

## Dev Agent Record

### Agent Model Used

GPT-5.4

### Debug Log References

- `pnpm dlx shadcn@latest init -t vite --no-monorepo --base radix --preset nova --css-variables -n global-governance`
- `pnpm add motion lenis react-icons three @react-three/fiber @react-three/drei`
- `pnpm format`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `Invoke-WebRequest http://localhost:5173` returned HTTP 200

### Completion Notes List

- Scaffolded the approved shadcn Vite starter, then lifted the generated app into the repository root so root config files match the story requirements.
- Removed generated Vite demo assets and left a neutral baseline app shell only.
- Created the expected frontend, shared helper, context, style, and Supabase boundary folders with placeholders where needed.
- Added approved frontend dependencies and preserved shadcn/ui primitives under `src/components/ui`.
- Added `.env.example` with browser-safe `VITE_` values separated from server-only placeholders.
- Verified format, lint, typecheck, production build, and dev-server HTTP response.

### File List

- .env.example
- .gitignore
- .prettierignore
- .prettierrc
- README.md
- components.json
- eslint.config.js
- index.html
- package.json
- pnpm-lock.yaml
- src/App.tsx
- src/components/chat/.gitkeep
- src/components/layout/.gitkeep
- src/components/modules/.gitkeep
- src/components/references/.gitkeep
- src/components/sections/.gitkeep
- src/components/ui/button.tsx
- src/contexts/theme-provider.tsx
- src/data/.gitkeep
- src/hooks/.gitkeep
- src/index.css
- src/lib/utils.ts
- src/main.tsx
- src/styles/motion.css
- src/types/.gitkeep
- supabase/functions/_shared/.gitkeep
- supabase/functions/tests/.gitkeep
- supabase/migrations/.gitkeep
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- vite.config.ts
- Removed generated demo asset: public/vite.svg
- Removed generated demo asset: src/assets/react.svg

### Change Log

- 2026-04-24: Implemented initial React + Vite + TypeScript + Tailwind + shadcn/ui scaffold and project boundary skeleton for Story 1.1.
