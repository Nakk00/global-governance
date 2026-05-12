# Phase 6: Maintainer Codebase Modularization - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-12
**Phase:** 06-maintainer-codebase-modularization
**Areas discussed:** Shell and shared infra, Source inventory decomposition, Repository layout, Overview and API grouping

---

## Shell and shared infra

| Option | Description | Selected |
|--------|-------------|----------|
| Keep shell stable and split shared helpers first | Keep `MaintainerDashboard.tsx` as the shell, then split `maintainerDashboardShared.tsx` into concern-based modules with compatibility exports. | ✓ |
| Split feature pages first | Move the page bodies out before touching the shared helpers. | |
| Delay shared split until later | Leave the monolith mostly intact while smaller feature splits happen around it. | |

**User's choice:** Auto-selected recommended default.
**Notes:** The proposal and current code graph both point to the shared maintainer file as the highest-payoff first move, while the shell already owns auth/bootstrap and should stay stable.

---

## Source inventory decomposition

| Option | Description | Selected |
|--------|-------------|----------|
| Thin container plus feature-owned modules | Keep `SourcesPage.tsx` as local state/composition only and move inventory/detail/trust helpers into feature-owned modules. | ✓ |
| Minimal helper split | Extract only a few shared helpers and leave most of the page inline. | |
| Over-shard every helper | Split every small helper into its own file. | |

**User's choice:** Auto-selected recommended default.
**Notes:** `SourcesPage.tsx` already owns page-local search, filter, pagination, and selection state, so the right boundary is a thin container with coarse-grained feature modules.

---

## Repository layout

| Option | Description | Selected |
|--------|-------------|----------|
| Compatibility layer plus repositories package | Keep `repository.py` as a facade and move implementation concerns into `backend/sources/repositories/`. | ✓ |
| Nested repository package under a new namespace | Rename the whole area into a new package shape and move callers at once. | |
| Read/write split only | Split just the obvious read and write paths and leave the rest in place. | |

**User's choice:** Auto-selected recommended default.
**Notes:** The backend repository has the widest blast radius, so the safest split is a thin compatibility layer plus focused implementation modules that preserve current service/view/DTO contracts.

---

## Overview and API grouping

| Option | Description | Selected |
|--------|-------------|----------|
| Extract builders and group wrappers by feature | Move `OverviewPage.tsx` builders/primitives out and group API wrappers by feature around a shared transport core. | ✓ |
| Split overview only | Leave the API file alone for now and only clean up the overview page. | |
| Split API only | Keep the overview page inline and only reorganize the API wrappers. | |

**User's choice:** Auto-selected recommended default.
**Notes:** The proposal already maps this split cleanly, and the current API file is the shared transport seam that should stay centralized while feature wrappers move out.

---

## the agent's Discretion

- Keep the split coarse-grained and feature-owned rather than helper-per-file.
- Use temporary compatibility exports while the import graph migrates.

## Deferred Ideas

- None noted beyond the locked out-of-scope items in SPEC.md.
