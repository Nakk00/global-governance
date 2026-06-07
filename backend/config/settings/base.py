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
PUBLIC_CHAT_CUTOVER_STATUS = "django-public-chat-ready"
PUBLIC_CHAT_REQUEST_BODY_MAX_BYTES = int(
    os.environ.get("PUBLIC_CHAT_REQUEST_BODY_MAX_BYTES", "8192")
)
PUBLIC_CHAT_QUESTION_MAX_CHARS = int(os.environ.get("PUBLIC_CHAT_QUESTION_MAX_CHARS", "2000"))
PUBLIC_CHAT_ANSWER_MAX_CHARS = int(os.environ.get("PUBLIC_CHAT_ANSWER_MAX_CHARS", "4000"))
PUBLIC_CHAT_VISIBLE_CITATION_LIMIT = int(os.environ.get("PUBLIC_CHAT_VISIBLE_CITATION_LIMIT", "6"))
PUBLIC_CHAT_POLICY_VERSION = os.environ.get("PUBLIC_CHAT_POLICY_VERSION", "public-chat-v1")
PUBLIC_CHAT_SOURCE_INDEX_VERSION = os.environ.get(
    "PUBLIC_CHAT_SOURCE_INDEX_VERSION", "approved-sources-local-v1"
)
MAX_EXTERNAL_JSON_BODY_BYTES = PUBLIC_CHAT_REQUEST_BODY_MAX_BYTES
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_JWT_ISSUER = os.environ.get("SUPABASE_JWT_ISSUER", "")
SUPABASE_JWT_AUDIENCE = os.environ.get("SUPABASE_JWT_AUDIENCE", "authenticated")
SUPABASE_JWT_ROLE = os.environ.get("SUPABASE_JWT_ROLE", "authenticated")
SUPABASE_JWKS_URL = os.environ.get("SUPABASE_JWKS_URL", "")
SUPABASE_JWKS_CACHE_SECONDS = int(os.environ.get("SUPABASE_JWKS_CACHE_SECONDS", "300"))
SUPABASE_REST_TIMEOUT_SECONDS = float(os.environ.get("SUPABASE_REST_TIMEOUT_SECONDS", "5"))
REDIS_URL = os.environ.get("REDIS_URL", "")
REDIS_PROTECTION_TTL_SECONDS = int(os.environ.get("REDIS_PROTECTION_TTL_SECONDS", "900"))
REDIS_RATE_LIMIT_WINDOW_SECONDS = int(os.environ.get("REDIS_RATE_LIMIT_WINDOW_SECONDS", "60"))
REDIS_RATE_LIMIT_MAX_REQUESTS = int(os.environ.get("REDIS_RATE_LIMIT_MAX_REQUESTS", "10"))
REDIS_ABUSE_COOLDOWN_SECONDS = int(os.environ.get("REDIS_ABUSE_COOLDOWN_SECONDS", "300"))
REDIS_ABUSE_THRESHOLD = int(os.environ.get("REDIS_ABUSE_THRESHOLD", "3"))
REDIS_GUARD_CACHE_TTL_SECONDS = int(os.environ.get("REDIS_GUARD_CACHE_TTL_SECONDS", "600"))
REDIS_QUERY_HELPER_CACHE_TTL_SECONDS = int(
    os.environ.get("REDIS_QUERY_HELPER_CACHE_TTL_SECONDS", "600")
)
REDIS_RETRIEVAL_CACHE_TTL_SECONDS = int(os.environ.get("REDIS_RETRIEVAL_CACHE_TTL_SECONDS", "120"))
REDIS_FINAL_ANSWER_CACHE_ENABLED = os.environ.get(
    "REDIS_FINAL_ANSWER_CACHE_ENABLED", "false"
).lower() in {"1", "true", "yes"}
NVIDIA_API_KEY = os.environ.get("NVIDIA_API_KEY", "")
NVIDIA_API_BASE_URL = os.environ.get("NVIDIA_API_BASE_URL") or "https://integrate.api.nvidia.com/v1"
NVIDIA_GENERATION_MODEL = os.environ.get(
    "NVIDIA_GENERATION_MODEL", "nvidia/llama-3.1-nemotron-nano-8b-v1"
)
NVIDIA_EMBEDDING_MODEL = os.environ.get(
    "NVIDIA_EMBEDDING_MODEL", "nvidia/llama-nemotron-embed-1b-v2"
)
NVIDIA_EMBEDDING_DIMENSIONS = int(os.environ.get("NVIDIA_EMBEDDING_DIMENSIONS", "384"))
NVIDIA_EMBEDDING_BATCH_SIZE = int(os.environ.get("NVIDIA_EMBEDDING_BATCH_SIZE", "16"))
NVIDIA_PROVIDER_TIMEOUT_SECONDS = float(os.environ.get("NVIDIA_PROVIDER_TIMEOUT_SECONDS", "20"))
NVIDIA_RERANK_MODEL = os.environ.get("NVIDIA_RERANK_MODEL", "nvidia/llama-nemotron-rerank-1b-v2")
NVIDIA_RETRIEVAL_API_BASE_URL = (
    os.environ.get("NVIDIA_RETRIEVAL_API_BASE_URL")
    or "https://ai.api.nvidia.com/v1/retrieval/nvidia"
)
NVIDIA_TOPIC_GUARD_MODEL = os.environ.get(
    "NVIDIA_TOPIC_GUARD_MODEL", "nvidia/llama-3.1-nemoguard-8b-topic-control"
)
NVIDIA_SAFETY_GUARD_MODEL = os.environ.get(
    "NVIDIA_SAFETY_GUARD_MODEL", "nvidia/llama-3.1-nemotron-safety-guard-8b-v3"
)
INGESTION_DRY_RUN = os.environ.get("INGESTION_DRY_RUN", "false").lower() in {
    "1",
    "true",
    "yes",
}
