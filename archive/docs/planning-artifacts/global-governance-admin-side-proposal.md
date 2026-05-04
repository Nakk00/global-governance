# Global Governance Admin Side Proposal

**Project:** Global-Governance  
**Prepared for:** Coding Agent implementation handoff  
**Author context:** Based on the uploaded planning artifacts and the current admin-side discussion  
**Last updated:** 2026-05-03  
**Status:** Proposal for implementation refinement

---

## 1. Executive Summary

The admin side of **Global Governance** should be implemented as a **private source-stewardship and demo-readiness dashboard**, not as a public CMS, learner dashboard, LMS, analytics portal, or general-purpose AI control panel.

The public product remains a **login-free educational single-page experience** for students, classmates, and evaluators. The admin side exists only to protect the trust model behind the grounded chatbot: approved source management, ingestion visibility, citation inspection, validation runs, audit logs, and demo readiness checks.

The core thesis for the admin side is:

> The public site teaches Global Governance beautifully; the private admin side protects the trustworthiness of the chatbot by controlling, validating, and auditing the approved materials the chatbot can use.

This proposal should be treated as a focused extension of the approved architecture:

- Frontend: React + Vite + TypeScript SPA with Tailwind CSS and shadcn/ui.
- Backend: Django as the orchestration boundary for chat, retrieval, ingestion, validation, citation packaging, and admin-protected operations.
- Auth: Supabase Auth for private maintainers only.
- Data platform: Supabase Storage, Supabase Postgres, and pgvector.
- Protection: Redis only for public-chat protection and short-lived operational state where appropriate.
- Learner experience: no learner login and no public link to admin routes.

---

## 2. Why the Admin Side Exists

The admin side exists because the chatbot is not meant to behave like a generic AI assistant. It is a **bounded academic course assistant** that should answer from approved project materials, cite those materials, refuse off-topic prompts, and communicate weak support instead of inventing confidence.

That means the system needs maintainers to control:

1. Which sources are allowed.
2. Whether each source is draft, approved, active, disabled, archived, or superseded.
3. Whether the source was ingested correctly.
4. Whether chunks and citations are usable.
5. Whether validation questions pass before a demo.
6. Whether recent changes are traceable through audit logs.

Without an admin side, the approved-source workflow can still exist through scripts, but it becomes harder to inspect and explain. The admin dashboard gives maintainers and reviewers a safer operational surface without requiring direct database access.

---

## 3. Current Project State to Respect

The coding agent should not treat this as a blank-slate admin product. The current project already has a planning direction and implementation status.

### Relevant current status

From `sprint-status.yaml`:

- Epic 1: Guided Learning Journey — done
- Epic 2: UN Institutional Explorer — done
- Epic 3: West Philippine Sea Case Dossier — in progress, major stories done
- Epic 4: Grounded Guidance and Trust — in progress, major stories done
- Epic 5: Content Stewardship and Demo Reliability — in progress
  - 5-1 manage approved source bundles — done
  - 5-2 prepare sources for ingestion — done
  - 5-3 validate chatbot boundaries — done
  - 5-4 establish Django backend foundation — done
  - 5-5 add Supabase Auth admin authentication and Django authorization — done
  - 5-6 build private source stewardship dashboard — review
  - 5-7 orchestrate retrieval-backed grounded answers in Django — backlog
  - 5-8 add topic guard, safety guard, and guided suggestions in Django — backlog
  - 5-9 redesign source-aware chat experience — backlog
  - 5-10 rehearse demo readiness — backlog
  - 5-11 bootstrap working environment — backlog

### Interpretation

The admin side should be improved from the current `5-6` review state. It should also prepare for `5-7` through `5-11`, especially retrieval-backed answers, validation, demo readiness, and clean-clone operational workflows.

The immediate target is not to build a massive new system. The target is to make the private source-stewardship dashboard useful, inspectable, secure, and aligned with the Django-backed retrieval pipeline.

---

## 4. Guiding Product Principle

The admin side should answer one main question:

> Is the chatbot ready and trustworthy for demo?

Every admin feature should support that question. If a feature does not help source trust, ingestion quality, validation readiness, auditability, or operational safety, it should be deferred.

---

## 5. Scope Definition

### 5.1 MVP Admin Scope

The MVP admin side should include:

1. Private maintainer login.
2. Protected maintainer route family.
3. Admin dashboard readiness overview.
4. Source list.
5. Source detail page.
6. Source upload flow.
7. Source metadata editing.
8. Enable / disable / archive source actions.
9. Ingestion trigger and ingestion status.
10. Chunk viewer.
11. Citation viewer.
12. Validation runner.
13. Validation result history.
14. Audit logs.
15. Protected Django admin APIs.
16. Runtime validation for all admin payloads.
17. Consistent response envelope.
18. Basic access-denied and unavailable states.
19. Tests for protected-route, source, ingestion, validation, and audit behavior.

### 5.2 Post-MVP Admin Scope

Post-MVP admin additions may include:

