---
phase: 05-admin-ux-polish-for-maintainers
plan: 01
subsystem: maintainer-monitoring-contract
tags:
  - backend
  - maintainer-api
  - contract
key-files:
  created:
    - src/lib/maintainer/api.test.ts
    - .planning/phases/05-admin-ux-polish-for-maintainers/05-01-SUMMARY.md
  modified:
    - backend/sources/dtos.py
    - backend/sources/repository.py
    - src/lib/maintainer/api.ts
    - src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx
    - backend/tests/test_admin_stewardship.py
metrics:
  tests:
    - pnpm backend:test
    - pnpm exec vitest run src/lib/maintainer/api.test.ts
---

# Plan 05-01 Summary

## Objective

Extended the private maintainer dashboard contract so richer overview, audit trail, and chatbot trust signals are shaped by the backend and mirrored at the frontend API boundary.

## Changes

| Area | Result |
|------|--------|
| Backend DTOs | Added server-shaped `monitoring`, `auditTrail`, and `chatbotTrust` groups to `StewardshipDashboardDto`. |
| Backend shaping | Computed readiness, blockers, validation health, next actions, audit summary, and chatbot trust evidence from canonical source snapshots. |
| Frontend API | Mirrored the richer dashboard contract in `src/lib/maintainer/api.ts`. |
| Tests | Added backend contract assertions and a focused API boundary test for richer payload loading plus auth-failure session clearing. |

## Commits

| Commit | Description |
|--------|-------------|
| this commit | Enriched the maintainer monitoring contract and added focused backend/API tests. |

## Deviations

- `src/lib/maintainer/api.test.ts` did not exist yet, so this plan created the focused frontend API boundary test file instead of updating an existing one.
- `gsd-sdk query` is unavailable in this checkout, so execution followed the checked-in plan inline.

## Verification

| Command | Result |
|---------|--------|
| `pnpm backend:test` | Passed: 75 tests. |
| `pnpm exec vitest run src/lib/maintainer/api.test.ts` | Passed: 2 tests. |

## Self-Check: PASSED

The richer maintainer monitoring contract is available behind the existing admin read path, frontend types consume the new shape, and focused backend/API tests prove the contract and auth boundary behavior.
