from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import PurePosixPath
from typing import Any, Protocol, cast
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urljoin
from urllib.request import Request, urlopen
from uuid import uuid4

from django.conf import settings
from django.core.files.uploadedfile import UploadedFile

from sources.dtos import (
    ApprovedSourceSeed,
    IngestJobDto,
    LifecycleState,
    PartialDataMarker,
    ReadinessState,
    SourceDetailDto,
    SourceInventoryItemDto,
    SourceMutationResult,
    StewardshipDashboardDto,
    StewardshipEventDto,
    StewardshipOverviewDto,
)

MAX_SOURCE_UPLOAD_BYTES = 10 * 1024 * 1024
SUPPORTED_UPLOAD_EXTENSIONS = {".md", ".txt", ".pdf", ".csv"}
PRIVATE_SOURCE_BUCKET = "project-source-pdfs"
ALLOWED_TRANSITIONS: dict[LifecycleState, set[LifecycleState]] = {
    "draft": {"approved", "archived"},
    "approved": {"active", "disabled", "archived"},
    "active": {"disabled", "archived"},
    "disabled": {"active", "archived"},
    "archived": set(),
}
INGESTABLE_STATES: set[LifecycleState] = {"approved", "active", "disabled"}


class SourceMutationError(ValueError):
    def __init__(
        self,
        *,
        code: str,
        message: str,
        status: int,
        fields: dict[str, str] | None = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status
        self.fields = fields or {}


@dataclass
class SourceRecord:
    source_id: str
    title: str
    source_type: str
    provenance: str
    summary: str
    usage_scope: list[str]
    aliases: list[str] = field(default_factory=list)
    lifecycle_state: LifecycleState = "draft"
    storage_path: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


@dataclass(frozen=True)
class SourceSnapshot:
    source: SourceRecord
    latest_ingest_job: IngestJobDto | None
    ingest_jobs: list[IngestJobDto]
    audit_events: list[StewardshipEventDto]
    validation_events: list[StewardshipEventDto]


class StewardshipRepository(Protocol):
    def get_dashboard(self) -> StewardshipDashboardDto: ...

    def get_source_detail(self, source_id: str) -> SourceDetailDto | None: ...

    def upload_source(
        self,
        *,
        uploaded_file: UploadedFile | None,
        metadata: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult: ...

    def update_source_metadata(
        self,
        *,
        source_id: str,
        payload: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult: ...

    def transition_source(
        self,
        *,
        source_id: str,
        target_state: LifecycleState,
        actor: str,
    ) -> SourceMutationResult: ...

    def dispatch_ingest(self, *, source_id: str, actor: str) -> SourceMutationResult: ...


APPROVED_SOURCE_SEEDS: tuple[ApprovedSourceSeed, ...] = (
    ApprovedSourceSeed(
        source_id="gg-src-global-governance-course-frame",
        title="Global Governance Course Frame",
        source_type="course",
        provenance="Repo-authored course framing; curriculum source",
        summary="Defines the course distinction between global governance and world government.",
        usage_scope=("chat", "ingestion"),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-philippines-arbitration-filing",
        title="Philippines Notification and Statement of Claim",
        source_type="case",
        provenance="2013 legal filing; UNCLOS arbitration; case initiation",
        summary=(
            "Identifies the legal questions the Philippines brought under UNCLOS "
            "dispute settlement."
        ),
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-2013-arbitration-filing",),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-post-award-compliance-record",
        title="Post-Award Compliance and Diplomacy Record",
        source_type="case",
        provenance="Post-2016 implementation context; diplomacy; enforcement limits",
        summary=(
            "Tracks continued maritime pressure, diplomatic positioning, and public "
            "accountability after the award."
        ),
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-post-2016-compliance",),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-scarborough-standoff-record",
        title="Scarborough Shoal Standoff Public Record",
        source_type="case",
        provenance="2012 maritime incident; timeline source; contested access",
        summary=(
            "Shows how official vessels and access claims turned Scarborough Shoal "
            "into a visible dispute."
        ),
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-2012-scarborough",),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-south-china-sea-award",
        title="South China Sea Arbitration Award",
        source_type="case",
        provenance="2016 UNCLOS tribunal award; legal record; West Philippine Sea case",
        summary=(
            "Clarifies maritime entitlements and legal findings while showing that "
            "legal judgment and political enforcement remain different problems."
        ),
        usage_scope=("presentation", "chat", "evidence", "ingestion"),
        aliases=("gg-src-wps-arbitral-ruling", "wps-src-2016-tribunal-award"),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-sustainable-development-report",
        title="UN Sustainable Development Goals Report",
        source_type="reference",
        provenance="UN public progress report; accountability evidence; policy snapshot",
        summary=(
            "Tracks shared goals, uneven progress, and the public evidence "
            "governments use to compare commitments against visible outcomes."
        ),
        usage_scope=("presentation", "ingestion"),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-un-charter-institutions",
        title="Charter of the United Nations",
        source_type="primary",
        provenance="Foundational UN treaty; institutional design; primary source",
        summary=(
            "Defines the UN's purposes, organs, member obligations, and Security "
            "Council structure."
        ),
        usage_scope=("presentation", "chat", "ingestion"),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-wps-enforcement-gap-comparison",
        title="Tribunal Award and Post-Award Conduct Comparison",
        source_type="case",
        provenance="Comparison source; legal outcome versus implementation; UNCLOS",
        summary=(
            "Pairs the award and later conduct to separate legal clarification from "
            "enforcement capacity."
        ),
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-comparison-enforcement-gap",),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-wps-political-reality-record",
        title="Diplomatic Response and State Behavior Record",
        source_type="case",
        provenance="Comparison source; diplomacy; state behavior",
        summary="Records how states used diplomacy, reputation, and capacity after the award.",
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-comparison-political-reality",),
    ),
)

_TEST_REPOSITORY: StewardshipRepository | None = None


class InMemoryStewardshipRepository:
    def __init__(self) -> None:
        self._sources: dict[str, SourceRecord] = {
            seed.source_id: _source_from_seed(seed) for seed in APPROVED_SOURCE_SEEDS
        }
        self._jobs: dict[str, list[IngestJobDto]] = {}
        self._audit_events: dict[str, list[StewardshipEventDto]] = {}
        self._validation_events: dict[str, list[StewardshipEventDto]] = {}

    def get_dashboard(self) -> StewardshipDashboardDto:
        snapshots = self._snapshots()
        return _dashboard_from_snapshots(snapshots)

    def get_source_detail(self, source_id: str) -> SourceDetailDto | None:
        snapshot = self._find_snapshot(source_id)
        return _source_detail(snapshot) if snapshot else None

    def upload_source(
        self,
        *,
        uploaded_file: UploadedFile | None,
        metadata: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult:
        source_id, title, source_type, provenance, summary, usage_scope = _validate_source_metadata(
            metadata
        )
        _validate_upload_file(uploaded_file)
        assert uploaded_file is not None
        _ensure_source_id_available(source_id, self._sources)
        storage_path = _build_storage_path(source_id, uploaded_file.name or "source-file")
        _read_uploaded_bytes(uploaded_file)
        record = SourceRecord(
            source_id=source_id,
            title=title,
            source_type=source_type,
            provenance=provenance,
            summary=summary,
            usage_scope=usage_scope,
            lifecycle_state="draft",
            storage_path=storage_path,
            created_at=_now(),
            updated_at=_now(),
        )
        self._sources[source_id] = record
        self._add_audit_event(
            source_id,
            event_type="upload",
            actor=actor,
            outcome="succeeded",
            summary="Uploaded as draft and inactive.",
        )
        return _mutation_result(self._snapshots(), source_id)

    def update_source_metadata(
        self,
        *,
        source_id: str,
        payload: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult:
        snapshot = self._require_snapshot(source_id)
        source = snapshot.source
        title = _clean_text(payload.get("title", source.title))
        provenance = _clean_text(payload.get("provenance", source.provenance))
        summary = _clean_text(payload.get("summary", source.summary))
        usage_scope = _clean_list(payload.get("usageScope", source.usage_scope))
        field_errors = {
            key: value
            for key, value in {
                "title": "Add a source title." if not title else "",
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
        source.title = title
        source.provenance = provenance
        source.summary = summary
        source.usage_scope = usage_scope
        if "sourceType" in payload:
            cleaned_type = _clean_text(payload["sourceType"])
            if cleaned_type:
                source.source_type = cleaned_type
        source.updated_at = _now()
        self._add_audit_event(
            source.source_id,
            event_type="edit",
            actor=actor,
            outcome="succeeded",
            summary="Updated source metadata.",
        )
        return _mutation_result(self._snapshots(), source.source_id)

    def transition_source(
        self,
        *,
        source_id: str,
        target_state: LifecycleState,
        actor: str,
    ) -> SourceMutationResult:
        snapshot = self._require_snapshot(source_id)
        _validate_transition(snapshot, target_state)
        snapshot.source.lifecycle_state = target_state
        snapshot.source.updated_at = _now()
        self._add_audit_event(
            source_id=snapshot.source.source_id,
            event_type=_lifecycle_event_type(target_state),
            actor=actor,
            outcome="succeeded",
            summary=f"Moved source to {target_state}.",
        )
        return _mutation_result(self._snapshots(), snapshot.source.source_id)

    def dispatch_ingest(self, *, source_id: str, actor: str) -> SourceMutationResult:
        snapshot = self._require_snapshot(source_id)
        _validate_ingest_request(snapshot)
        is_reingest = len(snapshot.ingest_jobs) > 0
        event_type = "re-ingest" if is_reingest else "ingest"
        now = _now()
        queued_job: IngestJobDto = {
            "jobId": f"ingest-{uuid4().hex[:12]}",
            "sourceId": snapshot.source.source_id,
            "status": "queued",
            "requestedAt": now,
            "summary": "Protected ingest request accepted for processing.",
        }
        self._jobs.setdefault(snapshot.source.source_id, []).insert(0, queued_job)
        self._add_audit_event(
            source_id=snapshot.source.source_id,
            event_type=event_type,
            actor=actor,
            outcome="queued",
            summary=queued_job["summary"],
        )
        completed_job: IngestJobDto = {
            **queued_job,
            "status": "succeeded",
            "summary": "Protected ingest request completed and is ready for activation.",
        }
        self._jobs[snapshot.source.source_id][0] = completed_job
        self._add_audit_event(
            source_id=snapshot.source.source_id,
            event_type=event_type,
            actor=actor,
            outcome="succeeded",
            summary=completed_job["summary"],
        )
        return _mutation_result(self._snapshots(), snapshot.source.source_id)

    def _snapshots(self) -> dict[str, SourceSnapshot]:
        snapshots: dict[str, SourceSnapshot] = {}
        for source_id, source in self._sources.items():
            audit_events = sorted(
                self._audit_events.get(source_id, []),
                key=lambda event: event["occurredAt"],
                reverse=True,
            )
            ingest_jobs = sorted(
                self._jobs.get(source_id, []),
                key=lambda job: job["requestedAt"],
                reverse=True,
            )
            validation_events = sorted(
                self._validation_events.get(source_id, []),
                key=lambda event: event["occurredAt"],
                reverse=True,
            )
            snapshots[source_id] = SourceSnapshot(
                source=source,
                latest_ingest_job=ingest_jobs[0] if ingest_jobs else None,
                ingest_jobs=ingest_jobs,
                audit_events=audit_events,
                validation_events=validation_events,
            )
        return snapshots

    def _find_snapshot(self, source_id: str) -> SourceSnapshot | None:
        snapshots = self._snapshots()
        if source_id in snapshots:
            return snapshots[source_id]
        return next(
            (
                snapshot
                for snapshot in snapshots.values()
                if source_id in snapshot.source.aliases
            ),
            None,
        )

    def _require_snapshot(self, source_id: str) -> SourceSnapshot:
        snapshot = self._find_snapshot(source_id)
        if snapshot is None:
            raise SourceMutationError(
                code="admin_source_not_found",
                message="The requested approved source was not found.",
                status=404,
            )
        return snapshot

    def _add_audit_event(
        self,
        source_id: str,
        *,
        event_type: str,
        actor: str,
        outcome: str,
        summary: str,
    ) -> None:
        event: StewardshipEventDto = {
            "eventId": f"audit-{uuid4().hex[:12]}",
            "sourceId": source_id,
            "eventType": event_type,
            "origin": actor,
            "occurredAt": _now(),
            "outcome": cast(Any, outcome),
            "summary": summary,
        }
        self._audit_events.setdefault(source_id, []).insert(0, event)


class SupabaseStewardshipRepository:
    def __init__(self, *, supabase_url: str, service_role_key: str) -> None:
        self.supabase_url = supabase_url.rstrip("/") + "/"
        self.service_role_key = service_role_key

    def get_dashboard(self) -> StewardshipDashboardDto:
        return _dashboard_from_snapshots(self._snapshots())

    def get_source_detail(self, source_id: str) -> SourceDetailDto | None:
        snapshot = self._find_snapshot(source_id)
        return _source_detail(snapshot) if snapshot else None

    def upload_source(
        self,
        *,
        uploaded_file: UploadedFile | None,
        metadata: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult:
        source_id, title, source_type, provenance, summary, usage_scope = _validate_source_metadata(
            metadata
        )
        _validate_upload_file(uploaded_file)
        assert uploaded_file is not None
        _ensure_source_id_available(
            source_id,
            {snapshot.source.source_id: snapshot.source for snapshot in self._snapshots().values()},
        )
        file_name = uploaded_file.name or "source-file"
        storage_path = _build_storage_path(source_id, file_name)
        content_type = uploaded_file.content_type or _content_type_for_name(file_name)
        file_bytes = _read_uploaded_bytes(uploaded_file)
        self._upload_storage_object(
            bucket=PRIVATE_SOURCE_BUCKET,
            path=storage_path,
            data=file_bytes,
            content_type=content_type,
        )
        record = self._request(
            "POST",
            "rest/v1/source_records",
            {
                "source_id": source_id,
                "title": title,
                "source_type": source_type,
                "provenance": provenance,
                "summary": summary,
                "usage_scope": usage_scope,
                "aliases": [],
                "lifecycle_state": "draft",
                "storage_bucket": PRIVATE_SOURCE_BUCKET,
                "storage_path": storage_path,
                "created_at": _now(),
                "updated_at": _now(),
            },
            prefer="return=representation",
        )[0]
        self._create_audit_event(
            source_id=source_id,
            event_type="upload",
            actor=actor,
            outcome="succeeded",
            summary="Uploaded as draft and inactive.",
            metadata={
                "storageBucket": PRIVATE_SOURCE_BUCKET,
                "storagePath": storage_path,
                "recordedAt": _now(),
            },
        )
        return self._mutation_result_from_record(record["source_id"])

    def update_source_metadata(
        self,
        *,
        source_id: str,
        payload: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult:
        snapshot = self._ensure_persisted_snapshot(source_id)
        source = snapshot.source
        title = _clean_text(payload.get("title", source.title))
        provenance = _clean_text(payload.get("provenance", source.provenance))
        summary = _clean_text(payload.get("summary", source.summary))
        usage_scope = _clean_list(payload.get("usageScope", source.usage_scope))
        field_errors = {
            key: value
            for key, value in {
                "title": "Add a source title." if not title else "",
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
        body: dict[str, Any] = {
            "title": title,
            "provenance": provenance,
            "summary": summary,
            "usage_scope": usage_scope,
            "updated_at": _now(),
        }
        if "sourceType" in payload:
            cleaned_type = _clean_text(payload["sourceType"])
            if cleaned_type:
                body["source_type"] = cleaned_type
        self._request(
            "PATCH",
            f"rest/v1/source_records?source_id=eq.{quote(snapshot.source.source_id, safe='')}",
            body,
            prefer="return=representation",
        )
        self._create_audit_event(
            source_id=snapshot.source.source_id,
            event_type="edit",
            actor=actor,
            outcome="succeeded",
            summary="Updated source metadata.",
            metadata={"changedFields": sorted(body.keys())},
        )
        return self._mutation_result_from_record(snapshot.source.source_id)

    def transition_source(
        self,
        *,
        source_id: str,
        target_state: LifecycleState,
        actor: str,
    ) -> SourceMutationResult:
        snapshot = self._ensure_persisted_snapshot(source_id)
        _validate_transition(snapshot, target_state)
        self._request(
            "PATCH",
            f"rest/v1/source_records?source_id=eq.{quote(snapshot.source.source_id, safe='')}",
            {
                "lifecycle_state": target_state,
                "updated_at": _now(),
            },
            prefer="return=representation",
        )
        self._create_audit_event(
            source_id=snapshot.source.source_id,
            event_type=_lifecycle_event_type(target_state),
            actor=actor,
            outcome="succeeded",
            summary=f"Moved source to {target_state}.",
            metadata={"targetState": target_state},
        )
        return self._mutation_result_from_record(snapshot.source.source_id)

    def dispatch_ingest(self, *, source_id: str, actor: str) -> SourceMutationResult:
        snapshot = self._ensure_persisted_snapshot(source_id)
        _validate_ingest_request(snapshot)
        is_reingest = len(snapshot.ingest_jobs) > 0
        event_type = "re-ingest" if is_reingest else "ingest"
        queued_summary = "Protected ingest request accepted for processing."
        requested_at = _now()
        try:
            queued_job = self._request(
                "POST",
                "rest/v1/source_ingest_jobs",
                {
                    "source_id": snapshot.source.source_id,
                    "status": "queued",
                    "requested_by": actor,
                    "requested_at": requested_at,
                    "summary": queued_summary,
                },
                prefer="return=representation",
            )[0]
        except SourceMutationError as error:
            if error.status == 409:
                raise SourceMutationError(
                    code="admin_source_ingest_in_progress",
                    message="An ingest job is already in progress for this source.",
                    status=409,
                ) from error
            raise
        self._create_audit_event(
            source_id=snapshot.source.source_id,
            event_type=event_type,
            actor=actor,
            outcome="queued",
            summary=queued_summary,
            metadata={"jobId": queued_job["id"]},
        )
        completed_summary = "Protected ingest request completed and is ready for activation."
        self._request(
            "PATCH",
            f"rest/v1/source_ingest_jobs?id=eq.{quote(str(queued_job['id']), safe='')}",
            {
                "status": "succeeded",
                "completed_at": _now(),
                "summary": completed_summary,
                "error_code": None,
            },
            prefer="return=representation",
        )
        self._create_audit_event(
            source_id=snapshot.source.source_id,
            event_type=event_type,
            actor=actor,
            outcome="succeeded",
            summary=completed_summary,
            metadata={"jobId": queued_job["id"]},
        )
        return self._mutation_result_from_record(snapshot.source.source_id)

    def _mutation_result_from_record(self, source_id: str) -> SourceMutationResult:
        snapshots = self._snapshots()
        return _mutation_result(snapshots, source_id)

    def _ensure_persisted_snapshot(self, source_id: str) -> SourceSnapshot:
        snapshot = self._find_snapshot(source_id)
        if snapshot is None:
            raise SourceMutationError(
                code="admin_source_not_found",
                message="The requested approved source was not found.",
                status=404,
            )
        if snapshot.source.created_at is None:
            self._persist_seed_snapshot(snapshot.source)
            snapshot = self._find_snapshot(snapshot.source.source_id)
            assert snapshot is not None
        return snapshot

    def _persist_seed_snapshot(self, source: SourceRecord) -> None:
        self._request(
            "POST",
            "rest/v1/source_records?on_conflict=source_id",
            {
                "source_id": source.source_id,
                "title": source.title,
                "source_type": source.source_type,
                "provenance": source.provenance,
                "summary": source.summary,
                "usage_scope": source.usage_scope,
                "aliases": source.aliases,
                "lifecycle_state": source.lifecycle_state,
                "storage_bucket": None,
                "storage_path": source.storage_path,
                "created_at": _now(),
                "updated_at": _now(),
            },
            prefer="resolution=merge-duplicates,return=representation",
        )

    def _find_snapshot(self, source_id: str) -> SourceSnapshot | None:
        snapshots = self._snapshots()
        if source_id in snapshots:
            return snapshots[source_id]
        return next(
            (
                snapshot
                for snapshot in snapshots.values()
                if source_id in snapshot.source.aliases
            ),
            None,
        )

    def _snapshots(self) -> dict[str, SourceSnapshot]:
        records = self._source_records()
        ingest_jobs = self._ingest_jobs()
        audit_events = self._audit_events()
        validation_events = self._validation_events()
        snapshots: dict[str, SourceSnapshot] = {}
        for seed in APPROVED_SOURCE_SEEDS:
            snapshots[seed.source_id] = SourceSnapshot(
                source=_source_from_seed(seed),
                latest_ingest_job=None,
                ingest_jobs=[],
                audit_events=[],
                validation_events=[],
            )
        for record in records.values():
            snapshots[record.source_id] = SourceSnapshot(
                source=record,
                latest_ingest_job=ingest_jobs.get(record.source_id, [None])[0],
                ingest_jobs=ingest_jobs.get(record.source_id, []),
                audit_events=audit_events.get(record.source_id, []),
                validation_events=validation_events.get(record.source_id, []),
            )
        return snapshots

    def _source_records(self) -> dict[str, SourceRecord]:
        rows = self._request(
            "GET",
            "rest/v1/source_records"
            "?select=source_id,title,source_type,provenance,summary,usage_scope,aliases,"
            "lifecycle_state,storage_path,created_at,updated_at"
            "&order=title.asc",
        )
        return {
            row["source_id"]: SourceRecord(
                source_id=row["source_id"],
                title=row["title"],
                source_type=row["source_type"],
                provenance=row["provenance"],
                summary=row["summary"],
                usage_scope=_clean_list(row.get("usage_scope", [])),
                aliases=_clean_list(row.get("aliases", [])),
                lifecycle_state=cast(LifecycleState, row["lifecycle_state"]),
                storage_path=row.get("storage_path"),
                created_at=row.get("created_at"),
                updated_at=row.get("updated_at"),
            )
            for row in rows
        }

    def _ingest_jobs(self) -> dict[str, list[IngestJobDto]]:
        rows = self._request(
            "GET",
            "rest/v1/source_ingest_jobs"
            "?select=id,source_id,status,requested_at,summary"
            "&order=requested_at.desc",
        )
        jobs: dict[str, list[IngestJobDto]] = {}
        for row in rows:
            jobs.setdefault(row["source_id"], []).append(
                {
                    "jobId": str(row["id"]),
                    "sourceId": row["source_id"],
                    "status": cast(Any, row["status"]),
                    "requestedAt": row["requested_at"],
                    "summary": row["summary"],
                }
            )
        return jobs

    def _audit_events(self) -> dict[str, list[StewardshipEventDto]]:
        rows = self._request(
            "GET",
            "rest/v1/source_audit_events"
            "?select=id,source_id,event_type,origin,occurred_at,outcome_status,summary"
            "&order=occurred_at.desc",
        )
        events: dict[str, list[StewardshipEventDto]] = {}
        for row in rows:
            events.setdefault(row["source_id"], []).append(_event_from_row(row))
        return events

    def _validation_events(self) -> dict[str, list[StewardshipEventDto]]:
        rows = self._request(
            "GET",
            "rest/v1/source_validation_runs"
            "?select=id,source_id,event_type,origin,occurred_at,outcome_status,summary"
            "&order=occurred_at.desc",
        )
        events: dict[str, list[StewardshipEventDto]] = {}
        for row in rows:
            events.setdefault(row["source_id"], []).append(_event_from_row(row))
        return events

    def _create_audit_event(
        self,
        *,
        source_id: str,
        event_type: str,
        actor: str,
        outcome: str,
        summary: str,
        metadata: dict[str, Any],
    ) -> None:
        self._request(
            "POST",
            "rest/v1/source_audit_events",
            {
                "source_id": source_id,
                "event_type": event_type,
                "actor_id": actor,
                "origin": actor,
                "occurred_at": _now(),
                "outcome_status": outcome,
                "summary": summary,
                "metadata": metadata,
            },
        )

    def _upload_storage_object(
        self,
        *,
        bucket: str,
        path: str,
        data: bytes,
        content_type: str,
    ) -> None:
        encoded_path = "/".join(quote(part, safe="") for part in (bucket, path))
        request = Request(
            urljoin(self.supabase_url, f"storage/v1/object/{encoded_path}"),
            data=data,
            headers={
                "apikey": self.service_role_key,
                "Authorization": f"Bearer {self.service_role_key}",
                "Content-Type": content_type,
                "x-upsert": "false",
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=settings.SUPABASE_REST_TIMEOUT_SECONDS):
                return
        except (HTTPError, URLError) as error:
            raise SourceMutationError(
                code="admin_source_upload_failed",
                message="The protected source file could not be stored.",
                status=502,
            ) from error

    def _request(
        self,
        method: str,
        path: str,
        payload: dict[str, Any] | None = None,
        *,
        prefer: str | None = None,
    ) -> Any:
        body = None if payload is None else json.dumps(payload).encode("utf-8")
        headers = {
            "apikey": self.service_role_key,
            "Authorization": f"Bearer {self.service_role_key}",
            "Accept": "application/json",
        }
        if body is not None:
            headers["Content-Type"] = "application/json"
        if prefer:
            headers["Prefer"] = prefer
        request = Request(
            urljoin(self.supabase_url, path),
            data=body,
            headers=headers,
            method=method,
        )
        try:
            with urlopen(request, timeout=settings.SUPABASE_REST_TIMEOUT_SECONDS) as response:
                return json.loads(response.read().decode("utf-8") or "[]")
        except HTTPError as error:
            if error.code == 409:
                raise SourceMutationError(
                    code="admin_source_conflict",
                    message=(
                        "The requested protected mutation conflicts with current "
                        "stewardship state."
                    ),
                    status=409,
                ) from error
            raise SourceMutationError(
                code="admin_source_store_unavailable",
                message="The protected stewardship store is temporarily unavailable.",
                status=503,
            ) from error
        except URLError as error:
            raise SourceMutationError(
                code="admin_source_store_unavailable",
                message="The protected stewardship store is temporarily unavailable.",
                status=503,
            ) from error


def reset_stewardship_state() -> None:
    global _TEST_REPOSITORY
    _TEST_REPOSITORY = InMemoryStewardshipRepository()


def get_stewardship_dashboard() -> StewardshipDashboardDto:
    return _repository().get_dashboard()


def get_source_detail(source_id: str) -> SourceDetailDto | None:
    return _repository().get_source_detail(source_id)


def upload_source(
    *,
    uploaded_file: UploadedFile | None,
    metadata: dict[str, Any],
    actor: str,
) -> SourceMutationResult:
    return _repository().upload_source(uploaded_file=uploaded_file, metadata=metadata, actor=actor)


def update_source_metadata(
    *, source_id: str, payload: dict[str, Any], actor: str
) -> SourceMutationResult:
    return _repository().update_source_metadata(source_id=source_id, payload=payload, actor=actor)


def transition_source(
    *, source_id: str, target_state: LifecycleState, actor: str
) -> SourceMutationResult:
    return _repository().transition_source(
        source_id=source_id, target_state=target_state, actor=actor
    )


def dispatch_ingest(*, source_id: str, actor: str) -> SourceMutationResult:
    return _repository().dispatch_ingest(source_id=source_id, actor=actor)


def _repository() -> StewardshipRepository:
    if _TEST_REPOSITORY is not None:
        return _TEST_REPOSITORY
    return SupabaseStewardshipRepository(
        supabase_url=settings.SUPABASE_URL,
        service_role_key=settings.SUPABASE_SERVICE_ROLE_KEY,
    )


def _source_from_seed(seed: ApprovedSourceSeed) -> SourceRecord:
    return SourceRecord(
        source_id=seed.source_id,
        title=seed.title,
        source_type=seed.source_type,
        provenance=seed.provenance,
        summary=seed.summary,
        usage_scope=list(seed.usage_scope),
        aliases=list(seed.aliases),
        lifecycle_state=seed.lifecycle_state,
        storage_path="bootstrap-approved-source-bundle",
    )


def _mutation_result(
    snapshots: dict[str, SourceSnapshot], source_id: str
) -> SourceMutationResult:
    snapshot = snapshots.get(source_id)
    if snapshot is None:
        raise SourceMutationError(
            code="admin_source_not_found",
            message="The requested approved source was not found.",
            status=404,
        )
    return {
        "source": _source_detail(snapshot),
        "dashboard": _dashboard_from_snapshots(snapshots),
    }


def _dashboard_from_snapshots(
    snapshots: dict[str, SourceSnapshot],
) -> StewardshipDashboardDto:
    ordered = sorted(snapshots.values(), key=lambda snapshot: snapshot.source.title.lower())
    sources = [_inventory_item(snapshot) for snapshot in ordered]
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
        "overview": _overview(sources, ingestion_runs, validation_runs),
        "sources": sources,
        "ingestionRuns": ingestion_runs,
        "validationRuns": validation_runs,
        "auditEvents": audit_events,
    }


def _inventory_item(snapshot: SourceSnapshot) -> SourceInventoryItemDto:
    partial_data: list[PartialDataMarker] = []
    readiness = _ingestion_readiness(snapshot.latest_ingest_job)
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


def _source_detail(snapshot: SourceSnapshot) -> SourceDetailDto:
    audit_events = list(snapshot.audit_events)
    return {
        **_inventory_item(snapshot),
        "summary": snapshot.source.summary,
        "metadata": {
            "canonicalSourceId": snapshot.source.source_id,
            "sourceType": snapshot.source.source_type,
            "usageScope": list(snapshot.source.usage_scope),
            "provenance": snapshot.source.provenance,
            "storagePath": snapshot.source.storage_path or "bootstrap-approved-source-bundle",
        },
        "approvalLineage": [
            event
            for event in audit_events
            if event["eventType"] in {"approved", "activate"}
        ],
        "ingestionProvenance": [
            event
            for event in audit_events
            if event["eventType"] in {"ingest", "re-ingest"}
        ],
        "validationHistory": list(snapshot.validation_events),
        "auditTrail": audit_events,
    }


def _overview(
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


def _validate_transition(snapshot: SourceSnapshot, target_state: LifecycleState) -> None:
    source = snapshot.source
    if target_state not in ALLOWED_TRANSITIONS[source.lifecycle_state]:
        raise SourceMutationError(
            code="admin_source_lifecycle_conflict",
            message="That lifecycle transition is not allowed for this source.",
            status=409,
            fields={"lifecycleState": f"{source.lifecycle_state} cannot move to {target_state}."},
        )
    if target_state == "active" and _ingestion_readiness(snapshot.latest_ingest_job) != "ready":
        raise SourceMutationError(
            code="admin_source_activation_blocked",
            message="Only reviewed and successfully ingested sources can be activated.",
            status=409,
            fields={
                "lifecycleState": (
                    "Approve the source and wait for a successful ingest before "
                    "activation."
                )
            },
        )


def _validate_ingest_request(snapshot: SourceSnapshot) -> None:
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
    if snapshot.latest_ingest_job and snapshot.latest_ingest_job["status"] == "queued":
        raise SourceMutationError(
            code="admin_source_ingest_in_progress",
            message="An ingest job is already in progress for this source.",
            status=409,
        )


def _validate_source_metadata(
    metadata: dict[str, Any],
) -> tuple[str, str, str, str, str, list[str]]:
    source_id = _clean_source_id(str(metadata.get("sourceId") or ""))
    title = _clean_text(metadata.get("title"))
    source_type = _clean_text(metadata.get("sourceType"))
    provenance = _clean_text(metadata.get("provenance"))
    summary = _clean_text(metadata.get("summary"))
    usage_scope = _clean_list(metadata.get("usageScope"))
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


def _ensure_source_id_available(source_id: str, sources: dict[str, SourceRecord]) -> None:
    existing_ids = set(sources)
    existing_aliases = {
        alias
        for source in sources.values()
        for alias in source.aliases
    }
    if source_id in existing_ids or source_id in existing_aliases:
        raise SourceMutationError(
            code="admin_source_conflict",
            message="A source with this identifier or alias already exists.",
            status=409,
            fields={"sourceId": "Use a source identifier that is not already in stewardship."},
        )


def _build_storage_path(source_id: str, file_name: str) -> str:
    cleaned_name = _sanitize_filename(file_name)
    return str(PurePosixPath("stewardship") / "draft" / source_id / cleaned_name)


def _sanitize_filename(file_name: str) -> str:
    base_name = PurePosixPath(file_name.replace("\\", "/")).name
    stem = re.sub(r"[^A-Za-z0-9._-]+", "-", base_name).strip(".-")
    return stem or "source-file"


def _validate_upload_file(uploaded_file: UploadedFile | None) -> None:
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


def _read_uploaded_bytes(uploaded_file: UploadedFile) -> bytes:
    chunks = [chunk for chunk in uploaded_file.chunks()]
    return b"".join(chunks)


def _event_from_row(row: dict[str, Any]) -> StewardshipEventDto:
    return {
        "eventId": str(row["id"]),
        "sourceId": row["source_id"],
        "eventType": row["event_type"],
        "origin": row["origin"],
        "occurredAt": row["occurred_at"],
        "outcome": cast(Any, row["outcome_status"]),
        "summary": row["summary"],
    }


def _content_type_for_name(file_name: str) -> str:
    extension = "." + file_name.rsplit(".", 1)[-1].lower() if "." in file_name else ""
    return {
        ".md": "text/markdown",
        ".txt": "text/plain",
        ".pdf": "application/pdf",
        ".csv": "text/csv",
    }.get(extension, "application/octet-stream")


def _ingestion_readiness(job: IngestJobDto | None) -> ReadinessState:
    if job is None:
        return "partial"
    if job["status"] == "succeeded":
        return "ready"
    return "partial"


def _lifecycle_event_type(target_state: LifecycleState) -> str:
    return {
        "approved": "approved",
        "active": "activate",
        "disabled": "disabled",
        "archived": "archived",
        "draft": "edit",
    }[target_state]


def _clean_text(value: Any) -> str:
    return str(value or "").strip()


def _clean_list(value: Any) -> list[str]:
    if isinstance(value, str):
        return [item.strip() for item in value.split(",") if item.strip()]
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    return []


def _clean_source_id(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-")
    return re.sub(r"-{2,}", "-", cleaned)


def _now() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


reset_stewardship_state()
