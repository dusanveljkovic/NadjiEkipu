import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time as T

VALID_USERNAME = "tigar"
VALID_PASSWORD = "password123"

class ActivityTest(unittest.TestCase):
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

    def test_user_can_view_created_activities(self):

        self.login()

        self.driver.get(
            "http://localhost:5173/my-activities"
        )


        activities = self.driver.find_elements(
            By.CSS_SELECTOR,
            "[data-testid='activity-card']"
        )


        self.assertGreater(
            len(activities),
            0
        )

    def test_create_activity_flow(self):
        self.login()

        self.driver.get("http://localhost:5173/my-activities")

        # klik na Nova aktivnost
        add_button = self.driver.find_element(
            By.CSS_SELECTOR,
            "[data-testid='add-activity']"
        )
        add_button.click()


        # proveri da je forma otvorena
        create_button = self.driver.find_element(
            By.CSS_SELECTOR,
            "[data-testid='create-activity']"
        )

        self.assertTrue(create_button.is_displayed())


        # popuni naziv
        title = self.driver.find_element(
            By.NAME,
            "title"
        )
        title.send_keys("Test aktivnost")
        print("title:", title.get_attribute("value"))


        # izaberi interesovanje
        select = Select(
            self.driver.find_element(By.NAME, "interest_id")
        )
        select.select_by_index(1)
        print("interest:", select.first_selected_option.get_attribute("value")) 


        # datum
        date = self.driver.find_element(
            By.NAME,
            "date"
        )

        self.driver.execute_script("""
            const input = arguments[0];
            const value = "2026-07-20";

            const setter = Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                "value"
            ).set;

            setter.call(input, value);

            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
        """, date)

        print("date:", date.get_attribute("value"))


        # vreme
        time = self.driver.find_element(
            By.NAME,
            "time"
        )
        time.send_keys("18:00")
        print("time:", time.get_attribute("value"))

        # lokacija
        location = self.driver.find_element(
            By.NAME,
            "location"
        )
        location.send_keys("Beograd")
        print("location:", location.get_attribute("value"))



        # max učesnika
        max_people = self.driver.find_element(
            By.NAME,
            "max_participants"
        )
        max_people.send_keys("10")
        print("max:", max_people.get_attribute("value"))

        desc = self.driver.find_element(
            By.NAME,
            "description"
        )
        desc.send_keys("Kratak opis aktivnosti")
        print("opis:", desc.get_attribute("value"))

        #T.sleep(50)

        # klik kreiraj
        self.driver.find_element(
            By.CSS_SELECTOR,
            "[data-testid='create-activity']"
        ).click()

        # cekaj alert
        alert = WebDriverWait(self.driver, 5).until(
            EC.alert_is_present()
        )

        assert "uspesno kreirana" in alert.text

        alert.accept()

    def test_filter_activities(self):
        self.login()

        self.driver.get("http://localhost:5173/home")

        button = self.driver.find_element(
            By.CSS_SELECTOR,
            "[data-testid='Interest-Fudbal']"
        )
        button.click()

        activities = self.driver.find_elements(
            By.CSS_SELECTOR,
            "[data-testid='aktivnost']"
        )


        self.assertGreater(
            len(activities),
            0
        )
        


if __name__ == "__main__":
    unittest.main()