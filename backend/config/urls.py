from __future__ import annotations

from django.urls import include, path

from config import api

urlpatterns = [
    path("api/admin/", include("accounts.urls")),
    path("_internal/bootstrap/health/", api.bootstrap_health, name="bootstrap-health"),
    path("_internal/chat/", api.reserved_chat, name="reserved-chat"),
    path("_internal/admin/", api.reserved_admin, name="reserved-admin"),
]

handler404 = api.not_found
handler500 = api.server_error
