from __future__ import annotations

from django.conf import settings
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from common.responses import error_response, success_response
from common.validation import (
    BoundaryValidationError,
    require_json_content_type,
    validate_json_object,
    validate_request_size,
)
from accounts.views import admin_me


def method_not_allowed_response(*, allowed: str) -> JsonResponse:
    return error_response(
        code="method_not_allowed",
        message=f"Use the documented HTTP method: {allowed}.",
        status=405,
    )


def bootstrap_health(request: HttpRequest) -> JsonResponse:
    if request.method != "GET":
        return method_not_allowed_response(allowed="GET")

    return success_response(
        {
            "service": "django-backend",
            "status": "ready",
            "publicChatCutover": settings.PUBLIC_CHAT_CUTOVER_STATUS,
        }
    )


@csrf_exempt
def reserved_chat(request: HttpRequest) -> JsonResponse:
    if request.method != "POST":
        return method_not_allowed_response(allowed="POST")

    try:
        require_json_content_type(request)
        validate_request_size(request, max_bytes=settings.MAX_EXTERNAL_JSON_BODY_BYTES)
        validate_json_object(request)
    except BoundaryValidationError as error:
        return error.to_response()

    return error_response(
        code="chat_cutover_deferred",
        message="Django chat orchestration is reserved for a later migration story.",
        status=501,
    )


def reserved_admin(request: HttpRequest) -> JsonResponse:
    return admin_me(request)


def not_found(request: HttpRequest, exception: Exception | None = None) -> JsonResponse:
    return error_response(
        code="not_found",
        message="The requested Django backend route does not exist.",
        status=404,
    )


def server_error(request: HttpRequest) -> JsonResponse:
    return error_response(
        code="internal_error",
        message="The backend could not complete the request.",
        status=500,
    )
