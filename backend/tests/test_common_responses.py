from django.test import SimpleTestCase

from common.responses import (
    error_envelope,
    exception_to_error_envelope,
    success_envelope,
)


class ResponseEnvelopeTests(SimpleTestCase):
    def test_success_envelope_has_stable_shape(self):
        envelope = success_envelope({"status": "ready"}, meta={"service": "django"})

        self.assertEqual(
            envelope,
            {
                "success": True,
                "data": {"status": "ready"},
                "error": None,
                "meta": {"service": "django"},
            },
        )

    def test_error_envelope_uses_user_safe_fields(self):
        envelope = error_envelope(
            code="invalid_json",
            message="Use a valid JSON request body.",
            status=400,
            details={"field": "body"},
        )

        self.assertFalse(envelope["success"])
        self.assertIsNone(envelope["data"])
        self.assertEqual(envelope["error"]["code"], "invalid_json")
        self.assertEqual(envelope["error"]["message"], "Use a valid JSON request body.")
        self.assertEqual(envelope["error"]["status"], 400)
        self.assertNotIn("traceback", envelope["error"])

    def test_unexpected_exceptions_convert_to_safe_envelopes(self):
        envelope = exception_to_error_envelope(RuntimeError("database secret leaked"))

        self.assertFalse(envelope["success"])
        self.assertEqual(envelope["error"]["code"], "internal_error")
        self.assertEqual(envelope["error"]["message"], "The backend could not complete the request.")
        self.assertNotIn("database secret leaked", str(envelope))
