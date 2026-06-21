# Author: Dusan Veljkovic 23/0417

import secrets
from django.http import JsonResponse
from django.views import View
from ..models import User, UserSession
from datetime import timedelta, datetime, UTC
from ..utils import json_response, parse_json_body


class LoginView(View):
    def post(self, request):
        data = parse_json_body(request)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "Korisnicko ime i sifra su obavezni"}, status=400
            )

        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                token = secrets.token_urlsafe(32)
                expires_at = datetime.now(UTC) + timedelta(days=7)

                session = UserSession.objects.create(
                    user_id=user, token=token, expires_at=expires_at
                )

                return json_response(
                    {
                        "token": token,
                        "user": {
                            "idusers": user.idusers,
                            "username": user.username,
                            "email": user.email,
                            "firstname": user.firstname,
                            "lastname": user.lastname,
                            "role_id": user.role_id.idroles,
                            "birthyear": user.birthyear,
                        },
                        "expires_at": expires_at,
                    }
                )
            else:
                return JsonResponse({"error": "Nevalidni kredencijali"}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "Nevalidni kredencijali"}, status=401)


class LogoutView(View):
    def post(self, request):
        if hasattr(request, "token"):
            UserSession.objects.filter(token=request.token).delete()
        return json_response({"message": "Korisnik uspesno odjavljen"})
