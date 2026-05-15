# Ingested Decisions

Source: `archive/docs/planning-artifacts/codebase-modularization-v2-proposal.md`

## Codebase Modularization V2

- Treat the v2 proposal as a SPEC-level planning input, not an ADR-level locked architecture decision.
- Start future modularization with the private maintainer console frontend before the backend source repository split.
- Use `maintainerDashboardShared.tsx` as the first target because it mixes shared infrastructure with feature implementations and has lower backend contract risk than repository refactoring.
- Keep modularization behavior-preserving: no frontend route changes, no backend response contract changes, no React Router, no global store, no public maintainer dashboard.
- Use compatibility exports during transition where they reduce import churn and review risk.
- Split by feature ownership and real responsibility boundaries rather than creating very small files for their own sake.
- Run GitNexus impact analysis before backend repository edits and before changing high-fan-out symbols.

## Recommended Sequence

1. Split `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`.
2. Split `src/components/modules/MaintainerDashboard/sources/SourcesPage.tsx`.
3. Split `backend/sources/repository.py`.
4. Split `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx`.
5. Split `src/lib/maintainer/api.ts`.

## Admin Side Documentation Proposal v4

- Treat the v4 proposal as documentation-first work, not a runtime or roadmap change.
- Route the guide-writing work to `gsd-docs-update` rather than widening the active maintainer implementation phases.
- Use the proposal’s verified facts as the source of truth, especially the action-first tab model, blocker playbook, and source-subtab walkthroughs, and treat anything outside that list as a gap until re-verified.
- Keep the improvement ideas separate so they can become a future story or phase only if explicitly promoted.
- Preserve exact UI labels in the guide, including `Operations` and the nested source tabs, and explain blockers as repair steps rather than architecture.
