from __future__ import annotations

from django.urls import include, path

from chatbot.views import public_chat
from config import api

urlpatterns = [
    # Vercel Services strip the service routePrefix before Django receives the path.
    path("", include("chatbot.urls")),
    path("admin/", include("accounts.urls")),
    path("admin/", include("sources.urls")),
    path("admin/", include("validation.urls")),
    path("api/", include("chatbot.urls")),
    path("api/admin/", include("accounts.urls")),
    path("api/admin/", include("sources.urls")),
    path("api/admin/", include("validation.urls")),
    path("_internal/bootstrap/health/", api.bootstrap_health, name="bootstrap-health"),
    path("_internal/chat/", public_chat, name="reserved-chat"),
    path("_internal/admin/", api.reserved_admin, name="reserved-admin"),
]

handler404 = api.not_found
handler500 = api.server_error
