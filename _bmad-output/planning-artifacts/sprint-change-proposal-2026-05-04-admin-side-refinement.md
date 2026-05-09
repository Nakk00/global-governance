# Sprint Change Proposal - Admin Side Refinement

**Project:** Global-Governance  
**Date:** 2026-05-04  
**Workflow:** `bmad-correct-course`  
**Mode:** Batch  
**Status:** Approved for canonical artifact update

## 1. Issue Summary

### Change Trigger

The archived proposal `archive/docs/planning-artifacts/global-governance-admin-side-proposal.md` defines a fuller and more implementation-ready admin side than the current canonical BMAD planning artifacts.

This proposal was reviewed after the current Epic 5 state already included:

- Story 5.4 - Django backend foundation
- Story 5.5 - Supabase Auth admin authentication and Django authorization
- Story 5.6 - private source stewardship dashboard
- Story 5.6A - protected source mutation workflows, currently ready for development

### Core Problem

The canonical BMAD artifacts already support the private maintainer direction, but they do not yet fully absorb the admin-side proposal's detailed scope, route structure, information architecture, API surface, schema guidance, validation design, audit expectations, and definition of done.

If the archived proposal remains separate, future agents may treat it as a second source of truth or miss important admin-side requirements during Story 5.6A and later Epic 5 implementation.

### Evidence

- `prd.md` already allows a focused private admin surface for approved-source stewardship, ingestion visibility, and validation support.
- `architecture.md` already defines Django as the admin orchestration boundary and includes a minimal admin endpoint family.
- `epics.md` already includes Story 5.6 and Story 5.6A, but does not explicitly cover chunk inspection, citation inspection, validation runner history, detailed audit logs, admin route IA, or a full admin-side definition of done.
- `ux-design-specification.md` currently says maintainer tooling stays outside the public learner UX, but it does not define the private admin information architecture or operational UI guidance.
- The admin-side proposal gives concrete MVP scope: readiness dashboard, source list/detail, upload/edit/enable-disable/archive, ingestion status, chunk viewer, citation viewer, validation runner, validation history, audit logs, protected APIs, runtime validation, and tests.

### Issue Type

- Planning refinement discovered during sprint execution
- Incomplete decomposition of already-approved maintainer/admin requirements
- Documentation alignment risk across canonical and archived planning artifacts

## 2. Impact Analysis

### Checklist Status

| Checklist Item | Status | Notes |
|---|---|---|
| 1.1 Triggering story identified | [x] Done | Trigger relates to Epic 5 after Story 5.6 and before Story 5.6A implementation. |
| 1.2 Core problem defined | [x] Done | Canonical docs need to absorb the archived admin proposal's concrete decisions. |
| 1.3 Supporting evidence gathered | [x] Done | Evidence from PRD, architecture, epics, UX spec, sprint status, and archived proposal. |
| 2.1 Current epic viability | [x] Done | Epic 5 remains viable and is the correct home. |
| 2.2 Epic-level changes needed | [x] Done | Epic 5 needs sharper admin-side scope and likely story refinement. |
| 2.3 Remaining planned epics reviewed | [x] Done | Epic 6 remains unaffected except that simulator/admin controls stay out of MVP scope. |
| 2.4 New epic needed? | [N/A] Skip | No new epic is needed. |
| 2.5 Epic order or priority change | [x] Done | Story 5.6A should stay next, but its scope should be clarified before development. |
| 3.1 PRD conflict review | [x] Done | No conflict; PRD needs specificity, not a strategic rewrite. |
| 3.2 Architecture conflict review | [x] Done | Architecture aligns but should expand admin routes, schema guidance, and boundaries. |
| 3.3 UX conflict review | [x] Done | UX should add private admin IA and operational UI guidance while preserving public UX. |
| 3.4 Secondary artifact review | [x] Done | Project context, sprint status, and Story 5.6A artifact may need updates after approval. |
| 4.1 Direct adjustment | [x] Viable | Best path: merge decisions into existing PRD, architecture, UX, and Epic 5. |
| 4.2 Potential rollback | [ ] Not viable | Completed Story 5.6 work remains useful. |
| 4.3 PRD MVP review | [ ] Not viable | MVP remains achievable; no scope reduction is recommended. |
| 4.4 Recommended path selected | [x] Done | Direct adjustment with targeted canonical artifact updates. |
| 5.1-5.5 Proposal components | [x] Done | Included below. |
| 6.1 Proposal completeness review | [x] Done | Proposal is actionable and scoped. |
| 6.2 Accuracy review | [x] Done | Recommendation is consistent with current Django/admin direction. |
| 6.3 User approval | [x] Done | User approved the proposal. |
| 6.4 Sprint status update | [x] Done | Sprint tracking updated to include the approved story split. |
| 6.5 Confirm handoff | [x] Done | Canonical artifact update is in progress. |

