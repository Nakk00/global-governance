# Phase 5: Admin UX Polish for Maintainers - Specification

**Created:** 2026-05-10
**Ambiguity score:** 0.14 (gate: <= 0.20)
**Requirements:** 6 locked

## Goal

The private maintainer console becomes a dark, mobile-capable control center that surfaces richer backend monitoring data, first-class `Audit Trail` and `Chatbot Trust` sections, and faster readiness actions.

## Background

Phase 5 implements `ADMIN-01` on top of the current brownfield maintainer shell. Today the repo already has a private, section-based dashboard with Overview, Sources, Validation, and Operations views, plus auth-gated backend endpoints and a DTO-shaped dashboard response. The existing surface is useful, but it is still closer to a thin readiness shell than a full control center. This phase extends that existing private shell instead of introducing a new router, a public admin product, or browser-only monitoring logic.

## Requirements

1. **Control-center overview**: The maintainer landing view becomes a multi-card control center that foregrounds readiness, blockers, validation health, and next actions.
   - Current: The private shell is section-based and readiness-oriented, but the top of the console still behaves like a thinner dashboard summary rather than a dense control center.
   - Target: The first view in Phase 5 presents separate cards for readiness, blockers, validation health, and next actions as the primary overview hierarchy.
   - Acceptance: A browser test can open the maintainer landing view and find distinct, labeled cards for readiness, blockers, validation health, and next actions.

2. **Richer monitoring contract**: The backend dashboard contract exposes canonical overview, audit, and trust aggregates for the maintainer console.
   - Current: `StewardshipDashboardDto` already carries overview, sources, ingestion runs, validation runs, and audit events, but the richer Phase 5 surfaces are not yet backed by a clearly richer monitoring contract.
   - Target: The Django maintainer data boundary provides explicit monitoring data for the overview cards, Audit Trail, and Chatbot Trust surfaces instead of requiring the browser to invent core metrics.
   - Acceptance: Backend and frontend contract tests can load the maintainer dashboard payload and verify that overview, audit, and trust data are present and consumable from the API shape.

3. **Audit Trail section**: `Audit Trail` becomes a first-class private navigation target with its own audit history view.
   - Current: Audit entries already exist in the dashboard and source detail flow, but maintainers do not have a dedicated Audit Trail destination.
   - Target: The maintainer shell exposes `Audit Trail` in the primary navigation and renders a dedicated audit history surface with drill-down into the relevant source or event detail.
   - Acceptance: A browser test can navigate to `Audit Trail` from the shell and verify that audit entries render without depending on the overview page.

4. **Chatbot Trust section**: `Chatbot Trust` becomes a first-class private navigation target with a dedicated trust summary and evidence view.
   - Current: Trust evidence is implied through validation and audit data, but there is no dedicated Chatbot Trust section in the maintainer console.
   - Target: The maintainer shell exposes `Chatbot Trust` in the primary navigation and renders trust summary information plus supporting evidence from backend data.
   - Acceptance: A browser test can navigate to `Chatbot Trust` and verify that trust metrics and supporting evidence render from the maintainer API.

5. **Branded dark shell**: The console uses the provided admin assets to reinforce a dark, presentation-safe control-center style.
   - Current: The existing shell does not yet use `Admin-Background.png` or `Admin-Logo.png` as part of the maintainer experience.
   - Target: The private shell uses the background image as atmospheric branding and the logo in the top-right brand area while keeping text and controls legible.
   - Acceptance: A screenshot or browser check can confirm both provided assets appear in the shell and the UI remains readable over the background.

6. **Mobile layout**: The maintainer console remains usable on mobile with compact navigation and stacked content blocks.
   - Current: The shell is primarily validated as a desktop-style dashboard, and the mobile layout strategy is not yet locked into the phase spec.
   - Target: On small screens, navigation collapses into a compact pattern and the overview/content sections stack into a single-column flow.
   - Acceptance: At a mobile viewport, the console shows no horizontal overflow, keeps navigation reachable, and preserves access to the main maintainer actions.

## Boundaries

**In scope:**
- Private maintainer control center overview and drill-down surfaces
- Backend shaping for overview, audit, and trust monitoring data
- First-class `Audit Trail` and `Chatbot Trust` navigation targets
- Dark branded shell using the provided background and logo assets
- Mobile responsive layout for the private console

**Out of scope:**
- Public admin discovery or a learner-facing admin view - the maintainer surface must remain private
- React Router, a global store, or a brand-new app shell - the existing SPA shell is sufficient for this phase
- Promoting `Settings` to first-class navigation in Phase 5 - the roadmap keeps it secondary
- Learner chat feature changes or simulator work - those belong to other phases or milestones

## Constraints

- The console must remain private, SPA-first, and anchor-navigation oriented.
- Rich monitoring data must remain backend-shaped and authoritative.
- `Settings` must remain secondary in the navigation hierarchy.
- `Admin-Background.png` and `Admin-Logo.png` are required visual references for the shell.
- Mobile layouts must preserve readability, keyboard access, and visible fallback states.

## Acceptance Criteria

- [ ] The maintainer landing view renders distinct readiness, blocker, validation-health, and next-action cards.
- [ ] The maintainer API and frontend contract expose backend-shaped overview, audit, and trust data without requiring browser-only synthesis of core metrics.
- [ ] `Audit Trail` is a first-class navigation target and renders dedicated audit history with drill-down.
- [ ] `Chatbot Trust` is a first-class navigation target and renders trust summary plus supporting evidence.
- [ ] The provided background and logo assets appear in the private shell and the interface remains legible over them.
- [ ] On a mobile viewport, navigation collapses to a compact pattern and the control center stacks vertically without horizontal scroll.

## Ambiguity Report

| Dimension           | Score | Min  | Status | Notes |
|--------------------|-------:|-----:|:------:|-------|
| Goal Clarity       | 0.92   | 0.75 | ✓      | Roadmap and requirements lock the control-center direction. |
| Boundary Clarity   | 0.86   | 0.70 | ✓      | Private boundary, first-class sections, and out-of-scope items are explicit. |
| Constraint Clarity | 0.82   | 0.65 | ✓      | Backend-shaped data, assets, SPA-first shell, and mobile support are specified. |
| Acceptance Criteria| 0.79   | 0.70 | ✓      | Phase checks map directly to visible sections and contract shapes. |
| **Ambiguity**      | 0.14   | <=0.20 | ✓    | Gate passed under `--auto`. |

## Interview Log

| Round | Perspective | Question summary | Decision locked |
|-------|-------------|------------------|-----------------|
| auto | auto-selected | No interview round was needed because `--auto` plus the roadmap and requirements already met the ambiguity gate | Proceeded directly to SPEC.md with the Phase 5 direction locked from the roadmap, requirements, context, and research |

---

*Phase: 05-admin-ux-polish-for-maintainers*
*Spec created: 2026-05-10*
*Next step: $gsd-discuss-phase 5 - implementation decisions (how to build what's specified above)*
