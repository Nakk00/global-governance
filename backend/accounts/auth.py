from __future__ import annotations

import importlib
from dataclasses import dataclass
from time import monotonic
from typing import Any, Protocol, cast

from django.conf import settings
from django.http import HttpRequest

imported_jwt_module: Any | None

try:
    imported_jwt_module = importlib.import_module("jwt")
    from jwt import PyJWKClient as imported_pyjwk_client
    from jwt.exceptions import InvalidTokenError as imported_invalid_token_error
    from jwt.exceptions import PyJWKClientError as imported_pyjwk_client_error
except ImportError:  # pragma: no cover - exercised through verifier-unavailable tests.
    imported_jwt_module = None
    PyJWKClientClass: Any | None = None
    JwtInvalidTokenError: type[Exception] = Exception
    JwtPyJWKClientError: type[Exception] = Exception
else:
    PyJWKClientClass = imported_pyjwk_client
    JwtInvalidTokenError = imported_invalid_token_error
    JwtPyJWKClientError = imported_pyjwk_client_error

jwt_module: Any | None = imported_jwt_module


ADMIN_AUTH_MISSING = "admin_auth_missing"
ADMIN_AUTH_INVALID = "admin_auth_invalid"
ADMIN_VERIFIER_UNAVAILABLE = "admin_verifier_unavailable"
ADMIN_MAINTAINER_UNAUTHORIZED = "admin_maintainer_unauthorized"
ADMIN_MAINTAINER_INACTIVE = "admin_maintainer_inactive"
ADMIN_PAYLOAD_UNSUPPORTED = "admin_payload_unsupported"


@dataclass(frozen=True)
class VerifiedSupabaseClaims:
    subject: str
    email: str
    role: str
    issuer: str
    audience: str | list[str]


class AdminAuthError(ValueError):
    def __init__(self, *, code: str, message: str, status: int) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status


class TokenVerifier(Protocol):
    def verify(self, token: str) -> VerifiedSupabaseClaims: ...


class SupabaseJwtVerifier:
    def __init__(
        self,
        *,
        issuer: str,
        audience: str,
        jwks_url: str,
        expected_role: str,
        cache_seconds: int,
    ) -> None:
        self.issuer = issuer
        self.audience = audience
        self.jwks_url = jwks_url
        self.expected_role = expected_role
        self.cache_seconds = cache_seconds
        self._client: Any | None = None
        self._client_expires_at = 0.0

    def verify(self, token: str) -> VerifiedSupabaseClaims:
        if jwt_module is None or PyJWKClientClass is None:
            raise AdminAuthError(
                code=ADMIN_VERIFIER_UNAVAILABLE,
                message="Admin token verification is not available.",
                status=401,
            )

        try:
            signing_key = self._jwks_client().get_signing_key_from_jwt(token)
            payload = jwt_module.decode(
                token,
                signing_key.key,
                algorithms=["ES256", "RS256"],
                audience=self.audience,
                issuer=self.issuer,
                options={"require": ["exp", "iss", "aud", "sub", "role", "email"]},
            )
        except (JwtInvalidTokenError, JwtPyJWKClientError, ValueError) as error:
            self.refresh_keys()
            raise AdminAuthError(
                code=ADMIN_AUTH_INVALID,
                message="Use a valid Supabase Auth bearer token.",
                status=401,
            ) from error

        return self._claims_from_payload(payload)

    def refresh_keys(self) -> None:
        self._client = None
        self._client_expires_at = 0.0

    def _jwks_client(self) -> Any:
        now = monotonic()
        if self._client is None or now >= self._client_expires_at:
            assert PyJWKClientClass is not None
            self._client = PyJWKClientClass(
                self.jwks_url, cache_jwk_set=True, lifespan=self.cache_seconds
            )
            self._client_expires_at = now + self.cache_seconds
        return self._client

    def _claims_from_payload(self, payload: dict[str, Any]) -> VerifiedSupabaseClaims:
        subject = payload.get("sub")
        email = payload.get("email")
        role = payload.get("role")
        audience = payload.get("aud")
        issuer = payload.get("iss")

        if not all(
            isinstance(value, str) and value.strip() for value in (subject, email, role, issuer)
        ):
            raise AdminAuthError(
                code=ADMIN_AUTH_INVALID,
                message="Use a valid Supabase Auth bearer token.",
                status=401,
            )
        if not isinstance(audience, (str, list)):
            raise AdminAuthError(
                code=ADMIN_AUTH_INVALID,
                message="Use a valid Supabase Auth bearer token.",
                status=401,
            )
        if role != self.expected_role:
            raise AdminAuthError(
                code=ADMIN_AUTH_INVALID,
                message="Use a valid Supabase Auth bearer token.",
                status=401,
            )

        return VerifiedSupabaseClaims(
            subject=cast(str, subject),
            email=cast(str, email),
            role=role,
            issuer=cast(str, issuer),
            audience=audience,
        )


def parse_bearer_token(request: HttpRequest) -> str:
    authorization = request.headers.get("Authorization", "")
    if not authorization.strip():
        raise AdminAuthError(
            code=ADMIN_AUTH_MISSING,
            message="Admin access requires a Supabase Auth bearer token.",
            status=401,
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0] != "Bearer" or not parts[1].strip():
        raise AdminAuthError(
            code=ADMIN_AUTH_INVALID,
            message="Use Authorization: Bearer <supabase_access_token>.",
            status=401,
        )

    return parts[1]


def get_supabase_jwt_verifier() -> SupabaseJwtVerifier:
    issuer = settings.SUPABASE_JWT_ISSUER
    audience = settings.SUPABASE_JWT_AUDIENCE
    jwks_url = settings.SUPABASE_JWKS_URL
    if not issuer or not audience or not jwks_url:
        raise AdminAuthError(
            code=ADMIN_VERIFIER_UNAVAILABLE,
            message="Admin token verification is not configured.",
            status=401,
        )

    return SupabaseJwtVerifier(
        issuer=issuer,
        audience=audience,
        jwks_url=jwks_url,
        expected_role=settings.SUPABASE_JWT_ROLE,
        cache_seconds=settings.SUPABASE_JWKS_CACHE_SECONDS,
    )