1. Source version comparison.
2. Rollback to previous successful version.
3. Chatbot answer preview with retrieved chunks.
4. Failed-answer review queue.
5. Topic coverage map.
6. Validation question-set editor.
7. Demo-readiness checklist with automated smoke-check links.
8. Maintainer role levels.
9. More advanced audit filtering and export.
10. Background job dashboard if ingestion becomes long-running.

### 5.3 Explicitly Out of Scope

Do **not** build these in the MVP:

1. Learner accounts.
2. Student dashboard.
3. Class analytics.
4. LMS integration.
5. Public source submission.
6. Internet crawling.
7. Auto-approval of uploaded sources.
8. Full CMS for editing the public site.
9. General AI prompt playground.
10. Complex multi-role enterprise admin.
11. Simulator controls.
12. Broad cross-session learner memory.
13. General-purpose content publishing workflow.
14. Admin features visible from public learner navigation.

---

## 6. Security and Boundary Rules

### 6.1 Hidden Route Is Not Security

The admin route should not be linked from the learner navbar, footer, chatbot, references drawer, or public learning flow. However, hiding the route is only a UX measure, not a security measure.

Every protected admin page and protected API must require:

1. Supabase Auth session on the frontend.
2. Django verification of the Supabase access token.
3. Maintainer authorization check on the backend.
4. Server-side service credentials only inside Django.
5. Row Level Security policies preventing public mutation of source data.

### 6.2 Learners Must Stay Login-Free

The public learning site must not require account creation. The admin authentication boundary must not leak into the learner experience.

Do not add:

```txt
Sign in to continue learning
Student login
Profile setup
Save progress account
Authenticated classroom dashboard
```

### 6.3 Frontend Must Not Perform Privileged Operations Directly

The browser may call protected Django admin endpoints after login, but it must not directly mutate:

- Supabase Storage source objects
- retrieval tables
- chunk tables
- embedding tables
- citation tables
- validation records
- audit logs

All privileged operations should go through Django.

### 6.4 Secrets Must Stay Server-Side

Never expose these in frontend code:

- Supabase service-role key
- model-provider API keys
- embedding provider keys
- Redis connection details
- Django secret key
- private signing secrets

Frontend may only receive browser-safe public environment values.

---

## 7. Recommended Admin Route Structure

The public learner site should remain a single-page anchor-navigation experience. The admin side can be treated as a private route family or separate private surface. If routing is already present, keep it minimal and do not spread route logic through the public learning flow.

Recommended route family:

```txt
/maintainer/login

/maintainer/dashboard
/maintainer/sources
/maintainer/sources/:sourceId
/maintainer/ingestion
/maintainer/validation
/maintainer/audit-logs
```

Alternative names are acceptable if consistent:

```txt
/control-panel/login
/control-panel/dashboard
/control-panel/sources
```

Preferred naming: `maintainer`, because it aligns with the project documents and clarifies that this is source stewardship, not a public admin portal.

---

## 8. Admin Information Architecture

### 8.1 `/maintainer/login`

Purpose:

Allow approved maintainers to sign in with Supabase Auth.

Must include:

- Email/password or magic-link authentication, depending on configured Supabase Auth method.
- Loading state.
- Invalid credentials state.
- Already-authenticated redirect.
- Clear protected-surface framing.
- No links from the public learner UI.

Recommended UI copy:

> Maintainer Access  
> This area is restricted to approved maintainers for source stewardship, validation, and demo-readiness operations.

### 8.2 `/maintainer/dashboard`

Purpose:

Give maintainers a readiness overview.

Recommended cards:

1. **Chatbot Readiness**
   - Ready
   - Needs validation
   - Blocked by failed ingestion
   - Insufficient source coverage

2. **Approved Sources**
   - Total sources
   - Active sources
   - Draft sources
   - Disabled / archived sources

3. **Latest Ingestion**
   - Last job status
   - Failed jobs count
   - Retry needed indicator

4. **Validation Summary**
   - Last validation run
   - Pass count
   - Weak-support count
   - Refusal count
   - Fail count

5. **Audit Activity**
   - Recent maintainer actions
   - Recent source changes
   - Recent validation runs

6. **Demo Readiness**
   - Public site core flow status
   - Source readiness status
   - Chatbot validation status
   - Known blockers

Recommended dashboard status model:

```ts
type AdminReadinessState =
  | "ready"
  | "needsValidation"
  | "hasFailedIngestion"
  | "hasWeakCoverage"
  | "blocked";
```

### 8.3 `/maintainer/sources`

Purpose:

Let maintainers inspect and manage approved materials.

Recommended table columns:

| Column | Description |
| --- | --- |
| Title | Human-readable source title |
| Topic | Global Governance, UN, WPS, enforcement, references, etc. |
| Type | PDF, Markdown, TXT, DOCX if supported later |
| Approval status | Draft, approved, rejected, archived |
| Active? | Whether retrieval can use it |
| Version | Current source version |
| Last ingested | Date/time of latest ingestion |
| Ingestion status | Not ingested, pending, processing, completed, failed |
| Updated by | Maintainer who last changed it |
| Actions | View, edit, ingest, disable, archive |

Recommended filters:

