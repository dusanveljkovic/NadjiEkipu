import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings

import os
import django

def generate_token(user):
    payload = {
        "user_id": user.idusers,
        "username": user.username,
        "role_id": user.role_id.idroles,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256"
    )

    return token

if __name__ == "__main__":

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    django.setup()

    class TestUser:
        id = 1
        username = "pera"
        role_id = 1

    user = TestUser()

    token = generate_token(user)
    print(token)