# Phase 5: Admin UX Polish for Maintainers - Research

**Researched:** 2026-05-10
**Domain:** Private maintainer dashboard UX and backend monitoring in a React + Vite SPA with Django API seams
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: The top of the console should become a multi-card control center, not a minimal readiness summary.
- D-02: The main overview should emphasize system readiness, blockers, validation health, and checklist-style next actions because those are the highest-value maintainer signals for this phase.
- D-03: The overview should feel like a presentation-safe operations surface, not a triage wall.
- D-04: `Audit Trail` and `Chatbot Trust` become first-class sections in the maintainer navigation for this phase.
- D-05: `Settings` is not promoted to a first-class section in Phase 5.
- D-06: The console remains a private maintainer surface; this is not a public admin product.
- D-07: Adopt the mock's dark analytics-heavy style.
- D-08: Use the mock as the visual target for density, contrast, and control-center feel, while keeping the existing SPA architecture underneath.
- D-09: Build a broader monitoring model with richer backend metrics rather than relying on UI-only derivations for the new portal cards.
- D-10: The richer monitoring model should support the new overview, Audit Trail, and Chatbot Trust surfaces instead of being limited to the current dashboard summary cards.
- D-11: The implementation can extend the existing maintainer dashboard contract and Django shaping layers as needed, but the end result should feel materially richer than the current dashboard object.
- D-12: Use `archive/images/Admin-Background.png` as the atmospheric background reference for the control center.
- D-13: Use `archive/images/Admin-Logo.png` as the top-right brand mark for the private admin shell.
- D-14: The Phase 5 control center must support mobile layouts with a compact navigation pattern and stacked content blocks.

### the agent's Discretion
- Exact card names, metric labels, and component splits can be decided during planning as long as the control-center direction, private boundary, dark analytics styling, and richer monitoring model are preserved.
- Exact implementation details for how the background and logo assets are integrated can be decided during planning as long as they preserve readability and branding.
- The mobile layout strategy can be decided during planning as long as the console remains readable and private on smaller screens.

### Deferred Ideas (OUT OF SCOPE)
- None - discussion stayed within Phase 5 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ADMIN-01 | Private maintainer views keep source status, validation outcomes, audit entries, and error states readable, actionable, and easy to navigate | The current section-based shell, existing admin auth boundary, and DTO-driven dashboard/service layers provide the base. Phase 5 should extend those seams into a richer control-center model rather than moving monitoring into browser-only state. |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Use `pnpm` for all project commands.
- Keep the frontend SPA-first and anchor-navigation oriented unless the architecture is explicitly updated.
- Do not assume Next.js, App Router, or server components.
- Keep shadcn/ui primitives in `src/components/ui` and feature composites in feature-owned folders.
- Keep browser-facing code in `src/` and privileged retrieval, ingestion, citation packaging, and service-role logic in `supabase/functions/`.
- Keep browser UI code organized by feature boundary first under `src/components/`.
- Store checked-in Playwright specs under `tests/e2e`, shared Playwright support under `tests/playwright`, and shared MSW support under `tests/support/msw`.
- Use `pnpm test:unit` for frontend Vitest coverage, `pnpm backend:test` for Django/pytest coverage, and `pnpm test:e2e` for the default fast Playwright suite.
- Use `pnpm test:chat:live` only when work touches the live chat endpoint or local Supabase integration.
- Preserve reduced-motion behavior, keyboard access, and visible fallback states across interactive sections.
- Keep chat presentation components free of privileged retrieval or data-mutation logic.
- Do not add React Router, a global store, or a public maintainer dashboard in the MVP unless the architecture is explicitly updated.
- Treat off-topic refusal, weak-support, and cooldown states as typed successful responses, not transport failures.

## Summary