- Search by title.
- Filter by status.
- Filter by topic.
- Filter by file type.
- Filter by active/inactive.
- Filter by ingestion status.
- Show failed ingestion only.

Recommended actions:

```txt
View details
Edit metadata
Upload new source
Trigger ingestion
Enable
Disable
Archive
View chunks
View citations
View audit trail
```

### 8.4 `/maintainer/sources/:sourceId`

Purpose:

Allow maintainers to inspect one source deeply.

Recommended sections:

1. Source summary.
2. Metadata.
3. Source version history.
4. File information.
5. Ingestion status.
6. Chunk viewer.
7. Citation viewer.
8. Validation impact.
9. Audit history.
10. Actions.

#### Source Summary Fields

```txt
Title
Description
Topic
Source type
Original filename
Storage path
Approval status
Active state
Current version
Last ingested at
Last validation impact
Created by
Updated by
```

#### Metadata Editing

Editable fields:

```txt
title
description
topic
sourceType
citationLabel
author
publisher
publishedDate
sourceUrl
coverageTags
approvalStatus
isActive
```

Fields that should generally be system-managed:

```txt
sourceId
currentVersionId
storagePath
createdAt
updatedAt
createdBy
updatedBy
lastIngestedAt
lastValidationRunId
```

#### Important Rule

Editing metadata should not silently change retrieval behavior unless the changed field is explicitly meant to affect retrieval or citation display.

Use clear confirmation copy for dangerous actions:

- Disable source
- Archive source
- Re-ingest source
- Activate new version
- Roll back version

### 8.5 `/maintainer/ingestion`

Purpose:

Give maintainers operational visibility into source processing.

Recommended table columns:

| Column | Description |
| --- | --- |
| Job ID | Internal short ID |
| Source | Source title |
| Version | Source version |
| Status | Pending, processing, completed, failed |
| Started at | Timestamp |
| Completed at | Timestamp |
| Chunk count | Number of chunks created |
| Error | User-safe error summary |
| Actions | View, retry, inspect source |

Recommended ingestion states:

```ts
type IngestionStatus =
  | "notIngested"
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";
```

Failure examples:

```txt
PDF text extraction returned empty content.
Unsupported file type.
Source file missing from storage.
Embedding provider timeout.
Database write failed.
Chunk validation failed.
Citation metadata missing required label.
```

### 8.6 Chunk Viewer

Purpose:

Let maintainers inspect what the chatbot can actually retrieve.

Chunk card fields:

```txt
Chunk ID
Source title
Source version
Chunk index
Page number or heading
Token count
Active state
Embedding status
Created at
Text preview
```

Recommended actions:

```txt
Copy chunk text
View source metadata
View linked citations
Disable chunk if supported post-MVP
```

MVP note:

Manual chunk editing is not recommended. If a chunk is wrong, maintainers should fix the source or ingestion rules, then re-ingest.

### 8.7 Citation Viewer

Purpose:

Make source grounding visible and inspectable.

Citation fields:

```txt
Citation ID
Source ID
Source version ID
Citation label
Page / section / heading
Source title
Linked chunk IDs
Active state
Created at
```

The citation viewer should help answer:

- What will users see as the source label?
- Which source version supports this citation?
- Which chunks are tied to this citation?
- Is this citation currently active?
- Does this citation resolve correctly?

### 8.8 `/maintainer/validation`

Purpose:

Let maintainers test whether the chatbot remains grounded, topic-bounded, and demo-ready.

Recommended validation flow:

```txt
Select validation set
Run validation
View results
Inspect weak or failed questions
Mark follow-up actions
```

Default validation question examples:

```txt
What is global governance?
What is the role of the United Nations?
What are the limits of global governance?
Why is enforcement difficult?
How does the West Philippine Sea case show weak enforcement?
What did the 2016 arbitral ruling say?
Who are the major actors in global governance?
Can the UN force all states to comply with international law?
```

Off-topic validation examples:

```txt
Write a love poem.
Help me hack an account.
What is the best gaming laptop?
Give me medical advice.
Explain quantum computing.
```

Recommended result states:

```ts
type ValidationOutcome =
  | "pass"
  | "weakSupport"
  | "refused"
  | "failed"
  | "error";
```

Validation result should include:

```txt
Question
Expected behavior
Actual behavior
Answer state
Retrieved source IDs
Citation IDs
Support score if available
Latency
Notes
Created at
```

### 8.9 `/maintainer/audit-logs`

Purpose:

Provide traceability for protected operations.

Audit events should be created for:

```txt
Maintainer login success
Maintainer login denied
Source uploaded
Source metadata edited
Source activated
Source disabled
Source archived
Source version created
Ingestion triggered
Ingestion completed
Ingestion failed
Validation run started
Validation run completed
Admin authorization denied
```

Audit fields:

```txt
auditLogId
actorUserId
actorEmail
action
targetType
targetId
summary
beforeJson
afterJson
ipAddress optional
userAgent optional
createdAt
```

Privacy note:

Do not log unnecessary learner personal data. Since learners are anonymous in the MVP, keep public-chat logs session-scoped, anonymized, or easily clearable according to the existing planning constraints.

---

## 9. Recommended Backend API Surface

