#
# Napisao Ivan Majer 2023/0406
# Napisao Dusan Veljkovic 2023/0417
#
from urllib.parse import parse_qs
from django.http import JsonResponse
from .models import UserSession
from datetime import datetime, UTC
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
import re


class AuthenticationMiddleware:
    """
    Middleware sasluzan za autentifikaciju korisnika i postavljanje
    request.user i request.token polja
    """

    exempt_urls = [
        r"^/api/auth/login/$",
        r"^/api/auth/register/$",
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self._authenticate(request)
        if response is not None:
            return response
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


@database_sync_to_async
def get_user_from_token(token):
    """
    Pronadji korisnika koristeci njegov token za autentifikaciju
    """
    if not token:
        return AnonymousUser()
    try:
        session = UserSession.objects.get(token=token, expires_at__gt=datetime.now(UTC))
        return session.user_id
    except UserSession.DoesNotExist:
        return AnonymousUser()


class WSAuthMiddleware(BaseMiddleware):
    """
    Middleware sasluzan za autentifikaciju korisnika kada salje websocket poruke.
    Postavlja scope["user"] na korisnika
    """

    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope.get("query_string", b"").decode())
        token = query_string.get("token", [None])[0]
        scope["user"] = await get_user_from_token(token)
        print(scope["user"])
        return await super().__call__(scope, receive, send)


def WSAuthMiddlewareStack(inner):
    return WSAuthMiddleware(AuthMiddlewareStack(inner))
