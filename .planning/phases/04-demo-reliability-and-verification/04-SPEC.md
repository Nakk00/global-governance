# Phase 4: Demo Reliability And Verification - Specification

**Created:** 2026-05-10
**Ambiguity score:** 0.19 (gate: <= 0.20)
**Requirements:** 4 locked

## Goal

The public learning experience stays usable on first load and through demo-time failures, while the project gains one repeatable pre-demo verification path that covers the frontend, Supabase functions, backend, and browser checks.

## Background

The repo already ships the main brownfield learner flow as a React + TypeScript Vite SPA. In `src/App.tsx`, the public narrative modules are imported eagerly, and only the private maintainer dashboard is wrapped in `React.lazy` and `Suspense`. The current browser coverage already splits into smoke, journey, layout, and live-chat lanes, and the repository scripts already expose frontend, Supabase, and backend checks. What is missing is a phase-level reliability contract that keeps the public path usable if optional heavy surfaces lag or fail, plus one documented pre-demo gate that tells maintainers exactly what to run and in what order.

The chat surface already has typed outcomes for answered, weak-support, refused, cooldown, and error states. The West Philippine Sea dossier already keeps working when a comparison state is unavailable. Those pieces show that failure handling exists in local pockets, but phase 4 is about making the overall brownfield demo path resilient and repeatable instead of leaving the team to assemble the verification order from memory.

## Requirements

1. **First render stays usable**: The public home route becomes interactive without waiting on optional heavy public modules or premium surfaces to finish loading.
   - Current: `src/App.tsx` eagerly imports `UNCommandCenter` and `WpsDossier`; the only lazy boundary is the private maintainer dashboard. The existing smoke and layout tests prove the journey works after load, but they do not protect first render against heavy optional public-module work.
   - Target: The hero, primary navigation, and journey-start content can render and accept input before optional heavy public modules finish loading.
   - Acceptance: A browser check that delays optional public-module loading still sees the hero heading, the "Begin the journey" link, and the Journey start region visible and focusable before those optional modules resolve.

2. **Core flow survives failures**: The learner can keep moving through the core course flow when chat or optional visual surfaces are unavailable.
   - Current: `SourceAwareChat` already turns runtime failures into typed error states, and `WpsDossier` already shows an unavailable comparison state without collapsing the dossier shell. There is no project-level reliability contract yet that says the overall course flow must stay usable when those surfaces fail.
   - Target: If chat fails or an optional visual surface cannot resolve, the learner can still continue the narrative, read recap cues, and inspect source and reference content.
   - Acceptance: A mocked chat failure and a missing optional surface still leave the narrative sections, section navigation, recap cues, and reference or source surfaces available with visible fallback copy instead of a crash or blank screen.

3. **Verification path is documented**: The project has one checked-in pre-demo verification path that covers the frontend, Supabase functions, backend, and browser checks in a repeatable order.
   - Current: The repo already exposes `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit`, `pnpm test:e2e`, `pnpm test:e2e:layout`, `pnpm test:chat:live`, `pnpm backend:test`, `pnpm backend:check`, `pnpm backend:lint`, `pnpm backend:typecheck`, and `pnpm backend:security`, and the Playwright suite already separates smoke, journey, layout, and live-chat intent. Those lanes exist, but the run order is implicit.
   - Target: One document or runbook names the exact command order for pre-demo verification across all supported runtimes.
   - Acceptance: A maintainer can follow the documented path from top to bottom without guessing the next command, and each step maps to a specific repo script or test lane.

4. **Local gates are repeatable**: The brownfield quality gate can be rerun locally to catch drift before demos or merges, even without a full hosted CI pipeline.
   - Current: The repo has multiple local checks, but no bundled brownfield gate that the team can run as a stable pre-demo habit.
   - Target: The phase defines a minimum repeatable quality gate that reduces integration drift and can be executed locally before release or presentation.
   - Acceptance: The gate is documented as a finite pass/fail checklist or command sequence, and rerunning it on the same commit produces the same outcome unless the code changes.

## Boundaries

**In scope:**
- Public-home first-render hardening for the learner route.
- Fallback behavior that keeps the core learning flow usable when chat or optional visual surfaces fail.
- One documented pre-demo verification path across frontend, Supabase functions, backend, and browser checks.
- A repeatable brownfield quality gate that the team can run locally before demos or merges.

**Out of scope:**
- New learner features or curriculum expansion - phase 4 is about reliability, not new content.
- Public chat ownership cutover to Django - that runtime change stays deferred to a future milestone.
- Public maintainer surface changes or auth model redesign - Phase 3 already owns the private maintainer experience.
- Full hosted CI platform buildout - phase 4 only codifies the local gates and closes the biggest verification gaps.

## Constraints

- Keep the learner experience as a React + TypeScript Vite SPA.
- Preserve reduced-motion behavior, keyboard access, and visible fallback states across the public flow.
- Do not make optional heavy modules a hard dependency for first render if a lighter path can satisfy the same user journey.
- The documented verification path must use the repo's existing frontend, Supabase function, backend, and browser scripts where possible.

## Acceptance Criteria

- [ ] The home route renders the hero and Journey start content without waiting on optional heavy public modules.
- [ ] The core course flow remains usable when chat or optional visual surfaces are unavailable.
- [ ] The repo contains a documented pre-demo verification path that spans frontend, functions, backend, and browser checks.
- [ ] The phase defines a repeatable local quality gate that can be rerun on the same commit and used before demos or merges.

## Ambiguity Report

| Dimension | Score | Min | Status | Notes |
|----------|-------|-----|--------|-------|
| Goal Clarity | 0.86 | 0.75 | OK | Phase goal is specific and maps to RELY-01 through RELY-04. |
| Boundary Clarity | 0.84 | 0.70 | OK | In-scope and out-of-scope work are clearly separated. |
| Constraint Clarity | 0.74 | 0.65 | OK | Existing scripts and SPA/runtime boundaries are known. |
| Acceptance Criteria | 0.77 | 0.70 | OK | Each requirement has a concrete pass/fail check. |
| **Ambiguity** | 0.19 | <=0.20 | OK | Below the gate threshold, so no interview rounds were needed. |

## Interview Log

| Round | Perspective | Question summary | Decision locked |
|-------|-------------|------------------|-----------------|
| auto | Auto-skip | Initial ambiguity already met the gate under `--auto` | Write the SPEC directly from the roadmap, requirements, and live codebase context. |

---

*Phase: 04-demo-reliability-and-verification*
*Spec created: 2026-05-10*
*Next step: $gsd-discuss-phase 4 - implementation decisions (how to build what's specified above)*
