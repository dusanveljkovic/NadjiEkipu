"""
test za SSU dokument 11 - Scenario pregleda profila
"""

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

# Test korisnik koji mora vec postojati u bazi pre pokretanja testova
USERNAME = "jana"
PASSWORD = "password123"
WRONG_OLD_PASSWORD = "netacnalozinka123"

# Korisnik mora imati bar jedno dodato interesovanje da bi testovi
# vezani za listu interesovanja na profilu bili relevantni
EXPECTED_FIRSTNAME = "Jana"


class ProfileTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(5)
        self.wait = WebDriverWait(self.driver, 5)
        self._login(USERNAME, PASSWORD)

    def tearDown(self):
        self.driver.quit()

    # ---------- pomocne metode ----------
    def _login(self, username, password):
        self.driver.get(f"{BASE_URL}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[type='text']").send_keys(username)
        self.driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/home"))

    def _open_profile(self):
        self.driver.get(f"{BASE_URL}/my-profile")

    def _open_password_modal(self):
        self.driver.find_element(By.ID, "promeni-lozinku-btn").click()
        self.wait.until(EC.visibility_of_element_located((By.ID, "old-password-input")))

    def _fill_password_form(self, old_password, new_password, confirm_password):
        self.driver.find_element(By.ID, "old-password-input").send_keys(old_password)
        self.driver.find_element(By.ID, "new-password-input").send_keys(new_password)
        self.driver.find_element(By.ID, "confirm-password-input").send_keys(confirm_password)

    def _submit_password_form(self):
        self.driver.find_element(By.ID, "submit-password-change").click()

    def _accept_alert_if_present(self, timeout=3):
        try:
            WebDriverWait(self.driver, timeout).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            text = alert.text
            alert.accept()
            return text
        except TimeoutException:
            return None

    # ---------- Test 11.1 - Prikaz licnih podataka (osnovni tok, koraci 1-2) ----------
    def test_prikaz_licnih_podataka(self):
        self._open_profile()
        time.sleep(1)

        ime_element = self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//h1"))
        )
        self.assertIn(EXPECTED_FIRSTNAME, ime_element.text,
                       "Ime i prezime korisnika treba da budu prikazani na profilu")

        try:
            self.driver.find_element(By.XPATH, f"//*[contains(text(),'@{USERNAME}')]")
        except NoSuchElementException:
            self.fail("Korisnicko ime nije prikazano na profilu")

        page_text = self.driver.find_element(By.TAG_NAME, "body").text
        self.assertIn("Email", page_text, "Email treba da bude prikazan na profilu")
        self.assertIn("Godište", page_text, "Godiste treba da bude prikazano na profilu")

        # Specifikacija (SSU 11) zahteva i prikaz pola korisnika
        if "Pol" not in page_text:
            self.fail(
                "DEFEKT: specifikacija (SSU 11) zahteva prikaz pola korisnika "
                "na stranici 'Moj profil', a to polje nije prisutno."
            )

    # ---------- Test 11.2 - Prikaz liste interesovanja (osnovni tok, korak 3) ----------
    def test_prikaz_liste_interesovanja(self):
        self._open_profile()
        time.sleep(1)  # ceka asinhrono ucitavanje interesovanja

        empty_state = self.driver.find_elements(
            By.XPATH, "//*[contains(text(),'Nema dodatih interesovanja')]"
        )
        if empty_state:
            self.skipTest(
                f"Korisnik '{USERNAME}' nema dodatih interesovanja - "
                "test zahteva korisnika sa bar jednim interesovanjem"
            )

        page_text = self.driver.find_element(By.TAG_NAME, "body").text
        self.assertIn("Nivo veštine", page_text,
                       "Nivo vestine (skill level) treba da bude prikazan uz svako interesovanje")

    # ---------- Test 11.3 - Otvaranje forme za promenu lozinke ----------
    def test_forma_za_promenu_lozinke_se_otvara(self):
        self._open_profile()
        self._open_password_modal()

        self.assertTrue(self.driver.find_element(By.ID, "old-password-input").is_displayed())
        self.assertTrue(self.driver.find_element(By.ID, "new-password-input").is_displayed())
        self.assertTrue(self.driver.find_element(By.ID, "confirm-password-input").is_displayed())

    # ---------- Test 11.4 - Otkazivanje promene lozinke ----------
    def test_otkazivanje_promene_lozinke(self):
        self._open_profile()
        self._open_password_modal()

        self.driver.find_element(By.XPATH, "//button[text()='Otkazi']").click()

        try:
            self.wait.until(
                EC.invisibility_of_element_located((By.ID, "old-password-input"))
            )
        except TimeoutException:
            self.fail("Forma za promenu lozinke treba da se zatvori nakon klika na 'Otkazi'")

    # ---------- Test 11.5 - Nove lozinke se ne poklapaju ----------
    def test_nove_lozinke_se_ne_poklapaju(self):
        self._open_profile()
        self._open_password_modal()
        self._fill_password_form(PASSWORD, "novaLozinka123", "drugacijaLozinka456")
        self._submit_password_form()

        try:
            error_div = self.wait.until(
                EC.visibility_of_element_located((By.ID, "password-error-message"))
            )
            self.assertIn("poklapaju", error_div.text.lower(),
                           "Poruka o gresci treba da naznaci da se lozinke ne poklapaju")
        except TimeoutException:
            self.fail("Poruka o gresci se ne prikazuje kada se nove lozinke ne poklapaju")

        # Forma ne treba da se zatvori niti da posalje zahtev ka serveru
        self.assertTrue(self.driver.find_element(By.ID, "old-password-input").is_displayed())

    # ---------- Test 11.6 - Neispravna stara lozinka ----------
    def test_neispravna_stara_lozinka(self):
        self._open_profile()
        self._open_password_modal()
        self._fill_password_form(WRONG_OLD_PASSWORD, "novaLozinka123", "novaLozinka123")
        self._submit_password_form()

        try:
            error_div = self.wait.until(
                EC.visibility_of_element_located((By.ID, "password-error-message"))
            )
            self.assertTrue(error_div.is_displayed(),
                             "Poruka o gresci treba da bude prikazana za netacnu staru lozinku")
        except TimeoutException:
            self.fail("Poruka o gresci se ne prikazuje kada je stara lozinka netacna")

    # ---------- Test 11.7 - Uspesna promena lozinke (osnovni tok) ----------
    def test_uspesna_promena_lozinke(self):
        privremena_lozinka = "PrivremenaLoz123"

        self._open_profile()
        self._open_password_modal()
        self._fill_password_form(PASSWORD, privremena_lozinka, privremena_lozinka)
        self._submit_password_form()

        poruka = self._accept_alert_if_present()
        if poruka is None:
            self.fail("Poruka o uspesnoj promeni lozinke nije prikazana")

        try:
            self.wait.until(EC.invisibility_of_element_located((By.ID, "old-password-input")))
        except TimeoutException:
            self.fail("Forma za promenu lozinke treba da se zatvori nakon uspesne promene")

        # Vraca lozinku na staru vrednost da naredna izvrsavanja testova ne bi bila pokvarena
        self._open_password_modal()
        self._fill_password_form(privremena_lozinka, PASSWORD, PASSWORD)
        self._submit_password_form()
        self._accept_alert_if_present()

if __name__ == "__main__":
    unittest.main()