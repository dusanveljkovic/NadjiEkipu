"""
Napisala Jana Jolovic 0038/23
test za SSU dokument 03
"""

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException

BASE_URL = "http://localhost:5173"

MODERATOR_USERNAME = "tigar"
MODERATOR_PASSWORD = "password123"

# Naziv interesovanja koji VEC postoji u bazi (za test 4.2)
EXISTING_INTEREST_NAME = "Fudbal"


class AddInterestTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(5)
        self.wait = WebDriverWait(self.driver, 5)
        self._login(MODERATOR_USERNAME, MODERATOR_PASSWORD)

    def tearDown(self):
        self.driver.quit()

    def _login(self, username, password):
        self.driver.get(f"{BASE_URL}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[type='text']").send_keys(username)
        self.driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/home"))

    def _open_add_interest(self):
        self.driver.get(f"{BASE_URL}/add-interest")

    def _unique_name(self):
        return f"Interesovanje_{int(time.time())}"

    def _select_first_icon(self):
        select_el = self.driver.find_element(By.TAG_NAME, "select")
        select = Select(select_el)
        # index 0 je "Izaberi ikonicu" (prazna opcija), pa biramo index 1
        options = select.options
        if len(options) > 1:
            select.select_by_index(1)

    def _fill_form(self, name, description="Opis za potrebe testa"):
        self._select_first_icon()
        self.driver.find_element(By.CSS_SELECTOR, "input[type='text']").send_keys(name)
        self.driver.find_element(By.TAG_NAME, "textarea").send_keys(description)

    def _submit(self):
        self.driver.find_element(By.XPATH, "//button[@type='submit']").click()

    # ---------- 4.1 - Uspesno dodavanje (osnovni tok) ----------
    def test_uspesno_dodavanje_interesovanja(self):
        self._open_add_interest()
        naziv = self._unique_name()
        self._fill_form(naziv)
        self._submit()

        self.wait.until(EC.url_contains("/my-interests"))
        self.assertIn("/my-interests", self.driver.current_url,
                       "Nakon uspesnog cuvanja treba da se vrati na 'Moja-Interesovanja'")

    # ---------- 4.2 - Interesovanje vec postoji ----------
    def test_interesovanje_vec_postoji(self):
        self._open_add_interest()
        self._fill_form(EXISTING_INTEREST_NAME)
        self._submit()

        time.sleep(1)

        try:
            error_msg = self.driver.find_element(
                By.XPATH, "//*[contains(text(),'postoji') or contains(text(),'greska') "
                           "or contains(text(),'Greska')]"
            )
            self.assertTrue(error_msg.is_displayed())
            self.assertIn("/add-interest", self.driver.current_url,
                           "Korisnik treba da ostane na formi nakon greske")
        except NoSuchElementException:
            self.fail(
                "DEFEKT: nema vidljive poruke o gresci kada interesovanje vec postoji. "
            )

    # ---------- 4.3 - Otkazivanje kreiranja ----------
    def test_otkazivanje_kreiranja(self):
        self._open_add_interest()
        self.driver.find_element(By.XPATH, "//button[text()='Otkaži']").click()

        self.wait.until(EC.url_contains("/my-interests"))
        self.assertIn("/my-interests", self.driver.current_url)

if __name__ == "__main__":
    unittest.main()