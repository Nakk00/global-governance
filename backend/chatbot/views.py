from __future__ import annotations

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from chatbot.contracts import ChatContractError, normalize_chat_request, serialize_chat_outcome
from chatbot.dtos import CooldownOutcome
from chatbot.services import answer_public_chat
from common.responses import error_response, success_response
from common.validation import (
    BoundaryValidationError,
    require_json_content_type,
    validate_json_object,
    validate_request_size,
)


def _public_chat_cors_origin(request: HttpRequest) -> str:
    return request.headers.get("Origin") or "*"


def _with_public_chat_cors(
    response: HttpResponse,
    request: HttpRequest,
) -> HttpResponse:
    response["Access-Control-Allow-Origin"] = _public_chat_cors_origin(request)
    response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, X-Anonymous-Session-Id"
    response["Access-Control-Max-Age"] = "600"

    return response


@csrf_exempt
def public_chat(request: HttpRequest) -> HttpResponse:
    if request.method == "OPTIONS":
        return _with_public_chat_cors(HttpResponse(status=204), request)

    if request.method != "POST":
        return _with_public_chat_cors(
            error_response(
                code="method_not_allowed",
                message="Use the documented HTTP method: POST.",
                status=405,
            ),
            request,
        )

    try:
        require_json_content_type(request)
        validate_request_size(
            request,
            max_bytes=settings.PUBLIC_CHAT_REQUEST_BODY_MAX_BYTES,
        )
        payload = validate_json_object(request)
    except BoundaryValidationError as error:
        return _with_public_chat_cors(error.to_response(), request)

    try:
        chat_request = normalize_chat_request(payload)
    except ChatContractError as error:
        return _with_public_chat_cors(
            error_response(code=error.code, message=str(error), status=error.status),
            request,
        )

    outcome = answer_public_chat(
        chat_request,
        anonymous_session_id=request.headers.get("X-Anonymous-Session-Id"),
        remote_address=request.META.get("REMOTE_ADDR"),
    )
    return _with_public_chat_cors(
        success_response(
            serialize_chat_outcome(outcome),
            status=429 if isinstance(outcome, CooldownOutcome) else 200,
        ),
        request,
    )
