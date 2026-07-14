import time
import uuid

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = "http://localhost:5173"
ADMIN_CREDENTIALS = ("admin", "admin123")
KORISNIK_CREDENTIALS = ("jana", "password123")


# ---------------------------------------------------------------------
# Fixture i pomocne funkcije
# ---------------------------------------------------------------------

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1280,900")
    drv = webdriver.Chrome(options=options)
    drv.implicitly_wait(2)
    yield drv
    drv.quit()


def wait(driver, condition, timeout=10):
    return WebDriverWait(driver, timeout).until(condition)


def login(driver, username, password):
    """Uloguje korisnika preko forme na /login i saceka redirekciju na /home."""
    driver.get(f"{BASE_URL}/login")
    wait(driver, EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='text']")))
    driver.find_element(By.CSS_SELECTOR, "input[type='text']").send_keys(username)
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    wait(driver, EC.url_contains("/home"))


def logout(driver):
    """Brise token iz localStorage-a da bi se mogao ulogovati drugi korisnik."""
    driver.get(BASE_URL)
    driver.execute_script("window.localStorage.clear();")


def accept_confirm(driver, timeout=5):
    wait(driver, EC.alert_is_present(), timeout)
    driver.switch_to.alert.accept()


def register_temp_user(driver):
    """
    Registruje novog, nasumicnog korisnika preko forme na /registration i
    vraca njegovo korisnicko ime. Koristi se da testovi za brisanje/promociju
    ne diraju stvarne naloge iz seed.sql.
    """
    username = f"selenium_{uuid.uuid4().hex[:8]}"

    driver.get(f"{BASE_URL}/registration")
    wait(driver, EC.presence_of_element_located((By.NAME, "username")))

    driver.find_element(By.NAME, "email").send_keys(f"{username}@example.com")
    driver.find_element(By.NAME, "ime").send_keys("Selenium")
    driver.find_element(By.NAME, "prezime").send_keys("Test")
    driver.find_element(By.NAME, "godiste").send_keys("2000")
    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys("password123")
    driver.find_element(By.NAME, "confirmPassword").send_keys("password123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait(driver, EC.url_contains("/login"))
    return username


def user_row(driver, username):
    return driver.find_element(
        By.XPATH,
        f"//span[text()='@{username}']/ancestor::div[contains(@class,'grid-cols-12')]",
    )


# ---------------------------------------------------------------------
# 2.2.1 Pregled korisnika
# ---------------------------------------------------------------------

class TestPregledKorisnika:
    def test_admin_vidi_listu_svih_korisnika(self, driver):
        login(driver, *ADMIN_CREDENTIALS)
        driver.get(f"{BASE_URL}/all-users")

        wait(driver, EC.presence_of_element_located(
            (By.XPATH, "//h1[contains(., 'Svi korisnici')]")
        ))
        rows = driver.find_elements(By.XPATH, "//span[starts-with(text(), '@')]")
        assert len(rows) > 0, "Lista korisnika treba da sadrzi bar jedan red"

    def test_obican_korisnik_ne_moze_na_admin_stranicu(self, driver):
        """AdminRoute.jsx mora da preusmeri korisnika koji nije Admin (role_id != 1)."""
        login(driver, *KORISNIK_CREDENTIALS)
        driver.get(f"{BASE_URL}/all-users")

        wait(driver, EC.url_contains("/home"))
        assert "/all-users" not in driver.current_url

    def test_pretraga_korisnika_filtrira_listu(self, driver):
        login(driver, *ADMIN_CREDENTIALS)
        driver.get(f"{BASE_URL}/all-users")
        wait(driver, EC.presence_of_element_located(
            (By.CSS_SELECTOR, "input[placeholder='Pretraži korisnike...']")
        ))

        search = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Pretraži korisnike...']")
        search.send_keys("ne_postoji_ovakav_korisnik_xyz")
        time.sleep(0.3)  # filtriranje je klijentsko i sinhrono; kratka pauza za render

        message = driver.find_element(
            By.XPATH, "//p[contains(., 'Nema korisnika koji odgovaraju pretrazi')]"
        )
        assert message.is_displayed()


# ---------------------------------------------------------------------
# 2.2.1 Brisanje korisnickog naloga
# ---------------------------------------------------------------------

class TestBrisanjeKorisnika:
    def test_admin_moze_da_obrise_korisnika(self, driver):
        username = register_temp_user(driver)

        login(driver, *ADMIN_CREDENTIALS)
        driver.get(f"{BASE_URL}/all-users")
        search = wait(driver, EC.presence_of_element_located(
            (By.CSS_SELECTOR, "input[placeholder='Pretraži korisnike...']")
        ))
        search.send_keys(username)
        time.sleep(0.3)

        row = wait(driver, lambda d: user_row(d, username))
        row.find_element(By.CSS_SELECTOR, "button[title='Obriši korisnika']").click()
        accept_confirm(driver)

        wait(driver, EC.invisibility_of_element_located(
            (By.XPATH, f"//span[text()='@{username}']")
        ))

    def test_obican_korisnik_ne_bi_trebalo_da_vidi_dugme_za_brisanje(self, driver):
        """
        Frontend proveru (AdminRoute) vec pokriva test iznad; ovaj test
        potvrdjuje da obican korisnik ne moze ni fizicki da dodje do dugmeta
        za brisanje jer stranica /all-users za njega uopste ne postoji.
        """
        login(driver, *KORISNIK_CREDENTIALS)
        driver.get(f"{BASE_URL}/all-users")
        wait(driver, EC.url_contains("/home"))

        delete_buttons = driver.find_elements(By.CSS_SELECTOR, "button[title='Obriši korisnika']")
        assert len(delete_buttons) == 0


# ---------------------------------------------------------------------
# 2.2.2 Pregled i obrada zahteva za moderatora
# ---------------------------------------------------------------------

class TestZahteviZaModeratora:
    def _kreiraj_zahtev_kao_novi_korisnik(self, driver):
        """
        Registruje svezeg korisnika (uvek ima role_id=3 pa vidi dugme za
        zahtev), uloguje ga i klikne na "Zahtev za moderatora" na profilu.
        Vraca korisnicko ime za dalju identifikaciju u admin panelu.
        """
        username = register_temp_user(driver)
        login(driver, username, "password123")

        driver.get(f"{BASE_URL}/my-profile")
        dugme = wait(driver, EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(., 'Zahtev za moderatora')]")
        ))
        dugme.click()
        wait(driver, EC.alert_is_present())
        driver.switch_to.alert.accept()

        logout(driver)
        return username

    def test_admin_vidi_zahtev_za_moderatora(self, driver):
        username = self._kreiraj_zahtev_kao_novi_korisnik(driver)

        login(driver, *ADMIN_CREDENTIALS)
        driver.get(f"{BASE_URL}/requests")

        wait(driver, EC.presence_of_element_located(
            (By.XPATH, f"//span[contains(., '@{username}')]")
        ))

    def test_admin_moze_da_prihvati_zahtev(self, driver):
        username = self._kreiraj_zahtev_kao_novi_korisnik(driver)

        login(driver, *ADMIN_CREDENTIALS)
        driver.get(f"{BASE_URL}/requests")

        row = wait(driver, lambda d: d.find_element(
            By.XPATH,
            f"//span[contains(., '@{username}')]/ancestor::div[contains(@class,'grid-cols-12')]",
        ))
        row.find_element(By.CSS_SELECTOR, "button[title='Prihvati zahtev']").click()
        accept_confirm(driver)

        wait(driver, EC.invisibility_of_element_located(
            (By.XPATH, f"//span[contains(., '@{username}')]")
        ))

        # Korisnik treba sada da ima ulogu Moderator - proveri na njegovom
        # javnom profilu (UserProfilePage prikazuje user.role_name)
        driver.get(f"{BASE_URL}/all-users")
        search = wait(driver, EC.presence_of_element_located(
            (By.CSS_SELECTOR, "input[placeholder='Pretraži korisnike...']")
        ))
        search.send_keys(username)
        time.sleep(0.3)

        user_row(driver, username).find_element(
            By.XPATH, ".//span[contains(@class,'cursor-pointer')][1]"
        ).click()

        role_text = wait(driver, EC.presence_of_element_located(
            (By.XPATH, "//p[contains(@class,'text-gray-700')]")
        ))
        assert "Moderator" in role_text.text

    def test_admin_moze_da_odbije_zahtev(self, driver):
        username = self._kreiraj_zahtev_kao_novi_korisnik(driver)

        login(driver, *ADMIN_CREDENTIALS)
        driver.get(f"{BASE_URL}/requests")

        row = wait(driver, lambda d: d.find_element(
            By.XPATH,
            f"//span[contains(., '@{username}')]/ancestor::div[contains(@class,'grid-cols-12')]",
        ))
        row.find_element(By.CSS_SELECTOR, "button[title='Odbij zahtev']").click()
        accept_confirm(driver)

        wait(driver, EC.invisibility_of_element_located(
            (By.XPATH, f"//span[contains(., '@{username}')]")
        ))

    @pytest.mark.xfail(
        reason=(
            "POZNAT BUG: AdminRequests.jsx (loadData) filtrira samo status "
            "!== 'APPROVED', pa se odbijeni (REJECTED) zahtevi ponovo "
            "pojavljuju u listi posle osvezavanja stranice."
        ),
        strict=False,
    )
    def test_odbijen_zahtev_se_ne_vraca_posle_osvezavanja(self, driver):
        username = self._kreiraj_zahtev_kao_novi_korisnik(driver)

        login(driver, *ADMIN_CREDENTIALS)
        driver.get(f"{BASE_URL}/requests")

        row = wait(driver, lambda d: d.find_element(
            By.XPATH,
            f"//span[contains(., '@{username}')]/ancestor::div[contains(@class,'grid-cols-12')]",
        ))
        row.find_element(By.CSS_SELECTOR, "button[title='Odbij zahtev']").click()
        accept_confirm(driver)
        wait(driver, EC.invisibility_of_element_located(
            (By.XPATH, f"//span[contains(., '@{username}')]")
        ))

        driver.refresh()

        # Ocekivano ponasanje: zahtev ostaje uklonjen i posle refresh-a.
        # Trenutno ponasanje (bug): zahtev se ponovo pojavljuje jer ga
        # filter na frontendu ne iskljucuje po statusu REJECTED.
        elements = driver.find_elements(By.XPATH, f"//span[contains(., '@{username}')]")
        assert len(elements) == 0