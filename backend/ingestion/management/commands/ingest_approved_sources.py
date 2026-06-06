from __future__ import annotations

from argparse import ArgumentParser

from django.core.management.base import BaseCommand

from ingestion.services import ingest_approved_sources


class Command(BaseCommand):
    help = "Ingest approved staged sources into private Supabase retrieval storage."

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--source-id",
            action="append",
            dest="source_ids",
            help="Canonical source id to ingest. Repeat to select multiple sources.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Validate and prepare sources with deterministic non-persisted vectors.",
        )

    def handle(self, *args: object, **options: object) -> None:
        source_values = options.get("source_ids")
        source_ids = set(source_values) if isinstance(source_values, list) else None
        dry_run = bool(options.get("dry_run"))
        results = ingest_approved_sources(source_ids=source_ids, dry_run=dry_run)
        mode = "dry-run" if dry_run else "persisted"
        for result in results:
            self.stdout.write(
                self.style.SUCCESS(
                    f"{mode}: {result.document_id} "
                    f"chunks={result.chunk_count} references={result.reference_count} "
                    f"embedding={result.embedding_model}/{result.embedding_dimensions}"
                )
            )
        self.stdout.write(self.style.SUCCESS(f"Processed {len(results)} approved source file(s)."))
