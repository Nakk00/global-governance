from __future__ import annotations

import json
from pathlib import Path
from unittest import mock
from urllib.error import URLError

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, SimpleTestCase, override_settings

from accounts.auth import AdminAuthError
from ingestion.dtos import IngestionRunResult
from sources import services as sources_service
from sources.repositories.memory import InMemoryStewardshipRepository
from sources.repositories.mutations import validate_transition
from sources.repository import reset_stewardship_state

REPO_ROOT = Path(__file__).resolve().parents[2]


@override_settings(ROOT_URLCONF="config.urls", INGESTION_DRY_RUN=True)
class AdminStewardshipApiTests(SimpleTestCase):
    def setUp(self) -> None:
        self.client = Client()
        reset_stewardship_state()

    def test_sources_dashboard_requires_admin_auth(self):
        response = self.client.get("/api/admin/sources")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["error"]["code"], "admin_auth_missing")

    def test_sources_dashboard_returns_inventory_and_partial_markers(self):
        with self._authorized():
            response = self.client.get("/api/admin/sources", HTTP_AUTHORIZATION="Bearer token")

        payload = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertGreater(payload["data"]["overview"]["sourceCount"], 0)
        self.assertIn("monitoring", payload["data"])
        self.assertIn("auditTrail", payload["data"])
        self.assertIn("chatbotTrust", payload["data"])
        self.assertEqual(payload["data"]["monitoring"]["blockers"]["label"], "Blockers")
        self.assertGreaterEqual(
            len(payload["data"]["monitoring"]["nextActions"]),
            1,
        )
        self.assertEqual(payload["data"]["auditTrail"]["totalEvents"], 0)
        self.assertEqual(payload["data"]["chatbotTrust"]["state"], "partial")
        first_source = payload["data"]["sources"][0]
        self.assertIn("sourceId", first_source)
        self.assertIn("createdAt", first_source)
        self.assertIn("updatedAt", first_source)
        self.assertIn(
            first_source["lifecycleState"], {"draft", "approved", "active", "disabled", "archived"}
        )
        self.assertIn("latestIngestJob", first_source)
        self.assertIn("partialData", first_source)
        self.assertGreater(len(first_source["partialData"]), 0)

    def test_source_detail_exposes_distinct_history_groups(self):
        with self._authorized():
            response = self.client.get(
                "/api/admin/sources/gg-src-un-charter-institutions",
                HTTP_AUTHORIZATION="Bearer token",
            )

        data = response.json()["data"]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["sourceId"], "gg-src-un-charter-institutions")
        self.assertIn("createdAt", data)
        self.assertIn("updatedAt", data)
        self.assertIn("approvalLineage", data)
        self.assertIn("ingestionProvenance", data)
        self.assertIn("validationHistory", data)
        self.assertIn("auditTrail", data)
        self.assertEqual(data["approvalLineage"], [])
        self.assertEqual(data["ingestionProvenance"], [])
        self.assertEqual(data["validationHistory"], [])
        self.assertEqual(data["auditTrail"], [])

    def test_missing_source_returns_safe_404(self):
        with self._authorized():
            response = self.client.get(
                "/api/admin/sources/missing-source",
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["error"]["code"], "admin_source_not_found")

    def test_source_chunk_inspection_defaults_to_latest_successful_document(self):
        with self._authorized():
            self.client.post(
                "/api/admin/sources/gg-src-un-charter-institutions/ingest",
                HTTP_AUTHORIZATION="Bearer token",
            )
            self.client.post(
                "/api/admin/sources/gg-src-un-charter-institutions/ingest",
                HTTP_AUTHORIZATION="Bearer token",
            )
            response = self.client.get(
                "/api/admin/sources/gg-src-un-charter-institutions/chunks",
                HTTP_AUTHORIZATION="Bearer token",
            )

        data = response.json()["data"]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["anchor"]["version"], "v2")
        self.assertEqual(data["anchor"]["documentId"], data["chunks"][0]["documentId"])
        self.assertEqual(data["chunks"][0]["chunkIndex"], 0)
        self.assertTrue(data["chunks"][0]["embeddingPresent"])
        self.assertEqual(data["chunks"][0]["activeState"], "ready")

    def test_source_citation_inspection_exposes_display_label_and_linked_chunks(self):
        with self._authorized():
            self.client.post(
                "/api/admin/sources/gg-src-un-charter-institutions/ingest",
                HTTP_AUTHORIZATION="Bearer token",
            )
            response = self.client.get(
                "/api/admin/sources/gg-src-un-charter-institutions/citations",
                HTTP_AUTHORIZATION="Bearer token",
            )

        data = response.json()["data"]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["anchor"]["version"], "v1")
        self.assertEqual(
            data["citations"][0]["citationLabel"], data["citations"][0]["displayLabel"]
        )
        self.assertEqual(len(data["citations"][0]["linkedChunkIds"]), 1)

    def test_source_inspection_explains_missing_or_inactive_evidence(self):
        with self._authorized():
            draft_upload = self.client.post(
                "/api/admin/sources/upload",
                data={
                    "sourceId": "gg-src-draft-evidence",
                    "title": "Draft Evidence",
                    "sourceType": "reference",
                    "provenance": "Maintainer upload",
                    "summary": "Draft source without ingestion evidence.",
                    "usageScope": "ingestion",
                    "file": SimpleUploadedFile("draft.md", b"# draft"),
                },
                HTTP_AUTHORIZATION="Bearer token",
            )
            response = self.client.get(
                "/api/admin/sources/gg-src-draft-evidence/chunks",
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(draft_upload.status_code, 201)
        data = response.json()["data"]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["anchor"]["state"], "inactive")
        self.assertEqual(data["chunks"], [])
        self.assertIn("Approve the source", data["anchor"]["nextStep"])

    def test_chunk_and_citation_detail_return_safe_404_and_linked_evidence(self):
        with self._authorized():
            self.client.post(
                "/api/admin/sources/gg-src-un-charter-institutions/ingest",
                HTTP_AUTHORIZATION="Bearer token",
            )
            chunks = self.client.get(
                "/api/admin/sources/gg-src-un-charter-institutions/chunks",
                HTTP_AUTHORIZATION="Bearer token",
            ).json()["data"]["chunks"]
            citations = self.client.get(
                "/api/admin/sources/gg-src-un-charter-institutions/citations",
                HTTP_AUTHORIZATION="Bearer token",
            ).json()["data"]["citations"]
            chunk_detail = self.client.get(
                f"/api/admin/chunks/{chunks[0]['id']}",
                HTTP_AUTHORIZATION="Bearer token",
            )
            citation_detail = self.client.get(
                f"/api/admin/citations/{citations[0]['id']}",
                HTTP_AUTHORIZATION="Bearer token",
            )
            missing_chunk = self.client.get(
                "/api/admin/chunks/missing",
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(chunk_detail.status_code, 200)
        self.assertIn("content", chunk_detail.json()["data"])
        self.assertEqual(chunk_detail.json()["data"]["linkedCitationIds"], [citations[0]["id"]])
        self.assertEqual(citation_detail.status_code, 200)
        self.assertEqual(citation_detail.json()["data"]["linkedChunks"][0]["id"], chunks[0]["id"])
        self.assertEqual(missing_chunk.status_code, 404)
        self.assertEqual(missing_chunk.json()["error"]["code"], "admin_chunk_not_found")

    def test_operational_endpoints_return_read_only_events(self):
        for path in ("/api/admin/ingestion", "/api/admin/validation", "/api/admin/audit"):
            with self.subTest(path=path):
                with self._authorized():
                    response = self.client.get(path, HTTP_AUTHORIZATION="Bearer token")

                self.assertEqual(response.status_code, 200)
                self.assertTrue(response.json()["success"])
                self.assertEqual(response.json()["data"], [])

    def test_dashboard_view_delegates_to_service_layer(self):
        with (
            self._authorized(),
            mock.patch(
                "sources.views.sources_service.get_stewardship_dashboard",
                wraps=sources_service.get_stewardship_dashboard,
            ) as mocked_service,
        ):
            response = self.client.get("/api/admin/sources", HTTP_AUTHORIZATION="Bearer token")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(mocked_service.called)

    @override_settings(
        SUPABASE_URL="https://example.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY="service-role-key",
    )
    def test_sources_dashboard_falls_back_when_store_is_unavailable(self):
        with (
            self._authorized(),
            mock.patch("sources.repositories.get_test_repository", return_value=None),
            mock.patch(
                "sources.repositories.supabase.urlopen",
                side_effect=URLError("timed out"),
            ),
        ):
            response = self.client.get("/api/admin/sources", HTTP_AUTHORIZATION="Bearer token")

        payload = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertGreater(payload["data"]["overview"]["sourceCount"], 0)
        self.assertIn("sources", payload["data"])

    def test_dashboard_monitoring_updates_after_ingest_and_audit_events(self):
        with self._authorized():
            self.client.post(
                "/api/admin/sources/gg-src-un-charter-institutions/ingest",
                HTTP_AUTHORIZATION="Bearer token",
            )
            response = self.client.get("/api/admin/sources", HTTP_AUTHORIZATION="Bearer token")

        data = response.json()["data"]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["auditTrail"]["totalEvents"], 2)
        self.assertEqual(data["auditTrail"]["latestOutcome"], "succeeded")
        self.assertGreaterEqual(data["chatbotTrust"]["groundedSourceCount"], 1)
        self.assertEqual(data["chatbotTrust"]["evidence"][0]["label"], "Grounded sources")

    def test_upload_requires_admin_auth(self):
        response = self.client.post("/api/admin/sources/upload")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["error"]["code"], "admin_auth_missing")

    def test_upload_creates_draft_inactive_source_and_audit_event(self):
        with self._authorized():
            response = self.client.post(
                "/api/admin/sources/upload",
                data={
                    "sourceId": "gg-src-new-policy-note",
                    "title": "New Policy Note",
                    "sourceType": "reference",
                    "provenance": "Maintainer upload",
                    "summary": "A source added through the private steward workflow.",
                    "usageScope": "ingestion",
                    "file": SimpleUploadedFile(
                        "policy-note.md",
                        b"# Policy note",
                        content_type="text/markdown",
                    ),
                },
                HTTP_AUTHORIZATION="Bearer token",
            )

        payload = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertTrue(payload["success"])
        source = payload["data"]["source"]
        self.assertEqual(source["sourceId"], "gg-src-new-policy-note")
        self.assertEqual(source["lifecycleState"], "draft")
        self.assertEqual(source["auditTrail"][0]["eventType"], "upload")
        self.assertIn(
            "gg-src-new-policy-note",
            [item["sourceId"] for item in payload["data"]["dashboard"]["sources"]],
        )

    def test_upload_rejects_empty_unsupported_and_conflicting_files_safely(self):
        cases = [
            (
                SimpleUploadedFile("empty.md", b"", content_type="text/markdown"),
                "admin_source_upload_empty",
                400,
            ),
            (
                SimpleUploadedFile(
                    "unsafe.exe", b"payload", content_type="application/octet-stream"
                ),
                "admin_source_upload_type",
                415,
            ),
        ]
        for uploaded_file, code, status in cases:
            with self.subTest(code=code):
                with self._authorized():
                    response = self.client.post(
                        "/api/admin/sources/upload",
                        data={
                            "sourceId": f"gg-src-{code}",
                            "title": "Rejected Source",
                            "sourceType": "reference",
                            "provenance": "Maintainer upload",
                            "summary": "Rejected upload case.",
                            "usageScope": "ingestion",
                            "file": uploaded_file,
                        },
                        HTTP_AUTHORIZATION="Bearer token",
                    )

                self.assertEqual(response.status_code, status)
                self.assertEqual(response.json()["error"]["code"], code)
                self.assertIn("fields", response.json()["error"]["details"])

        with self._authorized():
            conflict = self.client.post(
                "/api/admin/sources/upload",
                data={
                    "sourceId": "gg-src-un-charter-institutions",
                    "title": "Duplicate",
                    "sourceType": "primary",
                    "provenance": "Duplicate",
                    "summary": "Duplicate",
                    "usageScope": "ingestion",
                    "file": SimpleUploadedFile("duplicate.md", b"duplicate"),
                },
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(conflict.status_code, 409)
        self.assertEqual(conflict.json()["error"]["code"], "admin_source_conflict")

    def test_metadata_edit_persists_and_records_audit(self):
        with self._authorized():
            response = self.client.patch(
                "/api/admin/sources/gg-src-un-charter-institutions",
                data=json.dumps(
                    {
                        "title": "Updated UN Charter",
                        "provenance": "Maintainer correction",
                        "summary": "Updated summary",
                        "usageScope": ["chat", "ingestion"],
                    }
                ),
                content_type="application/json",
                HTTP_AUTHORIZATION="Bearer token",
            )

        source = response.json()["data"]["source"]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(source["title"], "Updated UN Charter")
        self.assertEqual(source["auditTrail"][0]["eventType"], "edit")

    def test_lifecycle_transition_and_ingest_rules_are_safe(self):
        with self._authorized():
            blocked = self.client.post(
                "/api/admin/sources/gg-src-global-governance-course-frame/activate",
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(blocked.status_code, 409)
        self.assertEqual(blocked.json()["error"]["code"], "admin_source_lifecycle_conflict")

        with self._authorized():
            disabled = self.client.post(
                "/api/admin/sources/gg-src-global-governance-course-frame/disable",
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(disabled.status_code, 200)
        self.assertEqual(disabled.json()["data"]["source"]["lifecycleState"], "disabled")
        self.assertEqual(
            disabled.json()["data"]["source"]["auditTrail"][0]["eventType"], "disabled"
        )

        with self._authorized():
            draft_upload = self.client.post(
                "/api/admin/sources/upload",
                data={
                    "sourceId": "gg-src-draft-ingest-case",
                    "title": "Draft Ingest Case",
                    "sourceType": "reference",
                    "provenance": "Maintainer upload",
                    "summary": "Draft upload used for ingest rule checks.",
                    "usageScope": "ingestion",
                    "file": SimpleUploadedFile("draft.md", b"# draft"),
                },
                HTTP_AUTHORIZATION="Bearer token",
            )
            draft_ingest = self.client.post(
                "/api/admin/sources/gg-src-draft-ingest-case/ingest",
                HTTP_AUTHORIZATION="Bearer token",
            )
            approved = self.client.post(
                "/api/admin/sources/gg-src-draft-ingest-case/approve",
                HTTP_AUTHORIZATION="Bearer token",
            )
            first_ingest = self.client.post(
                "/api/admin/sources/gg-src-draft-ingest-case/ingest",
                HTTP_AUTHORIZATION="Bearer token",
            )
            second_ingest = self.client.post(
                "/api/admin/sources/gg-src-draft-ingest-case/ingest",
                HTTP_AUTHORIZATION="Bearer token",
            )

        self.assertEqual(draft_upload.status_code, 201)
        self.assertEqual(draft_ingest.status_code, 409)
        self.assertEqual(
            draft_ingest.json()["error"]["code"],
            "admin_source_lifecycle_conflict",
        )
        self.assertEqual(approved.status_code, 200)
        self.assertEqual(first_ingest.status_code, 200)
        self.assertEqual(
            first_ingest.json()["data"]["source"]["latestIngestJob"]["status"], "succeeded"
        )
        self.assertEqual(second_ingest.status_code, 200)
        self.assertEqual(
            second_ingest.json()["data"]["source"]["auditTrail"][0]["eventType"],
            "re-ingest",
        )

    def test_ingest_job_moves_through_processing_before_success(self):
        observed_statuses: list[str] = []
        repository: InMemoryStewardshipRepository

        def runner(source):
            detail = repository.get_source_detail(source.source_id)
            assert detail is not None
            job = detail["latestIngestJob"]
            assert job is not None
            observed_statuses.append(job["status"])
            return IngestionRunResult(
                document_id="doc-success",
                chunk_count=3,
                reference_count=1,
                embedding_model="nvidia/test-embedding-model",
                embedding_dimensions=4,
            )

        repository = InMemoryStewardshipRepository(ingestion_runner=runner)

        result = repository.dispatch_ingest(
            source_id="gg-src-un-charter-institutions",
            actor="admin@example.test",
        )

        assert observed_statuses == ["processing"]
        job = result["source"]["latestIngestJob"]
        assert job is not None
        assert job["status"] == "succeeded"
        assert job["documentId"] == "doc-success"
        assert job["embeddingModel"] == "nvidia/test-embedding-model"
        assert job["embeddingDimensions"] == 4

    def test_failed_ingest_is_retryable_and_blocks_activation(self):
        attempts = 0

        def runner(_source):
            nonlocal attempts
            attempts += 1
            if attempts == 1:
                raise RuntimeError("embedding provider unavailable")
            return IngestionRunResult(
                document_id="doc-retry",
                chunk_count=2,
                reference_count=1,
                embedding_model="nvidia/test-embedding-model",
                embedding_dimensions=4,
            )

        repository = InMemoryStewardshipRepository(ingestion_runner=runner)
        source_id = "gg-src-global-governance-course-frame"
        repository._sources[source_id].lifecycle_state = "approved"

        failed = repository.dispatch_ingest(source_id=source_id, actor="admin@example.test")

        failed_job = failed["source"]["latestIngestJob"]
        assert failed_job is not None
        assert failed_job["status"] == "failed"
        assert failed_job["errorCode"] == "ingestion_failed"
        snapshot = repository._find_snapshot(source_id)
        assert snapshot is not None
        with self.assertRaisesRegex(ValueError, "successfully ingested"):
            validate_transition(snapshot, "active")

        succeeded = repository.dispatch_ingest(source_id=source_id, actor="admin@example.test")

        succeeded_job = succeeded["source"]["latestIngestJob"]
        assert succeeded_job is not None
        assert succeeded_job["status"] == "succeeded"
        assert attempts == 2

    def test_ingest_schema_supports_processing_and_embedding_evidence(self):
        migration = (
            REPO_ROOT / "supabase" / "migrations" / "0014_operationalize_source_ingest_jobs.sql"
        ).read_text(encoding="utf-8")

        assert "'processing'" in migration
        assert "document_id" in migration
        assert "chunk_count" in migration
        assert "reference_count" in migration
        assert "embedding_model" in migration
        assert "embedding_dimensions" in migration

    def test_revoked_session_error_stays_distinguishable(self):
        error = AdminAuthError(
            code="admin_maintainer_unauthorized",
            message="The authenticated user is not authorized for this admin boundary.",
            status=403,
        )
        with self._authorized(side_effect=error):
            response = self.client.get("/api/admin/sources", HTTP_AUTHORIZATION="Bearer token")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["error"]["code"], "admin_maintainer_unauthorized")

    def test_retryable_outage_error_stays_distinguishable(self):
        error = AdminAuthError(
            code="admin_verifier_unavailable",
            message="The admin auth boundary is temporarily unavailable.",
            status=503,
        )
        with self._authorized(side_effect=error):
            response = self.client.get("/api/admin/sources", HTTP_AUTHORIZATION="Bearer token")

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["error"]["code"], "admin_verifier_unavailable")

    def _authorized(self, *, side_effect: Exception | None = None):
        return mock.patch(
            "sources.views.authorize_admin_request",
            side_effect=side_effect,
            return_value=mock.Mock(email="admin@example.test"),
        )
