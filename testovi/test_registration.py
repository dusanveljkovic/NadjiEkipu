"""
Napisala Jana Jolovic 0038/23
test za SSU dokument 01
"""

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

BASE_URL = "http://localhost:5173"

EXISTING_USERNAME = "jana"
EXISTING_EMAIL = "jana@gmail.com"


class RegistrationTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(5)
        self.wait = WebDriverWait(self.driver, 5)

    def tearDown(self):
        self.driver.quit()

    def _open_registration(self):
        self.driver.get(f"{BASE_URL}/registration")

    def _fill_form(self, email, ime, prezime, godiste, username, password, confirm_password):
        self.driver.find_element(By.NAME, "email").send_keys(email)
        self.driver.find_element(By.NAME, "ime").send_keys(ime)
        self.driver.find_element(By.NAME, "prezime").send_keys(prezime)
        Select(self.driver.find_element(By.NAME, "godiste")).select_by_visible_text(str(godiste))
        self.driver.find_element(By.NAME, "username").send_keys(username)
        self.driver.find_element(By.NAME, "password").send_keys(password)
        self.driver.find_element(By.NAME, "confirmPassword").send_keys(confirm_password)

    def _submit(self):
        self.driver.find_element(By.XPATH, "//button[@type='submit' and text()='Registruj se']").click()

    def _unique_value(self, prefix):
        return f"{prefix}_{int(time.time())}"

    # ---------- 1.1 - Uspesna registracija (osnovni tok) ----------
    def test_uspesna_registracija(self):
        self._open_registration()
        unique = self._unique_value("novi")
        self._fill_form(
            email=f"{unique}@example.com",
            ime="Petar",
            prezime="Petrovic",
            godiste=2000,
            username=unique,
            password="Test1234!",
            confirm_password="Test1234!",
        )
        self._submit()

        self.wait.until(EC.url_contains("/login"))
        self.assertIn("/login", self.driver.current_url,
                       "Nakon uspesne registracije korisnik treba da bude preusmeren na /login")

    # ---------- 1.4 - Password i Confirm Password se ne poklapaju ----------
    def test_lozinke_se_ne_poklapaju(self):
        self._open_registration()
        unique = self._unique_value("mismatch")
        self._fill_form(
            email=f"{unique}@example.com",
            ime="Ana",
            prezime="Anic",
            godiste=1999,
            username=unique,
            password="Lozinka1!",
            confirm_password="DrugaLozinka2!",
        )
        self._submit()

        try:
            alert = self.wait.until(EC.alert_is_present())
            alert_text = alert.text
            alert.accept()
        except TimeoutException:
            self.fail("Ocekivan je alert 'Lozinke se ne poklapaju', ali se nije pojavio")

        self.assertIn("ne poklapaju", alert_text.lower(),
                      f"Tekst alerta ('{alert_text}') ne pominje da se lozinke ne poklapaju")

        self.assertIn("/registration", self.driver.current_url)

    # ---------- 1.2 - Korisnicko ime vec postoji ----------
    def test_username_vec_postoji(self):
        self._open_registration()
        unique = self._unique_value("email")
        self._fill_form(
            email=f"{unique}@example.com",     # nov, jedinstven email
            ime="Marko",
            prezime="Markovic",
            godiste=1998,
            username=EXISTING_USERNAME,         # namerno postojece korisnicko ime
            password="Test1234!",
            confirm_password="Test1234!",
        )
        self._submit()

        try:
            alert = self.wait.until(EC.alert_is_present())
            alert.accept()
        except TimeoutException:
            self.fail("Ocekivan je alert sa porukom o gresci (korisnicko ime vec postoji)")

        # Ostaje na formi, korisnik NIJE kreiran
        self.assertIn("/registration", self.driver.current_url)

    # ---------- 1.3 - Email adresa vec postoji ----------
    def test_email_vec_postoji(self):
        self._open_registration()
        unique = self._unique_value("user")
        self._fill_form(
            email=EXISTING_EMAIL,               # namerno postojeci email
            ime="Jovana",
            prezime="Jovanovic",
            godiste=2001,
            username=unique,                    # novo, jedinstveno korisnicko ime
            password="Test1234!",
            confirm_password="Test1234!",
        )
        self._submit()

        try:
            alert = self.wait.until(EC.alert_is_present())
            alert.accept()
        except TimeoutException:
            self.fail("Ocekivan je alert sa porukom o gresci (email vec postoji)")

        self.assertIn("/registration", self.driver.current_url)

    # ---------- 1.5 - Otkazivanje registracije ----------
    def test_otkazivanje_registracije(self):
        self._open_registration()
        self.driver.find_element(By.XPATH, "//button[text()='Cancel']").click()

        self.wait.until(EC.url_contains("/login"))
        self.assertIn("/login", self.driver.current_url,
                       "Otkazivanje treba da vrati korisnika na /login bez kreiranja naloga")


if __name__ == "__main__":
    unittest.main()