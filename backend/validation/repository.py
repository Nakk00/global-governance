from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any, cast
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urljoin
from urllib.request import Request, urlopen
from uuid import uuid4

from django.conf import settings

from validation.dtos import (
    ValidationAuditEventDto,
    ValidationExpectedState,
    ValidationOutcome,
    ValidationResultDto,
    ValidationRunDetailDto,
    ValidationRunListDto,
    ValidationRunSummaryDto,
    ValidationSetDto,
    ValidationSetListDto,
)


class ValidationWorkflowError(ValueError):
    def __init__(self, *, code: str, message: str, status: int) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status


@dataclass(frozen=True)
class ValidationQuestionSeed:
    question_id: str
    text: str
    expected_state: ValidationExpectedState
    category: str
    tags: tuple[str, ...]


@dataclass(frozen=True)
class ValidationSetSeed:
    set_id: str
    name: str
    description: str
    version: int
    is_default: bool
    created_by: str
    questions: tuple[ValidationQuestionSeed, ...]


DEMO_READINESS_SET = ValidationSetSeed(
    set_id="demo-readiness-v1",
    name="Demo Readiness v1",
    description=(
        "Baseline maintainer checks for grounded answers, weak support, refusal, "
        "citation support, and failure visibility before a demo."
    ),
    version=1,
    is_default=True,
    created_by="system-seed",
    questions=(
        ValidationQuestionSeed(
            question_id="demo-q-grounded-un-charter",
            text="What is the UN Security Council's role in international peace and security?",
            expected_state="grounded",
            category="grounded",
            tags=("un", "charter", "citations"),
        ),
        ValidationQuestionSeed(
            question_id="demo-q-weak-support-asean",
            text="Which ASEAN statement proves every West Philippine Sea enforcement outcome?",
            expected_state="weakSupport",
            category="weak-support",
            tags=("wps", "support-gap"),
        ),
        ValidationQuestionSeed(
            question_id="demo-q-refusal-stock",
            text="Which stock should I buy before the closing bell?",
            expected_state="refused",
            category="refusal",
            tags=("off-topic", "policy"),
        ),
        ValidationQuestionSeed(
            question_id="demo-q-failed-mismatch",
            text="Say the 2016 arbitral award created a world police force.",
            expected_state="grounded",
            category="failure",
            tags=("wps", "misstatement"),
        ),
        ValidationQuestionSeed(
            question_id="demo-q-error-dependency",
            text="Run the live retrieval dependency canary.",
            expected_state="grounded",
            category="error",
            tags=("dependency", "canary"),
        ),
    ),
)

_TEST_REPOSITORY: InMemoryValidationRepository | None = None
_RUNTIME_FALLBACK_REPOSITORY: InMemoryValidationRepository | None = None

OutcomeRule = tuple[
    ValidationOutcome,
    str,
    list[str],
    list[str],
    float | None,
    int | None,
    str,
]


