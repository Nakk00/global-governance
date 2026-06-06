from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from django.core.files.uploadedfile import UploadedFile

from sources.dtos import IngestJobDto, LifecycleState, ReadinessState

from .base import (
    ALLOWED_TRANSITIONS,
    INGESTABLE_STATES,
    MAX_SOURCE_UPLOAD_BYTES,
    SUPPORTED_UPLOAD_EXTENSIONS,
    SourceMutationError,
    SourceRecord,
    SourceSnapshot,
)


def validate_transition(snapshot: SourceSnapshot, target_state: LifecycleState) -> None:
    source = snapshot.source
    if target_state not in ALLOWED_TRANSITIONS[source.lifecycle_state]:
        raise SourceMutationError(
            code="admin_source_lifecycle_conflict",
            message="That lifecycle transition is not allowed for this source.",
            status=409,
            fields={"lifecycleState": f"{source.lifecycle_state} cannot move to {target_state}."},
        )
    if target_state == "active" and ingestion_readiness(snapshot.latest_ingest_job) != "ready":
        raise SourceMutationError(
            code="admin_source_activation_blocked",
            message="Only reviewed and successfully ingested sources can be activated.",
            status=409,
            fields={
                "lifecycleState": (
                    "Approve the source and wait for a successful ingest before activation."
                )
            },
        )


def validate_ingest_request(snapshot: SourceSnapshot) -> None:
    lifecycle_state = snapshot.source.lifecycle_state
    if lifecycle_state == "archived":
        raise SourceMutationError(
            code="admin_source_lifecycle_conflict",
            message="Archived sources cannot be ingested.",
            status=409,
            fields={"lifecycleState": "Restore is not available for archived sources."},
        )
    if lifecycle_state not in INGESTABLE_STATES:
        raise SourceMutationError(
            code="admin_source_lifecycle_conflict",
            message="Approve the source before requesting ingest.",
            status=409,
            fields={"lifecycleState": "Only approved, active, or disabled sources can ingest."},
        )
    if snapshot.latest_ingest_job and snapshot.latest_ingest_job["status"] in {
        "queued",
        "processing",
    }:
        raise SourceMutationError(
            code="admin_source_ingest_in_progress",
            message="An ingest job is already in progress for this source.",
            status=409,
        )


def validate_source_metadata(
    metadata: dict[str, Any],
) -> tuple[str, str, str, str, str, list[str]]:
    source_id = clean_source_id(str(metadata.get("sourceId") or ""))
    title = clean_text(metadata.get("title"))
    source_type = clean_text(metadata.get("sourceType"))
    provenance = clean_text(metadata.get("provenance"))
    summary = clean_text(metadata.get("summary"))
    usage_scope = clean_list(metadata.get("usageScope"))
    field_errors = {
        key: value
        for key, value in {
            "sourceId": "Use a unique source identifier." if not source_id else "",
            "title": "Add a source title." if not title else "",
            "sourceType": "Choose a source type." if not source_type else "",
            "provenance": "Describe where this source came from." if not provenance else "",
            "summary": "Add a short source summary." if not summary else "",
            "usageScope": "Choose at least one usage scope." if not usage_scope else "",
        }.items()
        if value
    }
    if field_errors:
        raise SourceMutationError(
            code="admin_source_validation_failed",
            message="The source metadata needs attention.",
            status=400,
            fields=field_errors,
        )
    return source_id, title, source_type, provenance, summary, usage_scope


def ensure_source_id_available(source_id: str, sources: dict[str, SourceRecord]) -> None:
    existing_ids = set(sources)
    existing_aliases = {alias for source in sources.values() for alias in source.aliases}
    if source_id in existing_ids or source_id in existing_aliases:
        raise SourceMutationError(
            code="admin_source_conflict",
            message="A source with this identifier or alias already exists.",
            status=409,
            fields={"sourceId": "Use a source identifier that is not already in stewardship."},
        )


def validate_upload_file(uploaded_file: UploadedFile | None) -> None:
    if uploaded_file is None:
        raise SourceMutationError(
            code="admin_source_upload_missing",
            message="Choose a supported source file before uploading.",
            status=400,
            fields={"file": "A source file is required."},
        )
    file_name = uploaded_file.name or ""
    extension = "." + file_name.rsplit(".", 1)[-1].lower() if "." in file_name else ""
    if extension not in SUPPORTED_UPLOAD_EXTENSIONS:
        raise SourceMutationError(
            code="admin_source_upload_type",
            message="Use a supported source file type.",
            status=415,
            fields={"file": "Supported types are Markdown, text, PDF, and CSV."},
        )
    upload_size = uploaded_file.size or 0
    if upload_size == 0:
        raise SourceMutationError(
            code="admin_source_upload_empty",
            message="The uploaded source file is empty.",
            status=400,
            fields={"file": "Choose a non-empty source file."},
        )
    if upload_size > MAX_SOURCE_UPLOAD_BYTES:
        raise SourceMutationError(
            code="admin_source_upload_too_large",
            message="The uploaded source file is too large.",
            status=413,
            fields={"file": "Keep source uploads at or below 10 MB."},
        )


def ingestion_readiness(job: IngestJobDto | None) -> ReadinessState:
    if job is None:
        return "partial"
    if job["status"] == "succeeded":
        return "ready"
    return "partial"


def lifecycle_event_type(target_state: LifecycleState) -> str:
    return {
        "approved": "approved",
        "active": "activate",
        "disabled": "disabled",
        "archived": "archived",
        "draft": "edit",
    }[target_state]


def clean_text(value: Any) -> str:
    return str(value or "").strip()


def clean_list(value: Any) -> list[str]:
    if isinstance(value, str):
        return [item.strip() for item in value.split(",") if item.strip()]
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    return []


def clean_source_id(value: str) -> str:
    import re

    cleaned = re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-")
    return re.sub(r"-{2,}", "-", cleaned)


def now() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


__all__ = [
    "clean_list",
    "clean_source_id",
    "clean_text",
    "ensure_source_id_available",
    "ingestion_readiness",
    "lifecycle_event_type",
    "now",
    "validate_ingest_request",
    "validate_source_metadata",
    "validate_transition",
    "validate_upload_file",
]
