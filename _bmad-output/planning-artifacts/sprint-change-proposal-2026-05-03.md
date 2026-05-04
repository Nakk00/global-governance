# Sprint Change Proposal - 2026-05-03

## 1. Issue Summary

### Change Trigger
- Triggering story: **Story 5.6 - Build the Private Source Stewardship Dashboard**
- Discovery point: during implementation review and local admin verification, the private `/maintainer` surface proved usable for sign-in, access checks, and read-only stewardship review, but it does not support upload, edit, archive, or ingest actions.

### Core Problem
The current Epic 5 story sequence contains a planning gap. The planning artifacts already require protected maintainer write workflows, but the active story map stops at a read-only dashboard and then jumps directly into retrieval orchestration.

### Evidence
- `prd.md` already requires protected maintainer write operations:
  - `FR36`: maintainers can define, inspect, and manage approved materials
  - `FR37`: maintainers can prepare, upload, or update approved source materials
  - `FR38`: maintainers can trigger or review ingestion, retrieval readiness, and validation status
- `architecture.md` already defines the intended admin API family:
  - `POST /api/admin/sources/upload`
  - `PATCH /api/admin/sources/{sourceId}`
  - `POST /api/admin/sources/{sourceId}/ingest`
- `epics.md` currently places **Story 5.6** immediately before **Story 5.7 - Orchestrate Retrieval-Backed Grounded Answers in Django** with no story owning protected source mutations.
- The implemented Story 5.6 acceptance criteria are inspection-oriented and intentionally stop short of becoming a writable CMS surface.

### Issue Type
- **Misunderstanding or incomplete decomposition of original requirements**
- The requirement is not new. It exists in PRD and architecture, but the implementation breakdown did not assign it to a concrete story.

## 2. Impact Analysis

### Checklist Status

| Checklist Item | Status | Notes |
|---|---|---|
| 1.1 Triggering story identified | [x] Done | Story 5.6 exposed the gap. |
| 1.2 Core problem defined | [x] Done | Existing requirements were not mapped to a concrete story. |
| 1.3 Supporting evidence gathered | [x] Done | PRD, architecture, epics, and implementation behavior all align on the gap. |
| 2.1 Current epic viability | [x] Done | Epic 5 is still viable, but sequencing is incomplete. |
| 2.2 Epic-level changes needed | [x] Done | Add one new Epic 5 story for protected source mutations. |
| 2.3 Remaining planned epics reviewed | [x] Done | Epic 5 backlog is affected; Epic 6 is not directly affected. |
| 2.4 New epic needed? | [N/A] Skip | A new epic is not needed; this belongs inside Epic 5. |
| 2.5 Epic order or priority change | [x] Done | Insert the missing story before retrieval orchestration. |
| 3.1 PRD conflict review | [x] Done | No conflict; PRD already supports the missing workflow. |
| 3.2 Architecture conflict review | [x] Done | No conflict; architecture already sketches the write endpoints. |
| 3.3 UX conflict review | [x] Done | No learner-flow conflict; private maintainer tooling remains outside public UX. |
| 3.4 Secondary artifact review | [!] Action-needed | `sprint-status.yaml` and later story files must be updated after approval. |
| 4.1 Direct adjustment | [x] Viable | Best fit. Moderate effort, low-to-medium risk. |
| 4.2 Potential rollback | [ ] Not viable | Rolling back Story 5.6 would lose useful work and does not solve the decomposition gap. |
| 4.3 PRD MVP review | [ ] Not viable | MVP remains achievable without reducing scope. |
| 4.4 Recommended path selected | [x] Done | Option 1: Direct Adjustment. |
| 5.1-5.5 Proposal components | [x] Done | Included below. |
| 6.1 Proposal completeness review | [x] Done | Analysis is actionable. |
| 6.2 Accuracy review | [x] Done | Recommendation stays aligned with current PRD and architecture. |
| 6.3 User approval | [!] Action-needed | Pending your approval. |
| 6.4 Update sprint status | [!] Action-needed | Do after approval. |
| 6.5 Confirm handoff | [!] Action-needed | Do after approval. |

