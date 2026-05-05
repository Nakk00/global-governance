from __future__ import annotations

from django.urls import path

from validation import views

urlpatterns = [
    path("validation-sets", views.validation_sets, name="admin-validation-sets"),
    path("validation-runs", views.validation_runs, name="admin-validation-runs"),
    path(
        "validation-runs/<str:run_id>",
        views.validation_run_detail,
        name="admin-validation-run-detail",
    ),
]
