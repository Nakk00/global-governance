from __future__ import annotations

from django.conf import settings
from django.http import HttpRequest, JsonResponse

from accounts.auth import ADMIN_PAYLOAD_UNSUPPORTED, AdminAuthError
from accounts.permissions import authorize_admin_request
from common.responses import error_response, success_response


def admin_me(request: HttpRequest) -> JsonResponse:
    if request.method != "GET":
        return error_response(
            code="method_not_allowed",
            message="Use the documented HTTP method: GET.",
            status=405,
        )

    if _has_unexpected_body(request):
        return error_response(
            code=ADMIN_PAYLOAD_UNSUPPORTED,
            message="GET /api/admin/me does not accept a request body.",
            status=400,
        )

    try:
        identity = authorize_admin_request(request)
    except AdminAuthError as error:
        return error_response(code=error.code, message=error.message, status=error.status)

    return success_response(
        {
            "userId": identity.user_id,
            "email": identity.email,
            "role": identity.role,
            "isActive": identity.is_active,
        }
    )


def _has_unexpected_body(request: HttpRequest) -> bool:
    content_length = request.headers.get("Content-Length")
    if (
        content_length
        and content_length.isdigit()
        and int(content_length) > settings.MAX_EXTERNAL_JSON_BODY_BYTES
    ):
        return True
    return bool(request.body.strip())
