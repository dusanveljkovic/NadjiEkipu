from django.test import TestCase
from django.db import connection

from api.models import Role, User, Interest, UserInterest, ModeratorRequest

MODELS_IN_CREATE_ORDER = [Role, User, Interest, UserInterest, ModeratorRequest]


class BaseModelTestCase(TestCase):
    """
    Nasledi ovu klasu umesto TestCase u testovima koji koriste Role/User/
    Interest/UserInterest/ModeratorRequest modele.
    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        with connection.schema_editor() as schema_editor:
            for model in MODELS_IN_CREATE_ORDER:
                schema_editor.create_model(model)

    @classmethod
    def tearDownClass(cls):
        with connection.schema_editor() as schema_editor:
            for model in reversed(MODELS_IN_CREATE_ORDER):
                schema_editor.delete_model(model)
        super().tearDownClass()