The current maintainer console is already on the right architectural track for this phase: a thin dashboard shell, section-based navigation, DTO-shaped data loading, and backend read endpoints that separate source detail, validation, and audit concerns. The important code seams are `MaintainerDashboard`, `MaintainerSectionNav`, `useMaintainerDashboardData`, `src/lib/maintainer/api.ts`, and the Django `StewardshipDashboardDto` / maintainer views. That means Phase 5 should extend the existing private shell instead of introducing a parallel admin app or a new routing framework.

The standard implementation approach is to keep the browser layer focused on presentation and navigation while moving richer monitoring into the backend DTO/service layer. The existing dashboard already surfaces sources, validation runs, and audit events, and source detail already has lineage, provenance, validation history, and audit trail arrays. That makes the natural next step clear: build the new overview cards, Audit Trail, and Chatbot Trust sections from a richer server-shaped monitoring model, then keep the frontend as a readable control surface with clear drill-down paths.

The main risk is turning the new overview into a second triage wall or scattering trust logic across browser state. The safer pattern is to shape a richer backend monitoring model first, keep the section-owned SPA structure intact, and let the overview aggregate only the most useful readiness signals. `Chatbot Trust` should be treated as a first-class operational view, but its initial metrics should likely come from validation and audit evidence already present in the repo rather than from ad hoc browser derivations.

**Primary recommendation:** Extend the current maintainer dashboard contract and backend shaping layers, then add first-class `Audit Trail` and `Chatbot Trust` sections that render a denser dark control-center UI on top of that richer data model.

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Section nav, route parsing, and console layout | Browser/Client | API/Backend | The SPA shell owns presentation and navigation state; the backend only supplies data and auth-gated responses. |
| Overview cards and dark control-center styling | Browser/Client | API/Backend | The browser owns composition and visual density, but the cards should be fed by server-shaped metrics rather than browser-only calculations. |
| Audit Trail surface and drill-down history | Browser/Client | API/Backend | The browser presents the history and navigation, while the backend supplies the canonical audit and source-history records. |
| Chatbot Trust surface | API/Backend | Browser/Client | Trust signals should come from shaped monitoring data and validation/audit evidence, with the client only rendering and linking them. |
| Monitoring aggregation and DTO shaping | API/Backend | Database/Storage | The backend should own the richer monitoring model and its contract so the dashboard stays consistent and testable. |
| Auth-gated maintainer access and read/write boundaries | API/Backend | Database/Storage | Private maintainer data and mutations must stay behind backend auth and repository checks. |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 5 is a brownfield admin UX extension, not a new product surface. The current maintainer experience is already section-based and DTO-driven, and the phase decisions intentionally preserve that shape while making the console feel like a dark analytics-heavy control center. The research therefore points toward an incremental plan: keep the current SPA shell, add richer backend monitoring fields, and split the new console experience into first-class sections instead of hiding everything inside one oversized overview.

The key implementation insight is that the repository already contains most of the raw evidence needed for the new surfaces. `StewardshipDashboardDto` already includes overview, sources, ingestion runs, validation runs, and audit events. Source detail already includes approval lineage, ingestion provenance, validation history, and audit trail. The missing piece is not a new navigation framework; it is a richer monitoring model and a clearer composition layer that turns the existing evidence into presentation-safe maintainer workflows.

The safest path is to treat `Audit Trail` and `Chatbot Trust` as real operational destinations backed by backend-shaped aggregates. That keeps the private boundary intact, reduces the chance of contract drift, and avoids the common admin-dashboard failure mode where the UI starts inventing its own truth. The frontend should stay readably thin; the backend should become a little richer.

