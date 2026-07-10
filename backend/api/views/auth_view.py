#
# Napisao Ivan Majer 2023/0406
# Napisao Dusan Veljkovic 2023/0417
#

import secrets
from django.http import JsonResponse
from django.views import View
from ..models import User, UserManager
from datetime import timedelta, datetime, timezone
from ..utils import json_response, parse_json_body
import traceback
import json
from ..services.auth_service import generate_token


class LoginView(View):
    def post(self, request):
        """
        Uloguj korisnika
        fields: {
            username: str,
            password: str
        }
        """
        data = parse_json_body(request)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({"error": "Missing fields"}, status=400)

        try:
            user = User.objects.get(username=username)

            if not user.check_password(password):
                return JsonResponse({"error": "Nevalidni kredencijali"}, status=401)

            auth_token = generate_token(user)

            return json_response(
                {
                    "token": auth_token,
                }
            )

        except User.DoesNotExist:
            return JsonResponse({"error": "Nevalidni kredencijali"}, status=401)
        except Exception as e:
            print(traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=500)


class RegisterView(View):

    def post(self, request):
        """
        Registruj korisnika
        fields: {
            email: str,
            username: str,
            password: str,
            confirm_password: str,
            godiste: int,
            firstname: str,
            lastname: str
        }
        """
        try:
            data = json.loads(request.body)

            email = data.get("email")
            username = data.get("username")
            password = data.get("password")
            confirm_password = data.get("confirmPassword")
            godiste = data.get("godiste")
            firstname = data.get("ime")
            lastname = data.get("prezime")

            if not email or not username or not password:
                return JsonResponse({"error": "Missing fields"}, status=400)

            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                firstname=firstname,
                lastname=lastname,
                birthyear=godiste,
            )

            return JsonResponse(
                {"message": "User created successfully", "user_id": user.pk}, status=201
            )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
