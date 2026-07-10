#
# Napisao Ivan Majer 2023/0406
#
import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings

def generate_token(user):
    """
    Generise token sa zadatim poljima koristeci apikey
    Vraca token kao odgovor na uspesan login
    """
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