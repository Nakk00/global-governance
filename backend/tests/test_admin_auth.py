from __future__ import annotations

from pathlib import Path
from unittest import mock

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import Client, SimpleTestCase, override_settings

from accounts.auth import AdminAuthError, SupabaseJwtVerifier, VerifiedSupabaseClaims
from accounts.services import AdminProfile, AdminProfileNotFoundError, AdminProfileRepositoryError


class FakeVerifier:
    def __init__(
        self,
        claims: VerifiedSupabaseClaims | None = None,
        error: AdminAuthError | None = None,
    ) -> None:
        self.claims = claims or VerifiedSupabaseClaims(
            subject="user-123",
            email="admin@example.test",
            role="authenticated",
            issuer="http://127.0.0.1:54321/auth/v1",
            audience="authenticated",
        )
        self.error = error

    def verify(self, token: str) -> VerifiedSupabaseClaims:
        if self.error:
            raise self.error
        return self.claims


class FakeRepository:
    def __init__(
        self,
        profile: AdminProfile | None = None,
        *,
        lookup_error: Exception | None = None,
        record_login_error: Exception | None = None,
        revoke_error: Exception | None = None,
    ) -> None:
        self.profile = profile
        self.lookup_error = lookup_error
        self.record_login_error = record_login_error
        self.revoke_error = revoke_error
        self.recorded_logins: list[str] = []
        self.saved_profiles: list[AdminProfile] = []

    def get_by_supabase_user_id(self, supabase_user_id: str) -> AdminProfile | None:
        if self.lookup_error:
            raise self.lookup_error
        if self.profile and self.profile.supabase_user_id == supabase_user_id:
            return self.profile
        return None

    def record_login(self, supabase_user_id: str) -> None:
        if self.record_login_error:
            raise self.record_login_error
        self.recorded_logins.append(supabase_user_id)

    def upsert(self, profile: AdminProfile) -> AdminProfile:
        self.profile = profile
        self.saved_profiles.append(profile)
        return profile

    def revoke(self, supabase_user_id: str) -> AdminProfile:
        if self.revoke_error:
            raise self.revoke_error
        self.profile = AdminProfile(
            supabase_user_id=supabase_user_id,
            email=self.profile.email if self.profile else "revoked@example.test",
            role=self.profile.role if self.profile else "admin",
            is_active=False,
        )
        return self.profile