**Primary recommendation:** Extend the existing maintainer dashboard DTO and service layer, then build the new control-center UI as a set of focused sections that consume that richer monitoring model.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | 19.2.4 | Component-based SPA UI | The repo already uses React for the maintainer shell and section pages. |
| react-dom | 19.2.4 | Browser rendering | Required for the SPA runtime. |
| typescript | 5.9.3 | Typed app and DTO code | Keeps the dashboard contract and backend-facing types aligned. |
| vite | 7.3.1 | Dev server and production build | The project is Vite-based, so Phase 5 should stay within that build model. |
| Django | 5.2.13 | Backend API and auth boundary | The private maintainer surface is already shaped through Django views and services. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | 4.2.1 | Utility styling | Dense dark admin layouts and responsive card grids. |
| @tailwindcss/vite | 4.2.1 | Tailwind build integration | When building the SPA with Vite. |
| vitest | 4.1.5 | Frontend unit/component tests | Dashboard logic, request guards, and UI matrices. |
| @testing-library/react | 16.3.0 | Component assertions | Browser-like DOM checks without a full browser. |
| msw | 2.14.3 | Request mocking | Dashboard API shape, envelope parsing, and safe fallback states. |
| @playwright/test | 1.59.1 | Browser smoke and layout checks | Minimal maintainer navigation and presentation-safe browser coverage. |
| motion | 12.38.0 | Subtle interaction motion | Small, controlled transitions for the control-center feel. |
| lucide-react | 1.9.0 | Iconography | Tight admin affordances and readable status glyphs. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Section-based shell navigation | React Router | Router would add more complexity than this phase needs and would fight the repo's existing anchor-oriented shell. |
| Browser-only metric derivation | A richer backend monitoring DTO | Browser-only derivation is faster to prototype but drifts more easily and is harder to verify. |
| Global store for dashboard state | Feature-owned data hook and DTO state | A global store would centralize state, but the current feature-owned hook is already the safer seam. |
| Hiding trust behind validation | First-class Chatbot Trust section | Validation-only trust is easier to ship, but it would underserve the locked Phase 5 direction. |

**Installation:**
```bash
pnpm add react react-dom
pnpm add -D typescript vite tailwindcss @tailwindcss/vite vitest @testing-library/react msw @playwright/test motion lucide-react
```

**Version verification:** The versions above were read from the repo's `package.json` and `backend/pyproject.toml`, which are the authoritative project manifests for this phase.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### System Architecture Diagram

Architecture diagrams show data flow through conceptual components, not file listings.

```text
Maintainer opens /maintainer/*
  -> SPA shell parses section path and gate state
  -> section nav chooses Overview | Sources | Validation | Operations | Audit Trail | Chatbot Trust
  -> page component requests data through useMaintainerDashboardData
      -> fetchStewardshipDashboard / fetchSourceDetail / validation endpoints
      -> auth gate + request-key guards prevent stale or unauthorized reads
      -> Django views and services shape StewardshipDashboardDto and related detail DTOs
      -> repository pulls source, validation, and audit records from storage
  -> dashboard, drill-down, and history sections render cards, queues, and timelines
```

Requirements:
- Show entry points (how data/requests enter the system)
- Show processing stages (what transformations happen, in what order)
- Show decision points and branching paths
- Show external dependencies and service boundaries
- Use arrows to indicate data flow direction
- A reader should be able to trace the primary use case from input to output by following the arrows

File-to-implementation mapping belongs in the Component Responsibilities table, not in the diagram.

### Recommended Project Structure
```text
src/
├── components/
│   └── modules/
│       └── MaintainerDashboard/
│           ├── overview/         # readiness cards and overview composition
│           ├── audit-trail/      # first-class audit trail section
│           ├── trust/            # first-class chatbot trust section
│           ├── validation/       # validation workbench and follow-up
│           ├── operations/       # audit/ingestion operations records
│           ├── shared/           # route parsing, card builders, shared helpers
│           └── hooks/            # data loading and mutation orchestration
├── lib/
│   └── maintainer/               # fetch and DTO boundary
└── types/                        # shared maintainer-facing type aliases
```