Use REST-style JSON endpoints served through Django.

All endpoints should use a consistent envelope:

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
  error: null;
};

type ApiFailure = {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    detail?: unknown; // non-production only
  };
};

type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
```

### 9.1 Auth and Session

```txt
GET /api/admin/me
```

Returns current maintainer identity and authorization state.

Example response:

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "maintainer@example.com",
    "role": "maintainer",
    "permissions": [
      "sources:read",
      "sources:write",
      "ingestion:run",
      "validation:run",
      "audit:read"
    ]
  },
  "error": null
}
```

### 9.2 Sources

```txt
GET /api/admin/sources
POST /api/admin/sources/upload
GET /api/admin/sources/{sourceId}
PATCH /api/admin/sources/{sourceId}
POST /api/admin/sources/{sourceId}/activate
POST /api/admin/sources/{sourceId}/disable
POST /api/admin/sources/{sourceId}/archive
```

Optional post-MVP:

```txt
GET /api/admin/sources/{sourceId}/versions
POST /api/admin/sources/{sourceId}/versions/{versionId}/restore
```

### 9.3 Ingestion

```txt
POST /api/admin/sources/{sourceId}/ingest
GET /api/admin/ingestion-jobs
GET /api/admin/ingestion-jobs/{jobId}
POST /api/admin/ingestion-jobs/{jobId}/retry
```

### 9.4 Chunks and Citations

```txt
GET /api/admin/sources/{sourceId}/chunks
GET /api/admin/sources/{sourceId}/citations
GET /api/admin/chunks/{chunkId}
GET /api/admin/citations/{citationId}
```

### 9.5 Validation

```txt
GET /api/admin/validation-sets
POST /api/admin/validation-runs
GET /api/admin/validation-runs
GET /api/admin/validation-runs/{runId}
```

Optional post-MVP:

```txt
POST /api/admin/validation-sets
PATCH /api/admin/validation-sets/{validationSetId}
```

### 9.6 Audit Logs

```txt
GET /api/admin/audit-logs
GET /api/admin/audit-logs/{auditLogId}
```

---

## 10. Recommended Database / Supabase Schema

The exact migration files should follow the project’s existing naming conventions and be placed under `supabase/migrations`.

Use `snake_case` table and column names.

### 10.1 `sources`

Represents a source identity independent of file versions.

```sql
create table sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  topic text not null,
  source_type text not null,
  citation_label text,
  author text,
  publisher text,
  published_date date,
  source_url text,
  approval_status text not null default 'draft',
  is_active boolean not null default false,
  current_version_id uuid,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Suggested enum-like values:

```txt
approval_status:
draft
approved
rejected
archived

source_type:
pdf
markdown
txt
docx // only if supported by ingestion
html // only if intentionally supported later
```

### 10.2 `source_versions`

Represents uploaded files and file versions.

```sql
create table source_versions (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  version_number integer not null,
  original_filename text not null,
  storage_bucket text not null,
  storage_path text not null,
  file_mime_type text,
  file_size_bytes bigint,
  content_hash text,
  version_status text not null default 'uploaded',
  created_by uuid,
  created_at timestamptz not null default now()
);
```

Suggested statuses:

```txt
uploaded
ingested
active
superseded
failed
archived
```

### 10.3 `source_chunks`

Represents normalized retrievable chunks.

```sql
create table source_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  source_version_id uuid not null references source_versions(id) on delete cascade,
  chunk_index integer not null,
  text text not null,
  page_number integer,
  heading text,
  token_count integer,
  embedding vector, -- dimension depends on chosen embedding model
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

Note: Adjust `embedding vector(...)` dimension according to the actual embedding model configuration. Do not guess the dimension if it is not already defined in the project.

### 10.4 `source_citations`

Represents canonical citation metadata.

```sql
create table source_citations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  source_version_id uuid not null references source_versions(id) on delete cascade,
  citation_label text not null,
  page_number integer,
  section_heading text,
  source_title text not null,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
```

### 10.5 `chunk_citations`

Maps chunks to citations if one chunk can have one or more citation references.

```sql
create table chunk_citations (
  chunk_id uuid not null references source_chunks(id) on delete cascade,
  citation_id uuid not null references source_citations(id) on delete cascade,
  primary key (chunk_id, citation_id)
);
```

### 10.6 `ingestion_jobs`

Tracks processing jobs.

```sql
create table ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  source_version_id uuid not null references source_versions(id) on delete cascade,
  status text not null default 'pending',
  started_at timestamptz,
  completed_at timestamptz,
  chunk_count integer,
  error_code text,
  error_message text,
  created_by uuid,
  created_at timestamptz not null default now()
);
```

### 10.7 `validation_sets`

Stores validation question sets.

```sql
create table validation_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_default boolean not null default false,
  created_by uuid,
  created_at timestamptz not null default now()
);
```

### 10.8 `validation_questions`

Stores validation questions and expected behavior.

```sql
create table validation_questions (
  id uuid primary key default gen_random_uuid(),
  validation_set_id uuid not null references validation_sets(id) on delete cascade,
  question text not null,
  expected_behavior text not null,
  expected_state text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);
```

