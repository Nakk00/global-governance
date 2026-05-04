from django.conf import settings
from django.test import SimpleTestCase


class SettingsImportTests(SimpleTestCase):
    def test_backend_apps_are_registered(self):
        expected_apps = {
            "chatbot.apps.ChatbotConfig",
            "retrieval.apps.RetrievalConfig",
            "ingestion.apps.IngestionConfig",
            "validation.apps.ValidationConfig",
            "audit.apps.AuditConfig",
            "sources.apps.SourcesConfig",
            "accounts.apps.AccountsConfig",
        }

        self.assertTrue(expected_apps.issubset(set(settings.INSTALLED_APPS)))

    def test_development_debug_stays_disabled_for_json_contracts(self):
        self.assertFalse(settings.DEBUG)

    def test_frontend_chat_endpoint_is_not_django_owned_yet(self):
        self.assertEqual(
            settings.PUBLIC_CHAT_CUTOVER_STATUS,
            "deferred-supabase-edge-function-default",
        )

    def test_supabase_auth_settings_are_available(self):
        self.assertEqual(settings.SUPABASE_JWT_AUDIENCE, "authenticated")
        self.assertEqual(settings.SUPABASE_JWT_ROLE, "authenticated")
        self.assertGreater(settings.SUPABASE_JWKS_CACHE_SECONDS, 0)
