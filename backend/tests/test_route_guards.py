from django.test import Client, SimpleTestCase, override_settings


@override_settings(ROOT_URLCONF="config.urls")
class RouteGuardTests(SimpleTestCase):
    def setUp(self):
        self.client = Client()

    def test_bootstrap_health_uses_envelope(self):
        response = self.client.get("/_internal/bootstrap/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"]["service"], "django-backend")

    def test_reserved_chat_route_rejects_wrong_content_type(self):
        response = self.client.post(
            "/_internal/chat/",
            data="plain text",
            content_type="text/plain",
        )

        self.assertEqual(response.status_code, 415)
        self.assertEqual(response.json()["error"]["code"], "unsupported_media_type")

    def test_reserved_chat_route_is_stubbed_without_public_cutover(self):
        response = self.client.post(
            "/_internal/chat/",
            data={"message": "hello"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 501)
        self.assertEqual(response.json()["error"]["code"], "chat_cutover_deferred")

    def test_reserved_admin_route_requires_auth(self):
        response = self.client.get("/_internal/admin/")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["error"]["code"], "admin_auth_required")

    def test_reserved_chat_wrong_method_uses_safe_envelope(self):
        response = self.client.get("/_internal/chat/")

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()["error"]["code"], "method_not_allowed")

    def test_unknown_route_uses_safe_json_404(self):
        response = self.client.get("/_internal/nope/")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["error"]["code"], "not_found")
