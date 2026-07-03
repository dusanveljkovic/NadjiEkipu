#
# Napisao Dusan Veljkovic 23/0417
#
import json
from django.http import JsonResponse
from django.views import View
from .services.weather_service import WeatherService
from .services.activity_recommender import ActivityRecommender
from .utils import json_response
from .models import Activity


class WeatherView(View):
    def get(self, request):
        """Trenutno vreme za lokaciju (koordinate)"""
        lat = request.GET.get("lat")
        lon = request.GET.get("lon")

        if lat and lon:
            weather_data = WeatherService.get_current_weather(lat, lon)
        else:
            return JsonResponse(
                {"error": "Please provide either city or lat/lon parameters"},
                status=400,
            )

        if not weather_data:
            return JsonResponse({"error": "Could not fetch weather data"}, status=500)

        weather_info = {
            "city": weather_data.get("name"),
            "country": weather_data.get("sys", {}).get("country"),
            "temperature": weather_data.get("main", {}).get("temp"),
            "feels_like": weather_data.get("main", {}).get("feels_like"),
            "humidity": weather_data.get("main", {}).get("humidity"),
            "pressure": weather_data.get("main", {}).get("pressure"),
            "weather_main": weather_data.get("weather", [{}])[0].get("main"),
            "weather_description": weather_data.get("weather", [{}])[0].get(
                "description"
            ),
            "weather_icon": weather_data.get("weather", [{}])[0].get("icon"),
            "wind_speed": weather_data.get("wind", {}).get("speed"),
            "clouds": weather_data.get("clouds", {}).get("all"),
            "lat": weather_data.get("coord", {}).get("lat"),
            "lon": weather_data.get("coord", {}).get("lon"),
        }

        # Get activity recommendations based on weather
        recommendations = ActivityRecommender.get_recommendations(weather_info)

        return json_response(
            {"weather": weather_info, "recommendations": recommendations}
        )


class WeatherForecastView(View):
    def get(self, request):
        """Get weather forecast for a location"""
        lat = request.GET.get("lat")
        lon = request.GET.get("lon")
        days = int(request.GET.get("days", 5))

        if not lat or not lon:
            return JsonResponse(
                {"error": "Please provide lat and lon parameters"}, status=400
            )

        forecast_data = WeatherService.get_forecast(lat, lon, days)

        if not forecast_data:
            return JsonResponse({"error": "Could not fetch forecast data"}, status=500)

        # Process forecast data
        forecasts = []
        for item in forecast_data.get("list", []):
            forecasts.append(
                {
                    "datetime": item.get("dt_txt"),
                    "temperature": item.get("main", {}).get("temp"),
                    "feels_like": item.get("main", {}).get("feels_like"),
                    "humidity": item.get("main", {}).get("humidity"),
                    "weather_main": item.get("weather", [{}])[0].get("main"),
                    "weather_description": item.get("weather", [{}])[0].get(
                        "description"
                    ),
                    "weather_icon": item.get("weather", [{}])[0].get("icon"),
                    "wind_speed": item.get("wind", {}).get("speed"),
                    "pop": item.get("pop", 0),  # Probability of precipitation
                }
            )

        return json_response(
            {
                "city": forecast_data.get("city", {}).get("name"),
                "country": forecast_data.get("city", {}).get("country"),
                "forecasts": forecasts,
            }
        )