@override_settings(ROOT_URLCONF="config.urls")
class AdminAuthBoundaryTests(SimpleTestCase):
    def setUp(self) -> None:
        self.client = Client()

    def test_missing_token_returns_401_safe_envelope(self):
        response = self.client.get("/api/admin/me")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["error"]["code"], "admin_auth_missing")
        self.assertNotIn("traceback", str(response.json()).lower())

    def test_wrong_auth_scheme_returns_401(self):
        response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Basic abc")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["error"]["code"], "admin_auth_invalid")

    def test_blank_bearer_token_returns_401(self):
        response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Bearer ")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["error"]["code"], "admin_auth_invalid")

    def test_malformed_or_expired_token_errors_return_401(self):
        for code in ("malformed", "expired", "issuer", "audience"):
            with self.subTest(code=code):
                error = AdminAuthError(
                    code="admin_auth_invalid",
                    message="Use a valid Supabase Auth bearer token.",
                    status=401,
                )
                with self._patched_auth(verifier=FakeVerifier(error=error)):
                    response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION=f"Bearer {code}")

                self.assertEqual(response.status_code, 401)
                self.assertEqual(response.json()["error"]["code"], "admin_auth_invalid")

    def test_unknown_maintainer_returns_403(self):
        with self._patched_auth(repository=FakeRepository()):
            response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Bearer valid-token")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["error"]["code"], "admin_maintainer_unauthorized")

    def test_inactive_maintainer_returns_403(self):
        profile = AdminProfile("user-123", "admin@example.test", "admin", False)
        repository = FakeRepository(profile)

        with self._patched_auth(repository=repository):
            response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Bearer valid-token")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["error"]["code"], "admin_maintainer_inactive")
        self.assertEqual(repository.recorded_logins, [])

    def test_disallowed_profile_role_returns_403(self):
        profile = AdminProfile("user-123", "admin@example.test", "viewer", True)

        with self._patched_auth(repository=FakeRepository(profile)):
            response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Bearer valid-token")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["error"]["code"], "admin_maintainer_unauthorized")

    def test_owner_profile_is_not_authorized_for_this_story(self):
        profile = AdminProfile("user-123", "admin@example.test", "owner", True)

        with self._patched_auth(repository=FakeRepository(profile)):
            response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Bearer valid-token")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["error"]["code"], "admin_maintainer_unauthorized")

    def test_valid_maintainer_returns_canonical_identity_and_records_login(self):
        profile = AdminProfile("user-123", "admin@example.test", "admin", True)
        repository = FakeRepository(profile)

        with self._patched_auth(repository=repository):
            response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Bearer valid-token")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["data"],
            {
                "userId": "user-123",
                "email": "admin@example.test",
                "role": "admin",
                "isActive": True,
            },
        )
        self.assertEqual(repository.recorded_logins, ["user-123"])

    def test_internal_admin_alias_delegates_to_same_boundary(self):
        profile = AdminProfile("user-123", "admin@example.test", "admin", True)

        with self._patched_auth(repository=FakeRepository(profile)):
            response = self.client.get("/_internal/admin/", HTTP_AUTHORIZATION="Bearer valid-token")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"]["userId"], "user-123")

    def test_unexpected_get_body_returns_stable_code(self):
        response = self.client.generic(
            "GET",
            "/api/admin/me",
            data=b'{"email":"spoof@example.test"}',
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer valid-token",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"]["code"], "admin_payload_unsupported")

    def test_verifier_unavailable_returns_401(self):
        error = AdminAuthError(
            code="admin_verifier_unavailable",
            message="Admin token verification is not configured.",
            status=401,
        )
        with self._patched_auth(verifier=FakeVerifier(error=error)):
            response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Bearer valid-token")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["error"]["code"], "admin_verifier_unavailable")

    def test_profile_lookup_failure_returns_stable_503(self):
        repository = FakeRepository(
            profile=None,
            lookup_error=AdminProfileRepositoryError("lookup failed"),
        )

        with self._patched_auth(repository=repository):
            response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Bearer valid-token")

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["error"]["code"], "admin_verifier_unavailable")

    def test_login_write_failure_returns_stable_503(self):
        profile = AdminProfile("user-123", "admin@example.test", "admin", True)
        repository = FakeRepository(
            profile,
            record_login_error=AdminProfileRepositoryError("write failed"),
        )

        with self._patched_auth(repository=repository):
            response = self.client.get("/api/admin/me", HTTP_AUTHORIZATION="Bearer valid-token")

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["error"]["code"], "admin_verifier_unavailable")

    def _patched_auth(
        self,
        *,
        verifier: FakeVerifier | None = None,
        repository: FakeRepository | None = None,
    ):
        return mock.patch.multiple(
            "accounts.permissions",
            get_supabase_jwt_verifier=mock.Mock(return_value=verifier or FakeVerifier()),
            get_admin_profile_repository=mock.Mock(return_value=repository or FakeRepository()),
        )


class SupabaseJwtVerifierTests(SimpleTestCase):
    def test_verifier_uses_configured_issuer_audience_role_and_jwks(self):
        verifier = SupabaseJwtVerifier(
            issuer="https://project.supabase.co/auth/v1",
            audience="authenticated",
            jwks_url="https://project.supabase.co/auth/v1/.well-known/jwks.json",
            expected_role="authenticated",
            cache_seconds=30,
        )
        signing_key = mock.Mock(key="public-key")
        client = mock.Mock()
        client.get_signing_key_from_jwt.return_value = signing_key
        payload = {
            "sub": "user-123",
            "email": "admin@example.test",
            "role": "authenticated",
            "iss": "https://project.supabase.co/auth/v1",
            "aud": "authenticated",
            "exp": 1893456000,
        }

        with (
            mock.patch("accounts.auth.PyJWKClientClass", return_value=client),
            mock.patch("accounts.auth.jwt_module.decode", return_value=payload) as decode,
        ):
            claims = verifier.verify("valid-token")

        decode.assert_called_once()
        _, _, kwargs = decode.mock_calls[0]
        self.assertEqual(kwargs["audience"], "authenticated")
        self.assertEqual(kwargs["issuer"], "https://project.supabase.co/auth/v1")
        self.assertIn("exp", kwargs["options"]["require"])
        self.assertEqual(claims.subject, "user-123")

    def test_jwks_failure_refreshes_cache_and_fails_safely(self):
        verifier = SupabaseJwtVerifier(
            issuer="issuer",
            audience="authenticated",
            jwks_url="https://example.test/jwks.json",
            expected_role="authenticated",
            cache_seconds=30,
        )
        client = mock.Mock()
        from accounts.auth import JwtPyJWKClientError

        client.get_signing_key_from_jwt.side_effect = JwtPyJWKClientError("temporary failure")

        with mock.patch("accounts.auth.PyJWKClientClass", return_value=client):
            with self.assertRaises(AdminAuthError) as context:
                verifier.verify("token")

        self.assertEqual(context.exception.code, "admin_auth_invalid")
        self.assertIsNone(verifier._client)

    def test_verified_claims_reject_wrong_supabase_role(self):
        verifier = SupabaseJwtVerifier(
            issuer="issuer",
            audience="authenticated",
            jwks_url="https://example.test/jwks.json",
            expected_role="authenticated",
            cache_seconds=30,
        )

        with self.assertRaises(AdminAuthError) as context:
            verifier._claims_from_payload(
                {
                    "sub": "user-123",
                    "email": "admin@example.test",
                    "role": "anon",
                    "iss": "issuer",
                    "aud": "authenticated",
                }
            )

        self.assertEqual(context.exception.code, "admin_auth_invalid")


