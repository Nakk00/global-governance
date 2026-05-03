from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any, Literal, Protocol
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urljoin
from urllib.request import Request, urlopen

from django.conf import settings

AdminRole = Literal["owner", "admin", "viewer"]
ADMIN_PROFILE_ROLES: tuple[AdminRole, ...] = ("owner", "admin", "viewer")


class AdminProfileRepositoryError(RuntimeError):
    pass


class AdminProfileNotFoundError(AdminProfileRepositoryError):
    pass


@dataclass(frozen=True)
class AdminProfile:
    supabase_user_id: str
    email: str
    role: AdminRole
    is_active: bool
    display_name: str | None = None


class AdminProfileRepository(Protocol):
    def get_by_supabase_user_id(self, supabase_user_id: str) -> AdminProfile | None:
        ...

    def record_login(self, supabase_user_id: str) -> None:
        ...

    def upsert(self, profile: AdminProfile) -> AdminProfile:
        ...

    def revoke(self, supabase_user_id: str) -> AdminProfile:
        ...


class SupabaseAdminProfileRepository:
    def __init__(self, *, supabase_url: str, service_role_key: str) -> None:
        self.supabase_url = supabase_url.rstrip("/") + "/"
        self.service_role_key = service_role_key

    def get_by_supabase_user_id(self, supabase_user_id: str) -> AdminProfile | None:
        query = (
            "rest/v1/admin_profiles"
            f"?supabase_user_id=eq.{quote(supabase_user_id, safe='')}"
            "&select=supabase_user_id,email,display_name,role,is_active"
            "&limit=1"
        )
        records = self._request("GET", query)
        if not records:
            return None
        return _profile_from_record(records[0])

    def record_login(self, supabase_user_id: str) -> None:
        self._request(
            "PATCH",
            f"rest/v1/admin_profiles?supabase_user_id=eq.{quote(supabase_user_id, safe='')}",
            {
                "last_login_at": datetime.now(UTC).isoformat(),
                "updated_at": datetime.now(UTC).isoformat(),
            },
        )

    def upsert(self, profile: AdminProfile) -> AdminProfile:
        records = self._request(
            "POST",
            "rest/v1/admin_profiles?on_conflict=supabase_user_id",
            {
                "supabase_user_id": profile.supabase_user_id,
                "email": profile.email,
                "display_name": profile.display_name,
                "role": profile.role,
                "is_active": profile.is_active,
                "updated_at": datetime.now(UTC).isoformat(),
            },
            prefer="resolution=merge-duplicates,return=representation",
        )
        if not records:
            raise AdminProfileRepositoryError("Supabase admin profile upsert returned no profile.")
        return _profile_from_record(records[0])

    def revoke(self, supabase_user_id: str) -> AdminProfile:
        records = self._request(
            "PATCH",
            f"rest/v1/admin_profiles?supabase_user_id=eq.{quote(supabase_user_id, safe='')}",
            {
                "is_active": False,
                "updated_at": datetime.now(UTC).isoformat(),
            },
            prefer="return=representation",
        )
        if not records:
            raise AdminProfileNotFoundError(
                f"Supabase admin profile '{supabase_user_id}' was not found for revoke."
            )
        return _profile_from_record(records[0])

    def _request(
        self,
        method: str,
        path: str,
        payload: dict[str, Any] | None = None,
        *,
        prefer: str | None = None,
    ) -> Any:
        body = None if payload is None else json.dumps(payload).encode("utf-8")
        headers = {
            "apikey": self.service_role_key,
            "Authorization": f"Bearer {self.service_role_key}",
            "Accept": "application/json",
        }
        if body is not None:
            headers["Content-Type"] = "application/json"
        if prefer:
            headers["Prefer"] = prefer

        request = Request(urljoin(self.supabase_url, path), data=body, headers=headers, method=method)
        try:
            with urlopen(request, timeout=settings.SUPABASE_REST_TIMEOUT_SECONDS) as response:
                content = response.read().decode("utf-8")
        except (HTTPError, URLError) as error:
            raise AdminProfileRepositoryError("Supabase admin profile request failed.") from error

        return json.loads(content or "[]")


def _profile_from_record(record: dict[str, Any]) -> AdminProfile:
    role = record["role"]
    if role not in ADMIN_PROFILE_ROLES:
        raise RuntimeError("Supabase admin profile contains an unsupported role.")

    return AdminProfile(
        supabase_user_id=record["supabase_user_id"],
        email=record["email"],
        display_name=record.get("display_name"),
        role=role,
        is_active=bool(record["is_active"]),
    )


def get_admin_profile_repository() -> AdminProfileRepository:
    return SupabaseAdminProfileRepository(
        supabase_url=settings.SUPABASE_URL,
        service_role_key=settings.SUPABASE_SERVICE_ROLE_KEY,
    )


def provision_admin_profile(
    *,
    supabase_user_id: str,
    email: str,
    role: AdminRole,
    is_active: bool,
    display_name: str | None = None,
    repository: AdminProfileRepository | None = None,
) -> AdminProfile:
    if role not in ADMIN_PROFILE_ROLES:
        raise ValueError("role must be one of: owner, admin, viewer")

    profile = AdminProfile(
        supabase_user_id=supabase_user_id,
        email=email,
        display_name=display_name,
        role=role,
        is_active=is_active,
    )
    return (repository or get_admin_profile_repository()).upsert(profile)


def revoke_admin_profile(
    *,
    supabase_user_id: str,
    repository: AdminProfileRepository | None = None,
) -> AdminProfile:
    return (repository or get_admin_profile_repository()).revoke(supabase_user_id)