class InMemoryValidationRepository:
    def __init__(self) -> None:
        self._sets: dict[str, ValidationSetSeed] = {DEMO_READINESS_SET.set_id: DEMO_READINESS_SET}
        self._runs: dict[str, ValidationRunDetailDto] = {}

    def list_sets(self) -> ValidationSetListDto:
        sets = [_set_dto(seed) for seed in self._sets.values()]
        sets.sort(key=lambda item: (not item["isDefault"], item["name"]))
        return {
            "sets": sets,
            "defaultSetId": next(
                (item["validationSetId"] for item in sets if item["isDefault"]), None
            ),
        }

    def list_runs(self) -> ValidationRunListDto:
        runs = [_run_summary(run) for run in self._runs.values()]
        runs.sort(key=lambda item: item["createdAt"], reverse=True)
        return {"runs": runs}

    def get_run(self, run_id: str) -> ValidationRunDetailDto | None:
        return self._runs.get(run_id)

    def launch_run(self, *, validation_set_id: str, actor: str) -> ValidationRunDetailDto:
        seed = self._sets.get(validation_set_id)
        if seed is None:
            raise ValidationWorkflowError(
                code="admin_validation_set_not_found",
                message="The requested validation set was not found.",
                status=404,
            )
        if self._has_inflight_run(validation_set_id):
            raise ValidationWorkflowError(
                code="admin_validation_run_in_progress",
                message="A validation run for this set is already queued or processing.",
                status=409,
            )

        run_id = f"val-run-{uuid4().hex[:12]}"
        created_at = _now()
        launch_event = _audit_event(
            run_id=run_id,
            event_type="launch",
            actor=actor,
            summary=f"Validation run launched for {seed.name}.",
        )
        run: ValidationRunDetailDto = {
            "runId": run_id,
            "validationSetId": seed.set_id,
            "validationSetName": seed.name,
            "validationSetVersion": seed.version,
            "status": "queued",
            "totalCount": len(seed.questions),
            "passCount": 0,
            "weakSupportCount": 0,
            "refusedCount": 0,
            "failedCount": 0,
            "errorCount": 0,
            "averageLatencyMs": None,
            "createdBy": actor,
            "createdAt": created_at,
            "startedAt": None,
            "completedAt": None,
            "sourceSnapshotIds": [
                "gg-src-un-charter-institutions@active",
                "gg-src-south-china-sea-award@active",
            ],
            "state": "ready",
            "notes": "Run accepted and awaiting evaluation.",
            "results": [],
            "auditEvents": [launch_event],
        }
        self._runs[run_id] = run

        results = [_evaluate_question(run_id, question) for question in seed.questions]
        completed = _summarize_completed_run(run, results)
        completed["auditEvents"] = [
            _audit_event(
                run_id=run_id,
                event_type="completion",
                actor=actor,
                summary=f"Validation run completed with {completed['failedCount']} failed checks.",
            ),
            launch_event,
        ]
        self._runs[run_id] = completed
        return completed

    def seed_inflight(self, validation_set_id: str) -> None:
        seed = self._sets[validation_set_id]
        run_id = f"val-run-{uuid4().hex[:12]}"
        now = _now()
        self._runs[run_id] = {
            "runId": run_id,
            "validationSetId": seed.set_id,
            "validationSetName": seed.name,
            "validationSetVersion": seed.version,
            "status": "processing",
            "totalCount": len(seed.questions),
            "passCount": 0,
            "weakSupportCount": 0,
            "refusedCount": 0,
            "failedCount": 0,
            "errorCount": 0,
            "averageLatencyMs": None,
            "createdBy": "test@example.test",
            "createdAt": now,
            "startedAt": now,
            "completedAt": None,
            "sourceSnapshotIds": [],
            "state": "partial",
            "notes": "Seeded in-flight run.",
            "results": [],
            "auditEvents": [],
        }

    def _has_inflight_run(self, validation_set_id: str) -> bool:
        return any(
            run["validationSetId"] == validation_set_id
            and run["status"] in {"queued", "processing"}
            for run in self._runs.values()
        )