### Pattern 1: Section-Based SPA Shell
**What:** Keep the private maintainer experience inside one shell that parses section paths and swaps focused feature-owned pages.
**When to use:** Any private dashboard or admin surface that should stay SPA-first and easy to navigate without adding a router framework.
**Example:**
```typescript
const links = [
  { path: "/maintainer", label: "Overview", active: route.section === "overview" },
  { path: "/maintainer/validation", label: "Validation", active: route.section === "validation" },
]
```

### Pattern 2: DTO-Driven Monitoring Surface
**What:** Load one authoritative dashboard object from the backend and derive cards, queues, and summaries from that DTO.
**When to use:** Read-only readiness consoles, audit surfaces, and monitoring views that must stay consistent across refreshes.
**Example:**
```typescript
const dashboard = await fetchStewardshipDashboard(session)
const cards = buildWorkflowCards(dashboard)
```

### Pattern 3: Request-Key Guarded Reads
**What:** Use request keys or equivalent guards so stale responses do not overwrite a newer navigation state.
**When to use:** Fast section switching, drill-down pages, or any dashboard that can reload while the user is moving around.
**Example:**
```typescript
const requestKey = ++dashboardRequestKeyRef.current
const dashboard = await fetchStewardshipDashboard(gate.session)
if (requestKey !== dashboardRequestKeyRef.current) return
```

### Anti-Patterns to Avoid
- **Adding React Router:** It would overcomplicate a shell that already works with section-based navigation.
- **Computing trust metrics only in the browser:** That makes the control center easy to drift and hard to verify.
- **Hiding trust or audit behind secondary panels:** The locked direction says those must be first-class navigation targets.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Section navigation state | A new routing library or global store | The existing section parser and shell navigation | The repo already has the right private-shell pattern. |
| Monitoring aggregation | Browser-only counters and ad hoc state | Backend-shaped DTOs and service helpers | Server-shaped metrics are easier to verify and keep consistent. |
| Audit history grouping | Per-page bespoke history logic | Shared audit/source detail arrays and focused section components | Shared evidence keeps the admin surface coherent. |
| Trust-state semantics | New trust labels invented in the UI | Validation and audit signals from the backend | Trust needs canonical evidence, not presentation-only guesswork. |

**Key insight:** Private admin dashboards become brittle when the browser starts inventing the facts. Keep the backend authoritative and let the client present it clearly.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Turning the overview into a triage wall
**What goes wrong:** The dashboard becomes dense but not readable, so maintainers cannot tell what to do next.
**Why it happens:** More metrics get added without a hierarchy or action ordering.
**How to avoid:** Keep the top level to a few high-value readiness cards, then push detail into the new sections.
**Warning signs:** Too many equal-sized cards, no clear next action, and a wall of status chips.

### Pitfall 2: Letting Chatbot Trust become a hidden validation subpanel
**What goes wrong:** The trust surface exists, but maintainers cannot find it or understand what evidence it uses.
**Why it happens:** Teams often tuck new trust signals into the nearest existing section instead of giving them a real home.
**How to avoid:** Make Chatbot Trust a first-class nav target with its own summary and drill-down path.
**Warning signs:** The nav still only shows overview, sources, validation, and operations.

### Pitfall 3: Creating frontend metrics before the backend contract exists
**What goes wrong:** Cards look good locally but are hard to keep in sync with real data.
**Why it happens:** It is tempting to prototype the UI first when the visual target is strong.
**How to avoid:** Shape the richer monitoring DTO and backend service layer early, then render from that contract.
**Warning signs:** Duplicate calculations in the browser, inconsistent counts, or new UI states with no backend source of truth.
</common_pitfalls>

<code_examples>
## Code Examples

### Section Navigation
```typescript
// Source: src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx
const links = [
  {
    path: "/maintainer",
    label: "Overview",
    active: route.section === "overview",
  },
  {
    path: "/maintainer/validation",
    label: "Validation",
    active: route.section === "validation",
  },
]
```

