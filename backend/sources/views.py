from __future__ import annotations

from collections.abc import Callable

from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from accounts.auth import AdminAuthError
from accounts.permissions import authorize_admin_request
from common.responses import error_response, success_response
from common.validation import BoundaryValidationError, validate_json_object
from sources import services as sources_service
from sources.dtos import LifecycleState
from sources.repositories import SourceMutationError


def dashboard(request: HttpRequest) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error

    try:
        return success_response(sources_service.get_stewardship_dashboard())
    except SourceMutationError as error:
        return error_response(code=error.code, message=error.message, status=error.status)


def source_detail(request: HttpRequest, source_id: str) -> JsonResponse:
    if request.method == "PATCH":
        return source_update(request, source_id)

    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error

    try:
        detail = sources_service.get_source_detail(source_id)
    except SourceMutationError as error:
        return error_response(code=error.code, message=error.message, status=error.status)
    if detail is None:
        return error_response(
            code="admin_source_not_found",
            message="The requested approved source was not found.",
            status=404,
        )
    return success_response(detail)


def source_chunks(request: HttpRequest, source_id: str) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error

    try:
        payload = sources_service.get_source_chunks(source_id)
    except SourceMutationError as error:
        return error_response(code=error.code, message=error.message, status=error.status)
    if payload is None:
        return error_response(
            code="admin_source_not_found",
            message="The requested approved source was not found.",
            status=404,
        )
    return success_response(payload)


def source_citations(request: HttpRequest, source_id: str) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error

    try:
        payload = sources_service.get_source_citations(source_id)
    except SourceMutationError as error:
        return error_response(code=error.code, message=error.message, status=error.status)
    if payload is None:
        return error_response(
            code="admin_source_not_found",
            message="The requested approved source was not found.",
            status=404,
        )
    return success_response(payload)


def chunk_detail(request: HttpRequest, chunk_id: str) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error

    try:
        payload = sources_service.get_chunk_detail(chunk_id)
    except SourceMutationError as error:
        return error_response(code=error.code, message=error.message, status=error.status)
    if payload is None:
        return error_response(
            code="admin_chunk_not_found",
            message="The requested retrieval chunk was not found.",
            status=404,
        )
    return success_response(payload)


def citation_detail(request: HttpRequest, citation_id: str) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error

    try:
        payload = sources_service.get_citation_detail(citation_id)
    except SourceMutationError as error:
        return error_response(code=error.code, message=error.message, status=error.status)
    if payload is None:
        return error_response(
            code="admin_citation_not_found",
            message="The requested citation evidence was not found.",
            status=404,
        )
    return success_response(payload)


def ingestion_runs(request: HttpRequest) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error

    try:
        return success_response(sources_service.list_ingestion_runs())
    except SourceMutationError as error:
        return error_response(code=error.code, message=error.message, status=error.status)


def validation_runs(request: HttpRequest) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error

    try:
        return success_response(sources_service.list_validation_runs())
    except SourceMutationError as error:
        return error_response(code=error.code, message=error.message, status=error.status)


def audit_events(request: HttpRequest) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error

    try:
        return success_response(sources_service.list_audit_events())
    except SourceMutationError as error:
        return error_response(code=error.code, message=error.message, status=error.status)


@csrf_exempt
def source_upload(request: HttpRequest) -> JsonResponse:
    identity, auth_error = _authorize_mutation(request, "POST")
    if auth_error:
        return auth_error

    metadata = {
        "sourceId": request.POST.get("sourceId", ""),
        "title": request.POST.get("title", ""),
        "sourceType": request.POST.get("sourceType", ""),
        "provenance": request.POST.get("provenance", ""),
        "summary": request.POST.get("summary", ""),
        "usageScope": request.POST.getlist("usageScope") or request.POST.get("usageScope", ""),
    }
    return _mutation_response(
        lambda: sources_service.upload_source(
            uploaded_file=request.FILES.get("file"),
            metadata=metadata,
            actor=identity.email,
        ),
        status=201,
    )


@csrf_exempt
def source_update(request: HttpRequest, source_id: str) -> JsonResponse:
    identity, auth_error = _authorize_mutation(request, "PATCH")
    if auth_error:
        return auth_error

    try:
        payload = validate_json_object(request)
    except BoundaryValidationError as error:
        return error.to_response()
    return _mutation_response(
        lambda: sources_service.update_source_metadata(
            source_id=source_id,
            payload=payload,
            actor=identity.email,
        )
    )


@csrf_exempt
def source_activate(request: HttpRequest, source_id: str) -> JsonResponse:
    return _lifecycle_mutation(request, source_id, "active")


@csrf_exempt
def source_approve(request: HttpRequest, source_id: str) -> JsonResponse:
    return _lifecycle_mutation(request, source_id, "approved")


@csrf_exempt
def source_disable(request: HttpRequest, source_id: str) -> JsonResponse:
    return _lifecycle_mutation(request, source_id, "disabled")


@csrf_exempt
def source_archive(request: HttpRequest, source_id: str) -> JsonResponse:
    return _lifecycle_mutation(request, source_id, "archived")


@csrf_exempt
def source_ingest(request: HttpRequest, source_id: str) -> JsonResponse:
    identity, auth_error = _authorize_mutation(request, "POST")
    if auth_error:
        return auth_error
    return _mutation_response(
        lambda: sources_service.dispatch_ingest(source_id=source_id, actor=identity.email)
    )


def _lifecycle_mutation(
    request: HttpRequest, source_id: str, target_state: LifecycleState
) -> JsonResponse:
    identity, auth_error = _authorize_mutation(request, "POST")
    if auth_error:
        return auth_error
    return _mutation_response(
        lambda: sources_service.transition_source(
            source_id=source_id, target_state=target_state, actor=identity.email
        )
    )


def _guard_request(request: HttpRequest, method: str) -> JsonResponse | None:
    if request.method != method:
        return error_response(
            code="method_not_allowed",
            message=f"Use the documented HTTP method: {method}.",
            status=405,
        )

    try:
        authorize_admin_request(request)
    except AdminAuthError as error:
        return error_response(code=error.code, message=error.message, status=error.status)

    return None


def _authorize_mutation(request: HttpRequest, method: str):
    if request.method != method:
        return None, error_response(
            code="method_not_allowed",
            message=f"Use the documented HTTP method: {method}.",
            status=405,
        )
    try:
        return authorize_admin_request(request), None
    except AdminAuthError as error:
        return None, error_response(code=error.code, message=error.message, status=error.status)


def _mutation_response(action: Callable[[], object], *, status: int = 200) -> JsonResponse:
    try:
        return success_response(action(), status=status)
    except SourceMutationError as error:
        return error_response(
            code=error.code,
            message=error.message,
            status=error.status,
            details={"fields": error.fields} if error.fields else None,
        )
