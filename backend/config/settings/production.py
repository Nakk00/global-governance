import os

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403


def _required_env(key: str) -> str:
    value = os.environ.get(key, "").strip()
    if not value:
        raise ImproperlyConfigured(f"{key} must be set for production deployments.")
    return value


def _required_csv_env(key: str) -> list[str]:
    values = [value.strip() for value in os.environ.get(key, "").split(",") if value.strip()]
    if not values:
        raise ImproperlyConfigured(f"{key} must include at least one production host.")
    return values


def _optional_csv_env(key: str) -> list[str]:
    return [value.strip() for value in os.environ.get(key, "").split(",") if value.strip()]


DEBUG = False
SECRET_KEY = _required_env("DJANGO_SECRET_KEY")
ALLOWED_HOSTS = _required_csv_env("DJANGO_ALLOWED_HOSTS")
CSRF_TRUSTED_ORIGINS = _optional_csv_env("DJANGO_CSRF_TRUSTED_ORIGINS")

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
