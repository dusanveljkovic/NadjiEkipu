"""
SSU 01 (registracija), SSU 02 (login korisnika), SSU 03 (login moderatora).
Pokretanje: python manage.py test api.tests.test_auth_view
"""

from django.test import TestCase, Client
import json

from api.models import User, Role


class LoginViewTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.role_korisnik = Role.objects.create(idroles=3, name="Korisnik")
        self.role_moderator = Role.objects.create(idroles=2, name="Moderator")

        self.user = User.objects.create(
            username="test_korisnik",
            email="korisnik@test.com",
            firstname="Test",
            lastname="Korisnik",
            birthyear=1997,
            role_id=self.role_korisnik,
        )
        self.user.set_password("ispravna_lozinka123")

        self.moderator = User.objects.create(
            username="test_moderator",
            email="moderator@test.com",
            firstname="Test",
            lastname="Moderator",
            birthyear=2000,
            role_id=self.role_moderator,
        )
        self.moderator.set_password("ispravna_lozinka123")

    def _post_login(self, username, password):
        return self.client.post(
            "/api/auth/login/",
            data=json.dumps({"username": username, "password": password}),
            content_type="application/json",
        )

    # ---------- SSU 02 - Login korisnika ----------
    def test_uspesan_login_korisnika(self):
        response = self._post_login("test_korisnik", "ispravna_lozinka123")

        self.assertEqual(response.status_code, 200,
                          f"Ocekivan 200, dobijen {response.status_code}: {response.content}")
        data = json.loads(response.content)
        self.assertIn("token", data, "Odgovor treba da sadrzi 'token'")
        self.assertTrue(len(data["token"]) > 0)

    def test_login_neispravna_lozinka(self):
        response = self._post_login("test_korisnik", "pogresna_lozinka")

        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content)
        self.assertIn("error", data)

    def test_login_nepostojeci_korisnik(self):
        response = self._post_login("ne_postoji_uopste", "bilo_sta")

        self.assertEqual(response.status_code, 401)

    def test_login_bez_username(self):
        response = self._post_login("", "lozinka123")
        self.assertEqual(response.status_code, 400)

    def test_login_bez_password(self):
        response = self._post_login("test_korisnik", "")
        self.assertEqual(response.status_code, 400)

    # ---------- SSU 03 - Login moderatora ----------
    def test_uspesan_login_moderatora(self):
        response = self._post_login("test_moderator", "ispravna_lozinka123")

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn("token", data)

    def test_login_moderator_neispravna_lozinka(self):
        response = self._post_login("test_moderator", "pogresna_lozinka")
        self.assertEqual(response.status_code, 401)


class RegisterViewTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.role_korisnik = Role.objects.create(idroles=3, name="Korisnik")

        self.postojeci_korisnik = User.objects.create(
            username="postojeci_user",
            email="postojeci@test.com",
            firstname="Postojeci",
            lastname="Korisnik",
            birthyear=1990,
            role_id=self.role_korisnik,
        )
        self.postojeci_korisnik.set_password("lozinka123")

    def _post_register(self, email, username, password, confirm_password,
                        ime="Ime", prezime="Prezime", godiste=2000):
        return self.client.post(
            "/api/auth/register/",
            data=json.dumps({
                "email": email,
                "username": username,
                "password": password,
                "confirmPassword": confirm_password,
                "ime": ime,
                "prezime": prezime,
                "godiste": godiste,
            }),
            content_type="application/json",
        )

    # ---------- SSU 01 - Uspesna registracija (osnovni tok) ----------
    def test_uspesna_registracija(self):
        pocetni_broj = User.objects.count()

        response = self._post_register(
            email="novi@test.com",
            username="novi_korisnik",
            password="Test1234!",
            confirm_password="Test1234!",
        )

        self.assertEqual(response.status_code, 201,
                          f"Ocekivan 201, dobijen {response.status_code}: {response.content}")
        self.assertEqual(User.objects.count(), pocetni_broj + 1)

        novi = User.objects.get(username="novi_korisnik")
        self.assertEqual(novi.email, "novi@test.com")
        self.assertTrue(novi.check_password("Test1234!"),
                         "Lozinka treba da bude ispravno hesirana i proveriva")

    # ---------- 1.4 - Lozinke se ne poklapaju ----------
    def test_lozinke_se_ne_poklapaju(self):
        pocetni_broj = User.objects.count()

        response = self._post_register(
            email="mismatch@test.com",
            username="mismatch_user",
            password="Lozinka1!",
            confirm_password="DrugaLozinka2!",
        )

        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content)
        self.assertIn("error", data)
        self.assertEqual(User.objects.count(), pocetni_broj,
                          "Korisnik ne treba da bude kreiran ako se lozinke ne poklapaju")

    # ---------- 1.2 - Korisnicko ime vec postoji ----------
    def test_username_vec_postoji(self):
        pocetni_broj = User.objects.count()

        response = self._post_register(
            email="drugi_email@test.com",
            username="postojeci_user",  # isti kao u setUp
            password="Test1234!",
            confirm_password="Test1234!",
        )

        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content)
        self.assertIn("error", data)
        self.assertEqual(User.objects.count(), pocetni_broj)

    # ---------- 1.3 - Email vec postoji ----------
    def test_email_vec_postoji(self):
        pocetni_broj = User.objects.count()

        response = self._post_register(
            email="postojeci@test.com",  # isti kao u setUp
            username="novi_username_ovde",
            password="Test1234!",
            confirm_password="Test1234!",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.count(), pocetni_broj)

    # ---------- Nedostaju obavezna polja ----------
    def test_registracija_bez_email(self):
        response = self._post_register(
            email="",
            username="korisnik_bez_email",
            password="Test1234!",
            confirm_password="Test1234!",
        )
        self.assertEqual(response.status_code, 400)

    def test_registracija_bez_username(self):
        response = self._post_register(
            email="bezusername@test.com",
            username="",
            password="Test1234!",
            confirm_password="Test1234!",
        )
        self.assertEqual(response.status_code, 400)

    # ---------- Novi korisnik dobija podrazumevanu rolu Korisnik (role_id=3) ----------
    def test_novi_korisnik_dobija_default_rolu(self):
        self._post_register(
            email="rola@test.com",
            username="rola_test_user",
            password="Test1234!",
            confirm_password="Test1234!",
        )
        novi = User.objects.get(username="rola_test_user")
        self.assertEqual(novi.role_id.idroles, 3,
                          "Novoregistrovani korisnik treba da dobije rolu 'Korisnik' (id=3)")
