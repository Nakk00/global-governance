# Phase 1: Depth-Aware Learning Foundation — Specification

**Created:** 2026-05-10
**Ambiguity score:** 0.17 (gate: ≤ 0.20)
**Requirements:** 4 locked

## Goal

Users can switch between Student and Expert explanation depth in the public learning shell, keep the chosen depth after a browser reload in the same browser, and have that depth shape the public narrative, recap copy, and chat context without breaking section navigation.

## Background

The current app is a section-based React + TypeScript SPA with session-local chapter navigation, section-specific recap cues, and chat starter prompts keyed to the current section. The navigation context only tracks the active section and completion state; there is no depth state, no visible Student/Expert control, and no shared depth-aware content contract today. The UN Command Center and West Philippine Sea dossier both render fixed copy sets, and the chat request payload only carries `currentSectionId`. This phase adds the first shared Student/Expert seam without turning the project into a global-store or architecture rewrite.

## Requirements

1. **Visible depth toggle**: The public shell exposes a visible Student/Expert toggle that updates a shared depth state used by the public learning experience.
   - Current: No depth control or depth state exists in `AppShell`, navigation, or the public narrative surfaces.
   - Target: A learner can choose Student or Expert from the public shell and that choice is available to the narrative, recap, and chat surfaces for the current browser session.
   - Acceptance: Clicking Student or Expert updates the visible control state without changing the current section hash or scroll position.

2. **Depth-aware public surfaces**: The core narrative, UN Command Center, West Philippine Sea dossier, and recap surfaces render depth-appropriate copy from a shared content contract.
   - Current: These surfaces render one fixed copy set with no Student/Expert variant selection.
   - Target: The public learning flow can render Student and Expert variants where they exist, while keeping section identity and chapter navigation stable.
   - Acceptance: A test render or fixture that provides both variants shows different Student and Expert copy for the same section without altering the active section or breaking layout.

3. **Chat depth context**: Chat starter prompts and the outgoing grounded-chat request carry the selected depth alongside the current section.
   - Current: Chat starter prompts vary by section, and the request payload only includes `currentSectionId`.
   - Target: The selected depth is included in the chat request context and can influence starter prompts without changing the existing answer composition path in this phase.
   - Acceptance: Submitting a chat question sends the selected depth in the request payload, and the starter prompt set reflects the active depth for the same section when a depth-specific catalog is available.

4. **Safe fallback behavior**: When a section, module, recap, or chat prompt set does not have an Expert variant, the app falls back to Student content and keeps the learning flow usable.
   - Current: There is no depth fallback path because no depth variants exist yet.
   - Target: Missing Expert content degrades to Student content instead of producing a broken, empty, or mixed-state surface.
   - Acceptance: Removing an Expert variant from one surface still renders readable Student content, preserves the current section, and does not show a broken state.

## Boundaries

**In scope:**
- A visible Student/Expert toggle in the public shell.
- A shared depth state seam that survives same-browser reloads.
- Depth-aware rendering for the core narrative, UN Command Center, West Philippine Sea dossier, and recap surfaces.
- Depth-aware chat starter prompts and chat request context.
- Student fallback behavior when an Expert variant is unavailable.

**Out of scope:**
- Changing grounded-chat answer wording or response generation logic in phase 1 - that remains on the existing answer path.
- Shareable-link or cross-device depth synchronization - same-browser reload persistence is the only persistence target for this phase.
- Broad global-store, router, or architecture refactors - the phase must stay focused on the depth seam.
- Maintainer, backend, or Supabase runtime changes - this phase is public learning only.
- Adding a third depth mode or other new audience tiers - the MVP scope is only Student and Expert.

## Constraints

- The solution must stay inside the existing React + TypeScript Vite SPA and browser-safe code under `src/`.
- Depth selection must remain stable across same-browser reloads without requiring a public account.
- Reduced motion, keyboard access, and visible fallback states must stay intact on the new toggle and all depth-aware surfaces.
- The phase must not depend on a global store migration or a backend cutover to deliver the depth seam.

## Acceptance Criteria

- [ ] The public shell renders a visible Student/Expert toggle.
- [ ] Switching depth leaves the current section and scroll position intact.
- [ ] Refreshing the page in the same browser preserves the selected depth.
- [ ] The core narrative, UN Command Center, West Philippine Sea dossier, and recap surfaces can render depth-specific copy without breaking navigation.
- [ ] Chat requests include the selected depth and starter prompts change when depth changes.
- [ ] Missing Expert content falls back to Student content with no broken or empty state.

## Ambiguity Report

| Dimension | Score | Min | Status | Notes |
|-----------|-------|-----|--------|-------|
| Goal Clarity | 0.91 | 0.75 | ✓ | Visible toggle, same-browser persistence, and in-scope surfaces are now explicit. |
| Boundary Clarity | 0.86 | 0.70 | ✓ | Public learning scope is locked; chat wording and architecture churn are out of scope. |
| Constraint Clarity | 0.74 | 0.65 | ✓ | SPA-only, same-browser persistence, and accessibility constraints are clear. |
| Acceptance Criteria | 0.76 | 0.70 | ✓ | Six pass/fail checks cover toggle, persistence, rendering, chat context, and fallback. |
| **Ambiguity** | 0.17 | ≤0.20 | ✓ | |

Status: ✓ = met minimum, ⚠ = below minimum (planner treats as assumption)

## Interview Log

| Round | Perspective | Question summary | Decision locked |
|-------|-------------|------------------|-----------------|
| 1 | Researcher | What should depth mode change in the public shell, which surfaces are in scope, and how should it persist? | Add a visible public-shell toggle; keep the scope on the core narrative, UN/WPS, and recap surfaces; persist the choice across same-browser reloads. |
| 2 | Simplifier | What is the smallest usable fallback and chat depth seam? | Fall back to Student copy when Expert content is missing; keep chat changes limited to starter prompts and request context. |
| 3 | Boundary Keeper | What must phase 1 not expand into? | Do not turn depth mode into a broad global-store or architecture refactor. |

---

*Phase: 01-depth-aware-learning-foundation*
*Spec created: 2026-05-10*
*Next step: $gsd-discuss-phase 1 - implementation decisions (how to build what's specified above)*
