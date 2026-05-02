from django.test import RequestFactory, SimpleTestCase

from common.responses import error_envelope
from common.validation import (
    BoundaryValidationError,
    require_json_content_type,
    validate_json_object,
    validate_request_size,
)


class RequestValidationTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_rejects_wrong_content_type(self):
        request = self.factory.post("/_internal/chat/", data="{}", content_type="text/plain")

        with self.assertRaises(BoundaryValidationError) as context:
            require_json_content_type(request)

        self.assertEqual(context.exception.code, "unsupported_media_type")
        self.assertEqual(context.exception.status, 415)

    def test_rejects_oversized_body(self):
        request = self.factory.post(
            "/_internal/chat/",
            data=b"x" * 17,
            content_type="application/json",
        )

        with self.assertRaises(BoundaryValidationError) as context:
            validate_request_size(request, max_bytes=16)

        self.assertEqual(context.exception.code, "payload_too_large")
        self.assertEqual(context.exception.status, 413)

    def test_rejects_malformed_json_object(self):
        request = self.factory.post(
            "/_internal/chat/",
            data="[1, 2, 3]",
            content_type="application/json",
        )

        with self.assertRaises(BoundaryValidationError) as context:
            validate_json_object(request)

        self.assertEqual(context.exception.code, "invalid_payload")
        self.assertEqual(context.exception.status, 400)

    def test_validation_errors_convert_to_response_envelopes(self):
        error = BoundaryValidationError(
            code="invalid_payload",
            message="Use a JSON object request body.",
            status=400,
        )

        self.assertEqual(
            error.to_envelope(),
            error_envelope(
                code="invalid_payload",
                message="Use a JSON object request body.",
                status=400,
            ),
        )
