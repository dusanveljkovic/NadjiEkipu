"""
Django jedinicni testovi za InterestView.post() - funkcionalnost dodavanja
novog interesovanja (SSU dokument 04).

Pokretanje: python manage.py test api.tests.test_interest_view
"""

from django.test import TestCase, Client
import json

from api.models import User, Role, Interest


class AddInterestViewTests(TestCase):

    def setUp(self):
        self.client = Client()

        self.role_moderator = Role.objects.create(idroles=2, name="Moderator")
        self.role_korisnik = Role.objects.create(idroles=3, name="Korisnik")

        # Moderator nalog koji ce kreirati interesovanje
        self.moderator = User.objects.create(
            username="test_moderator",
            email="moderator@test.com",
            firstname="Test",
            lastname="Moderator",
            birthyear=2000,
            role_id=self.role_moderator,
        )
        self.moderator.set_password("lozinka123")

        # Vec postojece interesovanje u bazi (za test duplikata)
        self.postojece_interesovanje = Interest.objects.create(
            name="Fudbal",
            description="Opis fudbala",
            created_by=self.moderator,
        )

    def _post_interest(self, name, description="Opis testa", avatar_id=1):
        """Helper - salje POST zahtev na endpoint za dodavanje interesovanja."""
        return self.client.post(
            "/api/interests/add-interest/",
            data=json.dumps({
                "name": name,
                "description": description,
                "avatar_id": avatar_id,
            }),
            content_type="application/json",
        )

    # ---------- 4.1 - Uspesno dodavanje (osnovni tok) ----------
    def test_uspesno_kreiranje_interesovanja(self):
        pocetni_broj = Interest.objects.count()

        response = self._post_interest(name="Kosarka", description="Sport sa loptom")

        self.assertEqual(response.status_code, 201,
                          f"Ocekivan status 201, dobijen {response.status_code}. "
                          f"Odgovor: {response.content}")

        self.assertEqual(Interest.objects.count(), pocetni_broj + 1,
                          "Broj interesovanja u bazi treba da se poveca za 1")

        novo = Interest.objects.get(name="Kosarka")
        self.assertEqual(novo.description, "Sport sa loptom")

    def test_odgovor_sadrzi_ispravne_podatke(self):
        response = self._post_interest(name="Tenis")
        data = json.loads(response.content)

        self.assertIn("id", data)
        self.assertEqual(data["name"], "Tenis")

    # ---------- Nedostaje ime (obavezno polje) ----------
    def test_bez_naziva_vraca_gresku(self):
        pocetni_broj = Interest.objects.count()

        response = self._post_interest(name="")

        self.assertEqual(response.status_code, 400,
                          "Prazan naziv treba da vrati 400 Bad Request")
        self.assertEqual(Interest.objects.count(), pocetni_broj,
                          "Interesovanje NE treba da bude kreirano bez naziva")

    # ---------- 4.2 - Interesovanje vec postoji (SSU zahteva gresku, provera da li backend to radi) ----------
    def test_duplikat_naziva_ne_pravi_drugi_zapis_ili_vraca_gresku(self):
        """
        SSU 04 (scenario 2.2.2) trazi da sistem prepozna vec postojeci naziv
        i prikaze gresku. 
        """
        pocetni_broj = Interest.objects.count()

        response = self._post_interest(name="Fudbal")  # isti naziv kao setUp

        self.assertNotEqual(response.status_code, 201,
                             "Kreiranje interesovanja sa vec postojecim nazivom "
                             "ne bi trebalo da uspe (status 201)")
        self.assertEqual(Interest.objects.count(), pocetni_broj,
                          "Ne treba da postoje dva interesovanja sa istim nazivom")

    # ---------- GET liste svih interesovanja ----------
    def test_get_lista_interesovanja(self):
        Interest.objects.create(name="Kosarka2", created_by=self.moderator)

        response = self.client.get("/api/interests/")

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 2)  # Fudbal + Kosarka2

    def test_get_jedno_interesovanje_po_id(self):
        response = self.client.get(f"/api/interests/{self.postojece_interesovanje.idinterests}/")

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["name"], "Fudbal")

    def test_get_nepostojece_interesovanje_vraca_404(self):
        response = self.client.get("/api/interests/999999/")
        self.assertEqual(response.status_code, 404)