### Epic Impact

Epic 5 remains the correct epic. The proposal strengthens the current Epic 5 scope rather than changing product direction.

Recommended Epic 5 clarification:

- Keep the epic focused on content stewardship and demo reliability.
- Explicitly define the admin side as a private trust-and-readiness console, not a CMS, learner dashboard, analytics portal, LMS, or generic AI control panel.
- Expand Epic 5 coverage to include admin IA, source lifecycle, ingestion visibility, chunk and citation inspection, validation runs, audit trails, and demo-readiness status.

Epic 6 remains future-facing. The proposal reinforces that simulator controls, broad learner memory, complex roles, source rollback, answer preview, failed-answer review queues, and automated readiness dashboards remain post-MVP unless separately approved.

### Story Impact

Current stories remain directionally valid:

- Story 5.4 establishes Django.
- Story 5.5 protects admin auth and authorization.
- Story 5.6 establishes private read-only stewardship visibility.
- Story 5.6A owns protected source mutations.
- Story 5.10 owns demo rehearsal.
- Story 5.12 owns operational hardening.

Story refinements are recommended:

- Story 5.6 should explicitly cover the private admin route family, readiness overview, source list/detail, ingestion status, validation summary, and recent audit activity.
- Story 5.6A should explicitly cover upload as draft, metadata editing, enable/disable/archive, ingest/re-ingest, user-safe errors, no auto-activation, and audit events.
- Story 5.6B is now approved to own chunk and citation inspection.
- Story 5.6C is now approved to own validation runner execution and validation history.
- Story 5.12 should retain audit, security, release, RLS, and observability hardening and should reference the admin-side audit log expectations.

### Artifact Conflicts

No hard artifact conflict exists. The issue is specificity and canonicalization.

Artifacts needing updates after approval:

- `prd.md`: add the admin-side MVP scope and explicit out-of-scope boundaries.
- `architecture.md`: expand admin route family, endpoint family, data model guidance, storage/upload decision notes, authorization model, and backend responsibilities.
- `epics.md`: refine Story 5.6 and Story 5.6A, and add approved Stories 5.6B and 5.6C.
- `ux-design-specification.md`: add private admin IA and operational UI guidance.
- `_bmad-output/project-context.md`: add agent guardrails for admin-side work.
- `_bmad-output/implementation-artifacts/sprint-status.yaml`: update only if new story IDs are added.
- `_bmad-output/implementation-artifacts/5-6a-add-protected-source-mutation-workflows.md`: update if Story 5.6A remains the next implementation story.

### Technical Impact

Frontend:

- Keep public learner SPA login-free.
- Add or refine private route family under `/maintainer`.
- Keep admin composites outside `src/components/ui`.
- Use shadcn/ui primitives for tables, forms, dialogs, badges, sheets, alerts, skeletons, and inputs.
- Keep admin UI calmer and more operational than the public showcase surface.

Django:

- Continue owning Supabase token verification, maintainer authorization, request validation, response envelopes, source mutations, ingestion orchestration, validation runs, and audit logging.
- Expand protected admin endpoints where needed.
- Return user-safe errors with stable codes.

Supabase:

- Confirm or add tables for sources, source versions, chunks, citations, chunk-citation mapping, ingestion jobs, validation sets/questions/runs/results, audit logs, and maintainers if not already present.
- Keep service-role operations server-side.
- Ensure RLS prevents public source-data mutation.

Testing:

- Add or update tests for admin route guards, source operations, upload form states, ingestion visibility, chunk/citation inspection, validation runner behavior, audit log creation, and public learner login-free behavior.

## 3. Recommended Approach

### Selected Path

**Option 1: Direct Adjustment**

Merge the admin-side proposal's decisions into the existing canonical BMAD planning artifacts without creating a new epic or reopening the Django pivot.

### Recommendation

Proceed with a moderate planning correction:

