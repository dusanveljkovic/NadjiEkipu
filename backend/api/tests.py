from datetime import datetime, timedelta, timezone

from django.test import TestCase

# Create your tests here.
import jwt
from django.conf import settings

class InterestUnitTest(TestCase):
    def createToken(self):
        payload = {
            "user_id": 2,
            "username": "tigar",
            "role_id": 2,
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
        }

        token = jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        return token
    
    def testCreateInterest(self):
        token = self.createToken()

        response = self.client.post(
            "api/interest",
            {"name": "Pikado"},
            content_type = "application-json",
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

        self.assertEqual(response.status_code, 200)

    def testCreateUserInterest(self):
        token = self.createToken()

        response = self.client.post(
            "api/user-interest",
            {"idusers": "2",
             "id_interest" : "15"},
            content_type = "application-json",
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

        self.assertEqual(response.status_code, 200)

    def testCreatedActivities(self):
        token = self.createToken()

        response = self.client.get(
            "api/activities",
            content_type = "application-json",
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

        self.assertEqual(response.status_code, 200)

        response = self.client.get(
            "api/activities",
            {"id_interest" : "1"},
            content_type = "application-json",
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

        self.assertEqual(response.status_code, 200)