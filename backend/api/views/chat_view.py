# Author: Dusan Veljkovic 23/0417

from django.db.models import Count, Q, Max
from django.http import JsonResponse
from django.views import View
from ..models import Chat, Message, Activity
from datetime import timedelta
from ..utils import json_response, parse_json_body, validate_required_fields


class UserChatsView(View):
    def get(self, request):
        user = request.user

        user_activities = Activity.objects.filter(
            Q(created_by=user) | Q(activityparticipant__user_id=user)
        ).distinct()

        chats = (
            Chat.objects.filter(event_id__in=user_activities)
            .select_related("event_id")
            .annotate(
                last_message_time=Max("message__sent_at"),
                message_count=Count("message"),
            )
            .order_by("-last_message_time")
        )
        chat_list = []
        for chat in chats:
            last_message = (
                Message.objects.filter(chat_id=chat)
                .select_related("sender_id")
                .order_by("-sent_at")
                .first()
            )

            chat_list.append(
                {
                    "chat_id": chat.idchats,
                    "last_message": (
                        {
                            "message": last_message.message if last_message else None,
                            "sent_at": last_message.sent_at if last_message else None,
                            "sender_name": (
                                last_message.sender_id.username
                                if last_message
                                else None
                            ),
                        }
                        if last_message
                        else None
                    ),
                    "activity_title": chat.event_id.title,
                    "message_count": chat.message_count,
                }
            )

        return json_response(chat_list)


class ChatView(View):
    def get(self, request, chat_id):
        try:
            chat = Chat.objects.select_related("event_id").get(idchats=chat_id)

            messages = (
                Message.objects.filter(chat_id=chat)
                .select_related("sender_id")
                .order_by("sent_at")
            )

            message_list = [
                {
                    "message_id": m.idmessages,
                    "sender_id": m.sender_id.idusers,
                    "sender_name": m.sender_id.username,
                    "message": m.message,
                    "sent_at": m.sent_at,
                    "is_own": m.sender_id.idusers == request.user.idusers,
                }
                for m in messages
            ]

            return json_response(
                {
                    "chat_id": chat.idchats,
                    "activity_title": chat.event_id.title,
                    "messages": message_list,
                }
            )
        except Chat.DoesNotExist:
            return JsonResponse({"error": "Chat ne postoji"}, status=404)
