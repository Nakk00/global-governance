from __future__ import annotations

from django.urls import path

from chatbot.views import public_chat

urlpatterns = [
    path("chat", public_chat, name="public-chat"),
]
