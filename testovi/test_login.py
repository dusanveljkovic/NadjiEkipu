"""
Napisala Jana Jolovic 0038/23
test za SSU dokument 02
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
VALID_USERNAME = "jana"
VALID_PASSWORD = "password123"
INVALID_PASSWORD = "123"


class LoginTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(5)
        self.wait = WebDriverWait(self.driver, 5)

    def tearDown(self):
        self.driver.quit()

    def _open_login(self):
        self.driver.get(f"{BASE_URL}/login")

    def _fill_login_form(self, username, password):
        username_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        username_input.clear()
        username_input.send_keys(username)
        password_input.clear()
        password_input.send_keys(password)

    def _submit(self):
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    # ---------- Test 2.1 - Uspesan login (osnovni tok) ----------
    def test_uspesan_login(self):
        self._open_login()
        self._fill_login_form(VALID_USERNAME, VALID_PASSWORD)
        self._submit()

        # Ceka da se URL promeni na /home nakon uspesnog logina
        self.wait.until(EC.url_contains("/home"))
        self.assertIn("/home", self.driver.current_url,
                       "Nakon uspesnog logina korisnik treba da bude na /home")

    # # ---------- Test 2.2 - Neispravni kredencijali ----------
    def test_neispravni_kredencijali(self):
        self._open_login()
        self._fill_login_form(VALID_USERNAME, INVALID_PASSWORD)
        self._submit()

        try:
            error_div = self.wait.until(
                EC.visibility_of_element_located((By.ID, "login-error-message"))
            )
            self.assertTrue(error_div.is_displayed(), "Poruka o gresci treba da bude prikazana")
        except TimeoutException:
            self.fail("Poruka o gresci se ne prikazuje pri neispravnim kredencijalima")

        self.assertIn("/", self.driver.current_url,
                    "Korisnik ne bi trebalo da bude preusmeren nakon neuspesnog logina")

    # ---------- Test - prazna polja  ----------
    def test_prazna_polja_ne_saljs_formu(self):
        self._open_login()
        self._submit()  # ne popunjava nista

        # Zbog 'required' atributa na inputima, browser ne bi trebalo da dozvoli submit
        # pa URL treba da ostane na /login
        time.sleep(0.5)
        self.assertIn("/login", self.driver.current_url,
                       "Forma ne bi trebalo da se posalje sa praznim obaveznim poljima")


if __name__ == "__main__":
    unittest.main()