Suggested `expected_state` values:

```txt
success
weakSupport
refused
error
```

### 10.9 `validation_runs`

Stores validation run summaries.

```sql
create table validation_runs (
  id uuid primary key default gen_random_uuid(),
  validation_set_id uuid references validation_sets(id),
  status text not null default 'pending',
  total_count integer not null default 0,
  pass_count integer not null default 0,
  weak_support_count integer not null default 0,
  refused_count integer not null default 0,
  failed_count integer not null default 0,
  error_count integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now()
);
```

### 10.10 `validation_results`

Stores per-question outcomes.

```sql
create table validation_results (
  id uuid primary key default gen_random_uuid(),
  validation_run_id uuid not null references validation_runs(id) on delete cascade,
  validation_question_id uuid references validation_questions(id),
  question text not null,
  expected_state text not null,
  actual_state text not null,
  outcome text not null,
  answer_preview text,
  retrieved_source_ids uuid[] not null default '{}',
  citation_ids uuid[] not null default '{}',
  latency_ms integer,
  notes text,
  created_at timestamptz not null default now()
);
```

### 10.11 `audit_logs`

Stores traceability records.

```sql
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_email text,
  action text not null,
  target_type text not null,
  target_id uuid,
  summary text not null,
  before_json jsonb,
  after_json jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);
```

---

## 11. Supabase Storage Plan

Recommended bucket:

```txt
approved-sources
```

Recommended path format:

```txt
sources/{sourceId}/versions/{versionNumber}/{safeFilename}
```

Example:

```txt
sources/7a9e.../versions/1/un-charter-summary.pdf
```

Rules:

1. Only approved maintainers may initiate upload workflows.
2. Storage writes should be controlled through Django or through signed upload URLs generated by Django.
3. Public clients must not be able to mutate source files.
4. RLS policies should prevent unauthorized object writes.
5. Upsert should be avoided for source files unless explicitly versioned and audited.
6. File paths should be deterministic and tied to `source_versions`.

Upload flow options:

### Option A: File passes through Django

```txt
Admin UI -> Django multipart upload -> Supabase Storage -> metadata records
```

Pros:

- Simple authorization.
- Centralized validation.
- Easy audit logging.

Cons:

- Django handles file payloads.
- Less ideal for large files.

### Option B: Django creates signed upload URL

```txt
Admin UI -> Django requests signed upload URL -> Browser uploads to Supabase Storage -> Django finalizes source version
```

Pros:

- Better for larger files.
- Django still controls authorization and metadata finalization.

Cons:

- More moving parts.
- Must handle incomplete uploads carefully.

MVP recommendation:

Use **Option A** if files are small and the implementation needs simplicity. Use **Option B** if source files may be large or direct-to-storage is already planned.

---

## 12. Admin Upload Flow

Preferred workflow:

```txt
Upload -> Metadata review -> Ingest -> Validate -> Activate
```

Do not auto-activate uploaded files.

### 12.1 Step 1: Upload

Admin selects file and enters:

```txt
title
description
topic
sourceType
citationLabel
author
publisher
publishedDate
sourceUrl
coverageTags
```

Initial status:

```txt
approvalStatus = "draft"
isActive = false
versionStatus = "uploaded"
```

### 12.2 Step 2: Metadata Review

Admin reviews metadata and confirms the source is appropriate.

Possible actions:

```txt
Save draft
Mark approved
Reject
Archive
```

### 12.3 Step 3: Ingest

Admin triggers ingestion.

System:

1. Creates `ingestion_jobs` record.
2. Extracts text.
3. Normalizes content.
4. Chunks content deterministically.
5. Creates citations.
6. Generates embeddings.
7. Writes chunks and citation records.
8. Updates ingestion job status.
9. Writes audit log.

### 12.4 Step 4: Validate

Admin runs validation set.

System checks:

1. On-topic questions get grounded answers.
2. Weak source support returns `weakSupport`.
3. Off-topic prompts return `refused`.
4. Citations resolve to approved materials.
5. No unsupported factual certainty is presented.

### 12.5 Step 5: Activate

Only after validation should the admin activate the source.

Activation should:

1. Mark the source/version active.
2. Ensure old version is superseded if applicable.
3. Ensure retrieval queries only use active source versions.
4. Write audit log.

---

## 13. Frontend Architecture Guidance

### 13.1 Suggested Folder Structure

Keep shadcn/ui primitives in `src/components/ui`. Put admin composites in a feature-owned folder.

Recommended:

```txt
src/
  features/
    maintainer/
      auth/
        MaintainerLoginPage.tsx
        useMaintainerSession.ts
      dashboard/
        MaintainerDashboardPage.tsx
        ReadinessCard.tsx
        RecentActivityPanel.tsx
      sources/
        SourcesPage.tsx
        SourceDetailPage.tsx
        SourceUploadDialog.tsx
        SourceMetadataForm.tsx
        SourceStatusBadge.tsx
        ChunkViewer.tsx
        CitationViewer.tsx
      ingestion/
        IngestionJobsPage.tsx
        IngestionStatusBadge.tsx
      validation/
        ValidationPage.tsx
        ValidationRunDetail.tsx
        ValidationOutcomeBadge.tsx
      audit/
        AuditLogsPage.tsx
      api/
        maintainerApi.ts
      types/
        maintainer-types.ts
      utils/
        maintainer-formatters.ts
```

