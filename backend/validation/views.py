from __future__ import annotations

from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from accounts.auth import AdminAuthError
from accounts.permissions import authorize_admin_request
from common.responses import error_response, success_response
from common.validation import BoundaryValidationError, validate_json_object
from validation import services as validation_service
from validation.repository import (
    ValidationWorkflowError,
)


def validation_sets(request: HttpRequest) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error
    return success_response(validation_service.list_validation_sets())


@csrf_exempt
def validation_runs(request: HttpRequest) -> JsonResponse:
    if request.method == "POST":
        return launch_run(request)

    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error
    return success_response(validation_service.list_validation_runs())


def validation_run_detail(request: HttpRequest, run_id: str) -> JsonResponse:
    auth_error = _guard_request(request, "GET")
    if auth_error:
        return auth_error
    run = validation_service.get_validation_run(run_id)
    if run is None:
        return error_response(
            code="admin_validation_run_not_found",
            message="The requested validation run was not found.",
            status=404,
        )
    return success_response(run)


@csrf_exempt
def launch_run(request: HttpRequest) -> JsonResponse:
    identity, auth_error = _authorize_mutation(request, "POST")
    if auth_error:
        return auth_error
    try:
        payload = validate_json_object(request)
    except BoundaryValidationError as error:
        return error.to_response()

    validation_set_id = payload.get("validationSetId")
    if not isinstance(validation_set_id, str) or not validation_set_id.strip():
        return error_response(
            code="admin_validation_set_required",
            message="Choose a validation set before launching a run.",
            status=400,
            details={"fields": {"validationSetId": "Choose a validation set."}},
        )
    validation_set_id = validation_set_id.strip()

    try:
        return success_response(
            validation_service.launch_validation_run(
                validation_set_id=validation_set_id, actor=identity.email
            ),
            status=201,
        )
    except ValidationWorkflowError as error:
        return error_response(code=error.code, message=error.message, status=error.status)


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
