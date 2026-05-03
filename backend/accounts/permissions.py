from __future__ import annotations

from dataclasses import dataclass

from django.http import HttpRequest

from accounts.auth import (
    ADMIN_VERIFIER_UNAVAILABLE,
    ADMIN_MAINTAINER_INACTIVE,
    ADMIN_MAINTAINER_UNAUTHORIZED,
    AdminAuthError,
    TokenVerifier,
    get_supabase_jwt_verifier,
    parse_bearer_token,
)
from accounts.services import (
    AdminProfile,
    AdminProfileRepository,
    AdminProfileRepositoryError,
    get_admin_profile_repository,
)

AUTHORIZED_ADMIN_ROLES = {"admin"}


@dataclass(frozen=True)
class AdminIdentity:
    user_id: str
    email: str
    role: str
    is_active: bool


def authorize_admin_request(
    request: HttpRequest,
    *,
    verifier: TokenVerifier | None = None,
    repository: AdminProfileRepository | None = None,
) -> AdminIdentity:
    token = parse_bearer_token(request)
    claims = (verifier or get_supabase_jwt_verifier()).verify(token)
    repository_instance = repository or get_admin_profile_repository()
    try:
        profile = repository_instance.get_by_supabase_user_id(claims.subject)
    except AdminProfileRepositoryError as error:
        raise AdminAuthError(
            code=ADMIN_VERIFIER_UNAVAILABLE,
            message="The admin auth boundary is temporarily unavailable.",
            status=503,
        ) from error
    if profile is None or profile.email.lower() != claims.email.lower() or profile.role not in AUTHORIZED_ADMIN_ROLES:
        raise AdminAuthError(
            code=ADMIN_MAINTAINER_UNAUTHORIZED,
            message="The authenticated user is not authorized for this admin boundary.",
            status=403,
        )
    if not profile.is_active:
        raise AdminAuthError(
            code=ADMIN_MAINTAINER_INACTIVE,
            message="The authenticated maintainer profile is inactive.",
            status=403,
        )

    try:
        repository_instance.record_login(profile.supabase_user_id)
    except AdminProfileRepositoryError as error:
        raise AdminAuthError(
            code=ADMIN_VERIFIER_UNAVAILABLE,
            message="The admin auth boundary is temporarily unavailable.",
            status=503,
        ) from error
    return _identity_from_profile(profile)


def _identity_from_profile(profile: AdminProfile) -> AdminIdentity:
    return AdminIdentity(
        user_id=profile.supabase_user_id,
        email=profile.email,
        role=profile.role,
        is_active=profile.is_active,
    )
