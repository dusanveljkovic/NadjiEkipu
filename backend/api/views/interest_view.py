from django.db.models import Count
from django.http import JsonResponse
from django.views import View
from ..models import Interest, UserInterest
from ..utils import json_response, parse_json_body


class InterestView(View):
    def get(self, request, interest_id=None):
        if interest_id:
            try:
                interest = Interest.objects.select_related("created_by").get(
                    idinterests=interest_id
                )
                return json_response(
                    {
                        "idinterests": interest.idinterests,
                        "name": interest.name,
                        "description": interest.description,
                        "avatar_id": interest.avatar_id,
                        "created_by": interest.created_by.idusers,
                        "created_at": interest.created_at,
                    }
                )
            except Interest.DoesNotExist:
                return JsonResponse({"error": "Interest not found"}, status=404)
        else:
            interests = (
                Interest.objects.select_related("created_by")
                .annotate(members=Count("userinterest"))
                .all()
            )
            interest_list = [
                {
                    "idinterests": interest.idinterests,
                    "name": interest.name,
                    "description": interest.description,
                    "avatar_id": interest.avatar_id,
                    "created_by": interest.created_by.idusers,
                    "created_at": interest.created_at,
                    "members": interest.members,
                }
                for interest in interests
            ]
            return json_response(interest_list)

    def post(self, request):
        data = parse_json_body(request)

        name = data.get("name")
        description = data.get("description")

        if not name:
            return json_response(
                {"error": "Name is required"},
                status=400
            )

        interest = Interest.objects.create(
            name=name,
            description=description,
            created_by=request.user
        )

        return json_response(
            {
                "id": interest.idinterests,
                "name": interest.name,
                "description": interest.description
            },
            status=201
        )


class UserInterestsView(View):
    def get(self, request):
        user_interests = (
            UserInterest.objects.filter(user_id=request.user.idusers)
            .select_related("user_id", "interest_id")
            .all()
        )
        user_interests_list = [
            {
                "iduser_interests": a.iduser_interests,
                "idinterests": a.interest_id.idinterests,
                "name": a.interest_id.name,
                "avatar_id": a.interest_id.avatar_id,
                "skill_level": a.skill_level,
            }
            for a in user_interests
        ]
        return json_response(user_interests_list)

    def post(self, request):
        data = parse_json_body(request)
        if not UserInterest.objects.filter(
            user_id=request.user, interest_id=data["interest_id"]
        ):
            ui = UserInterest.objects.create(
                user_id=request.user,
                interest_id_id=data["interest_id"],
                skill_level=data.get("skill_level", 0),
                attended_count=0,
            )

            return json_response({"iduser_interests": ui.iduser_interests}, status=201)

    def put(self, request, user_interest_id):
        try:
            ui = UserInterest.objects.get(
                iduser_interests=user_interest_id, user_id=request.user
            )

            data = parse_json_body(request)

            if "skill_level" in data:
                ui.skill_level = data["skill_level"]
            if "attended_count" in data:
                ui.attended_count = data["attended_count"]

            ui.save()
            return json_response({"message": "Usepsno sacuvano"})
        except UserInterest.DoesNotExist:
            return JsonResponse(
                {"error": "Interesovanje korisnika ne postoji"}, status=404
            )

    def delete(self, request, user_interest_id):
        try:
            ui = UserInterest.objects.get(
                iduser_interests=user_interest_id, user_id=request.user
            )
            ui.delete()
            return json_response({"message": "Usepsno obrisano"})
        except UserInterest.DoesNotExist:
            return JsonResponse(
                {"error": "Interesovanje korisnika ne postoji"}, status=404
            )
