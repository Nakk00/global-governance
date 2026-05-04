from __future__ import annotations

from typing import Any

from django.http import JsonResponse


def success_envelope(data: Any, *, meta: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "success": True,
        "data": data,
        "error": None,
        "meta": meta or {},
    }


def error_envelope(
    *,
    code: str,
    message: str,
    status: int,
    details: dict[str, Any] | None = None,
) -> dict[str, Any]:
    error: dict[str, Any] = {
        "code": code,
        "message": message,
        "status": status,
    }
    if details:
        error["details"] = details

    return {
        "success": False,
        "data": None,
        "error": error,
        "meta": {},
    }


def exception_to_error_envelope(exception: Exception) -> dict[str, Any]:
    return error_envelope(
        code="internal_error",
        message="The backend could not complete the request.",
        status=500,
    )


def success_response(
    data: Any, *, status: int = 200, meta: dict[str, Any] | None = None
) -> JsonResponse:
    return JsonResponse(success_envelope(data, meta=meta), status=status)


def error_response(
    *,
    code: str,
    message: str,
    status: int,
    details: dict[str, Any] | None = None,
) -> JsonResponse:
    return JsonResponse(
        error_envelope(code=code, message=message, status=status, details=details),
        status=status,
    )
