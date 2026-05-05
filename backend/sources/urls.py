from __future__ import annotations

from django.urls import path

from sources import views

urlpatterns = [
    path("sources/upload", views.source_upload, name="admin-source-upload"),
    path("sources/<str:source_id>/approve", views.source_approve, name="admin-source-approve"),
    path("sources/<str:source_id>/activate", views.source_activate, name="admin-source-activate"),
    path("sources/<str:source_id>/disable", views.source_disable, name="admin-source-disable"),
    path("sources/<str:source_id>/archive", views.source_archive, name="admin-source-archive"),
    path("sources/<str:source_id>/ingest", views.source_ingest, name="admin-source-ingest"),
    path("sources/<str:source_id>/chunks", views.source_chunks, name="admin-source-chunks"),
    path(
        "sources/<str:source_id>/citations",
        views.source_citations,
        name="admin-source-citations",
    ),
    path("chunks/<str:chunk_id>", views.chunk_detail, name="admin-chunk-detail"),
    path("citations/<str:citation_id>", views.citation_detail, name="admin-citation-detail"),
    path("sources", views.dashboard, name="admin-sources-dashboard"),
    path("sources/<str:source_id>", views.source_detail, name="admin-source-detail"),
    path("ingestion", views.ingestion_runs, name="admin-ingestion-runs"),
    path("validation", views.validation_runs, name="admin-validation-runs"),
    path("audit", views.audit_events, name="admin-audit-events"),
]
