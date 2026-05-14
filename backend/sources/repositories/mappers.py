from __future__ import annotations

from typing import Any, cast

from sources.dtos import (
    AuditTrailSummaryDto,
    ChatbotTrustDto,
    ChunkRowDto,
    CitationRowDto,
    InspectionState,
    NextActionDto,
    PartialDataMarker,
    ReadinessState,
    RunStatus,
    SourceDetailDto,
    SourceInventoryItemDto,
    SourceMutationResult,
    StewardshipDashboardDto,
    StewardshipEventDto,
    StewardshipMonitoringDto,
    StewardshipOverviewDto,
)

from .base import (
    ChunkRecord,
    CitationRecord,
    DocumentRecord,
    MetricTone,
    SourceMutationError,
    SourceSnapshot,
)
from .mutations import ingestion_readiness


def event_from_row(row: dict[str, Any]) -> StewardshipEventDto:
    return {
        "eventId": str(row["id"]),
        "sourceId": row["source_id"],
        "eventType": row["event_type"],
        "origin": row["origin"],
        "occurredAt": row["occurred_at"],
        "outcome": cast(Any, row["outcome_status"]),
        "summary": row["summary"],
    }


def document_from_row(row: dict[str, Any]) -> DocumentRecord:
    return DocumentRecord(
        document_id=str(row["id"]),
        source_id=str(row["source_id"]),
        title=str(row["title"]),
        source_path=row.get("source_path"),
        version=str(row["version"]),
        created_at=row.get("created_at"),
        updated_at=row.get("updated_at"),
    )


def chunk_from_row(row: dict[str, Any]) -> ChunkRecord:
    return ChunkRecord(
        chunk_id=str(row["id"]),
        document_id=str(row["document_id"]),
        source_id=str(row["source_id"]),
        chunk_index=int(row["chunk_index"]),
        content=str(row["content"]),
        token_count=int(row["token_count"]),
        embedding_present=row.get("embedding") is not None,
        metadata=_metadata_dict(row.get("metadata")),
        created_at=row.get("created_at"),
        updated_at=row.get("updated_at"),
    )


def citation_from_row(row: dict[str, Any], *, source_path: str | None) -> CitationRecord:
    return CitationRecord(
        citation_id=str(row["id"]),
        document_id=str(row["document_id"]),
        source_id=str(row["source_id"]),
        citation_label=str(row["citation_label"]),
        source_title=str(row["source_title"]),
        source_path=source_path,
        metadata=_metadata_dict(row.get("metadata")),
        created_at=row.get("created_at"),
        updated_at=row.get("updated_at"),
    )


def mutation_result(snapshots: dict[str, SourceSnapshot], source_id: str) -> SourceMutationResult:
    snapshot = snapshots.get(source_id)
    if snapshot is None:
        raise SourceMutationError(
            code="admin_source_not_found",
            message="The requested approved source was not found.",
            status=404,
        )
    return {
        "source": source_detail(snapshot),
        "dashboard": dashboard_from_snapshots(snapshots),
    }


def dashboard_from_snapshots(
    snapshots: dict[str, SourceSnapshot],
) -> StewardshipDashboardDto:
    ordered = sorted(snapshots.values(), key=lambda snapshot: snapshot.source.title.lower())
    sources = [inventory_item(snapshot) for snapshot in ordered]
    ingestion_runs = sorted(
        [
            event
            for snapshot in ordered
            for event in snapshot.audit_events
            if event["eventType"] in {"ingest", "re-ingest"}
        ],
        key=lambda event: event["occurredAt"],
        reverse=True,
    )
    validation_runs = sorted(
        [event for snapshot in ordered for event in snapshot.validation_events],
        key=lambda event: event["occurredAt"],
        reverse=True,
    )
    audit_events = sorted(
        [event for snapshot in ordered for event in snapshot.audit_events],
        key=lambda event: event["occurredAt"],
        reverse=True,
    )
    return {
        "overview": overview(sources, ingestion_runs, validation_runs),
        "monitoring": monitoring(sources, ingestion_runs, validation_runs),
        "auditTrail": audit_trail_summary(audit_events),
        "chatbotTrust": chatbot_trust(sources, validation_runs),
        "sources": sources,
        "ingestionRuns": ingestion_runs,
        "validationRuns": validation_runs,
        "auditEvents": audit_events,
    }


