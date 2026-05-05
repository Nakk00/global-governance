# Story 5.6b Edge Case Hunter Review Prompt

Review the story-scoped retrieval/citation changes for Story 5.6b.

Scope:
- `backend/sources/dtos.py`
- `backend/sources/repository.py`
- `backend/sources/views.py`
- `backend/sources/urls.py`
- `backend/tests/test_admin_auth.py`
- `backend/tests/test_admin_stewardship.py`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx`
- `src/lib/maintainer/api.ts`
- `tests/e2e/maintainer.spec.ts`
- `src/components/ui/table.tsx`

Instructions:
- Walk reachable branches and boundary conditions in the diff.
- Report only unhandled edge cases.
- Output findings as a JSON array with `location`, `trigger_condition`, `guard_snippet`, and `potential_consequence`.
- Ignore unrelated worktree changes.

