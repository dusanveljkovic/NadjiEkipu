#
# Napisala Jana Jolovic 0338/2023
#
from django.http import JsonResponse
from django.views import View
from .models import (
    User,
    ModeratorRequest,
)
from .utils import json_response, parse_json_body
from django.utils import timezone
from django.db import connection


class UserView(View):
    def get(self, request, user_id=None):
        """
        Dohvati jednog ili listu svih korisnika
        """
        if user_id:
            try:
                user = User.objects.get(idusers=user_id)
                return json_response(
                    {
                        "idusers": user.idusers,
                        "username": user.username,
                        "email": user.email,
                        "firstname": user.firstname,
                        "lastname": user.lastname,
                        "birthyear": user.birthyear,
                        "role_id": user.role_id.idroles,
                        "role_name": user.role_id.name,
                        "avatar_id": user.avatar_id,
                        "created_at": user.created_at,
                    }
                )
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)
        else:
            users = User.objects.all()
            return json_response(
                [
                    {
                        "idusers": u.idusers,
                        "username": u.username,
                        "email": u.email,
                        "firstname": u.firstname,
                        "lastname": u.lastname,
                        "role_id": u.role_id.idroles,
                        "role_name": u.role_id.name,
                        "avatar_id": u.avatar_id,
                    }
                    for u in users
                ]
            )

    def delete(self, request, user_id):
        """
        Obrisi jednog korisnika i sve njegove zahteve za moderatora, chetove, poruke,
        interesovanja
        """
        try:
            user = User.objects.get(idusers=user_id)
            with connection.cursor() as cursor:
                cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
                cursor.execute("DELETE FROM messages WHERE sender_id = %s", [user_id])
                cursor.execute(
                    "DELETE FROM user_sessions WHERE user_id = %s", [user_id]
                )
                cursor.execute(
                    "DELETE FROM moderator_requests WHERE user_id = %s", [user_id]
                )
                cursor.execute(
                    "DELETE FROM user_interests WHERE user_id = %s", [user_id]
                )
                cursor.execute(
                    "DELETE FROM activity_participants WHERE user_id = %s", [user_id]
                )
                cursor.execute(
                    """
                    DELETE m FROM messages m
                    JOIN chats c ON m.chat_id = c.idchats
                    JOIN activities a ON c.event_id = a.idactivities
                    WHERE a.created_by = %s
                """,
                    [user_id],
                )
                cursor.execute(
                    """
                    DELETE c FROM chats c
                    JOIN activities a ON c.event_id = a.idactivities
                    WHERE a.created_by = %s
                """,
                    [user_id],
                )
                cursor.execute(
                    """
                    DELETE FROM activity_participants WHERE activity_id IN (
                        SELECT idactivities FROM activities WHERE created_by = %s
                    )
                """,
                    [user_id],
                )
                cursor.execute(
                    "DELETE FROM activities WHERE created_by = %s", [user_id]
                )
                cursor.execute("DELETE FROM users WHERE idusers = %s", [user_id])
                cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

            return json_response({"message": "User deleted successfully"})
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)


class ModeratorRequestView(View):
    def get(self, request, request_id=None):
        """
        Dohvati jedan ili listu zahteva za moderatora
        """
        if request_id:
            try:
                mod_request = ModeratorRequest.objects.select_related("user_id").get(
                    idmoderator_requests=request_id
                )
                return json_response(
                    {
                        "id": mod_request.idmoderator_requests,
                        "user_id": mod_request.user_id.idusers,
                        "username": mod_request.user_id.username,
                        "status": mod_request.status,
                        "created_at": mod_request.created_at,
                        "resolved_at": mod_request.resolved_at,
                    }
                )
            except ModeratorRequest.DoesNotExist:
                return JsonResponse({"error": "Request not found"}, status=404)
        else:
            requests = ModeratorRequest.objects.all()
            return json_response(
                [
                    {
                        "id": r.idmoderator_requests,
                        "user_id": r.user_id.idusers,
                        "username": r.user_id.username,
                        "status": r.status,
                        "created_at": r.created_at,
                        "resolved_at": r.resolved_at,
                    }
                    for r in requests
                ]
            )

    def patch(self, request, request_id):
        """
        Promeni status aktivnog zahteva za moderatora
        fields: {
            status: str ("APPROVED" || "REJECTED")
        }
        """
        try:
            mod_request = ModeratorRequest.objects.get(idmoderator_requests=request_id)
            data = parse_json_body(request)
            status = data.get("status")

            if status not in ["APPROVED", "REJECTED"]:
                return JsonResponse({"error": "Invalid status"}, status=400)

            mod_request.status = status
            mod_request.resolved_at = timezone.now()
            mod_request.save()

            if status == "APPROVED":
                User.objects.filter(idusers=mod_request.user_id.idusers).update(
                    role_id=2
                )

            return json_response({"message": "Status updated successfully"})
        except ModeratorRequest.DoesNotExist:
            return JsonResponse({"error": "Request not found"}, status=404)

    def post(self, request):
        """
        Kreiraj zahtev za moderatora za ulogovanog korisnika
        """
        user_id = request.user.idusers

        if ModeratorRequest.objects.filter(user_id=user_id, status="PENDING").exists():
            return JsonResponse(
                {"error": "Već imate poslat zahtev."},
                status=400,
            )

        moderator_request = ModeratorRequest.objects.create(
            user_id_id=user_id,
            status="PENDING",
        )

        return json_response(
            {
                "id": moderator_request.idmoderator_requests,
                "message": "Moderator request created successfully",
            },
            status=201,
        )
