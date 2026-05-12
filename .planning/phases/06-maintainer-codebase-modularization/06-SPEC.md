# Phase 6: Maintainer Codebase Modularization — Specification

**Created:** 2026-05-12
**Ambiguity score:** 0.10 (gate: <= 0.20)
**Requirements:** 5 locked

## Goal

Split the maintainer console and source stewardship code into smaller responsibility-focused modules without changing any user-visible maintainer routes, DTOs, response envelopes, or session-expiry behavior.

## Background

Phase 5 is complete and the private maintainer console is now the active structural cleanup target. The current codebase still concentrates too much responsibility in a few large files: `maintainerDashboardShared.tsx` still mixes shared helpers with feature-page logic, `SourcesPage.tsx` still owns page state plus much of the inventory rendering logic, `backend/sources/repository.py` still carries a broad stewardship repository layer, and `OverviewPage.tsx` plus `src/lib/maintainer/api.ts` still combine top-level composition with builder or wrapper responsibilities.

The phase exists to reduce file size, mixed responsibility, and review risk while keeping the maintainer experience behavior-preserving. The private maintainer boundary must stay private, and the observable contracts used by frontend consumers and backend callers must remain stable.

## Requirements

1. **Shared maintainer shell split**: Maintainer shared infrastructure is separated from feature-owned page implementations.
   - Current: `maintainerDashboardShared.tsx` still mixes shared helpers, routing helpers, and full page logic for the maintainer surface.
   - Target: shared non-feature helpers live in focused shared modules, and `maintainerDashboardShared.tsx` no longer owns complete feature pages.
   - Acceptance: feature pages are imported from feature-owned modules, the shared file no longer contains full page implementations, and maintainer navigation still resolves to the same destinations.

2. **Source inventory decomposition**: The source inventory page is reduced to page state and composition.
   - Current: `SourcesPage.tsx` owns page state, filtering, pagination, selection sync, and render composition together.
   - Target: `SourcesPage.tsx` keeps page state and composition only, while filters, tables/cards, preview rail, metrics, formatters, and source detail/validation/audit/trust implementations live in feature-owned modules or folders.
   - Acceptance: the page imports the extracted modules, the page file no longer holds the row/filter/render helpers, and the source inventory screen still behaves the same from the user's perspective.

3. **Repository layer split**: The backend source repository becomes a compatibility layer over focused implementation modules.
   - Current: `backend/sources/repository.py` holds the broad stewardship repository logic in one place.
   - Target: focused base, mapper, seed, storage, mutation, memory, and Supabase modules exist, with `repository.py` retained as a compatibility layer during transition.
   - Acceptance: the repository API still satisfies the existing service/view/DTO contracts, backend stewardship tests still pass, and no backend response contract changes are required by the split.

4. **Overview composition split**: Overview data builders and visual primitives are separated from top-level page composition.
   - Current: `OverviewPage.tsx` builds blockers, actions, source rows, validation rows, audit rows, summaries, and formatting inline.
   - Target: data builders and visual primitives are extracted so `OverviewPage.tsx` mainly composes the overview screen.
   - Acceptance: the overview page no longer contains the bulk of row/summary-building logic and still presents the same readiness content and navigation targets.

5. **Maintainer API grouping**: Maintainer API wrappers are grouped by feature without changing shared transport behavior.
   - Current: `src/lib/maintainer/api.ts` mixes shared fetch/envelope/session-expiry behavior with feature-specific wrappers and DTO helpers.
   - Target: wrappers are grouped by feature while shared transport, envelope parsing, request shape, response parsing, and session-expiry handling remain centralized and unchanged.
   - Acceptance: the same endpoints, DTO field names, and envelope shapes are exposed to consumers, and session-expiry handling continues to behave identically.

## Boundaries

**In scope:**
- Split maintainer dashboard shared infrastructure away from feature pages.
- Reduce `SourcesPage.tsx` to page state and page composition.
- Move source detail, validation, audit trail, and chatbot trust code into feature-owned modules or folders.
- Split `backend/sources/repository.py` into responsibility-focused modules while keeping a compatibility layer.
- Separate overview builders and visual primitives from `OverviewPage.tsx`.
- Group maintainer API wrappers by feature while preserving shared transport behavior.

**Out of scope:**
- New maintainer features or new routes - this phase is structural only.
- Changes to frontend routes, backend response contracts, DTO field names, session-expiry behavior, or private maintainer access rules - these must remain stable.
- Public maintainer discovery or learner-visible functionality - outside the private stewardship boundary.
- A redesign of maintainer UI or data model semantics - the phase is behavior-preserving.

## Constraints

- The phase must be behavior-preserving from both user and API-consumer perspectives.
- Temporary compatibility exports are allowed during transition.
- Frontend routes, backend response contracts, DTO field names, session-expiry behavior, and private maintainer boundaries must stay stable.
- Backend modularization must preserve existing stewardship behavior and keep verification focused on the maintainer workflow.

## Acceptance Criteria

- [ ] `maintainerDashboardShared.tsx` no longer contains full feature-page implementations.
- [ ] `SourcesPage.tsx` is reduced to page state and composition, with filters, tables/cards, preview rail, metrics, formatters, and source detail/validation/audit/trust concerns moved out.
- [ ] `backend/sources/repository.py` is a compatibility layer over split base, mapper, seed, storage, mutation, memory, and Supabase modules.
- [ ] `OverviewPage.tsx` and maintainer API wrappers are split by feature without changing route behavior, DTO field names, response envelopes, or session-expiry behavior.
- [ ] Frontend checks pass: `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- [ ] Backend checks pass for the repository split: `pnpm backend:lint`, `pnpm backend:typecheck`, `pnpm backend:check`, and `pnpm backend:test`.

## Ambiguity Report

| Dimension | Score | Min | Status | Notes |
|-----------|-------|-----|--------|-------|
| Goal Clarity | 0.93 | 0.75 | OK | Goal is locked by Phase 6 roadmap and current phase context |
| Boundary Clarity | 0.91 | 0.70 | OK | In-scope and out-of-scope items are explicit |
| Constraint Clarity | 0.88 | 0.65 | OK | Stability constraints and compatibility rules are explicit |
| Acceptance Criteria | 0.86 | 0.70 | OK | All checks are pass/fail and verification-driven |
| **Ambiguity** | 0.10 | <=0.20 | OK | Gate passes without additional interview rounds |

## Interview Log

| Round | Perspective | Question summary | Decision locked |
|-------|-------------|------------------|-----------------|
| Auto | Derived | What does Phase 6 need to deliver? | Five modularization outcomes from MOD-01 through MOD-05 are locked from roadmap, requirements, and phase context |
| Auto | Derived | What must stay stable? | Routes, DTO fields, response envelopes, session-expiry behavior, and the private maintainer boundary remain unchanged |
| Auto | Derived | What transition is acceptable? | Compatibility exports are allowed while moving implementations into focused modules |

---

*Phase: 06-maintainer-codebase-modularization*
*Spec created: 2026-05-12*
*Next step: $gsd-discuss-phase 6 - implementation decisions (how to build what's specified above)*