def inventory_item(snapshot: SourceSnapshot) -> SourceInventoryItemDto:
    partial_data: list[PartialDataMarker] = []
    readiness = ingestion_readiness(snapshot.latest_ingest_job)
    if readiness != "ready":
        partial_data.append(
            {
                "field": "ingestionReadiness",
                "reason": "A successful protected ingest run is still required for activation.",
            }
        )
    if not snapshot.validation_events:
        partial_data.append(
            {
                "field": "latestValidationOutcome",
                "reason": "Validation history starts at a no-backfill baseline.",
            }
        )
    return {
        "sourceId": snapshot.source.source_id,
        "title": snapshot.source.title,
        "sourceType": snapshot.source.source_type,
        "lifecycleState": snapshot.source.lifecycle_state,
        "createdAt": snapshot.source.created_at,
        "updatedAt": snapshot.source.updated_at,
        "aliases": list(snapshot.source.aliases),
        "usageScope": list(snapshot.source.usage_scope),
        "provenance": snapshot.source.provenance,
        "ingestionReadiness": readiness,
        "latestValidationOutcome": (
            snapshot.validation_events[0]["outcome"] if snapshot.validation_events else None
        ),
        "latestIngestJob": snapshot.latest_ingest_job,
        "partialData": partial_data,
    }


def source_detail(snapshot: SourceSnapshot) -> SourceDetailDto:
    audit_events = list(snapshot.audit_events)
    return {
        **inventory_item(snapshot),
        "summary": snapshot.source.summary,
        "metadata": {
            "canonicalSourceId": snapshot.source.source_id,
            "sourceType": snapshot.source.source_type,
            "usageScope": list(snapshot.source.usage_scope),
            "provenance": snapshot.source.provenance,
            "storagePath": snapshot.source.storage_path or "bootstrap-approved-source-bundle",
        },
        "approvalLineage": [
            event for event in audit_events if event["eventType"] in {"approved", "activate"}
        ],
        "ingestionProvenance": [
            event for event in audit_events if event["eventType"] in {"ingest", "re-ingest"}
        ],
        "validationHistory": list(snapshot.validation_events),
        "auditTrail": audit_events,
    }


def inspection_anchor(
    snapshot: SourceSnapshot, document: DocumentRecord | None, record_type: str
) -> dict[str, Any]:
    state = inspection_state(snapshot, document, None)
    source = snapshot.source
    if document is None:
        return {
            "documentId": None,
            "version": None,
            "sourceId": source.source_id,
            "state": state,
            "message": f"No ingestion-backed {record_type} records are available for this source.",
            "nextStep": inspection_next_step(snapshot),
        }
    return {
        "documentId": document.document_id,
        "version": document.version,
        "sourceId": source.source_id,
        "state": state,
        "message": (
            f"Inspecting {record_type} records from the latest successful document revision."
        ),
        "nextStep": inspection_next_step(snapshot),
    }


def inspection_state(
    snapshot: SourceSnapshot,
    document: DocumentRecord | None,
    record: ChunkRecord | CitationRecord | None,
) -> InspectionState:
    if snapshot.source.lifecycle_state in {"draft", "disabled", "archived"}:
        return "inactive"
    if document is None:
        return "empty"
    if snapshot.source.lifecycle_state != "active":
        return "stale"
    if record is None:
        return "ready"
    metadata = record.metadata
    if isinstance(record, ChunkRecord):
        if (
            not record.embedding_present
            or not _metadata_value(metadata, "pageNumber", "page")
            or not _metadata_value(metadata, "heading", "sectionHeading")
        ):
            return "partial"
    if isinstance(record, CitationRecord):
        if (
            not _display_label(record)
            or not _metadata_value(metadata, "pageNumber", "page")
            or not _metadata_value(metadata, "sectionHeading", "heading")
        ):
            return "partial"
    return "ready"


def inspection_partial_data(
    snapshot: SourceSnapshot,
    document: DocumentRecord | None,
    records: list[ChunkRecord] | list[CitationRecord],
) -> list[PartialDataMarker]:
    markers: list[PartialDataMarker] = []
    if document is None:
        markers.append({"field": "documentId", "reason": inspection_next_step(snapshot)})
        return markers
    if not records:
        markers.append(
            {
                "field": "records",
                "reason": "The latest successful document revision has no retrieval evidence rows.",
            }
        )
    for record in records:
        if isinstance(record, ChunkRecord) and not record.embedding_present:
            markers.append({"field": record.chunk_id, "reason": "Chunk has no embedding vector."})
        if not _metadata_value(record.metadata, "pageNumber", "page"):
            field = record.chunk_id if isinstance(record, ChunkRecord) else record.citation_id
            markers.append(
                {
                    "field": field,
                    "reason": "Page context is unavailable.",
                }
            )
    return markers


