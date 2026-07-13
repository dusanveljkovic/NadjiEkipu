import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time as T

VALID_USERNAME = "tigar"
VALID_PASSWORD = "password123"

class InterestTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.driver.implicitly_wait(5)
        self.wait = WebDriverWait(self.driver, 5)
        

    def tearDown(self):
        self.driver.quit()

    def login(self):
        self.driver.get("http://localhost:5173/login")
        username_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        username_input.clear()
        username_input.send_keys(VALID_USERNAME)
        password_input.clear()
        password_input.send_keys(VALID_PASSWORD)

        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        WebDriverWait(self.driver, 5).until(EC.url_contains("home"))

    def test_user_changes_interests(self):
        self.login()

        self.driver.get(
            "http://localhost:5173/my-interests"
        )

        add_button = self.driver.find_element(
            By.CSS_SELECTOR,
            "[data-testid='interest-15']"
        )
        add_button.click()

        T.sleep(10)

        interests = self.driver.find_elements(
            By.CSS_SELECTOR,
            "[data-testid='Interest-15']"
        )

        self.assertGreater(
            len(interests),
            0
        )

if __name__ == "__main__":
    unittest.main()