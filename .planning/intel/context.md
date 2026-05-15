# Ingested Context

Source: `archive/docs/planning-artifacts/codebase-modularization-v2-proposal.md`

The modularization proposal is a conservative structural follow-up to the existing private maintainer and source stewardship work. It does not propose new user-facing behavior. Instead, it aims to reduce file size, mixed responsibilities, and future review risk in areas already identified as large or fragile:

- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`
- `src/components/modules/MaintainerDashboard/sources/SourcesPage.tsx`
- `backend/sources/repository.py`
- `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx`
- `src/lib/maintainer/api.ts`

The proposal overlaps with Phase 3's completed maintainer readiness hardening and Phase 5's active admin UX polish. The safest routing is to treat this as a later structural phase that follows the Phase 5 control-center work, or as a backlog/future milestone item if Phase 4 and Phase 5 remain the current delivery priorities.

## Admin Side Documentation Proposal v4

The admin-side documentation proposal is a documentation-only follow-up to the private maintainer/admin surface. It now centers on the current `/maintainer` SPA entry point, Supabase-backed sign-in and session storage, the `/api/admin/me` gate, dashboard triage, blocker remediation, nested source tabs, validation follow-up, and the backend auth/permissions boundary.

The proposal should be routed to `gsd-docs-update` for the guide itself. Its improvement ideas stay separate and should only become implementation work if they are explicitly promoted later. The latest revision expands the guide into an action-first maintainer playbook that explains what each tab does, what each blocker means, what to click, what to inspect, what to change, and what success looks like.