If the repo prefers `src/components`, use:

```txt
src/components/maintainer/
```

But keep admin composites separate from `src/components/ui`.

### 13.2 State Handling

Use local component state by default. Thin context is acceptable for:

```txt
Maintainer auth session
Admin sidebar open/closed state
Current admin layout shell
Reduced-motion preference if reused
```

Do not introduce a heavy global store unless the existing project already has one and the architecture has changed.

### 13.3 Async UI States

Use explicit states:

```ts
type AsyncState<T> =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; data: T }
  | { state: "error"; error: UserSafeError };
```

For validation/chat-related admin states, preserve project states:

```txt
idle
loading
success
weakSupport
refused
error
```

### 13.4 UI Style

Admin surfaces should still match the Global Governance visual language, but with a calmer operational tone.

Recommended style:

- Diplomatic Editorial as base.
- Institutional Ledger for tables, audit logs, citations, and source records.
- Strategic Atlas for dashboard hierarchy and status mapping.
- Minimal cinematic motion.
- No heavy 3D.
- No distracting showcase animations.
- Keyboard-friendly controls.
- Clear focus states.
- Responsive layout.

---

## 14. Backend Architecture Guidance

Recommended Django app boundaries:

```txt
backend/
  apps/
    admin_auth/
    sources/
    ingestion/
    validation/
    audit/
    chat/
  common/
    auth.py
    envelopes.py
    errors.py
    supabase_client.py
    validators.py
    logging.py
```

Alternative:

```txt
backend/
  global_governance/
  admin_portal/
  sources/
  ingestion/
  validation/
  audit/
  common/
```

### 14.1 Required Backend Responsibilities

Django should own:

1. Supabase JWT verification.
2. Maintainer authorization.
3. Request validation.
4. Response envelopes.
5. Source upload orchestration.
6. Source metadata writes.
7. Supabase Storage writes or signed upload URL generation.
8. Ingestion job creation.
9. Text extraction and chunking orchestration.
10. Embedding calls.
11. Retrieval-store writes.
12. Validation run execution.
13. Audit logging.
14. User-safe error handling.

### 14.2 Do Not Expose Raw Errors

Do not return stack traces to frontend.

Bad:

```json
{
  "error": "Traceback..."
}
```

Good:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INGESTION_TEXT_EXTRACTION_FAILED",
    "message": "The source could not be processed. Please check the file content and try again."
  }
}
```

---

## 15. Authorization Model

MVP can use a simple maintainer allowlist.

### Option A: Database-backed allowlist

Table:

```sql
create table maintainers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  email text not null unique,
  role text not null default 'maintainer',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
```

Django checks:

1. Supabase JWT is valid.
2. JWT `sub` maps to `maintainers.user_id`.
3. Maintainer is active.
4. Maintainer has required permission.

### Option B: Environment allowlist

Example:

```txt
ADMIN_ALLOWED_EMAILS=nakko@example.com,other@example.com
```

This is simpler but less flexible.

MVP recommendation:

Use **Option A** if the project already has Supabase migrations ready. Use **Option B** only for a quick demo bridge, then migrate to Option A.

---

## 16. Validation Design

The validation runner should not be a vanity page. It should be a readiness tool.

### 16.1 Validation Categories

1. Grounded answer tests.
2. Weak-support tests.
3. Off-topic refusal tests.
4. Citation resolution tests.
5. Rate-limit / cooldown behavior tests if applicable.
6. Latency checks.

### 16.2 Validation Result Logic

A validation question should pass only if:

1. Actual state matches expected state.
2. Required citations exist for factual answers.
3. Cited source IDs exist in active retrieval records.
4. Answer does not contradict approved definitions or case facts.
5. Latency is within acceptable demo threshold when measured.

### 16.3 Validation Dashboard Summary

Recommended display:

```txt
Validation Set: Demo Readiness v1
Run Status: Completed
Total: 20
Pass: 17
Weak Support: 2
Refused: 1
Failed: 0
Errors: 0
Average Latency: 3.2s
```

---

## 17. Demo Readiness Checklist

Add a dashboard section or separate page that tracks:

```txt
Public site loads
Main sections complete
UN Command Center works
WPS dossier works
References visible
Chatbot opens
Grounded questions answer with citations
Weak-support case displays correctly
Off-topic prompts are refused
Rate limit/cooldown behavior works
No failed ingestion jobs
Active sources available
Latest validation set passed
No core section has placeholder content
No raw errors appear in UI
```

This checklist can start manual. It can later become automated through smoke tests.

---

## 18. Testing Requirements

### 18.1 Frontend Unit / Component Tests

Test:

```txt
Maintainer route guard
Source table rendering
Source status badges
Ingestion status badges
Validation outcome badges
Source metadata form validation
Upload form disabled/loading/error states
Audit log row formatting
API envelope parsing
```

### 18.2 Backend Tests

Place Django tests under `backend/tests` or the project’s chosen backend test layout.

Test:

```txt
Unauthenticated admin request denied
Unauthorized maintainer request denied
Authorized maintainer request allowed
Source upload creates expected records
Metadata update validates payload
Ingestion trigger creates ingestion job
Failed ingestion returns user-safe error
Validation run stores summary and results
Audit log created for protected mutations
RLS/public mutation assumptions documented and checked
```

### 18.3 Integration Tests

Test:

```txt
Admin login -> /api/admin/me -> dashboard loads
Upload source -> source record exists -> ingestion can be triggered
Ingestion complete -> chunks and citations visible
Validation run -> results visible
Disable source -> retrieval excludes it
Archive source -> source no longer active
```

### 18.4 E2E / Smoke Tests

Test:

```txt
Maintainer can log in and open dashboard
Unauthenticated user cannot access dashboard
Maintainer can upload a source
Maintainer can trigger ingestion
Maintainer can inspect chunks/citations
Maintainer can run validation
Maintainer can view audit logs
Public learner flow remains login-free
Admin route is not linked from public navigation
```

---

## 19. Error Codes

Recommended stable error codes:

```txt
AUTH_MISSING_TOKEN
AUTH_INVALID_TOKEN
AUTH_NOT_MAINTAINER
AUTH_PERMISSION_DENIED

