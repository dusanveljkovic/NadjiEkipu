from django.http import JsonResponse
from django.views import View
from ..models import Interest
from ..utils import json_response


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
            interests = Interest.objects.select_related("created_by").all()
            interest_list = [
                {
                    "idinterests": interest.idinterests,
                    "name": interest.name,
                    "description": interest.description,
                    "avatar_id": interest.avatar_id,
                    "created_by": interest.created_by.idusers,
                    "created_at": interest.created_at,
                }
                for interest in interests
            ]
            return json_response(interest_list)
