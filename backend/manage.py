#!/usr/bin/env python
"""Django command-line utility for the Global Governance backend."""

from __future__ import annotations

import os
import sys
from pathlib import Path


def main() -> None:
    base_dir = Path(__file__).resolve().parent
    sys.path.insert(0, str(base_dir))
    os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.development"

    from common.env import RuntimeCheckError, check_backend_prerequisites, load_env_file

    load_env_file(base_dir / ".env")
    guarded_commands = {"check", "runserver"}
    if len(sys.argv) > 1 and sys.argv[1] in guarded_commands:
        try:
            check_backend_prerequisites(check_services=sys.argv[1] == "runserver")
        except RuntimeCheckError as error:
            raise SystemExit(str(error)) from error

    try:
        from django.core.management import execute_from_command_line
    except ModuleNotFoundError as error:
        if error.name == "django":
            raise SystemExit(
                "Django is not installed for this backend runtime. "
                "Create backend/.venv and run `python -m pip install -r backend/requirements.txt`."
            ) from error
        raise

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