### Epic Impact
- **Epic 5** remains the correct home for this work.
- The epic can still complete as planned, but it needs one inserted story between the read-only dashboard and retrieval orchestration.
- Retrieval, topic-guard, and chat redesign stories should remain downstream of this new story because they depend on a usable maintainer path for source mutations and ingest reruns.

### Story Impact
- **Story 5.6** remains valid as implemented and should stay focused on inspection and stewardship visibility.
- A **new companion story** is needed for protected write actions.
- Current backlog stories should shift only in sequencing, not in product intent.

### Artifact Conflicts
- **PRD**: no requirement change needed; existing FR36-FR38 already cover the missing workflow.
- **Architecture**: no substantive change required; the planned endpoint family already supports the proposed story.
- **UX design specification**: no learner-facing flow change required; maintainer tooling remains private and outside the public experience.
- **Epics**: needs explicit story insertion.
- **Sprint status**: needs one new backlog entry after approval.

### Technical Impact
- Frontend: private maintainer dashboard gains protected mutation controls and form states.
- Django: admin write endpoints, validation, auth checks, and audit logging become concrete implementation scope.
- Supabase: storage, ingestion, and audit persistence paths are exercised through protected Django operations.
- Testing: access-control, mutation validation, ingest-trigger, and audit-trail coverage should be added.

## 3. Recommended Approach

### Selected Path
**Option 1: Direct Adjustment**

### Recommendation
Insert a new Epic 5 story immediately after Story 5.6 to own protected source mutation workflows in the private maintainer dashboard.

### Why This Path
- It resolves the gap without invalidating completed work.
- It preserves the existing private maintainer boundary.
- It keeps retrieval orchestration dependent on an actual maintainable source lifecycle rather than a partially manual workflow.
- It avoids unnecessary PRD or architecture churn because the higher-level documents are already aligned.

### Effort, Risk, and Timeline
- **Effort:** Medium
- **Risk:** Low to Medium
- **Timeline impact:** Moderate backlog reorganization only; no rollback required

### Scope Framing
The writable maintainer path should support:
- upload approved source materials
- edit source metadata and stewardship fields
- archive or deactivate sources without destructive deletion
- trigger ingest or re-ingest from the source record
- preserve auditability and role-based protection

Hard delete is **not** recommended in the first writable story because the planning artifacts strongly emphasize stewardship, provenance, and protected operations rather than destructive content removal.

## 4. Detailed Change Proposals

### Proposal A - Insert a New Story in `epics.md`

**Artifact:** `_bmad-output/planning-artifacts/epics.md`  
**Section:** Epic 5 story sequence

**OLD**

```md
### Story 5.6: Build the Private Source Stewardship Dashboard
...

### Story 5.7: Orchestrate Retrieval-Backed Grounded Answers in Django
```

**NEW**

```md
### Story 5.6: Build the Private Source Stewardship Dashboard
...

### Story 5.6A: Add Protected Source Mutation Workflows

As a maintainer,
I want protected source upload, editing, archiving, and ingest actions in the private dashboard,
So that I can keep approved materials current without leaving the authenticated stewardship flow.

**Acceptance Criteria:**

**Given** I am an authenticated authorized maintainer
**When** I upload a supported approved-source file with the required metadata
**Then** the source is stored through protected server-side operations
**And** the learner-facing experience exposes no public write path

**Given** I need to correct or refine a source record
**When** I edit metadata or archive a source from the private dashboard
**Then** the change is persisted through protected admin APIs
**And** prior stewardship history remains auditable

**Given** I need retrieval data to reflect a source change
**When** I trigger ingest or re-ingest for that source
**Then** the job runs through the protected ingestion path
**And** I can review job state and outcomes from the dashboard

**Given** my session is invalid, expired, revoked, or unauthorized
**When** I attempt a protected source mutation
**Then** the request is denied safely
**And** no learner-facing route or public UI gains access to the workflow
```

**Rationale**
- This closes the traceability gap between FR36-FR38 and Epic 5 execution.
- `5.6A` is recommended instead of renumbering the remaining backlog stories because it minimizes churn in existing story references, filenames, review artifacts, and sprint tracking.

### Proposal B - Update `sprint-status.yaml` After Approval

**Artifact:** `_bmad-output/implementation-artifacts/sprint-status.yaml`  
**Section:** Epic 5 development status

