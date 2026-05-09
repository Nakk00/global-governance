# Story 5.6b Blind Hunter Review Prompt

Review only the story-scoped retrieval/citation changes for Story 5.6b.

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
- Review the unified diff for only the files above.
- Do not use project context or surrounding repository files.
- Output findings as a Markdown list of descriptions only.
- Focus on correctness, missing behavior, regressions, and contract drift.
- Ignore unrelated worktree changes.

