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
