#
# Napisao Dusan Veljkovic 2023/0417
#
import requests
from django.conf import settings
from django.core.cache import cache


class WeatcherService:
    """Klasa zaduzena sa integraciju sa openweather API-jem"""

    BASE_URL = "https://api.openweathermap.org/data/2.5"

    @classmethod
    def get_current_weather(cls, lat, lon, units="metric"):
        """Trenutna vremenska prognoza za koordinate"""
        cache_key = f"weather_{lat}_{lon}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return cached_data

        try:
            response = requests.get(
                f"{cls.BASE_URL}/weather",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": settings.OPENWEATHER_API_KEY,
                    "units": units,
                },
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()

            cache.set(cache_key, data, 600)
            return data
        except requests.exceptions.RequestException as e:
            print("Weather error " + e)
            return None

    @classmethod
    def get_forecast(cls, lat, lon, days=5, units="metric"):
        """Vremenska prognoza za sledece dane za koordinater"""
        cache_key = f"forecast_{lat}_{lon}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return cached_data

        try:
            response = requests.get(
                f"{cls.BASE_URL}/forecast",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": settings.OPENWEATHER_API_KEY,
                    "units": units,
                    "cnt": days * 8,
                },
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()

            cache.set(cache_key, data, 1800)
            return data
        except requests.exceptions.RequestException as e:
            print("Weather error " + e)
            return None
