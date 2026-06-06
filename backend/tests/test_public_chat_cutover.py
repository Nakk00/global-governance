from __future__ import annotations

import tomllib
from pathlib import Path

from django.test import SimpleTestCase
from django.urls import resolve

from chatbot.views import public_chat


REPO_ROOT = Path(__file__).resolve().parents[2]
SUPABASE_CONFIG = REPO_ROOT / "supabase" / "config.toml"
SUPABASE_FUNCTIONS = REPO_ROOT / "supabase" / "functions"


class PublicChatCutoverTests(SimpleTestCase):
    def test_public_chat_route_resolves_to_django(self):
        match = resolve("/api/chat")

        self.assertIs(match.func, public_chat)
        self.assertEqual(match.url_name, "public-chat")

    def test_supabase_config_does_not_register_public_chat_functions(self):
        config = tomllib.loads(SUPABASE_CONFIG.read_text(encoding="utf-8"))
        configured_functions = config.get("functions", {})

        self.assertNotIn("chat", configured_functions)
        self.assertNotIn("chat-retrieve", configured_functions)

    def test_supabase_public_chat_function_files_are_absent(self):
        retired_paths = (
            SUPABASE_FUNCTIONS / "chat" / "index.ts",
            SUPABASE_FUNCTIONS / "chat-retrieve" / "index.ts",
            SUPABASE_FUNCTIONS / "_shared" / "chat-grounding.ts",
            SUPABASE_FUNCTIONS / "_shared" / "chat-protection.ts",
            SUPABASE_FUNCTIONS / "_shared" / "approved-source-bundle.ts",
        )

        for path in retired_paths:
            with self.subTest(path=path.relative_to(REPO_ROOT)):
                self.assertFalse(path.exists())