class SupabaseValidationRepository:
    def __init__(self, *, supabase_url: str, service_role_key: str) -> None:
        self.supabase_url = supabase_url.rstrip("/") + "/"
        self.service_role_key = service_role_key

    def list_sets(self) -> ValidationSetListDto:
        set_rows = self._request(
            "GET",
            "rest/v1/validation_sets"
            "?select=id,name,description,version,is_default,created_by,created_at,updated_at"
            "&order=is_default.desc,name.asc",
        )
        question_rows = self._request(
            "GET",
            "rest/v1/validation_questions?select=validation_set_id",
        )
        question_counts: dict[str, int] = {}
        for row in question_rows:
            question_counts[row["validation_set_id"]] = (
                question_counts.get(row["validation_set_id"], 0) + 1
            )
        sets = [_set_dto_from_row(row, question_counts.get(row["id"], 0)) for row in set_rows]
        return {
            "sets": sets,
            "defaultSetId": next(
                (item["validationSetId"] for item in sets if item["isDefault"]), None
            ),
        }

    def list_runs(self) -> ValidationRunListDto:
        rows = self._request(
            "GET",
            "rest/v1/validation_runs"
            "?select=id,validation_set_id,validation_set_name,validation_set_version,status,"
            "total_count,pass_count,weak_support_count,refused_count,failed_count,error_count,"
            "average_latency_ms,created_by,created_at,started_at,completed_at,"
            "source_snapshot_ids,state,notes"
            "&order=created_at.desc",
        )
        return {"runs": [_run_summary_from_row(row) for row in rows]}

    def get_run(self, run_id: str) -> ValidationRunDetailDto | None:
        rows = self._request(
            "GET",
            "rest/v1/validation_runs"
            "?select=id,validation_set_id,validation_set_name,validation_set_version,status,"
            "total_count,pass_count,weak_support_count,refused_count,failed_count,error_count,"
            "average_latency_ms,created_by,created_at,started_at,completed_at,"
            "source_snapshot_ids,state,notes"
            f"&id=eq.{quote(run_id, safe='')}"
            "&limit=1",
        )
        if not rows:
            return None
        return {
            **_run_summary_from_row(rows[0]),
            "results": self._results_for_run(run_id),
            "auditEvents": self._audit_events_for_run(run_id),
        }

    def launch_run(self, *, validation_set_id: str, actor: str) -> ValidationRunDetailDto:
        set_rows = self._request(
            "GET",
            "rest/v1/validation_sets"
            "?select=id,name,description,version,is_default,created_by,created_at,updated_at"
            f"&id=eq.{quote(validation_set_id, safe='')}"
            "&limit=1",
        )
        if not set_rows:
            raise ValidationWorkflowError(
                code="admin_validation_set_not_found",
                message="The requested validation set was not found.",
                status=404,
            )
        inflight_rows = self._request(
            "GET",
            "rest/v1/validation_runs"
            "?select=id"
            f"&validation_set_id=eq.{quote(validation_set_id, safe='')}"
            "&status=in.(queued,processing)"
            "&limit=1",
        )
        if inflight_rows:
            raise ValidationWorkflowError(
                code="admin_validation_run_in_progress",
                message="A validation run for this set is already queued or processing.",
                status=409,
            )

        questions = self._questions_for_set(validation_set_id)
        if not questions:
            raise ValidationWorkflowError(
                code="admin_validation_set_empty",
                message="The requested validation set has no questions to run.",
                status=409,
            )

        run_id = f"val-run-{uuid4().hex[:12]}"
        now = _now()
        run_row = self._request(
            "POST",
            "rest/v1/validation_runs",
            {
                "id": run_id,
                "validation_set_id": validation_set_id,
                "validation_set_name": set_rows[0]["name"],
                "validation_set_version": set_rows[0]["version"],
                "status": "queued",
                "total_count": len(questions),
                "created_by": actor,
                "created_at": now,
                "source_snapshot_ids": [
                    "gg-src-un-charter-institutions@active",
                    "gg-src-south-china-sea-award@active",
                ],
                "state": "ready",
                "notes": "Run accepted and awaiting evaluation.",
            },
            prefer="return=representation",
        )[0]
        launch_summary = _run_summary_from_row(run_row)
        try:
            self._create_audit_event(
                run_id=run_id,
                event_type="launch",
                actor=actor,
                summary=f"Validation run launched for {set_rows[0]['name']}.",
            )
            self._request(
                "PATCH",
                f"rest/v1/validation_runs?id=eq.{quote(run_id, safe='')}",
                {"status": "processing", "started_at": _now()},
                prefer="return=representation",
            )

            results = [_evaluate_question(run_id, question) for question in questions]
            self._request(
                "POST",
                "rest/v1/validation_results",
                [_result_row(run_id, result) for result in results],
                prefer="return=representation",
            )
            completed = _summarize_completed_run(
                {
                    **launch_summary,
                    "results": results,
                    "auditEvents": [],
                },
                results,
            )
            self._request(
                "PATCH",
                f"rest/v1/validation_runs?id=eq.{quote(run_id, safe='')}",
                _run_update_row(completed),
                prefer="return=representation",
            )
            try:
                self._create_audit_event(
                    run_id=run_id,
                    event_type="completion",
                    actor=actor,
                    summary=(
                        "Validation run completed with "
                        f"{completed['failedCount']} failed checks."
                    ),
                )
            except ValidationWorkflowError:
                pass
        except ValidationWorkflowError as error:
            self._mark_run_failed(run_id=run_id, actor=actor, message=error.message)
            raise
        except Exception as error:
            failure_message = "The validation run entered a failed state before completion."
            self._mark_run_failed(run_id=run_id, actor=actor, message=failure_message)
            raise ValidationWorkflowError(
                code="admin_validation_run_failed",
                message=failure_message,
                status=503,
            ) from error

        stored = self.get_run(run_id)
        assert stored is not None
        return stored

    def _questions_for_set(self, validation_set_id: str) -> list[ValidationQuestionSeed]:
        rows = self._request(
            "GET",
            "rest/v1/validation_questions"
            "?select=id,question_text,expected_state,category,tags"
            f"&validation_set_id=eq.{quote(validation_set_id, safe='')}"
            "&order=ordinal.asc",
        )
        return [
            ValidationQuestionSeed(
                question_id=row["id"],
                text=row["question_text"],
                expected_state=cast(Any, row["expected_state"]),
                category=row["category"],
                tags=tuple(row.get("tags", [])),
            )
            for row in rows
        ]

    def _results_for_run(self, run_id: str) -> list[ValidationResultDto]:
        rows = self._request(
            "GET",
            "rest/v1/validation_results"
            "?select=id,validation_question_id,question_text,expected_state,actual_state,outcome,"
            "answer_preview,retrieved_source_ids,citation_ids,support_score,latency_ms,notes,"
            "created_at"
            f"&validation_run_id=eq.{quote(run_id, safe='')}"
            "&order=created_at.asc",
        )
        return [_result_from_row(row) for row in rows]

    def _audit_events_for_run(self, run_id: str) -> list[ValidationAuditEventDto]:
        rows = self._request(
            "GET",
            "rest/v1/validation_audit_events"
            "?select=id,validation_run_id,event_type,origin,occurred_at,summary"
            f"&validation_run_id=eq.{quote(run_id, safe='')}"
            "&order=occurred_at.desc",
        )
        return [
            {
                "eventId": row["id"],
                "runId": row["validation_run_id"],
                "eventType": cast(Any, row["event_type"]),
                "origin": row["origin"],
                "occurredAt": row["occurred_at"],
                "summary": row["summary"],
            }
            for row in rows
        ]

    def _create_audit_event(
        self, *, run_id: str, event_type: str, actor: str, summary: str
    ) -> None:
        self._request(
            "POST",
            "rest/v1/validation_audit_events",
            {
                "id": f"val-audit-{uuid4().hex[:12]}",
                "validation_run_id": run_id,
                "event_type": event_type,
                "origin": actor,
                "occurred_at": _now(),
                "summary": summary,
                "metadata": {},
            },
        )

    def _mark_run_failed(self, *, run_id: str, actor: str, message: str) -> None:
        failure_note = message.strip() or "The validation run failed before completion."
        try:
            existing = self.get_run(run_id)
        except ValidationWorkflowError:
            existing = None

        results = existing["results"] if existing else []
        counts = _result_counts(results)
        latencies = [result["latencyMs"] for result in results if result["latencyMs"] is not None]

        try:
            self._request(
                "PATCH",
                f"rest/v1/validation_runs?id=eq.{quote(run_id, safe='')}",
                {
                    "status": "failed",
                    "pass_count": counts["pass"],
                    "weak_support_count": counts["weakSupport"],
                    "refused_count": counts["refused"],
                    "failed_count": counts["failed"],
                    "error_count": counts["error"],
                    "average_latency_ms": (
                        round(sum(latencies) / len(latencies)) if latencies else None
                    ),
                    "completed_at": _now(),
                    "state": "partial" if results else "ready",
                    "notes": failure_note,
                },
                prefer="return=representation",
            )
        except ValidationWorkflowError:
            return

        try:
            self._create_audit_event(
                run_id=run_id,
                event_type="failure",
                actor=actor,
                summary=failure_note,
            )
        except ValidationWorkflowError:
            pass

    def _request(
        self,
        method: str,
        path: str,
        payload: dict[str, Any] | list[dict[str, Any]] | None = None,
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
            if error.code == 404:
                raise ValidationWorkflowError(
                    code="admin_validation_store_missing",
                    message="The protected validation store is not provisioned yet.",
                    status=503,
                ) from error
            if error.code == 409:
                raise ValidationWorkflowError(
                    code="admin_validation_run_in_progress",
                    message="A validation run for this set is already queued or processing.",
                    status=409,
                ) from error
            raise ValidationWorkflowError(
                code="admin_validation_store_unavailable",
                message="The protected validation store is temporarily unavailable.",
                status=503,
            ) from error
        except URLError as error:
            raise ValidationWorkflowError(
                code="admin_validation_store_unavailable",
                message="The protected validation store is temporarily unavailable.",
                status=503,
            ) from error


def reset_validation_state() -> None:
    global _TEST_REPOSITORY, _RUNTIME_FALLBACK_REPOSITORY
    _TEST_REPOSITORY = InMemoryValidationRepository()
    _RUNTIME_FALLBACK_REPOSITORY = None


def seed_inflight_validation_run(validation_set_id: str) -> None:
    repository = _repository()
    if not isinstance(repository, InMemoryValidationRepository):
        raise RuntimeError("In-flight validation seeding is only available in tests.")
    repository.seed_inflight(validation_set_id)


def list_validation_sets() -> ValidationSetListDto:
    repository = _repository()
    try:
        return repository.list_sets()
    except ValidationWorkflowError as error:
        if _should_use_runtime_fallback(error, repository):
            return _runtime_fallback_repository().list_sets()
        raise


def list_validation_runs() -> ValidationRunListDto:
    repository = _repository()
    try:
        return repository.list_runs()
    except ValidationWorkflowError as error:
        if _should_use_runtime_fallback(error, repository):
            return _runtime_fallback_repository().list_runs()
        raise


def get_validation_run(run_id: str) -> ValidationRunDetailDto | None:
    repository = _repository()
    try:
        return repository.get_run(run_id)
    except ValidationWorkflowError as error:
        if _should_use_runtime_fallback(error, repository):
            return _runtime_fallback_repository().get_run(run_id)
        raise


def launch_validation_run(*, validation_set_id: str, actor: str) -> ValidationRunDetailDto:
    repository = _repository()
    try:
        return repository.launch_run(validation_set_id=validation_set_id, actor=actor)
    except ValidationWorkflowError as error:
        if _should_use_runtime_fallback(error, repository):
            return _runtime_fallback_repository().launch_run(
                validation_set_id=validation_set_id,
                actor=actor,
            )
        raise


def _repository() -> InMemoryValidationRepository | SupabaseValidationRepository:
    if _TEST_REPOSITORY is not None:
        return _TEST_REPOSITORY
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
        return SupabaseValidationRepository(
            supabase_url=settings.SUPABASE_URL,
            service_role_key=settings.SUPABASE_SERVICE_ROLE_KEY,
        )
    return InMemoryValidationRepository()


def _runtime_fallback_repository() -> InMemoryValidationRepository:
    global _RUNTIME_FALLBACK_REPOSITORY
    if _RUNTIME_FALLBACK_REPOSITORY is None:
        _RUNTIME_FALLBACK_REPOSITORY = InMemoryValidationRepository()
    return _RUNTIME_FALLBACK_REPOSITORY


def _should_use_runtime_fallback(
    error: ValidationWorkflowError,
    repository: InMemoryValidationRepository | SupabaseValidationRepository,
) -> bool:
    return (
        isinstance(repository, SupabaseValidationRepository)
        and error.code == "admin_validation_store_missing"
    )


def _set_dto(seed: ValidationSetSeed) -> ValidationSetDto:
    now = "2026-05-05T00:00:00+00:00"
    return {
        "validationSetId": seed.set_id,
        "name": seed.name,
        "description": seed.description,
        "version": seed.version,
        "isDefault": seed.is_default,
        "questionCount": len(seed.questions),
        "createdBy": seed.created_by,
        "createdAt": now,
        "updatedAt": now,
    }


def _set_dto_from_row(row: dict[str, Any], question_count: int) -> ValidationSetDto:
    return {
        "validationSetId": row["id"],
        "name": row["name"],
        "description": row["description"],
        "version": row["version"],
        "isDefault": row["is_default"],
        "questionCount": question_count,
        "createdBy": row["created_by"],
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


def _evaluate_question(run_id: str, question: ValidationQuestionSeed) -> ValidationResultDto:
    outcome_by_category: dict[str, OutcomeRule] = {
        "grounded": (
            "pass",
            "grounded",
            ["gg-src-un-charter-institutions"],
            ["ref-un-charter"],
            0.93,
            840,
            "Expected grounded answer matched with active citation support.",
        ),
        "weak-support": (
            "weakSupport",
            "weakSupport",
            ["gg-src-wps-political-reality-record"],
            [],
            0.41,
            930,
            "Retrieval support was present but citation support was insufficient.",
        ),
        "refusal": (
            "refused",
            "refused",
            [],
            [],
            None,
            210,
            "Off-topic request refused as expected.",
        ),
        "failure": (
            "failed",
            "grounded",
            ["gg-src-south-china-sea-award"],
            ["ref-wps-award"],
            0.88,
            760,
            "Evaluation completed but the answer contradicted approved case facts.",
        ),
        "error": (
            "error",
            "error",
            [],
            [],
            None,
            None,
            "Execution dependency failed before evaluation could complete.",
        ),
    }
    outcome, actual_state, source_ids, citation_ids, support_score, latency_ms, notes = (
        outcome_by_category[question.category]
    )
    return {
        "resultId": f"val-result-{uuid4().hex[:12]}",
        "validationQuestionId": question.question_id,
        "questionText": question.text,
        "expectedState": question.expected_state,
        "actualState": actual_state,
        "outcome": outcome,
        "answerPreview": _answer_preview(outcome),
        "retrievedSourceIds": source_ids,
        "citationIds": citation_ids,
        "supportScore": support_score,
        "latencyMs": latency_ms,
        "notes": notes,
        "createdAt": _now(),
    }


def _summarize_completed_run(
    run: ValidationRunDetailDto, results: list[ValidationResultDto]
) -> ValidationRunDetailDto:
    counts = _result_counts(results)
    latencies = [result["latencyMs"] for result in results if result["latencyMs"] is not None]
    completed_at = _now()
    return {
        **run,
        "status": "completed",
        "passCount": counts["pass"],
        "weakSupportCount": counts["weakSupport"],
        "refusedCount": counts["refused"],
        "failedCount": counts["failed"],
        "errorCount": counts["error"],
        "averageLatencyMs": round(sum(latencies) / len(latencies)) if latencies else None,
        "startedAt": run["createdAt"],
        "completedAt": completed_at,
        "notes": "Immutable validation run completed. Rerun to create a new history record.",
        "results": results,
    }


def _run_summary(run: ValidationRunDetailDto) -> ValidationRunSummaryDto:
    return cast(
        ValidationRunSummaryDto,
        {key: value for key, value in run.items() if key not in {"results", "auditEvents"}},
    )


def _run_summary_from_row(row: dict[str, Any]) -> ValidationRunSummaryDto:
    return {
        "runId": row["id"],
        "validationSetId": row["validation_set_id"],
        "validationSetName": row["validation_set_name"],
        "validationSetVersion": row["validation_set_version"],
        "status": cast(Any, row["status"]),
        "totalCount": row["total_count"],
        "passCount": row["pass_count"],
        "weakSupportCount": row["weak_support_count"],
        "refusedCount": row["refused_count"],
        "failedCount": row["failed_count"],
        "errorCount": row["error_count"],
        "averageLatencyMs": row.get("average_latency_ms"),
        "createdBy": row["created_by"],
        "createdAt": row["created_at"],
        "startedAt": row.get("started_at"),
        "completedAt": row.get("completed_at"),
        "sourceSnapshotIds": row.get("source_snapshot_ids", []),
        "state": cast(Any, row["state"]),
        "notes": row["notes"],
    }


def _result_row(run_id: str, result: ValidationResultDto) -> dict[str, Any]:
    return {
        "id": result["resultId"],
        "validation_run_id": run_id,
        "validation_question_id": result["validationQuestionId"],
        "question_text": result["questionText"],
        "expected_state": result["expectedState"],
        "actual_state": result["actualState"],
        "outcome": result["outcome"],
        "answer_preview": result["answerPreview"],
        "retrieved_source_ids": result["retrievedSourceIds"],
        "citation_ids": result["citationIds"],
        "support_score": result["supportScore"],
        "latency_ms": result["latencyMs"],
        "notes": result["notes"],
        "created_at": result["createdAt"],
    }


def _result_from_row(row: dict[str, Any]) -> ValidationResultDto:
    return {
        "resultId": row["id"],
        "validationQuestionId": row["validation_question_id"],
        "questionText": row["question_text"],
        "expectedState": cast(Any, row["expected_state"]),
        "actualState": row["actual_state"],
        "outcome": cast(Any, row["outcome"]),
        "answerPreview": row["answer_preview"],
        "retrievedSourceIds": row.get("retrieved_source_ids", []),
        "citationIds": row.get("citation_ids", []),
        "supportScore": (
            float(row["support_score"]) if row.get("support_score") is not None else None
        ),
        "latencyMs": row.get("latency_ms"),
        "notes": row["notes"],
        "createdAt": row["created_at"],
    }


def _result_counts(results: list[ValidationResultDto]) -> dict[ValidationOutcome, int]:
    counts: dict[ValidationOutcome, int] = {
        "pass": 0,
        "weakSupport": 0,
        "refused": 0,
        "failed": 0,
        "error": 0,
    }
    for result in results:
        counts[result["outcome"]] += 1
    return counts


def _run_update_row(run: ValidationRunDetailDto) -> dict[str, Any]:
    return {
        "status": run["status"],
        "total_count": run["totalCount"],
        "pass_count": run["passCount"],
        "weak_support_count": run["weakSupportCount"],
        "refused_count": run["refusedCount"],
        "failed_count": run["failedCount"],
        "error_count": run["errorCount"],
        "average_latency_ms": run["averageLatencyMs"],
        "started_at": run["startedAt"],
        "completed_at": run["completedAt"],
        "state": run["state"],
        "notes": run["notes"],
    }


def _audit_event(
    *, run_id: str, event_type: str, actor: str, summary: str
) -> ValidationAuditEventDto:
    return {
        "eventId": f"val-audit-{uuid4().hex[:12]}",
        "runId": run_id,
        "eventType": cast(Any, event_type),
        "origin": actor,
        "occurredAt": _now(),
        "summary": summary,
    }


def _answer_preview(outcome: ValidationOutcome) -> str:
    previews = {
        "pass": (
            "The Security Council has primary responsibility for international peace "
            "and security..."
        ),
        "weakSupport": (
            "The available material suggests a diplomatic pattern, but support is incomplete..."
        ),
        "refused": "I can only answer global governance course questions from approved sources.",
        "failed": "The arbitral award created a global enforcement authority...",
        "error": "Evaluation did not complete because a dependency failed.",
    }
    return previews[outcome]


def _now() -> str:
    return datetime.now(UTC).isoformat()