### Stale-Response Guard
```typescript
// Source: src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts
const requestKey = ++dashboardRequestKeyRef.current
const dashboard = await fetchStewardshipDashboard(gate.session)
if (requestKey !== dashboardRequestKeyRef.current) {
  return
}
setDashboardState({ state: "ready", dashboard })
```

### Backend Dashboard Boundary
```python
# Source: backend/sources/views.py
def dashboard(request: HttpRequest) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error
    return success_response(sources_service.get_stewardship_dashboard())
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| One oversized admin component | Thin shell plus feature-owned pages and shared helpers | Already in place in this repo | Phase 5 can extend the shell instead of replacing it. |
| UI-only readiness counters | Backend-shaped monitoring DTOs | Common in modern brownfield dashboards | Reduces contract drift and makes trust surfaces easier to verify. |
| Mega Playwright specs for everything | Unit/component tests for logic, backend tests for APIs, and small browser smoke coverage | Increasingly preferred for maintainability | Keeps verification fast enough to rerun while still covering the browser journey. |

**New tools/patterns to consider:**
- Request-key guarded data hooks: useful when dashboard state can refresh while users navigate.
- Feature-owned section folders: keeps new admin surfaces isolated without creating a new routing framework.
- MSW-backed request tests: good for response-shape and fallback-state coverage without a live backend.

**Deprecated/outdated:**
- Browser-only dashboard metrics: they drift too easily.
- Public-facing admin navigation: conflicts with the private-maintainer boundary.
- Global stores for every dashboard counter: usually more complexity than this phase needs.
</sota_updates>

<open_questions>
## Open Questions

1. **Which metrics should Chatbot Trust show first?**
   - What we know: The repo already has validation runs, validation results, audit events, and source history.
   - What's unclear: Whether the first release should prioritize grounded vs weak-support counts, recent refusals, source coverage, or another trust summary.
   - Recommendation: Decide this in planning so the backend can shape the right aggregate instead of exposing a vague trust card.

2. **How much of the richer monitoring model should be aggregated versus drill-down only?**
   - What we know: The current dashboard already has summary and detail seams.
   - What's unclear: Which values belong in the top-level cards versus only in Audit Trail or source detail.
   - Recommendation: Keep the overview intentionally small and move deeper evidence into the new sections.

3. **Should Audit Trail stay source-centric or become a broader maintainer event feed?**
   - What we know: The current code already exposes source detail audit history and dashboard audit events.
   - What's unclear: Whether Phase 5 should surface only source/admin events or also trust-related monitoring events.
   - Recommendation: Start source-centric, then extend only if the planner can keep the nav and metrics readable.
</open_questions>

<assumptions_log>
## Assumptions Log

No [ASSUMED] claims were needed. All phase-relevant claims in this research were grounded in repo docs, manifests, or current code inspection.
</assumptions_log>

<validation_architecture>
## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.5 + React Testing Library 16.3.0 + MSW 2.14.3; Django pytest 9.0.3 + pytest-django 4.12.0; Playwright 1.59.1 |
| Config file | `package.json`, `backend/pyproject.toml`, `playwright.config.ts` |
| Quick run command | `pnpm test:unit` |
| Full suite command | `pnpm test:unit && pnpm backend:test && pnpm test:e2e` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ADMIN-01 | Private maintainer views keep source status, validation outcomes, audit entries, and error states readable, actionable, and easy to navigate | unit + backend + browser | `pnpm test:unit && pnpm backend:test && pnpm test:e2e` | No - Wave 0 gaps remain for the new sections |

### Sampling Rate
- Per task commit: `pnpm test:unit` for frontend state and rendering changes, plus `pnpm backend:test` when backend DTOs or views change.
- Per wave merge: `pnpm test:unit && pnpm backend:test && pnpm test:e2e`
- Phase gate: full suite green before `$gsd-verify-work`

### Wave 0 Gaps
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` - add cases for the new first-class `Audit Trail` and `Chatbot Trust` navigation targets.
- `backend/tests/test_admin_stewardship.py` - extend coverage for richer dashboard DTO fields and aggregates.
- `tests/e2e` - add a smoke path that proves the new sections are reachable and readable in the browser.

