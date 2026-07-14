"""
test za SSU dokument 10 - Scenario razgovora sa drugim korisnicima
"""

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

# Test korisnik koji mora vec postojati u bazi i biti prijavljen bar na
# jednu AKTIVNU aktivnost koja ima postojeci cet sa bar jednom porukom
CHAT_USERNAME = "jana"
CHAT_PASSWORD = "password123"

# Test korisnik koji NIJE prijavljen ni na jednu aktivnost (za test 10.4 -
# scenario "Korisnik nije prijavljen ni na jednu aktivnost")
NO_CHAT_USERNAME = "admin"
NO_CHAT_PASSWORD = "admin123"


class ChatTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(5)
        self.wait = WebDriverWait(self.driver, 5)

    def tearDown(self):
        self.driver.quit()

    # ---------- pomocne metode ----------
    def _login(self, username, password):
        self.driver.get(f"{BASE_URL}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[type='text']").send_keys(username)
        self.driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/home"))

    def _open_my_chats(self):
        self.driver.get(f"{BASE_URL}/my-chats")

    def _get_chat_links(self):
        # Svaka stavka liste cetova je <a href="/my-chats/<chat_id>">
        return self.driver.find_elements(By.CSS_SELECTOR, "a[href^='/my-chats/']")

    def _open_first_chat(self):
        links = self._get_chat_links()
        if not links:
            self.skipTest(
                f"Korisniku '{CHAT_USERNAME}' ne postoji nijedan aktivan cet - "
                "test zahteva prijavu na aktivnu aktivnost sa postojecim cetom"
            )
        chat_url = links[0].get_attribute("href")
        links[0].click()
        self.wait.until(EC.url_to_be(chat_url))

    def _get_message_input(self):
        return self.wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "textarea"))
        )

    def _get_send_button(self):
        return self.driver.find_element(
            By.XPATH, "//button[.//i[contains(@class,'fa-paper-plane')]]"
        )

    def _send_message(self, text):
        message_input = self._get_message_input()
        message_input.send_keys(text)
        self._get_send_button().click()

    # ---------- Test 10.1 - Pregled liste cetova (osnovni tok, koraci 1-2) ----------
    def test_pregled_liste_cetova(self):
        self._login(CHAT_USERNAME, CHAT_PASSWORD)
        self._open_my_chats()

        try:
            self.wait.until(lambda d: len(self._get_chat_links()) > 0)
        except TimeoutException:
            self.skipTest(
                f"Korisniku '{CHAT_USERNAME}' ne postoji nijedan aktivan cet - "
                "test zahteva prijavu na aktivnu aktivnost sa postojecim cetom"
            )

        chats = self._get_chat_links()
        self.assertGreater(len(chats), 0, "Korisnik prijavljen na aktivnost treba da vidi svoje cetove")

    # ---------- Test 10.2 - Otvaranje cet stranice (osnovni tok, koraci 3-5) ----------
    def test_otvaranje_ceta(self):
        self._login(CHAT_USERNAME, CHAT_PASSWORD)
        self._open_my_chats()
        self._open_first_chat()

        self.assertRegex(
            self.driver.current_url, r"/my-chats/.+",
            "Nakon klika na cet korisnik treba da bude na stranici tog ceta"
        )

        # Naslov ceta (ime aktivnosti) treba da bude prikazan
        try:
            self.driver.find_element(By.XPATH, "//p[contains(@class,'font-medium')]")
        except NoSuchElementException:
            self.fail("Naslov (ime aktivnosti) ceta nije prikazan na stranici ceta")

        # Polje za unos poruke i dugme za slanje moraju biti prisutni
        self._get_message_input()
        try:
            self._get_send_button()
        except NoSuchElementException:
            self.fail("Dugme za slanje poruke nije prisutno na stranici ceta")

    # ---------- Test 10.3 - Slanje poruke (alt. tok "Korisnik salje poruku u cet") ----------
    def test_slanje_poruke(self):
        self._login(CHAT_USERNAME, CHAT_PASSWORD)
        self._open_my_chats()
        self._open_first_chat()

        poruka = f"Test poruka {int(time.time())}"
        self._send_message(poruka)

        try:
            self.wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, f"//div[contains(@class,'rounded-2xl')][contains(., '{poruka}')]")
                )
            )
        except TimeoutException:
            self.fail("Poslata poruka nije postala vidljiva u cetu")

        # Polje za unos treba da bude prazno nakon slanja
        message_input = self._get_message_input()
        self.assertEqual(
            message_input.get_attribute("value"), "",
            "Polje za unos poruke treba da se isprazni nakon slanja"
        )

    # ---------- Test 10.4 - Prazna poruka se ne salje ----------
    def test_prazna_poruka_se_ne_salje(self):
        self._login(CHAT_USERNAME, CHAT_PASSWORD)
        self._open_my_chats()
        self._open_first_chat()

        try:
            broj_poruka_pre = len(self.driver.find_elements(By.CSS_SELECTOR, "div.rounded-2xl"))
        except NoSuchElementException:
            broj_poruka_pre = 0

        self._get_send_button().click()
        time.sleep(1)

        broj_poruka_posle = len(self.driver.find_elements(By.CSS_SELECTOR, "div.rounded-2xl"))
        self.assertEqual(
            broj_poruka_pre, broj_poruka_posle,
            "Ne bi trebalo da se posalje prazna poruka"
        )

    # ---------- Test 10.5 - Korisnik nije prijavljen ni na jednu aktivnost ----------
    def test_korisnik_bez_aktivnih_cetova(self):
        self._login(NO_CHAT_USERNAME, NO_CHAT_PASSWORD)
        self._open_my_chats()

        chats = self._get_chat_links()
        if chats:
            self.skipTest(
                f"Korisnik '{NO_CHAT_USERNAME}' ima aktivne cetove - "
                "test zahteva korisnika bez ijedne prijave na aktivnost"
            )

        try:
            poruka = self.wait.until(
                EC.visibility_of_element_located(
                    (By.XPATH, "//*[contains(text(),'nemate ni jedan aktivan')]")
                )
            )
            self.assertTrue(poruka.is_displayed())
        except TimeoutException:
            self.fail(
                "DEFEKT: kada korisnik nije prijavljen ni na jednu aktivnost, "
                "specifikacija (SSU 10) zahteva poruku "
                "'Trenutno nemate ni jedan aktivan cet', a ona nije prikazana."
            )


if __name__ == "__main__":
    unittest.main()