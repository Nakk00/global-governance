from __future__ import annotations

import json
from typing import Any

from django.http import HttpRequest, JsonResponse

from common.responses import error_envelope, error_response


class BoundaryValidationError(ValueError):
    def __init__(self, *, code: str, message: str, status: int) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status

    def to_envelope(self) -> dict[str, Any]:
        return error_envelope(code=self.code, message=self.message, status=self.status)

    def to_response(self) -> JsonResponse:
        return error_response(code=self.code, message=self.message, status=self.status)


def require_json_content_type(request: HttpRequest) -> None:
    content_type = request.headers.get("Content-Type", "")
    if not content_type.lower().startswith("application/json"):
        raise BoundaryValidationError(
            code="unsupported_media_type",
            message="Use application/json for Django backend requests.",
            status=415,
        )


def validate_request_size(request: HttpRequest, *, max_bytes: int) -> None:
    content_length = request.headers.get("Content-Length")
    body_length = int(content_length) if content_length and content_length.isdigit() else len(request.body)
    if body_length > max_bytes:
        raise BoundaryValidationError(
            code="payload_too_large",
            message="The request body is too large for this backend boundary.",
            status=413,
        )


def validate_json_object(request: HttpRequest) -> dict[str, Any]:
    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise BoundaryValidationError(
            code="invalid_json",
            message="Use a valid JSON request body.",
            status=400,
        ) from error

    if not isinstance(payload, dict):
        raise BoundaryValidationError(
            code="invalid_payload",
            message="Use a JSON object request body.",
            status=400,
        )

    return payload
