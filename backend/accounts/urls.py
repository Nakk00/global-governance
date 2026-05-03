from __future__ import annotations

from django.urls import path

from accounts import views

urlpatterns = [
    path("me", views.admin_me, name="admin-me"),
]
