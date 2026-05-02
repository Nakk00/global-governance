# Sprint Change Proposal - Django Backend Pivot for Chatbot and Admin Stewardship

**Project:** Global-Governance  
**Date:** 2026-05-02  
**Workflow:** `bmad-correct-course`  
**Mode:** Batch (assumed from explicit user direction)  
**Status:** Approved for implementation planning

## 1. Issue Summary

### Problem Statement

The active planning set currently treats **Supabase Edge Functions** as the backend/API layer for chatbot orchestration, retrieval, topic checks, and ingestion, while also treating maintainer operations as a **local workflow without a private dashboard**.

That is now out of date.

The user has explicitly approved a **strategic architecture pivot**:

1. **Replace the current chatbot backend direction based on Supabase Edge Functions with Django**
2. **Adopt Supabase Auth for private admin authentication**
3. **Add a private Admin Dashboard for source stewardship**

This is not a minor backlog tweak. It changes a core implementation boundary that appears across the PRD, architecture, project context rules, Epic 5 story sequencing, and current sprint status.

### Trigger Context

The pivot became explicit on **2026-05-02** after reviewing:

- the current planning artifacts under `_bmad-output/planning-artifacts`
- the already approved chatbot architecture and chatbot UI sprint-change proposals from **2026-05-01**
- the archived proposal `archive/docs/planning-artifacts/global-governance-supabase-auth-django-admin-dashboard-proposal.md`

Unlike the May 1 corrections, this change is not only about improving the current chat path. It changes **which backend platform owns the chat path**.

### Evidence

- `architecture.md` currently says: use Supabase Edge Functions as the backend/API layer for chat, retrieval, topic guard orchestration, and ingestion utilities.
- `architecture.md` currently says: no public maintainer dashboard in the MVP, and maintainer actions happen through local scripts, Supabase CLI workflows, and protected project access.
- `_bmad-output/project-context.md` currently instructs agents to keep privileged retrieval, ingestion, and citation packaging inside Supabase Edge Functions.
- `epics.md` currently sequences Epic 5 around the Edge Function path, with retrieval and safety stories already defined against that architecture.
- `sprint-status.yaml` currently marks `5-4-orchestrate-retrieval-backed-grounded-answers` and `5-6-redesign-the-source-aware-chat-experience` as ready for development under the old backend assumption.
- The approved archived proposal explicitly replaces or supplements the Edge Function backend direction with Django and adds Supabase Auth plus a private Admin Dashboard.

### Issue Type

- Strategic pivot or market change
- New requirement emerged from stakeholders
- Failed approach requiring different solution only at the architecture-boundary level, not at the public product vision level

## 2. Impact Analysis

### Epic Impact

#### Current Epic Affected

Epic `5 Content Stewardship and Demo Reliability` is directly affected and can no longer be completed safely as currently sequenced.

The epic still owns the right capability area, but its backend implementation path is no longer correct. The stories that were preparing to deepen the Edge Function path should pause until the architecture and backlog are rewritten around Django.

#### Additional Epic-Level Impact

Epic `4 Grounded Guidance and Trust` is indirectly affected.

Its public chat outcomes remain valid, but its implementation assumptions now depend on a different backend service boundary. The frontend contract should stay as stable as possible, but the backend ownership model changes underneath it.

Epic `6 Adaptive Presentation and Future Expansion` is indirectly affected.

It should remain mostly intact, but any future chat-depth or richer assistant behavior should now assume a Django-backed orchestration layer rather than a Supabase Edge Function expansion path.

### Story Impact

#### Stories That Remain Directionally Valid

- `5.1 Manage Approved Source Bundles`
- `5.2 Prepare Sources for Ingestion`
- `5.3 Validate Chatbot Boundaries`
- `5.6 Redesign the Source-Aware Chat Experience` as a product goal, though its dependency chain changes

These stories still describe valid product or operations outcomes. What changes is the **implementation path**, not the need for source governance, ingestion, trust boundaries, and premium chat UX.

#### Stories Requiring Redefinition or Re-sequencing

- `5.4 Orchestrate Retrieval-Backed Grounded Answers`
- `5.5 Add Topic Guard, Safety Guard, and Guided Chat Suggestions`
- `5.8 Bootstrap the Working Environment`

