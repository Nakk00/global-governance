from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "development-only-not-for-production")
DEBUG = False
ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")
    if host.strip()
]

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "chatbot.apps.ChatbotConfig",
    "retrieval.apps.RetrievalConfig",
    "ingestion.apps.IngestionConfig",
    "validation.apps.ValidationConfig",
    "audit.apps.AuditConfig",
    "sources.apps.SourcesConfig",
    "accounts.apps.AccountsConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SECURE_PROXY_SSL_HEADER = None
USE_X_FORWARDED_HOST = False
PUBLIC_CHAT_CUTOVER_STATUS = "deferred-supabase-edge-function-default"
MAX_EXTERNAL_JSON_BODY_BYTES = 16 * 1024
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_JWT_ISSUER = os.environ.get("SUPABASE_JWT_ISSUER", "")
SUPABASE_JWT_AUDIENCE = os.environ.get("SUPABASE_JWT_AUDIENCE", "authenticated")
SUPABASE_JWT_ROLE = os.environ.get("SUPABASE_JWT_ROLE", "authenticated")
SUPABASE_JWKS_URL = os.environ.get("SUPABASE_JWKS_URL", "")
SUPABASE_JWKS_CACHE_SECONDS = int(os.environ.get("SUPABASE_JWKS_CACHE_SECONDS", "300"))
SUPABASE_REST_TIMEOUT_SECONDS = float(os.environ.get("SUPABASE_REST_TIMEOUT_SECONDS", "5"))