- Keep the archived admin proposal as historical input.
- Promote its durable decisions into canonical BMAD artifacts.
- Refine Story 5.6A before development begins.
- Split chunk/citation inspection and validation runner scope into companion stories 5.6B and 5.6C so 5.6A stays implementation-ready.
- Rerun implementation readiness after canonical artifacts are updated.

### Why This Path

- The public product vision remains unchanged.
- The learner experience stays login-free.
- The Django plus Supabase backend direction remains intact.
- Story 5.6 work remains useful.
- Story 5.6A becomes clearer and safer to implement.
- Future agents get one canonical planning baseline instead of splitting attention between archive and BMAD output.

### Effort, Risk, and Timeline

- **Effort:** Medium
- **Risk:** Low to Medium
- **Timeline impact:** Moderate planning update before Story 5.6A implementation

### Scope Framing

MVP admin scope should include:

- private maintainer login and protected route family
- readiness dashboard
- source list and source detail
- upload source as draft
- edit metadata
- enable, disable, and archive
- trigger ingest and view ingestion status
- inspect chunks and citations
- run validation and inspect validation history
- view audit logs
- enforce protected Django APIs and runtime validation
- cover route, source, ingestion, validation, and audit behavior in tests

MVP admin scope should exclude:

- learner accounts
- student dashboard
- class analytics
- LMS integration
- public source submission
- internet crawling
- auto-approval of sources
- full CMS for the public site
- general AI prompt playground
- complex enterprise roles
- simulator controls
- broad cross-session learner memory
- admin links in public learner navigation

## 4. Detailed Change Proposals

### Proposal A - Update `prd.md`

**Artifact:** `_bmad-output/planning-artifacts/prd.md`

**Current baseline**

The PRD already says the public site remains login-free and that a focused private admin surface may support approved-source stewardship, ingestion visibility, and validation.

**Proposed change**

Add a short subsection under MVP scope or Maintainer & Content Stewardship:

```md
The private admin side is a maintainer-only trust-and-readiness console. It exists to protect the grounded chatbot model by managing approved sources, ingestion readiness, citation inspectability, validation runs, audit history, and demo readiness. It is not a public CMS, learner dashboard, analytics portal, LMS, or general AI control panel.

MVP admin capabilities include private maintainer login, protected route access, readiness overview, source list/detail, source upload as draft, metadata editing, enable/disable/archive actions, ingestion trigger and status, chunk and citation inspection, validation runner and history, audit logs, protected Django APIs, runtime validation, user-safe errors, and tests for protected admin behavior.
```

Also add explicit out-of-scope language:

```md
The admin MVP does not include learner accounts, student dashboards, classroom analytics, LMS integration, public source submission, internet crawling, auto-approval of sources, full CMS editing of the public site, simulator controls, general AI playgrounds, broad cross-session learner memory, or admin links in the public learner navigation.
```

**Rationale**

This keeps the product promise narrow: the admin side exists only to support source trust and demo readiness.

### Proposal B - Update `architecture.md`

**Artifact:** `_bmad-output/planning-artifacts/architecture.md`

**Current baseline**

The architecture defines a minimal admin API family:

```md
- `GET /api/admin/me`
- `GET /api/admin/sources`
- `POST /api/admin/sources/upload`
- `PATCH /api/admin/sources/{sourceId}`
- `POST /api/admin/sources/{sourceId}/ingest`
- `GET /api/admin/ingestion-jobs`
- `POST /api/admin/validation-runs`
- `GET /api/admin/audit-logs`
```

**Proposed change**

Expand the protected admin endpoint family:

```md
- `GET /api/admin/me`
- `GET /api/admin/sources`
- `POST /api/admin/sources/upload`
- `GET /api/admin/sources/{sourceId}`
- `PATCH /api/admin/sources/{sourceId}`
- `POST /api/admin/sources/{sourceId}/activate`
- `POST /api/admin/sources/{sourceId}/disable`
- `POST /api/admin/sources/{sourceId}/archive`
- `POST /api/admin/sources/{sourceId}/ingest`
- `GET /api/admin/ingestion-jobs`
- `GET /api/admin/ingestion-jobs/{jobId}`
- `POST /api/admin/ingestion-jobs/{jobId}/retry`
- `GET /api/admin/sources/{sourceId}/chunks`
- `GET /api/admin/sources/{sourceId}/citations`
- `GET /api/admin/chunks/{chunkId}`
- `GET /api/admin/citations/{citationId}`
- `GET /api/admin/validation-sets`
- `POST /api/admin/validation-runs`
- `GET /api/admin/validation-runs`
- `GET /api/admin/validation-runs/{runId}`
- `GET /api/admin/audit-logs`
- `GET /api/admin/audit-logs/{auditLogId}`
```