**OLD**

```yaml
  5-6-build-the-private-source-stewardship-dashboard: review
  5-7-orchestrate-retrieval-backed-grounded-answers-in-django: backlog
  5-8-add-topic-guard-safety-guard-and-guided-chat-suggestions-in-django: backlog
  5-9-redesign-the-source-aware-chat-experience: backlog
  5-10-rehearse-demo-readiness: backlog
  5-11-bootstrap-the-working-environment: backlog
```

**NEW**

```yaml
  5-6-build-the-private-source-stewardship-dashboard: review
  5-6a-add-protected-source-mutation-workflows: backlog
  5-7-orchestrate-retrieval-backed-grounded-answers-in-django: backlog
  5-8-add-topic-guard-safety-guard-and-guided-chat-suggestions-in-django: backlog
  5-9-redesign-the-source-aware-chat-experience: backlog
  5-10-rehearse-demo-readiness: backlog
  5-11-bootstrap-the-working-environment: backlog
```

**Rationale**
- Adds the missing story without renumbering current backlog items.
- Keeps the sprint board readable and low-churn for implementation.

### Proposal C - No PRD Text Change Required

**Artifact:** `_bmad-output/planning-artifacts/prd.md`

**Current Assessment**
- FR36-FR38 already cover the missing behavior.
- No scope increase is required to justify the new story.

**Proposed Action**
- No text edit required unless the team wants to explicitly standardize `archive/deactivate` language in a later refinement pass.

**Rationale**
- The problem is traceability and decomposition, not missing product intent.

### Proposal D - No Architecture Text Change Required

**Artifact:** `_bmad-output/planning-artifacts/architecture.md`

**Current Assessment**
- The architecture already includes:
  - `POST /api/admin/sources/upload`
  - `PATCH /api/admin/sources/{sourceId}`
  - `POST /api/admin/sources/{sourceId}/ingest`

**Proposed Action**
- No immediate architecture edit required for the sprint correction.

**Optional Follow-Up**
- During story authoring, clarify that archive and metadata updates should flow through `PATCH /api/admin/sources/{sourceId}` and that destructive deletion is not part of the initial writable scope.

**Rationale**
- The architecture is already ahead of the story breakdown.

### Proposal E - No UX Spec Change Required

**Artifact:** `_bmad-output/planning-artifacts/ux-design-specification.md`

**Current Assessment**
- The UX spec already states that private maintainer tooling stays outside the public learner flow.

**Proposed Action**
- No immediate UX spec edit required for this correction.

**Optional Follow-Up**
- Add private maintainer form-state notes when the dedicated story file is created, if the team wants stronger implementation guidance for loading, error, and confirmation states.

## 5. Implementation Handoff

### Scope Classification
**Moderate**

### Recommended Handoff
Route to: **Product Owner / Developer**

### Responsibilities
- **Product Owner**
  - approve the sprint change proposal
  - insert the new Epic 5 story into `epics.md`
  - update `sprint-status.yaml`
  - create the dedicated story artifact for `5.6A`
- **Developer**
  - implement the new story after Story 5.6 review is complete
  - add protected mutation UI, Django admin write paths, and regression coverage

### Success Criteria
- Epic 5 explicitly owns protected source upload, metadata editing, archive/deactivate, and ingest-trigger actions.
- Sprint tracking reflects the inserted story.
- Retrieval orchestration remains downstream of a usable maintainer source-mutation workflow.
- Public learner UX remains login-free and does not expose maintainer write controls.

### High-Level Action Plan
1. Approve this sprint change proposal.
2. Update `epics.md` with Story `5.6A`.
3. Update `sprint-status.yaml` with the new backlog entry.
4. Create the dedicated implementation story file for `5.6A`.
5. Implement `5.6A` before starting retrieval orchestration.

## 6. Final Recommendation

Proceed with a **moderate direct-adjustment correction**:
- keep Story 5.6 as the read-only stewardship foundation
- insert **Story 5.6A: Add Protected Source Mutation Workflows**
- leave PRD, architecture, and UX documents unchanged for now
- update the sprint plan and story artifacts after approval

This is the lowest-churn fix that restores alignment between the approved requirements and the implementation sequence.
