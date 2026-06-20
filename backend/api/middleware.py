from django.http import JsonResponse
from .models import UserSession, User
from datetime import datetime, UTC
import re


class AuthenticationMiddleware:
    exempt_urls = [
        r"^/api/auth/login/$",
        r"^/api/auth/register/$",
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        self._authenticate(request)
        return self.get_response(request)

    def _authenticate(self, request):
        for exempt_url in self.exempt_urls:
            if re.match(exempt_url, request.path):
                return None
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Bad authorizaion header"}, status=401)

        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return JsonResponse({"error": "Bad authorizaion header"}, status=401)

        try:
            session = UserSession.objects.get(
                token=token, expires_at__gt=datetime.now(UTC)
            )
            request.user = session.user_id
            request.token = token
            return None
        except UserSession.DoesNotExist:
            return JsonResponse({"error": "Invalid or expired token"}, status=401)