Add schema guidance for:

```md
- `sources`
- `source_versions`
- `source_chunks`
- `source_citations`
- `chunk_citations`
- `ingestion_jobs`
- `validation_sets`
- `validation_questions`
- `validation_runs`
- `validation_results`
- `audit_logs`
- `maintainers`, if database-backed authorization is selected
```

Add upload-flow guidance:

```md
The MVP upload flow should prefer Django-mediated uploads for simplicity unless file size or storage constraints require signed upload URLs. Uploaded sources should begin as draft and inactive. Activation should occur only after metadata review, ingestion, and validation.
```

**Rationale**

The current architecture is directionally correct but does not yet give implementation agents enough route, schema, or lifecycle detail.

### Proposal C - Update `epics.md`

**Artifact:** `_bmad-output/planning-artifacts/epics.md`

**Current Story 5.6**

Story 5.6 focuses on a private dashboard for read-only stewardship visibility.

**Proposed Story 5.6 refinement**

Add acceptance criteria for:

```md
**Given** I access the private maintainer route family
**When** I navigate between dashboard, sources, ingestion, validation, and audit views
**Then** each route remains protected by maintainer authentication and authorization
**And** no route is exposed through public learner navigation

**Given** the dashboard loads
**When** I review readiness cards
**Then** I can see source readiness, latest ingestion state, validation summary, recent audit activity, and demo-readiness blockers
**And** the dashboard helps answer whether the chatbot is ready for demo

**Given** I inspect a source detail view
**When** source metadata, version, ingestion, chunk, citation, validation, and audit summaries are available
**Then** I can understand source state without direct database access
**And** the view remains source-stewardship scoped rather than becoming a general CMS
```

**Current Story 5.6A**

Story 5.6A covers upload, metadata edit/archive, ingest, and denied mutation attempts.

**Proposed Story 5.6A refinement**

Add acceptance criteria for:

```md
**Given** I upload a source
**When** the upload succeeds
**Then** the source starts as draft and inactive
**And** it is not available for chatbot retrieval until explicitly approved, ingested, validated, and activated

**Given** I activate, disable, or archive a source
**When** the action completes
**Then** retrieval eligibility changes only according to that protected action
**And** an audit event records who changed what and when

**Given** an upload, metadata edit, or ingest request fails validation
**When** the API responds
**Then** the UI shows a user-safe error code and recovery path
**And** raw server traces are never exposed
```

**Potential new story**

Add approved Story 5.6B for chunk/citation inspection:

```md
### Story 5.6B: Inspect Retrieval Chunks and Citations

As a maintainer,
I want to inspect chunks and citations generated from approved source versions,
So that I can verify what the chatbot can retrieve and cite before demo.
```

Add approved Story 5.6C for validation runner and validation history:

```md
### Story 5.6C: Run Admin Validation Checks

As a maintainer,
I want to run validation sets and inspect validation history from the private admin surface,
So that I can verify grounded, weak-support, refusal, and citation behavior before demo.
```

**Rationale**

Story 5.6A is currently next in sprint status. Refining it before development avoids hiding too much work inside one ambiguous story.

### Proposal D - Update `ux-design-specification.md`

**Artifact:** `_bmad-output/planning-artifacts/ux-design-specification.md`

**Current baseline**

The UX spec says the public learner experience remains login-free and maintainer tooling stays outside the public UX path.

**Proposed change**

Add a private admin UX subsection under Scope Boundaries or Component Strategy:

```md
The private maintainer surface should use a calmer operational expression of the Global Governance visual language. It should support `/maintainer/login`, `/maintainer/dashboard`, `/maintainer/sources`, `/maintainer/sources/:sourceId`, `/maintainer/ingestion`, `/maintainer/validation`, and `/maintainer/audit-logs`.

The admin UI should emphasize source stewardship, status scanning, protected actions, validation readiness, and audit traceability. It should use shadcn/ui primitives for tables, forms, dialogs, sheets, badges, alerts, skeletons, inputs, and status controls. It should avoid public-showcase motion, 3D, marketing hero treatment, and vague labels such as AI settings or bot brain.
```

Add status badge guidance:

