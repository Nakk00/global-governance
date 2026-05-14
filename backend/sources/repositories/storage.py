from __future__ import annotations

import re
from pathlib import PurePosixPath
from urllib.parse import quote

from django.core.files.uploadedfile import UploadedFile


def build_storage_path(source_id: str, file_name: str) -> str:
    cleaned_name = sanitize_filename(file_name)
    return str(PurePosixPath("stewardship") / "draft" / source_id / cleaned_name)


def sanitize_filename(file_name: str) -> str:
    base_name = PurePosixPath(file_name.replace("\\", "/")).name
    stem = re.sub(r"[^A-Za-z0-9._-]+", "-", base_name).strip(".-")
    return stem or "source-file"


def content_type_for_name(file_name: str) -> str:
    extension = "." + file_name.rsplit(".", 1)[-1].lower() if "." in file_name else ""
    return {
        ".md": "text/markdown",
        ".txt": "text/plain",
        ".pdf": "application/pdf",
        ".csv": "text/csv",
    }.get(extension, "application/octet-stream")


def read_uploaded_bytes(uploaded_file: UploadedFile) -> bytes:
    chunks = [chunk for chunk in uploaded_file.chunks()]
    return b"".join(chunks)


def quoted_csv(values: list[str]) -> str:
    return ",".join(quote(value, safe="") for value in values)


__all__ = [
    "build_storage_path",
    "content_type_for_name",
    "quoted_csv",
    "read_uploaded_bytes",
    "sanitize_filename",
]