class ProvisionAdminCommandTests(SimpleTestCase):
    def test_grant_update_and_revoke_use_backend_only_repository(self):
        repository = FakeRepository()

        with mock.patch("accounts.services.get_admin_profile_repository", return_value=repository):
            call_command(
                "provision_admin",
                "grant",
                "--supabase-user-id",
                "user-123",
                "--email",
                "admin@example.test",
                "--role",
                "admin",
            )
            call_command(
                "provision_admin",
                "update",
                "--supabase-user-id",
                "user-123",
                "--email",
                "admin@example.test",
                "--role",
                "viewer",
                "--inactive",
            )
            call_command("provision_admin", "revoke", "--supabase-user-id", "user-123")

        self.assertEqual(repository.saved_profiles[0].role, "admin")
        self.assertEqual(repository.saved_profiles[1].role, "viewer")
        profile = repository.profile
        assert profile is not None
        self.assertFalse(profile.is_active)

    def test_revoke_missing_profile_raises_command_error(self):
        repository = FakeRepository(revoke_error=AdminProfileNotFoundError("missing profile"))

        with mock.patch("accounts.services.get_admin_profile_repository", return_value=repository):
            with self.assertRaises(CommandError) as context:
                call_command("provision_admin", "revoke", "--supabase-user-id", "user-123")

        self.assertIn("missing profile", str(context.exception))


class SupabaseAdminProfileRepositoryTests(SimpleTestCase):
    def test_upsert_targets_supabase_user_id_conflict(self):
        from accounts.services import AdminProfile, SupabaseAdminProfileRepository

        repository = SupabaseAdminProfileRepository(
            supabase_url="https://example.test",
            service_role_key="service-role",
        )
        profile = AdminProfile("user-123", "admin@example.test", "admin", True)
        response = mock.Mock()
        response.read.return_value = b"".join(
            [
                b'[{"supabase_user_id":"user-123","email":"admin@example.test",',
                b'"display_name":null,"role":"admin","is_active":true}]',
            ]
        )
        context_manager = mock.MagicMock()
        context_manager.__enter__.return_value = response
        context_manager.__exit__.return_value = False

        with mock.patch("accounts.services.urlopen", return_value=context_manager) as urlopen:
            repository.upsert(profile)

        request = urlopen.call_args.args[0]
        self.assertIn("on_conflict=supabase_user_id", request.full_url)


class PublicLearnerBoundaryTests(SimpleTestCase):
    def test_frontend_does_not_surface_admin_routes_or_supabase_auth_logic(self):
        source_root = Path(__file__).resolve().parents[2] / "src"
        private_boundary = source_root / "components" / "modules" / "MaintainerDashboard"
        private_libs = {
            source_root / "lib" / "maintainer",
            source_root / "lib" / "supabase",
        }
        text_suffixes = {".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".json"}
        source_text = "\n".join(
            path.read_text(encoding="utf-8")
            for path in source_root.rglob("*")
            if path.is_file()
            and path.suffix in text_suffixes
            and "graphify-out" not in path.parts
            and private_boundary not in path.parents
            and not any(private_lib in path.parents for private_lib in private_libs)
        )

        self.assertNotIn("/api/admin", source_text)
        self.assertNotIn("/_internal/admin", source_text)
        self.assertNotIn("signInWithPassword", source_text)
