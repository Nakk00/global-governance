# Story 5.6b Acceptance Auditor Review Prompt

Review the Story 5.6b diff against the story and context documents.

Story file:
- `_bmad-output/implementation-artifacts/5-6b-inspect-retrieval-chunks-and-citations.md`

Loaded context docs:
- `CLAUDE.md`
- `_bmad-output/project-context.md`

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
- Review the diff against ACs 1-6 in the story file.
- Check for violations of acceptance criteria, story intent, and context constraints.
- Output findings as a Markdown list with one-line title, violated AC/constraint, and evidence.
- Ignore unrelated worktree changes.