```md
Admin status badges should cover Draft, Approved, Active, Disabled, Archived, Pending, Processing, Completed, Failed, Pass, Weak Support, Refused, and Error.
```

**Rationale**

This keeps the admin surface coherent with the product while making it more work-focused than the public educational experience.

### Proposal E - Update `_bmad-output/project-context.md`

**Artifact:** `_bmad-output/project-context.md`

**Proposed additions**

Add critical agent rules:

```md
- Treat the admin side as a private source-stewardship and demo-readiness console, not a CMS, learner dashboard, LMS, analytics portal, simulator control panel, or general AI playground.
- Keep admin routes under a clearly private route family such as `/maintainer/*`; never link them from public learner navigation.
- Admin browser code may call protected Django endpoints after maintainer auth, but it must never mutate Supabase Storage, retrieval tables, chunk tables, citation tables, validation records, or audit logs directly.
- Uploaded sources should not auto-activate for retrieval; they should pass review, ingestion, validation, and explicit activation.
- Dangerous source actions such as disable, archive, activate, ingest, and re-ingest should create audit records.
```

**Rationale**

Project context is what future coding agents are most likely to read before implementation. These rules reduce drift.

### Proposal F - Sprint Status and Story Artifact Follow-Up

**Artifact:** `_bmad-output/implementation-artifacts/sprint-status.yaml`

**Current baseline**

```yaml
5-6a-add-protected-source-mutation-workflows: ready-for-dev
5-7-orchestrate-retrieval-backed-grounded-answers-in-django: backlog
```

**Recommended action**

Story 5.6B and Story 5.6C are approved and should be added to sprint status:

```yaml
5-6a-add-protected-source-mutation-workflows: ready-for-dev
5-6b-inspect-retrieval-chunks-and-citations: backlog
5-6c-run-admin-validation-checks: backlog
5-7-orchestrate-retrieval-backed-grounded-answers-in-django: backlog
```

**Rationale**

Avoid unnecessary churn unless the team chooses to split the admin proposal into smaller implementation slices.

## 5. Implementation Handoff

### Scope Classification

**Moderate**

This is a planning refinement and backlog clarification inside an already-approved Epic 5 direction. It does not require another strategic backend pivot.

### Recommended Handoff

Route to: **Product Owner / Developer**

### Responsibilities

Product Owner / Planning:

- Approve this sprint change proposal.
- Update PRD, architecture, UX, epics, and project context with the durable admin-side decisions.
- Preserve the approved split between Story 5.6A, Story 5.6B, and Story 5.6C.
- Refresh sprint status and implementation artifacts for the new story IDs.

Developer:

- Before implementing Story 5.6A, inspect existing code to answer the proposal's open implementation questions.
- Keep public learner routes login-free.
- Keep privileged mutations in Django.
- Add tests according to the refined story scope.

### Success Criteria

- The archived admin proposal no longer functions as a parallel source of truth.
- Canonical BMAD artifacts clearly define the admin side as a private trust-and-readiness console.
- Story 5.6A is implementation-ready with upload, edit, archive/disable/activate, ingestion, audit, and safe-error expectations.
- Chunk/citation inspection and validation runner scope is split into clear companion stories `5.6B` and `5.6C`.
- Public learner UX remains login-free and does not expose admin navigation.
- Implementation readiness is rerun after canonical artifacts are updated.

### High-Level Action Plan

1. Approve this sprint change proposal.
2. Update `prd.md`.
3. Update `architecture.md`.
4. Update `ux-design-specification.md`.
5. Update `epics.md`.
6. Update `_bmad-output/project-context.md`.
7. Update Story `5.6A` and add Story `5.6B` and Story `5.6C` to sprint tracking and implementation artifacts.
8. Run `bmad-check-implementation-readiness`.
9. Run `bmad-sprint-status` to confirm the next implementation step.

## 6. Approval Gate

Approval requested:

- `yes` - approve this sprint change proposal and proceed to update canonical BMAD artifacts.
- `revise` - keep the direction but adjust the proposed scope or story split.
- `no` - leave the admin-side proposal as archived context only.

## 7. Final Recommendation

Approve a **moderate direct-adjustment correction**.

The admin-side proposal is valuable and should be merged into the canonical BMAD planning set, but as extracted decisions rather than pasted wholesale. The best next implementation path is to clarify Story 5.6A, then carry chunk/citation inspection in Story 5.6B and admin validation execution in Story 5.6C, with Epic 5 continuing from one canonical source of truth.
