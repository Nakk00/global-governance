# Phase 3: Maintainer Readiness Hardening - Specification

**Created:** 2026-05-10
**Ambiguity score:** 0.10 (gate: <= 0.20)
**Requirements:** 3 locked

## Goal

The private maintainer surface becomes a readiness-first console with workflow-health summaries, source-first drill-downs, and thin shell boundaries that make the stewardship and validation seams safer to extend.

## Background

The brownfield repo already has a private maintainer SPA and protected Django admin APIs, but before this phase the maintainer experience was still concentrated in a large dashboard implementation that owned auth bootstrap, route parsing, overview, source detail, validation, operations, and helper logic in one place. The backend stewardship and validation modules exposed the right data, but readiness shaping still sat too close to persistence and view orchestration.

This phase does not change the private boundary or the core admin contracts. It clarifies the maintainer journey so the overview reads as a health summary, readiness findings lead to source detail first, and the codebase gains smaller page-owned and service-owned seams for future changes.

## Requirements

1. **Readiness-first overview**: The maintainer overview presents Sources, Validation, and Audit/Operations as health-summary entry points instead of generic section links.
   - Current: The private dashboard shows the maintainer workflow, but the overview is not yet guaranteed to be a health-summary-first entry point with workflow cards, status signals, and filtered drill-downs.
   - Target: The overview shows three workflow cards with visible status and key metrics, and each card opens a filtered drill-down that keeps readiness context intact.
   - Acceptance: The overview renders all three workflow cards, each card includes a visible status/metric summary, and selecting a card preserves the readiness preset while showing recent context inline.

2. **Source-first drill-down**: A readiness finding opens source detail first, with the current blocking issue shown before broader source context and validation evidence summarized inline.
   - Current: Readiness follow-ups can reach source detail, but the blocker-first investigative path and inline validation summary are not yet locked as the default flow.
   - Target: When a maintainer selects a readiness finding, source detail is the first destination, the current blocker is shown before deeper history, and validation evidence is available inline with a deeper inspection path.
   - Acceptance: Choosing a readiness finding shows the blocker in source detail before history or deeper inspection, and any validation follow-up remains tied to the same source context.

3. **Thin shell and service-shaped seams**: The maintainer shell and backend readiness code stop carrying too much orchestration in one layer.
   - Current: The private shell and backend stewardship/validation layers still concentrate page orchestration and readiness shaping too heavily in the same ownership boundaries.
   - Target: `MaintainerDashboard.tsx` owns auth, navigation, and a small shared readiness context; page-owned modules own overview, source detail, validation, and operations state; backend services shape readiness contracts above narrow repositories.
   - Acceptance: Shell-level code no longer owns page-specific async orchestration, the page modules remain the stable entry points for overview/source/validation/operations, and the stewardship and validation integration tests continue to pass through service delegation.

## Boundaries

**In scope:**
- Readiness overview cards and filtered drill-downs
- Source-first investigation with inline validation evidence
- Private shell decomposition into page-owned modules and focused hooks
- Backend service-layer shaping for stewardship and validation
- Frontend and Django verification of the readiness journey

**Out of scope:**
- Replacing the private shell with React Router or a different app architecture - unnecessary for this brownfield SPA
- Introducing a global state store - the phase is about page ownership, not centralizing more logic
- Public maintainer dashboard discovery - the surface must remain private
- Reworking public depth-mode or chat behavior - belongs to Phases 1 and 2

## Constraints

- Keep the private maintainer surface inside the existing React + TypeScript Vite SPA and Django admin boundary.
- Preserve keyboard access, visible focus, and reduced-motion behavior.
- Keep the current safe envelope shape for admin responses and avoid changing the protected boundary contract.
- Use frontend integration plus Django API integration as the main confidence story, with only minimal Playwright coverage for the overview-to-source-detail journey.

## Acceptance Criteria

- [ ] The maintainer overview opens with three workflow cards for Sources, Validation, and Audit/Operations.
- [ ] Each workflow card shows a visible health/status signal plus key metrics.
- [ ] Selecting a workflow card opens a filtered drill-down that preserves readiness context and shows recent context inline.
- [ ] Source detail leads with the current blocker or readiness issue and shows inline validation evidence before deeper inspection.
- [ ] The maintainer shell stays private and authenticated while Overview, Sources, Validation, and Operations live in page-owned modules.
- [ ] Backend stewardship and validation views continue to delegate readiness shaping through services while keeping repositories narrow.
- [ ] Frontend integration tests, backend tests, and the minimal browser smoke path for overview -> source detail pass.

## Ambiguity Report

| Dimension | Score | Min | Status | Notes |
|-----------|-------|-----|--------|-------|
| Goal Clarity | 0.94 | 0.75 | OK | Goal is specific and measurable |
| Boundary Clarity | 0.92 | 0.70 | OK | In-scope and out-of-scope are explicit |
| Constraint Clarity | 0.88 | 0.65 | OK | Stack and verification constraints are locked |
| Acceptance Criteria | 0.90 | 0.70 | OK | All checks are pass/fail |
| **Ambiguity** | 0.10 | <=0.20 | OK | Gate passed |

Status: OK = met minimum, WARN = below minimum (planner treats as assumption)

## Interview Log

| Round | Perspective | Question summary | Decision locked |
|-------|-------------|------------------|-----------------|
| 0 | Auto-skip | No interview rounds were needed because `--auto` plus the roadmap and requirements already met the clarity gate. | SPEC was generated directly from the phase-3 roadmap, requirements, and completed phase context. |

---
*Phase: 03-maintainer-readiness-hardening*
*Spec created: 2026-05-10*
*Next step: $gsd-discuss-phase 3 - implementation decisions (how to build what's specified above)*
