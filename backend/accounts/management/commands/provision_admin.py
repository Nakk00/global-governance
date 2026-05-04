from __future__ import annotations

from django.core.management.base import BaseCommand, CommandError

from accounts.services import (
    ADMIN_PROFILE_ROLES,
    AdminProfileNotFoundError,
    AdminProfileRepositoryError,
    provision_admin_profile,
    revoke_admin_profile,
)


class Command(BaseCommand):
    help = "Grant, update, or revoke backend-only maintainer access in Supabase admin_profiles."

    def add_arguments(self, parser) -> None:
        parser.add_argument("action", choices=("grant", "update", "revoke"))
        parser.add_argument("--supabase-user-id", required=True)
        parser.add_argument("--email")
        parser.add_argument("--display-name")
        parser.add_argument("--role", choices=ADMIN_PROFILE_ROLES, default="admin")
        parser.add_argument("--inactive", action="store_true")

    def handle(self, *args, **options) -> None:
        action = options["action"]
        supabase_user_id = options["supabase_user_id"]
        try:
            if action == "revoke":
                profile = revoke_admin_profile(supabase_user_id=supabase_user_id)
            else:
                if not options.get("email"):
                    raise CommandError("--email is required for grant and update actions.")
                profile = provision_admin_profile(
                    supabase_user_id=supabase_user_id,
                    email=options["email"],
                    display_name=options.get("display_name"),
                    role=options["role"],
                    is_active=not options["inactive"],
                )
        except AdminProfileNotFoundError as error:
            raise CommandError(str(error)) from error
        except AdminProfileRepositoryError as error:
            raise CommandError("Supabase admin profile operation failed.") from error

        state = "active" if profile.is_active else "inactive"
        summary = (
            f"{action} saved for {profile.email} "
            f"({profile.supabase_user_id}) as {profile.role}, {state}."
        )
        self.stdout.write(self.style.SUCCESS(summary))
