#
# Napisao Dusan Veljkovic 2023/0417
#
from ..models import Activity, Interest


class ActivityRecommender:
    """Preporuci aktivnosti prema vremenskim uslovima"""

    # Weather-based activity mapping
    WEATHER_RECOMMENDATIONS = {
        "Clear": {
            "outdoor": ["Running", "Cycling", "Hiking", "Outdoor Sports"],
            "indoor": ["Yoga", "Swimming", "Dancing"],
        },
        "Clouds": {
            "outdoor": ["Running", "Cycling", "Hiking"],
            "indoor": ["Yoga", "Swimming", "Dancing", "Gaming"],
        },
        "Rain": {
            "outdoor": [],
            "indoor": ["Swimming", "Yoga", "Dancing", "Gaming", "Chess"],
        },
        "Thunderstorm": {
            "outdoor": [],
            "indoor": ["Chess", "Gaming", "Art", "Reading"],
        },
        "Snow": {
            "outdoor": ["Hiking", "Running"],
            "indoor": ["Swimming", "Yoga", "Dancing", "Gaming"],
        },
        "Mist": {
            "outdoor": ["Running", "Cycling"],
            "indoor": ["Yoga", "Swimming", "Dancing"],
        },
        "Fog": {"outdoor": [], "indoor": ["Yoga", "Dancing", "Gaming", "Chess"]},
    }

    @classmethod
    def get_recommendations(cls, weather_info):
        """Preporuci aktivnost prema vremenskim uslovima"""
        weather_main = weather_info.get("weather_main", "Clear")
        temperature = weather_info.get("temperature")

        recommended_activities = {"indoor": [], "outdoor": [], "suggestions": []}

        weather_recs = cls.WEATHER_RECOMMENDATIONS.get(
            weather_main, cls.WEATHER_RECOMMENDATIONS["Clear"]
        )

        if temperature is not None:
            if temperature > 30:
                # Unutra ili u vodi
                weather_recs["outdoor"] = [
                    a
                    for a in weather_recs.get("outdoor", [])
                    if a in ["Swimming", "Running"]
                ]
                weather_recs["indoor"] = weather_recs.get("indoor", []) + ["Swimming"]
            elif temperature < 0:
                # Unutra
                weather_recs["outdoor"] = [
                    a
                    for a in weather_recs.get("outdoor", [])
                    if a in ["Running", "Hiking"]
                ]

        # Aktivnosti iz baze
        for category in ["indoor", "outdoor"]:
            interest_names = weather_recs.get(category, [])
            if interest_names:
                activities = Activity.objects.filter(
                    interest_id__name__in=interest_names,
                    indoor=1 if category == "indoor" else 0,
                ).select_related("interest_id")[:5]

                recommended_activities[category] = [
                    {
                        "id": a.idactivities,
                        "title": a.title,
                        "interest": a.interest_id.name,
                        "location": a.location_name,
                        "event_time": a.event_time,
                    }
                    for a in activities
                ]

        suggestions = []
        if weather_main in ["Rain", "Thunderstorm", "Fog"]:
            suggestions.append(
                "🌧️ Vreme nije pogodno za spoljne aktivnosti. Preporučujemo unutrašnje aktivnosti."
            )
        elif weather_main in ["Clear", "Sunny"]:
            suggestions.append(
                "☀️ Savršeno vreme za spoljne aktivnosti! Iskoristite sunčan dan."
            )
        elif weather_main in ["Snow"]:
            suggestions.append(
                "❄️ Zimsko vreme! Uživajte u aktivnostima na svežem vazduhu ili u zatvorenom."
            )

        if temperature is not None:
            if temperature > 30:
                suggestions.append(
                    "🔥 Vruće je! Preporučujemo aktivnosti u hladu ili u zatvorenom prostoru."
                )
            elif temperature < 0:
                suggestions.append(
                    "🥶 Hladno je! Obucite se toplo za spoljne aktivnosti."
                )
            elif 15 <= temperature <= 25:
                suggestions.append("🌤️ Idealna temperatura za sve vrste aktivnosti!")

        recommended_activities["suggestions"] = suggestions
        recommended_activities["weather_summary"] = (
            f"{weather_main}, {temperature}°C" if temperature else weather_main
        )

        return recommended_activities
