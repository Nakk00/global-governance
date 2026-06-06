# Contract: Maintainer Readiness And Stewardship

## Purpose

Defines the protected maintainer/admin contract used to inspect readiness, source stewardship, validation evidence, and audit activity.

## Protected Endpoints

### Stewardship dashboard

`GET /api/admin/sources`

Returns the readiness-first dashboard model used by the maintainer overview.

Key sections:

- `overview`
- `monitoring`
- `auditTrail`
- `chatbotTrust`
- `sources`
- `ingestionRuns`
- `validationRuns`
- `auditEvents`

### Source detail

`GET /api/admin/sources/{sourceId}`

Returns the selected source plus approval lineage, ingestion provenance, validation history, and audit trail.

### Source inspection

- `GET /api/admin/sources/{sourceId}/chunks`
- `GET /api/admin/sources/{sourceId}/citations`
- `GET /api/admin/chunks/{chunkId}`
- `GET /api/admin/citations/{citationId}`

Used for chunk/citation trust inspection without exposing private source access in the public runtime.

### Source mutations

- `POST /api/admin/sources/upload`
- `POST /api/admin/sources/{sourceId}/approve`
- `POST /api/admin/sources/{sourceId}/activate`
- `POST /api/admin/sources/{sourceId}/disable`
- `POST /api/admin/sources/{sourceId}/archive`
- `POST /api/admin/sources/{sourceId}/ingest`

Each successful mutation returns an updated `SourceMutationResult` containing the updated source detail plus refreshed dashboard summary.

### Validation workflows

- `GET /api/admin/validation-sets`
- `GET /api/admin/validation-runs`
- `POST /api/admin/validation-runs`
- `GET /api/admin/validation-runs/{runId}`

Validation contracts remain protected and are used by the maintainer readiness and remediation workflow.

## Core DTO Expectations

### `StewardshipDashboard`

```json
{
  "overview": {
    "sourceCount": 12,
    "activeSourceCount": 9,
    "draftSourceCount": 2,
    "partialSourceCount": 1,
    "latestIngestionStatus": "warning",
    "latestValidationStatus": "failed",
    "readinessState": "partial"
  },
  "monitoring": {
    "readiness": {},
    "blockers": {},
    "validationHealth": {},
    "nextActions": []
  },
  "auditTrail": {},
  "chatbotTrust": {
    "state": "partial",
    "groundedSourceCount": 8,
    "validationRunCount": 4,
    "latestValidationStatus": "failed",
    "warningCount": 1,
    "failedCount": 1,
    "evidence": []
  },
  "sources": [],
  "ingestionRuns": [],
  "validationRuns": [],
  "auditEvents": []
}
```

### `ValidationRunDetail`

Must preserve:

- overall run status
- affected validation set
- itemized findings
- audit event trail
- enough detail for the maintainer UI to explain why trust/readiness changed and where to navigate next

## Auth And Error Rules

- All endpoints require the existing protected maintainer/admin session.
- Auth failures must produce user-safe protected-access errors so the frontend can sign the maintainer out or prompt for re-authentication.
- Partial-data conditions should remain explicit in the response model rather than collapsing into silent omissions.

## Notes

- This contract intentionally builds on the current stewardship and validation DTO families instead of creating a second readiness domain.
- No part of this contract becomes a public browser-facing API for anonymous learners.
- Maintainer readiness changes must begin with failing backend and frontend tests for healthy, warning, failed, partial-data, unauthorized, empty, retry, and navigation outcomes before implementation.
- New or materially changed readiness executable code must meet the feature's 80% changed-scope coverage gate; the protected Playwright smoke journey supplements rather than replaces those lower-layer tests.
