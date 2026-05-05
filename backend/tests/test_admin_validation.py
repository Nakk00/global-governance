from __future__ import annotations

import json
from email.message import Message
from io import BytesIO
from unittest import mock
from urllib.error import HTTPError

from django.test import Client, SimpleTestCase, override_settings

from accounts.auth import AdminAuthError
from validation.repository import _result_from_row, reset_validation_state


@override_settings(ROOT_URLCONF="config.urls")
class AdminValidationApiTests(SimpleTestCase):
    def setUp(self) -> None:
        self.client = Client()
        reset_validation_state()

    def test_validation_sets_require_admin_auth(self):
        response = self.client.get("/api/admin/validation-sets")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["error"]["code"], "admin_auth_missing")

    def test_default_validation_set_is_listed_and_marked_default(self):
        with self._authorized():
            response = self.client.get(
                "/api/admin/validation-sets", HTTP_AUTHORIZATION="Bearer token"
            )

        data = response.json()["data"]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["sets"][0]["name"], "Demo Readiness v1")
        self.assertTrue(data["sets"][0]["isDefault"])
        self.assertGreaterEqual(data["sets"][0]["questionCount"], 4)

    def test_launch_run_persists_summary_results_and_audit_events(self):
        with self._authorized():
            launch = self.client.post(
                "/api/admin/validation-runs",
                data=json.dumps({"validationSetId": "demo-readiness-v1"}),
                content_type="application/json",
                HTTP_AUTHORIZATION="Bearer token",
            )

            runs = self.client.get("/api/admin/validation-runs", HTTP_AUTHORIZATION="Bearer token")
            detail = self.client.get(
                f"/api/admin/validation-runs/{launch.json()['data']['runId']}",
                HTTP_AUTHORIZATION="Bearer token",
            )

        launched = launch.json()["data"]
        detail_data = detail.json()["data"]
        self.assertEqual(launch.status_code, 201)
        self.assertEqual(launched["status"], "completed")
        self.assertEqual(launched["validationSetVersion"], 1)
        self.assertEqual(launched["totalCount"], len(detail_data["results"]))
        self.assertGreater(launched["passCount"], 0)
        self.assertGreater(launched["weakSupportCount"], 0)
        self.assertGreater(launched["refusedCount"], 0)
        self.assertGreater(launched["failedCount"], 0)
        self.assertGreater(launched["errorCount"], 0)
        self.assertEqual(runs.json()["data"]["runs"][0]["runId"], launched["runId"])
        first_result = detail_data["results"][0]
        self.assertIn(
            first_result["outcome"],
            {"pass", "weakSupport", "refused", "failed", "error"},
        )
        self.assertIn("questionText", first_result)
        self.assertIn("expectedState", first_result)
        self.assertIn("actualState", first_result)
        self.assertIn("answerPreview", first_result)
        self.assertIn("retrievedSourceIds", first_result)
        self.assertIn("citationIds", first_result)
        self.assertIn("latencyMs", first_result)
        self.assertEqual(len(detail_data["auditEvents"]), 2)

    def test_duplicate_in_flight_launch_returns_safe_conflict(self):
        from validation.repository import seed_inflight_validation_run

        seed_inflight_validation_run("demo-readiness-v1")

        with self._authorized():
            response = self.client.post(
                "/api/admin/validation-runs",
                data=json.dumps({"validationSetId": "demo-readiness-v1"}),
                content_type="application/json",
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json()["error"]["code"], "admin_validation_run_in_progress")

    def test_launch_route_accepts_post_without_csrf_token_for_bearer_auth(self):
        client = Client(enforce_csrf_checks=True)

        with self._authorized():
            response = client.post(
                "/api/admin/validation-runs",
                data=json.dumps({"validationSetId": "demo-readiness-v1"}),
                content_type="application/json",
                HTTP_AUTHORIZATION="Bearer token",
                HTTP_HOST="127.0.0.1",
            )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()["success"])

    def test_run_list_empty_and_not_found_states_are_safe(self):
        with self._authorized():
            runs = self.client.get("/api/admin/validation-runs", HTTP_AUTHORIZATION="Bearer token")
            missing = self.client.get(
                "/api/admin/validation-runs/missing-run",
                HTTP_AUTHORIZATION="Bearer token",
            )
            bad_set = self.client.post(
                "/api/admin/validation-runs",
                data=json.dumps({"validationSetId": "missing-set"}),
                content_type="application/json",
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(runs.status_code, 200)
        self.assertEqual(runs.json()["data"]["runs"], [])
        self.assertEqual(missing.status_code, 404)
        self.assertEqual(missing.json()["error"]["code"], "admin_validation_run_not_found")
        self.assertEqual(bad_set.status_code, 404)
        self.assertEqual(bad_set.json()["error"]["code"], "admin_validation_set_not_found")

    def test_launch_requires_non_blank_validation_set_id(self):
        with self._authorized():
            response = self.client.post(
                "/api/admin/validation-runs",
                data=json.dumps({"validationSetId": "   "}),
                content_type="application/json",
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"]["code"], "admin_validation_set_required")

    def test_auth_failures_keep_safe_envelopes(self):
        error = AdminAuthError(
            code="admin_verifier_unavailable",
            message="The admin auth boundary is temporarily unavailable.",
            status=503,
        )
        with self._authorized(side_effect=error):
            response = self.client.get(
                "/api/admin/validation-runs", HTTP_AUTHORIZATION="Bearer token"
            )

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["error"]["code"], "admin_verifier_unavailable")

    @override_settings(
        SUPABASE_URL="https://example.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY="service-role-key",
    )
    def test_validation_workbench_falls_back_when_store_is_not_provisioned(self):
        missing_store = HTTPError(
            url="https://example.supabase.co/rest/v1/validation_sets",
            code=404,
            msg="Not Found",
            hdrs=Message(),
            fp=BytesIO(b'{"message":"Not Found"}'),
        )

        def raise_missing_store(*args, **kwargs):
            raise missing_store

        with (
            self._authorized(),
            mock.patch(
                "validation.repository.urlopen",
                side_effect=raise_missing_store,
            ),
        ):
            sets = self.client.get("/api/admin/validation-sets", HTTP_AUTHORIZATION="Bearer token")
            launch = self.client.post(
                "/api/admin/validation-runs",
                data=json.dumps({"validationSetId": "demo-readiness-v1"}),
                content_type="application/json",
                HTTP_AUTHORIZATION="Bearer token",
            )
            runs = self.client.get("/api/admin/validation-runs", HTTP_AUTHORIZATION="Bearer token")

        self.assertEqual(sets.status_code, 200)
        self.assertEqual(sets.json()["data"]["sets"][0]["name"], "Demo Readiness v1")
        self.assertEqual(launch.status_code, 201)
        self.assertEqual(launch.json()["data"]["status"], "completed")
        self.assertEqual(runs.status_code, 200)
        self.assertEqual(len(runs.json()["data"]["runs"]), 1)

    def _authorized(self, *, side_effect: Exception | None = None):
        return mock.patch(
            "validation.views.authorize_admin_request",
            side_effect=side_effect,
            return_value=mock.Mock(email="admin@example.test"),
        )


class ValidationRepositoryHelpersTests(SimpleTestCase):
    def test_result_row_preserves_zero_support_score(self):
        result = _result_from_row(
            {
                "id": "result-1",
                "validation_question_id": "question-1",
                "question_text": "Question",
                "expected_state": "grounded",
                "actual_state": "weakSupport",
                "outcome": "weakSupport",
                "answer_preview": "Preview",
                "retrieved_source_ids": [],
                "citation_ids": [],
                "support_score": 0.0,
                "latency_ms": 500,
                "notes": "Support was measured at zero.",
                "created_at": "2026-05-05T00:00:00Z",
            }
        )

        self.assertEqual(result["supportScore"], 0.0)
