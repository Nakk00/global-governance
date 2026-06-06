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

    def test_frontend_chat_endpoint_is_django_owned_and_ready(self):
        self.assertEqual(
            settings.PUBLIC_CHAT_CUTOVER_STATUS,
            "django-public-chat-ready",
        )

    def test_supabase_auth_settings_are_available(self):
        self.assertEqual(settings.SUPABASE_JWT_AUDIENCE, "authenticated")
        self.assertEqual(settings.SUPABASE_JWT_ROLE, "authenticated")
        self.assertGreater(settings.SUPABASE_JWKS_CACHE_SECONDS, 0)

    def test_django_chat_model_role_settings_are_available(self):
        self.assertEqual(
            settings.NVIDIA_GENERATION_MODEL,
            "nvidia/llama-3.1-nemotron-nano-8b-v1",
        )
        self.assertEqual(
            settings.NVIDIA_EMBEDDING_MODEL,
            "nvidia/llama-nemotron-embed-1b-v2",
        )
        self.assertEqual(
            settings.NVIDIA_RERANK_MODEL,
            "nvidia/llama-nemotron-rerank-1b-v2",
        )
        self.assertEqual(
            settings.NVIDIA_TOPIC_GUARD_MODEL,
            "nvidia/llama-3.1-nemoguard-8b-topic-control",
        )
        self.assertEqual(
            settings.NVIDIA_SAFETY_GUARD_MODEL,
            "nvidia/llama-3.1-nemotron-safety-guard-8b-v3",
        )
        self.assertIsInstance(settings.REDIS_URL, str)
