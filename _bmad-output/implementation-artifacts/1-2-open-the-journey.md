# Story 1.2: Open the Journey

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student presenter,
I want the opening hero to clearly frame the topic and invite me to continue,
so that I immediately understand what this site is and how to begin.

## Acceptance Criteria

1. Given the site loads on first visit, when the hero appears, then it communicates Global Governance as the topic and signals that the experience is interactive, not a static report. The opening content is readable without requiring prior navigation.
2. Given I view the hero at 360 px, 480 px, 768 px, 1024 px, and large desktop widths, when the layout renders, then the title, subtitle, and primary call to action remain readable without horizontal scrolling or clipping. The primary action remains visually clear and reachable at each breakpoint.
3. Given I activate the primary call to action, when I continue, then the page moves to a stable in-page landing target within the same SPA without requiring a page reload. The target is a named, focusable landmark or section, such as `journey-start`, so focus or reading order lands on an announced destination and I can still understand how the opening relates to the rest of the site.
4. Given reduced motion is enabled, when the hero renders, then the opening experience still feels intentional and does not depend on nonessential looping motion or showcase animation. Any decorative motion has a static fallback and the hero remains understandable in reduced-motion mode.
5. Given I use keyboard only, when I tab to the primary call to action, then it receives a visible focus state and can be activated without a pointer device. The hero remains semantically understandable to assistive technology.

## Tasks / Subtasks

- [x] Replace the starter shell with the Story 1.2 opening hero (AC: 1, 2, 3, 4, 5)
  - [x] Add a typed hero copy module under `src/data/sections/hero-content.ts` so the eyebrow, headline, support text, CTA label, and continue target stay repo-managed and easy to review.
  - [x] Build a `HeroNarrativeFrame` composite under `src/components/sections/HeroNarrativeFrame.tsx` and render it from `src/App.tsx`.
  - [x] Keep the hero as a single-page landing surface, not a routed page or modal flow.
  - [x] Add a stable in-page landing target in the same shell, such as a `journey-start` anchor or section with an accessible heading and focus target, so the CTA has a real destination.
- [x] Wire the continue action to a stable in-page landing target (AC: 3)
  - [x] Use an anchor or scroll target within the same SPA so the CTA advances the user into the learning journey without a reload.
  - [x] Keep the target readable and context-preserving; move focus or reading order to the target after activation and do not introduce React Router or a global state dependency.
- [x] Make the hero responsive and motion-safe (AC: 2, 4)
  - [x] Preserve readable hierarchy at 360 px, 480 px, 768 px, 1024 px, and large desktop widths with no horizontal scrolling or clipped CTA text.
  - [x] Use Motion only if needed for a subtle entrance effect; any decorative animation must degrade cleanly in reduced-motion mode and remain optional to understanding the hero.
  - [x] Avoid GSAP and heavy media; this story should stay lightweight and fast on first paint.
