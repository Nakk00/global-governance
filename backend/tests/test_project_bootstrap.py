import importlib
import os
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest import mock

from django.core.exceptions import ImproperlyConfigured
from django.test import SimpleTestCase

from common.env import (
    REQUIRED_SERVER_ENV,
    RuntimeCheckError,
    check_backend_prerequisites,
    load_env_file,
    validate_backend_dependencies,
    validate_redis_service,
    validate_required_env,
    validate_supabase_service,
)


class ProjectBootstrapTests(SimpleTestCase):
    def test_explicit_settings_modules_import(self):
        for module_name in ("config.settings.base", "config.settings.development"):
            with self.subTest(module_name=module_name):
                self.assertIsNotNone(importlib.import_module(module_name))

        with (
            self.subTest(module_name="config.settings.production"),
            mock.patch.dict(
                os.environ,
                {
                    "DJANGO_SECRET_KEY": "production-secret",
                    "DJANGO_ALLOWED_HOSTS": ".vercel.app,global-governance.vercel.app",
                },
                clear=True,
            ),
        ):
            sys.modules.pop("config.settings.production", None)
            self.assertIsNotNone(importlib.import_module("config.settings.production"))

    def test_entry_points_select_development_settings_by_default(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            importlib.reload(importlib.import_module("config.asgi"))
            self.assertEqual(os.environ["DJANGO_SETTINGS_MODULE"], "config.settings.development")

        with mock.patch.dict(os.environ, {}, clear=True):
            importlib.reload(importlib.import_module("config.wsgi"))
            self.assertEqual(os.environ["DJANGO_SETTINGS_MODULE"], "config.settings.development")

    def test_entry_points_preserve_inherited_settings_module(self):
        with mock.patch.dict(
            os.environ,
            {
                "DJANGO_SETTINGS_MODULE": "config.settings.production",
                "DJANGO_SECRET_KEY": "production-secret",
                "DJANGO_ALLOWED_HOSTS": ".vercel.app,global-governance.vercel.app",
            },
            clear=True,
        ):
            importlib.reload(importlib.import_module("config.asgi"))
            self.assertEqual(os.environ["DJANGO_SETTINGS_MODULE"], "config.settings.production")

        with mock.patch.dict(
            os.environ,
            {
                "DJANGO_SETTINGS_MODULE": "config.settings.production",
                "DJANGO_SECRET_KEY": "production-secret",
                "DJANGO_ALLOWED_HOSTS": ".vercel.app,global-governance.vercel.app",
            },
            clear=True,
        ):
            importlib.reload(importlib.import_module("config.wsgi"))
            self.assertEqual(os.environ["DJANGO_SETTINGS_MODULE"], "config.settings.production")

    def test_manage_py_preserves_inherited_settings_module(self):
        with (
            mock.patch.dict(
                os.environ,
                {"DJANGO_SETTINGS_MODULE": "config.settings.production"},
                clear=True,
            ),
            mock.patch.object(sys, "argv", ["manage.py", "showmigrations"]),
            mock.patch("common.env.load_env_file"),
            mock.patch(
                "django.core.management.execute_from_command_line"
            ) as execute_from_command_line,
        ):
            manage = importlib.import_module("manage")
            manage.main()

            self.assertEqual(os.environ["DJANGO_SETTINGS_MODULE"], "config.settings.production")
            execute_from_command_line.assert_called_once_with(["manage.py", "showmigrations"])

    def test_production_settings_require_secret_key(self):
        with mock.patch.dict(
            os.environ,
            {"DJANGO_ALLOWED_HOSTS": ".vercel.app,global-governance.vercel.app"},
            clear=True,
        ):
            sys.modules.pop("config.settings.production", None)

            with self.assertRaises(ImproperlyConfigured) as context:
                importlib.import_module("config.settings.production")

        self.assertIn("DJANGO_SECRET_KEY", str(context.exception))

    def test_production_settings_require_allowed_hosts(self):
        with mock.patch.dict(
            os.environ,
            {"DJANGO_SECRET_KEY": "production-secret"},
            clear=True,
        ):
            sys.modules.pop("config.settings.production", None)

            with self.assertRaises(ImproperlyConfigured) as context:
                importlib.import_module("config.settings.production")

        self.assertIn("DJANGO_ALLOWED_HOSTS", str(context.exception))

    def test_required_server_environment_is_declared(self):
        keys = {requirement.key for requirement in REQUIRED_SERVER_ENV}

        self.assertIn("DJANGO_SECRET_KEY", keys)
        self.assertIn("SUPABASE_URL", keys)
        self.assertIn("SUPABASE_SERVICE_ROLE_KEY", keys)
        self.assertIn("SUPABASE_JWT_ISSUER", keys)
        self.assertIn("SUPABASE_JWT_AUDIENCE", keys)
        self.assertIn("SUPABASE_JWKS_URL", keys)
        self.assertIn("REDIS_URL", keys)
        self.assertNotIn("VITE_SUPABASE_ANON_KEY", keys)

    def test_env_file_can_override_inherited_local_values(self):
        with TemporaryDirectory() as temp_dir:
            env_path = Path(temp_dir) / ".env"
            env_path.write_text(
                "REDIS_ABUSE_COOLDOWN_SECONDS=10\nREDIS_RATE_LIMIT_MAX_REQUESTS=5\n",
                encoding="utf-8",
            )

            with mock.patch.dict(
                os.environ,
                {
                    "REDIS_ABUSE_COOLDOWN_SECONDS": "300",
                    "REDIS_RATE_LIMIT_MAX_REQUESTS": "10",
                },
                clear=True,
            ):
                load_env_file(env_path, override=True)

                self.assertEqual(os.environ["REDIS_ABUSE_COOLDOWN_SECONDS"], "10")
                self.assertEqual(os.environ["REDIS_RATE_LIMIT_MAX_REQUESTS"], "5")

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
            "REDIS_URL": "redis://127.0.0.1:6379/0",
        }

        with mock.patch.dict(os.environ, environment, clear=True):
            check_backend_prerequisites(check_services=False)

    def test_prerequisite_check_validates_required_local_services(self):
        environment = {
            "DJANGO_SECRET_KEY": "dev-secret",
            "SUPABASE_URL": "http://127.0.0.1:54321",
            "SUPABASE_SERVICE_ROLE_KEY": "server-only",
            "SUPABASE_JWT_ISSUER": "http://127.0.0.1:54321/auth/v1",
            "SUPABASE_JWT_AUDIENCE": "authenticated",
            "SUPABASE_JWKS_URL": "http://127.0.0.1:54321/auth/v1/.well-known/jwks.json",
            "REDIS_URL": "redis://127.0.0.1:6379/0",
        }

        with (
            mock.patch.dict(os.environ, environment, clear=True),
            mock.patch("common.env.validate_supabase_service") as supabase_service,
            mock.patch("common.env.validate_redis_service") as redis_service,
        ):
            check_backend_prerequisites(check_services=True)

        supabase_service.assert_called_once_with()
        redis_service.assert_called_once_with()

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

    def test_hosted_supabase_url_uses_https_default_port(self):
        with (
            mock.patch.dict(
                os.environ,
                {
                    "SUPABASE_URL": "https://project-ref.supabase.co",
                },
                clear=True,
            ),
            mock.patch("common.env.socket.create_connection") as create_connection,
        ):
            validate_supabase_service(timeout_seconds=0.5, retries=1)

        create_connection.assert_called_once_with(("project-ref.supabase.co", 443), timeout=0.5)

    def test_invalid_redis_url_reports_actionable_message(self):
        with mock.patch.dict(
            os.environ,
            {
                "REDIS_URL": "redis://127.0.0.1:abc/0",
            },
            clear=True,
        ):
            with self.assertRaises(RuntimeCheckError) as context:
                validate_redis_service()

        self.assertIn("valid numeric port", str(context.exception))
