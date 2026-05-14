---
phase: 06-maintainer-codebase-modularization
plan: 04
subsystem: api
tags: [django, python, repository, supabase, stewardship, refactor]
requires:
  - phase: 05-admin-ux-polish-for-maintainers
    provides: stable private maintainer control-center context and repository consumers
provides:
  - backend/sources/repositories/ package with focused repository, mapper, mutation, storage, and seed modules
  - compatibility facade at backend/sources/repository.py
  - preserved stewardship regression coverage through the existing backend test suite
affects:
  - Phase 6
  - backend stewardship
  - maintainer service/view imports
tech-stack:
  added: []
  patterns: [compatibility facade, split package modules, shared mapper helpers, shared mutation helpers]
key-files:
  created:
    - backend/sources/repositories/__init__.py
    - backend/sources/repositories/base.py
    - backend/sources/repositories/mappers.py
    - backend/sources/repositories/memory.py
    - backend/sources/repositories/mutations.py
    - backend/sources/repositories/seeds.py
    - backend/sources/repositories/storage.py
    - backend/sources/repositories/supabase.py
  modified:
    - backend/sources/repository.py
    - backend/sources/services.py
    - backend/sources/views.py
key-decisions:
  - "Kept backend/sources/repository.py as a compatibility shim and moved the live implementation into backend/sources/repositories/."
  - "Moved the live backend consumers to the split repository package while keeping the test reset hook on the compatibility surface."
  - "Used coarse-grained helper modules for seeds, storage, mutation rules, and row-to-DTO mapping to avoid helper-per-file sprawl."
requirements-completed:
  - MOD-03
duration: 18 min
completed: 2026-05-14
---

# Phase 6 Plan 4: Split backend source repository into base, mapper, seed, storage, mutation, memory, and Supabase modules Summary

Backend stewardship now lives in a focused repositories package with a compatibility layer, while the protected service and view contracts stay unchanged.

## Performance

- **Duration:** 18 min
- **Started:** 2026-05-14T12:31:51Z
- **Completed:** 2026-05-14T12:50:01Z
- **Tasks:** 3
- **Files modified:** 11 code files

## Accomplishments
- Split the monolithic stewardship repository into `base.py`, `mappers.py`, `mutations.py`, `storage.py`, `seeds.py`, `memory.py`, and `supabase.py`.
- Kept `backend/sources/repository.py` as a compatibility shim so existing imports still work.
- Updated the backend consumer imports to point at the split repository package while preserving the stewardship regression suite.

## Task Commits

1. **Task 1: Run GitNexus impact analysis and create the repository package skeleton** - `37de3c3` (`refactor`)
2. **Task 2: Move repository implementations and mutation helpers into the new package** - `37de3c3` (`refactor`)
3. **Task 3: Update backend consumers and regression tests for the split repository layer** - `37de3c3` (`refactor`)

## Files Created/Modified
- `backend/sources/repositories/__init__.py` - Package facade and compatibility helpers.
- `backend/sources/repositories/base.py` - Shared repository dataclasses, constants, and protocol.
- `backend/sources/repositories/mappers.py` - Row-to-record and row-to-DTO mapping helpers.
- `backend/sources/repositories/memory.py` - In-memory stewardship repository and test reset hook.
- `backend/sources/repositories/mutations.py` - Validation and lifecycle rule helpers.
- `backend/sources/repositories/seeds.py` - Approved source seed definitions.
- `backend/sources/repositories/storage.py` - Storage path, filename, and upload byte helpers.
- `backend/sources/repositories/supabase.py` - Supabase-backed stewardship repository.
- `backend/sources/repository.py` - Compatibility shim over the split repository package.
- `backend/sources/services.py` - Service imports now target the split package.
- `backend/sources/views.py` - View error handling imports now target the split package.

## Decisions Made
- Kept the compatibility layer so downstream callers could migrate incrementally.
- Used coarse-grained modules instead of helper-per-file fragmentation.
- Preserved the existing stewardship regression coverage rather than rewriting the behavior contract.

## Deviations from Plan

### Auto-fixed Issues

None.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** The wave stayed within scope and preserved the protected stewardship contract.

## Issues Encountered
- None. The backend lint, typecheck, system check, and stewardship tests all passed after the split.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Wave 4 is complete and wave 5 can now split the overview builders and maintainer API wrappers.
- The repository compatibility shim remains available for any code that still imports `sources.repository`.

---
*Phase: 06-maintainer-codebase-modularization*
*Completed: 2026-05-14*