These stories currently assume an Edge Function-owned backend path or a local-workflow-only maintainer model. They need either redefinition or insertion of prerequisite stories before they can proceed safely.

#### New Story Gaps Identified

At minimum, the backlog now needs explicit stories for:

1. Django backend foundation and service setup
2. Supabase Auth integration for private admin login
3. Django-side admin authorization and session verification
4. Private source stewardship dashboard flows
5. Django-owned ingestion, retrieval, and validation orchestration

### Artifact Conflicts

#### PRD

The PRD is partially compatible with the pivot, but several sections now conflict with the approved direction.

Conflicts and update needs:

- The product still correctly states that learner use remains account-free.
- The PRD out-of-scope language currently excludes account systems unless scope changes. Scope has now changed, so the PRD must explicitly distinguish:
  - **no learner auth**
  - **private maintainer auth allowed**
- The maintainer journey currently centers on local workflow reliability. It must expand to include a **private admin stewardship path** while preserving clean-clone reproducibility.
- MVP scope must be updated to include the Django backend shift and the private admin dashboard if both remain approved MVP items.

#### Architecture

The architecture document has the strongest direct conflict.

Sections requiring revision include:

- critical decisions
- authentication and security
- API and communication patterns
- infrastructure and deployment
- project structure and boundaries
- implementation sequence
- external integrations

The largest conflicts are:

- Edge Functions are currently defined as the primary backend/API layer.
- Edge Functions are currently the only allowed privileged orchestration layer.
- maintainer operations are currently defined as local-script and CLI only.
- the document does not yet describe a Django service boundary, Django deployment, Django app structure, or Django-Supabase responsibility split.

#### UX Design

The public learning UX remains mostly compatible, but the UX specification now needs a meaningful extension.

Revisions needed:

- preserve the existing public `Source-Aware Chat Panel` behavior and session-local continuity
- add a **private admin dashboard UX surface**
- define admin login, dashboard overview, source table, source detail, upload flow, ingestion status, validation flow, and audit visibility

This is a moderate UX impact, not a full UX restart.

#### Additional Artifacts

Secondary artifacts needing updates:

- `_bmad-output/project-context.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- implementation artifacts for backend-affected Epic 5 stories
- testing strategy guidance for backend and integration coverage
- environment and local workflow documentation
- any future CI/CD notes that assume Supabase Edge Function deployment as the only backend deployment path

### Technical Impact

- The current Edge Function chatbot path becomes a temporary or superseded implementation, not the target backend architecture.
- The backend must now be split between:
  - React + Vite frontend
  - Django backend service
  - Supabase Auth, Storage, Postgres, and pgvector
- The frontend chat contract should ideally remain stable so public UX work does not need unnecessary rewrites.
- Ingestion, retrieval, topic guard, safety guard, validation, and citation packaging must move from the Edge Function planning boundary into the Django planning boundary.
- Local setup complexity increases because the project now needs a Django runtime, Django environment configuration, and likely a dual-service development workflow.

### Sprint Status Impact

The current sprint status is no longer trustworthy for backend-related next steps.

In particular:

- `5-4-orchestrate-retrieval-backed-grounded-answers: ready-for-dev` should not proceed under the old plan
- `5-6-redesign-the-source-aware-chat-experience: ready-for-dev` should pause until its new backend dependencies are clarified

These entries need to be revised after this proposal is approved.

## 3. Recommended Approach

### Selected Path

**Hybrid, led by Option 1: Direct Adjustment with Architecture Rebaseline**

Use direct adjustment to preserve the public product vision, the approved chat UX direction, and the valid source-governance work already completed. Pair that with a **major architecture rebaseline** across PRD, architecture, epics, and sprint planning before new backend implementation continues.

### Why This Is Recommended

- It preserves the public-facing product concept instead of restarting the project.
- It respects the newly approved user decision to learn Django through real backend ownership.
- It prevents more implementation drift on Edge-Function-based stories that are no longer architecturally correct.
- It keeps completed frontend and source-governance progress useful where possible.
- It gives the team a clear, explicit planning baseline before more code work begins.

### Alternatives Considered

#### Option 2: Potential Rollback

**Not recommended as the primary path**

A full rollback of recent Epic 5 work would throw away useful source-governance, ingestion-shape, and UX planning progress. Some implementation artifacts will become partially obsolete, but that is not the same as requiring full rollback.

Effort: High  
Risk: High

#### Option 3: PRD MVP Review

**Useful only as a supporting step, not the main strategy**

The MVP definition must be reviewed and clarified, but the goal is not to reduce the product. The goal is to **change the backend implementation path** while preserving the approved product intent.

Effort: Medium  
Risk: Medium

### Effort, Risk, Timeline

- Effort: High
- Risk: Medium to High
- Timeline impact: Significant replanning before safe continuation of backend-heavy Epic 5 work

### Recommendation Summary

Do not continue backend-related Epic 5 development under the current Edge Function planning baseline.  
Do not restart the whole product.  
Instead, pause, rewrite the planning artifacts around Django, regenerate the backlog and sprint status, then resume implementation from the new backend foundation.

## 4. Detailed Change Proposals

### A. Epic and Story Backlog Changes

#### Proposal A1 - Redefine Epic 5 to include private admin operations explicitly

**Artifact:** `epics.md`  
**Section:** Epic 5 title and description

**OLD:**

```md
### Epic 5: Content Stewardship and Demo Reliability