def inspection_next_step(snapshot: SourceSnapshot) -> str:
    state = snapshot.source.lifecycle_state
    if state == "draft":
        return "Approve the source before ingesting retrieval evidence."
    if state == "approved":
        return "Run ingest or re-ingest to create retrieval chunks and citations."
    if state == "disabled":
        return "Activate the source after confirming the retrieval evidence is current."
    if state == "archived":
        return "Archived sources are not retrieval-eligible from this dashboard."
    if snapshot.latest_ingest_job is None:
        return "Run ingest to create the first retrieval evidence snapshot."
    return "Re-ingest if the visible evidence is stale or incomplete."


def chunk_row(chunk: ChunkRecord, state: InspectionState) -> ChunkRowDto:
    return {
        "id": chunk.chunk_id,
        "documentId": chunk.document_id,
        "sourceId": chunk.source_id,
        "chunkIndex": chunk.chunk_index,
        "tokenCount": chunk.token_count,
        "contentPreview": _preview(chunk.content),
        "embeddingPresent": chunk.embedding_present,
        "activeState": state,
        "pageNumber": _optional_int(_metadata_value(chunk.metadata, "pageNumber", "page")),
        "heading": _optional_str(_metadata_value(chunk.metadata, "heading", "sectionHeading")),
        "metadata": dict(chunk.metadata),
    }


def citation_row(
    citation: CitationRecord, linked_chunk_ids: list[str], state: InspectionState
) -> CitationRowDto:
    return {
        "id": citation.citation_id,
        "documentId": citation.document_id,
        "sourceId": citation.source_id,
        "citationLabel": citation.citation_label,
        "displayLabel": _display_label(citation),
        "linkedChunkIds": list(linked_chunk_ids),
        "activeState": state,
        "pageNumber": _optional_int(_metadata_value(citation.metadata, "pageNumber", "page")),
        "sectionHeading": _optional_str(
            _metadata_value(citation.metadata, "sectionHeading", "heading")
        ),
        "metadata": dict(citation.metadata),
    }


def overview(
    sources: list[SourceInventoryItemDto],
    ingestion_runs: list[StewardshipEventDto],
    validation_runs: list[StewardshipEventDto],
) -> StewardshipOverviewDto:
    partial_count = sum(1 for source in sources if source["partialData"])
    readiness_state: ReadinessState = "ready"
    if partial_count:
        readiness_state = "partial"
    elif not sources:
        readiness_state = "empty"
    return {
        "sourceCount": len(sources),
        "activeSourceCount": sum(1 for source in sources if source["lifecycleState"] == "active"),
        "draftSourceCount": sum(1 for source in sources if source["lifecycleState"] == "draft"),
        "partialSourceCount": partial_count,
        "latestIngestionStatus": ingestion_runs[0]["outcome"] if ingestion_runs else None,
        "latestValidationStatus": validation_runs[0]["outcome"] if validation_runs else None,
        "readinessState": readiness_state,
    }


def monitoring(
    sources: list[SourceInventoryItemDto],
    ingestion_runs: list[StewardshipEventDto],
    validation_runs: list[StewardshipEventDto],
) -> StewardshipMonitoringDto:
    partial_count = sum(1 for source in sources if source["partialData"])
    draft_count = sum(1 for source in sources if source["lifecycleState"] == "draft")
    active_count = sum(1 for source in sources if source["lifecycleState"] == "active")
    warning_validation_count = sum(1 for event in validation_runs if event["outcome"] == "warning")
    failed_validation_count = sum(1 for event in validation_runs if event["outcome"] == "failed")
    blocker_count = partial_count + draft_count + failed_validation_count
    return {
        "readiness": {
            "label": "Readiness",
            "value": f"{active_count}/{len(sources)} active",
            "tone": "good" if sources and blocker_count == 0 else "warning",
            "detail": "Active approved sources ready for learner-facing grounding.",
        },
        "blockers": {
            "label": "Blockers",
            "value": str(blocker_count),
            "tone": "good" if blocker_count == 0 else "critical",
            "detail": "Draft, partial, or failed validation items needing maintainer attention.",
        },
        "validationHealth": {
            "label": "Validation health",
            "value": latest_status_label(validation_runs),
            "tone": status_tone(validation_runs[0]["outcome"] if validation_runs else None),
            "detail": (
                f"{warning_validation_count} warning and {failed_validation_count} failed "
                "source validation signals."
            ),
        },
        "nextActions": next_actions(
            partial_count=partial_count,
            draft_count=draft_count,
            ingestion_runs=ingestion_runs,
            validation_runs=validation_runs,
        ),
    }