*(If no gaps: "None - existing test infrastructure covers all phase requirements")*
</validation_architecture>

<security_domain>
## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Admin auth gate / session-aware request checks |
| V3 Session Management | yes | Existing session-aware maintainer fetches and auth failure handling |
| V4 Access Control | yes | Private maintainer boundary, backend route guards, and service-layer checks |
| V5 Input Validation | yes | Validated JSON, typed DTOs, and backend validation helpers |
| V6 Cryptography | yes | Use the existing auth/session libraries; do not hand-roll crypto |

### Known Threat Patterns for React + Django maintainer dashboards

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Broken access control / IDOR on maintainer endpoints | Elevation of privilege | Keep private views behind backend auth and repository checks; never expose audit or trust data without the admin gate. |
| Tampering or injection in admin metadata fields | Tampering | Validate request payloads on the backend and keep dashboard metrics shaped in services, not in ad hoc browser logic. |
| Private operational data leakage into the public shell | Information disclosure | Keep the maintainer console outside learner navigation and preserve the private boundary in routing and links. |
| CSRF or boundary spoofing on mutations | Tampering | Preserve the existing authorized mutation flow and do not weaken the admin request guards when extending the console. |
</security_domain>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/phases/05-admin-ux-polish-for-maintainers/05-CONTEXT.md` - locked Phase 5 decisions and scope.
- `.planning/REQUIREMENTS.md` - `ADMIN-01` maintainer UX requirement and out-of-scope guardrails.
- `.planning/ROADMAP.md` - Phase 5 placement and dependency on Phase 4.
- `.planning/STATE.md` - current milestone state and Phase 5 resume pointer.
- `AGENTS.md` - repository rules for stack, structure, verification, and private maintainer boundaries.
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` - current nav, overview, routing, and workflow card logic.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` - dashboard loading, detail loading, and mutation orchestration.
- `src/lib/maintainer/api.ts` - frontend maintainer DTO and fetch boundary.
- `backend/sources/dtos.py` - dashboard, source detail, and history DTOs.
- `backend/sources/views.py` - auth-gated maintainer dashboard and audit endpoints.
- `backend/validation/views.py` - validation set, run, and run-detail endpoints.
- `graphify-out-merged/GRAPH_REPORT.md` - cross-layer hub map for the maintainer/dashboard flow.

### Secondary (MEDIUM confidence)
- `archive/docs/planning-artifacts/chatbot_admin_improvement_proposal.md` - background ideas that influenced the Phase 5 control-center direction.
- `.planning/phases/03-maintainer-readiness-hardening/03-CONTEXT.md` - prior readiness-first navigation and shell-splitting decisions.

### Tertiary (LOW confidence)
- None - repo-local research was sufficient for this phase.
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: React + Vite SPA maintainer console with Django admin/data seams
- Ecosystem: Tailwind CSS, Vitest, React Testing Library, MSW, Playwright, Django pytest
- Patterns: section-based shell, DTO-driven monitoring, request-key guarded reads, backend-shaped trust/audit surfaces
- Pitfalls: triage wall, hidden trust surface, browser-only metrics, contract drift

**Confidence breakdown:**
- Standard stack: HIGH - versions verified from current repo manifests
- Architecture: HIGH - directly inspected current dashboard, API, and backend code paths
- Pitfalls: HIGH - derived from the repo's current maintainer seams and locked Phase 5 decisions
- Code examples: HIGH - snippets were taken from current project files

**Research date:** 2026-05-10
**Valid until:** 2026-06-09
</metadata>

---

*Phase: 5-Admin UX Polish for Maintainers*
*Research completed: 2026-05-10*
*Ready for planning: yes*
