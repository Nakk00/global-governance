# Phase 5: Admin UX Polish for Maintainers - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish the private maintainer console into a dark, analytics-heavy readiness
control center. This phase expands the existing private dashboard into a richer
portal with stronger overview hierarchy, first-class Audit Trail and Chatbot
Trust sections, and broader monitoring data that supports demo-safe readiness
signals. The work stays inside the private maintainer boundary and builds on the
current brownfield SPA plus Django admin/data seams.

</domain>

<decisions>
## Implementation Decisions

### Overview Composition
- **D-01:** The top of the console should become a multi-card control center,
  not a minimal readiness summary.
- **D-02:** The main overview should emphasize system readiness, blockers,
  validation health, and checklist-style next actions because those are the
  highest-value maintainer signals for this phase.
- **D-03:** The overview should feel like a presentation-safe operations
  surface, not a triage wall.

### Navigation Scope
- **D-04:** `Audit Trail` and `Chatbot Trust` become first-class sections in the
  maintainer navigation for this phase.
- **D-05:** `Settings` is not promoted to a first-class section in Phase 5.
- **D-06:** The console remains a private maintainer surface; this is not a
  public admin product.

### Visual Language
- **D-07:** Adopt the mock’s dark analytics-heavy style.
- **D-08:** Use the mock as the visual target for density, contrast, and
  control-center feel, while keeping the existing SPA architecture underneath.

### Data Scope
- **D-09:** Build a broader monitoring model with richer backend metrics rather
  than relying on UI-only derivations for the new portal cards.
- **D-10:** The richer monitoring model should support the new overview,
  Audit Trail, and Chatbot Trust surfaces instead of being limited to the
  current dashboard summary cards.
- **D-11:** The implementation can extend the existing maintainer dashboard
  contract and Django shaping layers as needed, but the end result should feel
  materially richer than the current dashboard object.

### the agent's Discretion
- Exact card names, metric labels, and component splits can be decided during
  planning as long as the control-center direction, private boundary, dark
  analytics styling, and richer monitoring model are preserved.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope
- `.planning/ROADMAP.md` - Phase 5 title, dependency on Phase 4, and the
  current placeholder phase entry.
- `.planning/REQUIREMENTS.md` - `ADMIN-01` plus the maintainer UX and out-of-
  scope guardrails for the private admin surface.
- `.planning/PROJECT.md` - brownfield MVP posture, private maintainer boundary,
  and current product priorities.
- `.planning/STATE.md` - current milestone state and the note that Phase 5 was
  added to the roadmap.
- `.planning/phases/03-maintainer-readiness-hardening/03-CONTEXT.md` -
  readiness-first navigation, thin shell ownership, and source-first drill-down
  decisions that Phase 5 should extend.
- `AGENTS.md` - repo operating rules for file placement, verification, and the
  private maintainer boundary.

### Discussion Inputs
- `archive/docs/planning-artifacts/chatbot_admin_improvement_proposal.md` -
  admin and chatbot improvement ideas that shaped the control-center direction.

### Codebase Maps
- `.planning/codebase/STRUCTURE.md` - repo layout and maintainer/admin file
  placement rules.
- `.planning/codebase/CONVENTIONS.md` - naming, boundary, and error-handling
  conventions.
- `.planning/codebase/STACK.md` - the current React + Django + Supabase stack
  and the private maintainer boundary.
- `.planning/codebase/INTEGRATIONS.md` - protected maintainer API shape and
  current data/service boundaries.
- `.planning/codebase/ARCHITECTURE.md` - SPA-first architecture and current
  maintainer flow.
- `.planning/codebase/CONCERNS.md` - large maintainer shell and repository seam
  risks.
- `.planning/codebase/TESTING.md` - the preferred frontend/backend/browser
  verification split.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`:
  already acts as a thin shell that routes between overview, sources, source
  detail, validation, and operations.
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`:
  concentrates the current overview, section nav, workflow cards, source
  validation evidence, and other shared maintainer UI helpers.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts`:
  owns dashboard loading, detail loading, and mutation state, which makes it the
  natural seam for richer monitoring data.
- `src/lib/maintainer/api.ts`: central maintainer fetch and DTO boundary for the
  private console.
- `backend/sources/dtos.py`: `StewardshipDashboardDto` already carries overview,
  sources, ingestion runs, validation runs, and audit events.
- `backend/sources/services.py`: dashboard, validation-run, and audit-event
  service shaping already exists for the backend seam.
- `backend/validation/dtos.py`: validation run detail and answer-preview DTOs
  can support the trust and validation surfaces.

### Established Patterns
- The private maintainer experience already uses section-based routing inside
  the SPA instead of React Router, so the phase should preserve that structure
  while making the portal feel more control-center-like.
- The dashboard is already DTO-driven, so richer portal metrics should be
  shaped through existing frontend/backend boundaries instead of ad hoc browser
  state.
- Backend source and validation concerns are already separated into repository
  and service layers; richer monitoring should keep that split intact.
- Phase 3 established a readiness-first, source-first maintainer direction, and
  Phase 5 should extend that direction rather than reset it.

### Integration Points
- `MaintainerDashboard.tsx` and `MaintainerSectionNav` are the entry points for
  the new section structure.
- `OverviewPage`, `SourceDetailPage`, `ValidationWorkbench`, and
  `OperationsPage` are the current page-owned seams the new portal should build
  on or extend.
- `SourceValidationEvidence` is the existing source-first evidence surface that
  can feed into the trust and validation story.
- `src/lib/maintainer/api.ts` and the Django `/api/admin/*` boundary are the
  main integration seams for any richer monitoring data.

</code_context>

<specifics>
## Specific Ideas

- Use `archive/images/Admin_Dashboard.png` as the visual reference for the
  Phase 5 control-center look.
- The desired feel is a dark analytics-heavy console with dense but readable
  readiness information, not a light utility dashboard.
- `Audit Trail` and `Chatbot Trust` should feel like real navigation targets,
  not hidden sub-panels.
- The phase should still feel private and operational, not like a learner-facing
  experience with admin labels on top.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within Phase 5 scope.

</deferred>

---

*Phase: 5-Admin UX Polish for Maintainers*
*Context gathered: 2026-05-10*