Maintainers can manage approved source material, validate chatbot behavior, and rehearse a stable classroom demo that keeps the core experience reliable.
```

**NEW:**

```md
### Epic 5: Content Stewardship, Private Admin Operations, and Demo Reliability

Maintainers can manage approved source material through a private operational surface, validate Django-backed chatbot behavior, and rehearse a stable classroom demo that keeps the core experience reliable.
```

**Rationale:** Epic 5 still owns the right domain, but it must now include private admin operations explicitly.

#### Proposal A2 - Insert Django foundation work before retrieval and chat redesign

**Artifact:** `epics.md`  
**Section:** Epic 5 story ordering

**OLD direction:**

```md
5.4 Orchestrate Retrieval-Backed Grounded Answers
5.5 Add Topic Guard, Safety Guard, and Guided Chat Suggestions
5.6 Redesign the Source-Aware Chat Experience
5.7 Rehearse Demo Readiness
5.8 Bootstrap the Working Environment
```

**NEW direction:**

```md
5.4 Establish the Django Backend Foundation
5.5 Add Supabase Auth Admin Authentication and Django Authorization
5.6 Build the Private Source Stewardship Dashboard
5.7 Orchestrate Retrieval-Backed Grounded Answers in Django
5.8 Add Topic Guard, Safety Guard, and Guided Chat Suggestions in Django
5.9 Redesign the Source-Aware Chat Experience
5.10 Rehearse Demo Readiness
5.11 Bootstrap the Working Environment
```

**Rationale:** The chat redesign and demo rehearsal should not proceed on top of an implementation path the project has just rejected.

#### Proposal A3 - Preserve already valid source-governance outcomes

**Artifact:** `epics.md`  
**Section:** Story disposition notes

**Disposition to document:**

- Keep `5.1`, `5.2`, and `5.3` as valid completed/planned capability outcomes
- Mark their implementation assumptions as partially superseded where they depended specifically on Edge Function ownership
- Reuse their acceptance criteria where still applicable to Django-backed stories

**Rationale:** This avoids unnecessary loss of momentum while still acknowledging the architecture pivot.

### B. PRD Modifications

#### Proposal B1 - Clarify the account boundary after scope change

**Artifact:** `prd.md`  
**Section:** Out of Scope

**OLD:**

```md
- LMS integration, classroom analytics, or account systems unless project scope changes
```

**NEW:**

```md
- learner account systems, LMS integration, or classroom analytics
- private maintainer authentication is allowed for source stewardship and operations
```

**Rationale:** The project still rejects learner auth, but it now explicitly allows private maintainer auth.

#### Proposal B2 - Update MVP scope to include the Django backend pivot

**Artifact:** `prd.md`  
**Sections:** MVP scope, maintainer journey, technical architecture considerations

**NEW planning intent to add:**

- The public site remains a login-free React + Vite educational SPA.
- The chatbot backend is implemented through Django rather than Supabase Edge Functions.
- Supabase Auth may be used for private maintainer login only.
- A private admin dashboard may be included for approved-source stewardship if retained in MVP.

**Rationale:** The MVP definition must state the approved implementation boundary clearly so later stories do not drift.

#### Proposal B3 - Expand maintainer workflow language

**Artifact:** `prd.md`  
**Section:** Journey 4 — Project Maintainer or Admin Readiness Path

**OLD emphasis:** local workflow and demo preparation only  
**NEW emphasis:** local reproducibility plus optional private admin dashboard operations for approved-source management

**Rationale:** The maintainer path now includes an authenticated operational surface.

### C. Architecture Modifications

#### Proposal C1 - Replace the backend/API layer decision

**Artifact:** `architecture.md`  
**Sections:** critical decisions, API boundaries, service boundaries

**OLD:**

```md
Use Supabase Edge Functions as the backend/API layer for chat, retrieval, topic guard orchestration, and ingestion utilities.
```

**NEW:**

```md
Use Django as the backend/API orchestration layer for chat, retrieval, topic guard, safety guard, ingestion, admin APIs, and citation packaging, while keeping Supabase as the platform for Auth, Storage, Postgres, and pgvector.
```

**Rationale:** This is the central architecture pivot and must be stated explicitly.

#### Proposal C2 - Replace the maintainer-operations boundary

**Artifact:** `architecture.md`  
**Sections:** authentication and security, architectural boundaries

**OLD:**

```md
- No public maintainer dashboard in the MVP.
- Maintainer actions happen through local scripts, Supabase CLI workflows, and protected project access.
```

**NEW:**

```md
- No learner authentication in the MVP.
- No public maintainer dashboard linked from the public experience.
- A private maintainer dashboard is allowed for approved-source stewardship.
- Maintainer actions may happen through both local workflows and authenticated Django-backed admin operations.
```

**Rationale:** This preserves the public product boundary while allowing the newly approved private admin capability.

#### Proposal C3 - Update structure and deployment guidance

**Artifact:** `architecture.md` and `_bmad-output/project-context.md`

**Required updates:**

- replace Edge-Function-only privileged backend guidance with Django-backend guidance
- define Django service placement in the repo
- define frontend-to-Django and Django-to-Supabase responsibility boundaries
- update local development workflow from `Vite + Supabase CLI` only to a multi-service workflow
- update deployment guidance for Django runtime, environment variables, and logs

**Rationale:** The repo’s current project-context rules would otherwise keep pushing future implementation back toward Edge Functions.

### D. UX Design Modifications

#### Proposal D1 - Preserve public chat UX while adding admin surfaces

**Artifact:** `ux-design-specification.md`

**Existing public UX to preserve:**

- `Source-Aware Chat Panel`
- guided topic cards
- session-local thread continuity
- visible citations and fallback states

**New UX scope to add:**

- private admin login page
- dashboard overview
- source materials table
- source detail and upload flow
- ingestion status view
- validation and audit surfaces

**Rationale:** The public experience remains aligned, but the project now includes a second authenticated UX surface.

### E. Sprint Status and Implementation Artifact Changes

#### Proposal E1 - Freeze backend-ready stories until replanning is merged

**Artifact:** `_bmad-output/implementation-artifacts/sprint-status.yaml`

**Current problematic entries:**

```yaml
5-4-orchestrate-retrieval-backed-grounded-answers: ready-for-dev
5-6-redesign-the-source-aware-chat-experience: ready-for-dev
```

**Recommended update after proposal approval:**

```yaml
5-4-establish-the-django-backend-foundation: backlog
5-5-add-supabase-auth-admin-authentication-and-django-authorization: backlog
5-6-build-the-private-source-stewardship-dashboard: backlog
5-7-orchestrate-retrieval-backed-grounded-answers-in-django: backlog
5-8-add-topic-guard-safety-guard-and-guided-chat-suggestions-in-django: backlog
5-9-redesign-the-source-aware-chat-experience: backlog
5-10-rehearse-demo-readiness: backlog
5-11-bootstrap-the-working-environment: backlog
```

**Rationale:** The sprint tracker must stop signaling that Edge-Function-based backend stories are safe to start immediately.

#### Proposal E2 - Mark May 1 change proposals as partially superseded

**Artifacts:**

- `_bmad-output/planning-artifacts/sprint-change-proposal-2026-05-01.md`
- `_bmad-output/planning-artifacts/sprint-change-proposal-2026-05-01-chatbot-ui-redesign.md`

**Supersession rule to document:**

- the May 1 proposals remain valid in product intent
- they are superseded where they assume Supabase Edge Functions remain the target backend path

**Rationale:** This keeps history understandable instead of silently contradicting it.

## 5. Implementation Handoff

### Scope Classification

**Major**

This change alters the core backend architecture, the maintainership model, the sprint sequence, and the implementation rules future agents will follow.

### Recommended Handoff

#### Product Manager / Solution Architect

Responsibilities:

- finalize the approved pivot as a planning decision
- revise PRD and architecture baselines
- define the official Django/Supabase responsibility split
- decide whether the private admin dashboard is MVP-required or MVP-preferred

#### Product Owner / Developer

Responsibilities:

- rewrite Epic 5 stories and sequencing
- update sprint status
- retire or supersede Edge-Function-specific implementation assumptions
- prepare the next implementation-ready story after the architecture rebaseline

#### Developer Agent

Responsibilities after planning updates are approved:

- establish the Django project foundation
- integrate Supabase Auth verification
- rebuild retrieval, ingestion, and topic/safety orchestration behind Django
- preserve the frontend chat contract where practical

### Success Criteria for the Pivot

- PRD, architecture, epics, UX, and sprint status no longer contradict the Django decision
- learner experience remains login-free
- private admin flows are clearly separated from the public site
- backend responsibilities are clearly split between Django and Supabase
- the next story to implement is Django foundation work, not more Edge-Function deepening

## 6. Checklist Status Snapshot

- [x] 1.1 Trigger identified
- [x] 1.2 Core problem defined
- [x] 1.3 Evidence gathered
- [x] 2.1 Current epic impact assessed
- [x] 2.2 Epic-level changes identified
- [x] 2.3 Remaining epic impact reviewed
- [x] 2.4 New epic/story gaps identified
- [x] 2.5 Sequencing impact identified
- [x] 3.1 PRD conflicts reviewed
- [x] 3.2 Architecture conflicts reviewed
- [x] 3.3 UX conflicts reviewed
- [x] 3.4 Secondary artifact impact reviewed
- [x] 4.1 Direct adjustment evaluated
- [x] 4.2 Rollback evaluated
- [x] 4.3 PRD MVP review evaluated
- [x] 4.4 Recommended path selected
- [x] 5.1 Issue summary prepared
- [x] 5.2 Impact and artifact adjustments documented
- [x] 5.3 Recommended path and rationale documented
- [x] 5.4 MVP impact and action plan defined
- [x] 5.5 Agent handoff plan defined
- [x] 6.1 Internal review complete
- [x] 6.2 Proposal accuracy reviewed
- [x] 6.3 User approval obtained on 2026-05-02
- [x] 6.4 Sprint status update completed after approval
- [x] 6.5 Final handoff confirmation prepared

## 7. Approval Gate

This proposal recommends a **major replanning pass before additional backend-heavy implementation continues**.

Approval decision requested:

- `yes` — approve this sprint change proposal for implementation planning
- `revise` — keep the Django pivot but adjust the proposal details
- `no` — reject this proposal and keep the current backend direction

## 8. Approval Outcome and Handoff

### Approval Outcome

The user approved this sprint change proposal on **2026-05-02**.

### Handoff Direction

This approved change should now route to:

- **Product Manager / Solution Architect** for PRD and architecture rebaseline
- **Product Owner / Developer** for Epic 5 rewrite and sprint tracker realignment
- **Developer Agent** only after those planning artifacts are updated

### Immediate Next Step

The next safe planning action is:

1. update the PRD to reflect the Django backend and private maintainer-auth boundary
2. rewrite the architecture baseline around Django + Supabase responsibilities
3. regenerate Epic 5 sequencing and story set
4. refresh implementation readiness and sprint planning before new backend development resumes
