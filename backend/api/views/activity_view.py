# Author: Dusan Veljkovic 23/0417

from django.db.models import Count, Q
from django.http import JsonResponse
from django.views import View
from ..models import Activity, ActivityParticipant, Chat, Message
from datetime import timedelta
from ..utils import json_response, parse_json_body, validate_required_fields


class ActivityView(View):
    def get(self, request, activity_id=None):
        if activity_id:
            try:
                activity = (
                    Activity.objects.select_related("interest_id", "created_by")
                    .annotate(num_participants=Count("activityparticipant"))
                    .get(idactivities=activity_id)
                )
                return json_response(
                    {
                        "idactivities": activity.idactivities,
                        "interest_id": activity.interest_id.idinterests,
                        "interest_name": activity.interest_id.name,
                        "created_by": activity.created_by.idusers,
                        "created_by_name": activity.created_by.username,
                        "title": activity.title,
                        "description": activity.description,
                        "event_time": activity.event_time,
                        "lat": float(activity.lat) if activity.lat else None,
                        "lon": float(activity.lon) if activity.lon else None,
                        "location_name": activity.location_name,
                        "max_participants": activity.max_participants,
                        "indoor": activity.indoor,
                        "created_at": activity.created_at,
                        "num_participants": activity.num_participants,
                    }
                )
            except Activity.DoesNotExist:
                return JsonResponse({"error": "Activity not found"}, status=404)
        else:
            activities = (
                Activity.objects.select_related("interest_id", "created_by")
                .annotate(num_participants=Count("activityparticipant"))
                .all()
            )
            activity_list = [
                {
                    "idactivities": a.idactivities,
                    "title": a.title,
                    "interest_name": a.interest_id.name,
                    "created_by_name": a.created_by.username,
                    "created_by_id": a.created_by.idusers,
                    "event_time": a.event_time,
                    "location_name": a.location_name,
                    "max_participants": a.max_participants,
                    "num_participants": a.num_participants,
                }
                for a in activities
            ]
            return json_response(activity_list)

    def post(self, request):
        data = parse_json_body(request)
        required_fields = ["interest_id", "title", "event_time"]
        if not validate_required_fields(data, required_fields):
            return JsonResponse(
                {"error": f"Missing required fields: {required_fields}"}, status=400
            )

        activity = Activity.objects.create(
            interest_id_id=data["interest_id"],
            created_by=request.user,
            title=data["title"],
            description=data.get("description"),
            event_time=data["event_time"],
            lat=data.get("lat"),
            lon=data.get("lon"),
            location_name=data.get("location_name"),
            max_participants=data.get("max_participants"),
            indoor=data.get("indoor", 0),
        )

        # Create chat for the activity
        expires_at = activity.event_time + timedelta(days=7)
        Chat.objects.create(event_id=activity, expires_at=expires_at)

        return json_response(
            {
                "idactivities": activity.idactivities,
                "message": "Activity created successfully",
            },
            status=201,
        )

    def put(self, request, activity_id):
        try:
            activity = Activity.objects.get(idactivities=activity_id)
            data = parse_json_body(request)

            if "title" in data:
                activity.title = data["title"]
            if "description" in data:
                activity.description = data["description"]
            if "event_time" in data:
                activity.event_time = data["event_time"]
            if "location_name" in data:
                activity.location_name = data["location_name"]
            if "max_participants" in data:
                activity.max_participants = data["max_participants"]
            if "indoor" in data:
                activity.indoor = data["indoor"]

            activity.save()
            return json_response({"message": "Activity updated successfully"})
        except Activity.DoesNotExist:
            return JsonResponse({"error": "Activity not found"}, status=404)

    def delete(self, request, activity_id):
        try:
            activity = Activity.objects.get(idactivities=activity_id)
            if request.user.idusers != activity.created_by.idusers:
                return JsonResponse(
                    {"error": "Nemate dozvolu da obriste ovu aktivnost"}, status=403
                )

            ActivityParticipant.objects.filter(activity_id=activity).delete()

            try:
                chat = Chat.objects.get(event_id=activity)
                Message.objects.filter(chat_id=chat).delete()
                chat.delete()
            except Chat.DoesNotExist:
                pass

            activity.delete()
            return json_response({"message": "Activity deleted successfully"})
        except Activity.DoesNotExist:
            return JsonResponse({"error": "Activity not found"}, status=404)


class UserActivityView(View):
    def get(self, request):
        activities = (
            Activity.objects.filter(created_by_id=request.user.idusers)
            .select_related("interest_id", "created_by")
            .annotate(num_participants=Count("activityparticipant"))
            .all()
        )
        activity_list = [
            {
                "idactivities": a.idactivities,
                "title": a.title,
                "interest_name": a.interest_id.name,
                "created_by_name": a.created_by.username,
                "event_time": a.event_time,
                "location_name": a.location_name,
                "max_participants": a.max_participants,
                "num_participants": a.num_participants,
            }
            for a in activities
        ]
        return json_response(activity_list)


class ActivityParticipantsView(View):
    def get(self, request, activity_id):
        try:
            activity = Activity.objects.get(idactivities=activity_id)
            participants = ActivityParticipant.objects.filter(
                activity_id=activity
            ).select_related("user_id")
            participant_list = [
                {
                    "user_id": p.user_id.idusers,
                    "username": p.user_id.username,
                    "joined_at": p.joined_at,
                    "status": p.status,
                }
                for p in participants
            ]
            return json_response(participant_list)
        except Activity.DoesNotExist:
            return JsonResponse({"error": "Activity not found"}, status=404)


class JoinActivityView(View):
    def post(self, request, activity_id):
        try:
            activity = Activity.objects.get(idactivities=activity_id)

            if ActivityParticipant.objects.filter(
                activity_id=activity, user_id=request.user
            ).exists():
                return JsonResponse(
                    {"error": "Already joined this activity"}, status=400
                )

            if activity.max_participants:
                current_count = ActivityParticipant.objects.filter(
                    activity_id=activity
                ).count()
                if current_count >= activity.max_participants:
                    return JsonResponse({"error": "Activity is full"}, status=400)

            participant = ActivityParticipant.objects.create(
                activity_id=activity, user_id=request.user, status=1
            )

            return json_response(
                {"message": "Successfully joined the activity"}, status=201
            )
        except Activity.DoesNotExist:
            return JsonResponse({"error": "Activity not found"}, status=404)


class LeaveActivityView(View):
    def delete(self, request, activity_id):
        try:
            activity = Activity.objects.get(idactivities=activity_id)
            participant = ActivityParticipant.objects.filter(
                activity_id=activity, user_id=request.user
            ).first()

            if participant:
                participant.delete()
                return json_response({"message": "Successfully left the activity"})
            return JsonResponse(
                {"error": "You are not a participant of this activity"}, status=400
            )
        except Activity.DoesNotExist:
            return JsonResponse({"error": "Activity not found"}, status=404)


class JoinedActivitiesView(View):
    def get(self, request):
        activities = ActivityParticipant.objects.filter(
            user_id_id=request.user.idusers
        ).all()
        activity_list = [{"idactivities": a.activity_id_id} for a in activities]
        return json_response(activity_list)
