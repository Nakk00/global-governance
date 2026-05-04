from __future__ import annotations

import os
import socket
import sys
from dataclasses import dataclass
from importlib.util import find_spec
from pathlib import Path
from time import sleep
from urllib.parse import urlparse


class RuntimeCheckError(RuntimeError):
    """Raised when backend startup prerequisites are not satisfied."""


@dataclass(frozen=True)
class EnvRequirement:
    key: str
    description: str


REQUIRED_SERVER_ENV = (
    EnvRequirement("DJANGO_SECRET_KEY", "Django signing secret for this backend."),
    EnvRequirement("SUPABASE_URL", "Server-side Supabase API URL."),
    EnvRequirement("SUPABASE_SERVICE_ROLE_KEY", "Server-only Supabase service role key."),
    EnvRequirement("SUPABASE_JWT_ISSUER", "Expected Supabase Auth JWT issuer."),
    EnvRequirement("SUPABASE_JWT_AUDIENCE", "Expected Supabase Auth JWT audience."),
    EnvRequirement("SUPABASE_JWKS_URL", "Supabase Auth JWKS endpoint for token verification."),
)


def load_env_file(path: Path) -> None:
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def validate_required_env() -> None:
    missing = [
        requirement.key
        for requirement in REQUIRED_SERVER_ENV
        if not os.environ.get(requirement.key)
    ]
    if not missing:
        return

    formatted = ", ".join(missing)
    raise RuntimeCheckError(
        "Missing required Django backend environment values: "
        f"{formatted}. Create backend/.env from backend/.env.example "
        "and keep these values server-only."
    )


def validate_python_runtime() -> None:
    if (sys.version_info.major, sys.version_info.minor) < (3, 12):
        raise RuntimeCheckError(
            "The Django backend requires Python 3.12 or newer. "
            "Install Python 3.12 and create the backend virtual environment again."
        )


def validate_backend_dependencies() -> None:
    if find_spec("django") is None:
        raise RuntimeCheckError(
            "Django is not installed for this backend runtime. "
            "Create backend/.venv and run `python -m pip install -r backend/requirements.txt`."
        )


def validate_supabase_service(timeout_seconds: float = 0.5, retries: int = 10) -> None:
    supabase_url = os.environ.get("SUPABASE_URL", "")
    parsed = urlparse(supabase_url)
    try:
        port = parsed.port
    except ValueError as error:
        raise RuntimeCheckError(
            "SUPABASE_URL must include a valid numeric port, for example http://127.0.0.1:54321."
        ) from error

    if not parsed.hostname or not port:
        raise RuntimeCheckError(
            "SUPABASE_URL must include a host and port, for example http://127.0.0.1:54321."
        )

    for attempt in range(retries):
        try:
            with socket.create_connection((parsed.hostname, port), timeout=timeout_seconds):
                return
        except OSError as error:
            if attempt == retries - 1:
                raise RuntimeCheckError(
                    "Local Supabase services are not reachable from Django. "
                    "Run `pnpm supabase:start` before `pnpm backend:dev`."
                ) from error
            sleep(0.5)


def check_backend_prerequisites(*, check_services: bool = True) -> None:
    validate_python_runtime()
    validate_required_env()
    validate_backend_dependencies()
    if check_services:
        validate_supabase_service()