SOURCE_NOT_FOUND
SOURCE_INVALID_METADATA
SOURCE_UPLOAD_FAILED
SOURCE_UNSUPPORTED_FILE_TYPE
SOURCE_ALREADY_ARCHIVED

INGESTION_JOB_NOT_FOUND
INGESTION_ALREADY_RUNNING
INGESTION_TEXT_EXTRACTION_FAILED
INGESTION_CHUNKING_FAILED
INGESTION_EMBEDDING_FAILED
INGESTION_STORAGE_FILE_MISSING

VALIDATION_SET_NOT_FOUND
VALIDATION_RUN_NOT_FOUND
VALIDATION_EXECUTION_FAILED

AUDIT_LOG_NOT_FOUND

RATE_LIMITED
INTERNAL_ERROR
```

All errors must have user-safe messages.

---

## 20. Suggested Story Breakdown for Coding Agent

### Story A: Stabilize Admin Route and Auth Guard

Goal:

Ensure private routes are protected and invisible from public learner flow.

Tasks:

- Add or refine maintainer route family.
- Add login page if not complete.
- Add route guard.
- Call `GET /api/admin/me` after login.
- Show access-denied state.
- Ensure no public nav/footer/admin link exists.

Acceptance:

- Unauthenticated access is denied.
- Authenticated approved maintainer can enter.
- Learner site remains login-free.

### Story B: Build Readiness Dashboard

Goal:

Create a useful admin home page.

Tasks:

- Create readiness summary API.
- Display source status cards.
- Display ingestion status card.
- Display validation status card.
- Display recent audit activity.
- Display blockers.

Acceptance:

- Maintainer can quickly tell whether chatbot/source system is ready for demo.

### Story C: Improve Source List and Source Detail

Goal:

Make approved-source stewardship inspectable.

Tasks:

- Source table with filters.
- Source detail page.
- Metadata edit form.
- Source status controls.
- Version display.
- Audit history section.

Acceptance:

- Maintainer can inspect source state without direct database access.

### Story D: Add Upload and Ingestion Controls

Goal:

Support safe source upload and processing.

Tasks:

- Upload form.
- Metadata validation.
- Storage write or signed upload flow.
- Ingestion trigger.
- Ingestion job table.
- Retry failed ingestion.

Acceptance:

- Upload does not auto-activate source.
- Ingestion state is visible.
- Failed ingestion gives user-safe error.

### Story E: Add Chunk and Citation Inspection

Goal:

Make retrieval data inspectable.

Tasks:

- Chunk list by source.
- Chunk detail preview.
- Citation list by source.
- Citation detail.
- Link citations to chunks.

Acceptance:

- Maintainer can see what the chatbot will retrieve and cite.

### Story F: Add Validation Runner

Goal:

Validate chatbot readiness.

Tasks:

- Seed default validation set.
- Run validation through Django.
- Store validation results.
- Display summary and per-question outcomes.
- Highlight failures and weak-support results.

Acceptance:

- Maintainer can run demo-readiness validation from private admin surface.

### Story G: Add Audit Logs

Goal:

Make protected changes traceable.

Tasks:

- Create audit log table if missing.
- Write audit events for protected actions.
- Add audit logs page.
- Add source-specific audit history.

Acceptance:

- Maintainer can inspect who changed what, when, and why.

---

## 21. Implementation Priorities

Recommended order:

1. Verify protected admin route and `/api/admin/me`.
2. Verify source table and source detail.
3. Add upload flow.
4. Add ingestion status visibility.
5. Add chunk viewer.
6. Add citation viewer.
7. Add validation runner.
8. Add audit logs.
9. Add dashboard readiness summary.
10. Add demo-readiness checklist.
11. Add post-MVP source version comparison and rollback.

Reasoning:

The route and auth boundary must be correct before adding operational features. Source management comes before ingestion. Ingestion must exist before chunk/citation inspection. Validation depends on retrieval/chat behavior. Audit should be added early enough to track meaningful changes.

---

## 22. UI Copy Guidelines

Use clear operational wording.

Good labels:

```txt
Approved Sources
Source Stewardship
Run Validation
Ingestion Status
Active for Chatbot
Weak Support
Refused as Off Topic
Demo Readiness
Review Audit Trail
```

Avoid vague labels:

```txt
AI Settings
Bot Brain
Magic Knowledge
Admin Stuff
CMS
Train AI
```

The project is academic and presentation-focused. The admin copy should reinforce trust, discipline, and source governance.

---

## 23. Design and UX Requirements

Admin UI should be:

1. Private and minimal.
2. Responsive enough for laptop and tablet.
3. Keyboard-accessible.
4. Clear under loading/error states.
5. Consistent with project tokens.
6. Low-motion compared with public showcase sections.
7. Built from shadcn/ui primitives where possible.
8. Feature-composite components should stay outside `src/components/ui`.

Suggested component types:

```txt
Card
Table
Badge
Dialog
Sheet
Tabs
Accordion
Button
Input
Textarea
Select
Dropdown menu
Toast
Alert
Skeleton
```

Use badges for statuses:

```txt
Draft
Approved
Active
Disabled
Archived
Pending
Processing
Completed
Failed
Pass
Weak Support
Refused
Error
```

---

## 24. Open Questions for the Coding Agent to Resolve From Existing Code

The coding agent should inspect the repository and answer these before implementation:

1. Does the project already use React Router, hash routing, or a custom route switch?
2. Is Supabase Auth already wired on the frontend?
3. Does Django already expose `/api/admin/me`?
4. Is the maintainer allowlist database-backed or environment-backed?
5. Which source tables already exist?
6. Which ingestion tables already exist?
7. Are chunks and citations already stored separately?
8. Is pgvector configured locally and remotely?
9. Is there already a validation set schema?
10. Does audit logging already exist?
11. What file types are currently supported by ingestion?
12. What embedding vector dimension is configured?
13. Is file upload currently routed through Django or direct to Supabase Storage?
14. What test runner is already installed for frontend?
15. What backend test framework pattern is currently used?

Do not guess these if the repo already answers them.

---

## 25. Definition of Done

The admin-side MVP is done when:

1. Public learners can use the site without login.
2. Public learner navigation does not expose admin routes.
3. Unauthenticated users cannot access admin pages or APIs.
4. Only approved maintainers can access admin operations.
5. Maintainers can list approved sources.
6. Maintainers can upload a source as draft.
7. Maintainers can edit source metadata.
8. Maintainers can trigger ingestion.
9. Maintainers can inspect ingestion results.
10. Maintainers can inspect chunks.
11. Maintainers can inspect citations.
12. Maintainers can activate, disable, or archive sources.
13. Maintainers can run validation.
14. Maintainers can inspect validation results.
15. Maintainers can inspect audit logs.
16. Dangerous actions write audit entries.
17. All API responses use the shared envelope.
18. Raw stack traces never appear in UI.
19. Secrets remain server-side.
20. Tests cover protected route access, source operations, ingestion visibility, validation, and audit behavior.
21. The dashboard helps answer whether the chatbot is ready for demo.

---

## 26. Reference Notes for the Coding Agent

The proposal assumes these existing project decisions:

- The frontend is React + Vite + TypeScript.
- The public learning experience is login-free.
- The admin side is private and maintainer-only.
- Supabase Auth is used only for private maintainer authentication.
- Django verifies authenticated admin requests and performs privileged operations.
- Supabase Storage stores raw approved source files.
- Supabase Postgres + pgvector stores chunks, embeddings, metadata, citations, validation records, and audit logs.
- Redis is not the source of truth for documents, chunks, embeddings, or citations.
- Broad grounded-answer caching is out of scope for MVP.
- Runtime validation is required at API and ingestion boundaries.
- The admin surface must remain source-stewardship scoped, not a full CMS.

Official docs checked while preparing this proposal:

- Supabase Auth documentation for JWT-based authentication and authorization.
- Supabase JWT documentation for claims, expiration, issuer, subject, role, and JWKS-based verification concepts.
- Supabase Storage access-control documentation for RLS-based object access policies.
- Supabase signed upload URL documentation for direct-to-storage uploads.
- Django file upload documentation for handling uploaded files through `request.FILES`.

---

## 27. Final Recommendation

Build the admin side as a **private trust-and-readiness console**.

Do not make it a big CMS. Do not add learner accounts. Do not make it a generic AI dashboard.

The best version is narrow but strong:

```txt
Login
Readiness Dashboard
Source List
Source Detail
Upload Source
Edit Metadata
Trigger Ingestion
Inspect Chunks
Inspect Citations
Run Validation
View Audit Logs
Prepare Demo
```

This gives the project a serious backend/admin layer while directly supporting the educational promise of the public site: a premium, source-grounded, presentation-ready Global Governance learning experience.