- [x] Verify the landing experience stays within the project baseline (AC: 1-5)
  - [x] Keep semantics, focus states, and contrast aligned with the shared accessibility rules.
  - [x] Update `tests/e2e/home.spec.ts` so the smoke test asserts the new hero heading, CTA, and in-page continuation target instead of the starter-shell copy, and covers keyboard-only activation plus reduced-motion fallback.
  - [x] Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` after implementation, then confirm the hero CTA works in an end-to-end smoke pass.

### Review Findings

- [x] [Review][Patch] Add a visible focus state to the journey target [src/App.tsx:11]
- [x] [Review][Patch] Avoid duplicate CTA history entries and preserve cleaner hash navigation semantics [src/components/sections/HeroNarrativeFrame.tsx:31]
- [x] [Review][Patch] Do not mask horizontal overflow in CSS or assert the masking behavior in E2E coverage [src/index.css:126]
- [x] [Review][Patch] Activate the CTA under reduced-motion E2E coverage so the continuation path is covered in that mode [tests/e2e/home.spec.ts:28]

## Dev Notes

- Story 1.2 is the first user-visible experience after the starter scaffold from Story 1.1. Replace the neutral "Foundation ready" shell, but do not expand into the full section rail or narrative system yet.
- Use the simplified MVP version of the UX spec's Hero Narrative Frame. The future Living Globe Hero belongs to post-MVP work and should not be implemented here.
- Keep the site SPA-first and anchor-navigation oriented. The CTA should move to a named in-page target within the current page; do not add React Router, a global store, or backend work.
- Motion is the default animation system in this project, but the hero must remain understandable with nonessential motion removed. If any animation is used, keep it subtle and local to the hero, and ensure the static fallback still reads as an intentional opening frame.
- Preserve the current scaffold foundation:
  - `ThemeProvider` is already wired in `src/main.tsx`
  - shadcn/ui primitives already live under `src/components/ui`
  - `Button` is available for the primary CTA
  - the current app already has Vite, TypeScript, Tailwind, Motion, Lenis, and the other approved frontend dependencies installed
- Keep visible content in repo-managed data modules instead of hardcoding all copy inside component markup. The hero text should be easy to review and update later.
- Do not pull the full editorial design system into this story. Story 1.6 owns the site-wide color, typography, and surface treatment system; this story only needs a strong, readable opening frame.
- If a decorative atmospheric layer is added, hide it from assistive technologies and keep it presentational only.

### Project Structure Notes

- Likely files to touch:
  - `src/App.tsx`
  - `src/components/sections/HeroNarrativeFrame.tsx`
  - `src/data/sections/hero-content.ts`
  - `src/index.css` only if the hero needs minimal page-level spacing or background treatment
- Keep any new component in `src/components/sections/` rather than `src/components/ui/`.
- Keep hero copy out of component logic so Story 1.4 and later sections can follow the same content-module pattern.
- If a helper anchor is needed for the continue action, keep it inside the same landing shell and make it part of the SPA flow.

### References

- [Source: _bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md, Story 1.1 completion notes and file list]
- [Source: _bmad-output/planning-artifacts/epics.md, Story 1.2: Open the Journey]
- [Source: _bmad-output/planning-artifacts/epics.md, Story 1.3: Navigate the Story]
- [Source: _bmad-output/planning-artifacts/architecture.md, Hero Narrative Frame]
- [Source: _bmad-output/planning-artifacts/architecture.md, SPA routing strategy, performance optimization, and component boundaries]
- [Source: _bmad-output/planning-artifacts/architecture.md, Responsive Design & Accessibility]
- [Source: _bmad-output/planning-artifacts/architecture.md, Implementation Roadmap]
- [Source: _bmad-output/planning-artifacts/architecture.md, Requirements to Structure Mapping]
- [Source: _bmad-output/project-context.md, Technology Stack & Versions]
- [Source: _bmad-output/project-context.md, Critical Implementation Rules]
- [Source: _bmad-output/planning-artifacts/prd.md, FR1-FR4, FR8-FR12, FR18-FR22, NFR1-NFR5, NFR17-NFR21]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Experience Mechanics]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Hero Narrative Frame]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Scope Boundaries]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Requirements Traceability]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Responsive Design & Accessibility]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- GitNexus impact analysis for `App`: LOW risk, 0 impacted symbols/processes.
- Red phase: updated `tests/e2e/home.spec.ts`; initial run failed against the starter shell because the new hero heading was absent.
- Verification: `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e -- tests/e2e/home.spec.ts` passed.

### Implementation Plan

- Replace starter copy with a typed hero content module and a section-owned hero composite.
- Keep navigation in-page with a real `#journey-start` target and keyboard focus transfer.
- Use lightweight CSS/Tailwind treatment with reduced-motion fallback and no heavy media or GSAP.

### Completion Notes List

- Implemented the Story 1.2 opening hero with repo-managed copy, responsive layout, primary CTA, and presentational atmospheric styling hidden from assistive technology.
- Added a focusable `journey-start` section in the SPA shell and wired the CTA to update the hash, scroll in-page, and move focus without React Router or global state.
- Expanded the Playwright smoke coverage for hero heading/copy/CTA, keyboard activation, reduced motion, and no horizontal overflow at 360, 480, 768, 1024, and 1440 px widths.

### File List

- src/App.tsx
- src/components/sections/HeroNarrativeFrame.tsx
- src/data/sections/hero-content.ts
- src/index.css
- tests/e2e/home.spec.ts

### Change Log

- 2026-04-24: Implemented Story 1.2 hero journey opening and E2E smoke coverage.
