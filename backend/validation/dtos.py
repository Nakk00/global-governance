from __future__ import annotations

from typing import Literal, TypedDict

ValidationRunStatus = Literal["queued", "processing", "completed", "failed"]
ValidationOutcome = Literal["pass", "weakSupport", "refused", "failed", "error"]
ValidationExpectedState = Literal["grounded", "weakSupport", "refused"]


class ValidationSetDto(TypedDict):
    validationSetId: str
    name: str
    description: str
    version: int
    isDefault: bool
    questionCount: int
    createdBy: str
    createdAt: str
    updatedAt: str


class ValidationSetListDto(TypedDict):
    sets: list[ValidationSetDto]
    defaultSetId: str | None


class ValidationResultDto(TypedDict):
    resultId: str
    validationQuestionId: str
    questionText: str
    expectedState: ValidationExpectedState
    actualState: str
    outcome: ValidationOutcome
    answerPreview: str
    retrievedSourceIds: list[str]
    citationIds: list[str]
    supportScore: float | None
    latencyMs: int | None
    notes: str
    createdAt: str


class ValidationAuditEventDto(TypedDict):
    eventId: str
    runId: str
    eventType: Literal["launch", "completion", "failure"]
    origin: str
    occurredAt: str
    summary: str


class ValidationRunSummaryDto(TypedDict):
    runId: str
    validationSetId: str
    validationSetName: str
    validationSetVersion: int
    status: ValidationRunStatus
    totalCount: int
    passCount: int
    weakSupportCount: int
    refusedCount: int
    failedCount: int
    errorCount: int
    averageLatencyMs: int | None
    createdBy: str
    createdAt: str
    startedAt: str | None
    completedAt: str | None
    sourceSnapshotIds: list[str]
    state: Literal["empty", "stale", "partial", "ready"]
    notes: str


class ValidationRunListDto(TypedDict):
    runs: list[ValidationRunSummaryDto]


class ValidationRunDetailDto(ValidationRunSummaryDto):
    results: list[ValidationResultDto]
    auditEvents: list[ValidationAuditEventDto]
