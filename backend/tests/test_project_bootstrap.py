import importlib
import os
from unittest import mock

from django.test import SimpleTestCase

from common.env import (
    REQUIRED_SERVER_ENV,
    RuntimeCheckError,
    check_backend_prerequisites,
    validate_backend_dependencies,
    validate_required_env,
    validate_supabase_service,
)


class ProjectBootstrapTests(SimpleTestCase):
    def test_explicit_settings_modules_import(self):
        for module_name in (
            "config.settings.base",
            "config.settings.development",
            "config.settings.production",
        ):
            with self.subTest(module_name=module_name):
                self.assertIsNotNone(importlib.import_module(module_name))

    def test_entry_points_select_development_settings_by_default(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            importlib.reload(importlib.import_module("config.asgi"))
            self.assertEqual(os.environ["DJANGO_SETTINGS_MODULE"], "config.settings.development")

        with mock.patch.dict(os.environ, {}, clear=True):
            importlib.reload(importlib.import_module("config.wsgi"))
            self.assertEqual(os.environ["DJANGO_SETTINGS_MODULE"], "config.settings.development")

    def test_entry_points_override_inherited_settings_module(self):
        with mock.patch.dict(
            os.environ, {"DJANGO_SETTINGS_MODULE": "config.settings.production"}, clear=True
        ):
            importlib.reload(importlib.import_module("config.asgi"))
            self.assertEqual(os.environ["DJANGO_SETTINGS_MODULE"], "config.settings.development")

        with mock.patch.dict(
            os.environ, {"DJANGO_SETTINGS_MODULE": "config.settings.production"}, clear=True
        ):
            importlib.reload(importlib.import_module("config.wsgi"))
            self.assertEqual(os.environ["DJANGO_SETTINGS_MODULE"], "config.settings.development")

    def test_required_server_environment_is_declared(self):
        keys = {requirement.key for requirement in REQUIRED_SERVER_ENV}

        self.assertIn("DJANGO_SECRET_KEY", keys)
        self.assertIn("SUPABASE_URL", keys)
        self.assertIn("SUPABASE_SERVICE_ROLE_KEY", keys)
        self.assertIn("SUPABASE_JWT_ISSUER", keys)
        self.assertIn("SUPABASE_JWT_AUDIENCE", keys)
        self.assertIn("SUPABASE_JWKS_URL", keys)
        self.assertNotIn("VITE_SUPABASE_ANON_KEY", keys)

    def test_missing_required_env_reports_actionable_message(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(RuntimeCheckError) as context:
                validate_required_env()

        message = str(context.exception)
        self.assertIn("Missing required Django backend environment values", message)
        self.assertIn("backend/.env.example", message)
        self.assertNotIn("SUPABASE_SERVICE_ROLE_KEY=", message)

    def test_prerequisite_check_allows_mocked_available_services(self):
        environment = {
            "DJANGO_SECRET_KEY": "dev-secret",
            "SUPABASE_URL": "http://127.0.0.1:54321",
            "SUPABASE_SERVICE_ROLE_KEY": "server-only",
            "SUPABASE_JWT_ISSUER": "http://127.0.0.1:54321/auth/v1",
            "SUPABASE_JWT_AUDIENCE": "authenticated",
            "SUPABASE_JWKS_URL": "http://127.0.0.1:54321/auth/v1/.well-known/jwks.json",
        }

        with mock.patch.dict(os.environ, environment, clear=True):
            check_backend_prerequisites(check_services=False)

    def test_missing_backend_dependencies_reports_actionable_message(self):
        with mock.patch("common.env.find_spec", return_value=None):
            with self.assertRaises(RuntimeCheckError) as context:
                validate_backend_dependencies()

        self.assertIn("backend/requirements.txt", str(context.exception))

    def test_invalid_supabase_url_reports_actionable_message(self):
        with mock.patch.dict(
            os.environ,
            {
                "SUPABASE_URL": "http://127.0.0.1:abc",
            },
            clear=True,
        ):
            with self.assertRaises(RuntimeCheckError) as context:
                validate_supabase_service()

        self.assertIn("valid numeric port", str(context.exception))