def audit_trail_summary(
    audit_events: list[StewardshipEventDto],
) -> AuditTrailSummaryDto:
    latest = audit_events[0] if audit_events else None
    return {
        "totalEvents": len(audit_events),
        "latestOutcome": latest["outcome"] if latest else None,
        "latestEventAt": latest["occurredAt"] if latest else None,
        "recentEvents": audit_events[:6],
    }


def chatbot_trust(
    sources: list[SourceInventoryItemDto],
    validation_runs: list[StewardshipEventDto],
) -> ChatbotTrustDto:
    grounded_sources = [
        source
        for source in sources
        if "chat" in source["usageScope"]
        and source["lifecycleState"] == "active"
        and source["ingestionReadiness"] == "ready"
    ]
    warning_count = sum(1 for event in validation_runs if event["outcome"] == "warning")
    failed_count = sum(1 for event in validation_runs if event["outcome"] == "failed")
    state: ReadinessState = "ready"
    if failed_count or warning_count or not grounded_sources:
        state = "partial"
    if not sources:
        state = "empty"
    latest_status = validation_runs[0]["outcome"] if validation_runs else None
    return {
        "state": state,
        "groundedSourceCount": len(grounded_sources),
        "validationRunCount": len(validation_runs),
        "latestValidationStatus": latest_status,
        "warningCount": warning_count,
        "failedCount": failed_count,
        "evidence": [
            {
                "label": "Grounded sources",
                "value": str(len(grounded_sources)),
                "tone": "good" if grounded_sources else "warning",
                "detail": "Active chat-scoped sources with successful ingestion evidence.",
            },
            {
                "label": "Validation coverage",
                "value": str(len(validation_runs)),
                "tone": status_tone(latest_status),
                "detail": "Canonical validation signals available to the private console.",
            },
        ],
    }


def next_actions(
    *,
    partial_count: int,
    draft_count: int,
    ingestion_runs: list[StewardshipEventDto],
    validation_runs: list[StewardshipEventDto],
) -> list[NextActionDto]:
    actions: list[NextActionDto] = []
    if draft_count:
        actions.append(
            {
                "label": "Review draft sources",
                "detail": f"{draft_count} draft source(s) need approval or archive decisions.",
                "href": "/maintainer/sources",
                "priority": "high",
            }
        )
    if partial_count:
        actions.append(
            {
                "label": "Close partial evidence",
                "detail": (
                    f"{partial_count} source record(s) need ingestion or validation follow-up."
                ),
                "href": "/maintainer/sources",
                "priority": "high",
            }
        )
    if not validation_runs:
        actions.append(
            {
                "label": "Run validation",
                "detail": "Launch the demo readiness set before presenting chatbot trust.",
                "href": "/maintainer/validation",
                "priority": "medium",
            }
        )
    if ingestion_runs and ingestion_runs[0]["outcome"] in {"failed", "warning"}:
        actions.append(
            {
                "label": "Inspect latest ingest",
                "detail": "The latest ingest signal needs maintainer review.",
                "href": "/maintainer/operations",
                "priority": "medium",
            }
        )
    return actions[:4]


def latest_status_label(validation_runs: list[StewardshipEventDto]) -> str:
    if not validation_runs:
        return "No runs"
    return validation_runs[0]["outcome"].replace("-", " ").title()


def status_tone(status: RunStatus | None) -> MetricTone:
    if status == "succeeded":
        return "good"
    if status == "failed":
        return "critical"
    if status in {"warning", "queued"}:
        return "warning"
    return "neutral"


def _display_label(citation: CitationRecord) -> str:
    value = _metadata_value(citation.metadata, "displayLabel", "shortTitle", "label")
    return _optional_str(value) or citation.citation_label or citation.source_title


def _metadata_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _metadata_value(metadata: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        value = metadata.get(key)
        if value not in (None, ""):
            return value
    return None


def _optional_str(value: Any) -> str | None:
    return str(value) if value not in (None, "") else None


def _optional_int(value: Any) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _preview(content: str) -> str:
    return content if len(content) <= 220 else f"{content[:217]}..."
