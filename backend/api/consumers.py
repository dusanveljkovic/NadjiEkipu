#
# Napisao Dusan Veljkovic 2023/0417
#
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Chat, Message, User, ActivityParticipant
import logging

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    """
    Klasa zaduzena za slanje i primanje poruka u chetu
    """

    async def connect(self):
        """
        Povezi se na websocket kanal
        """
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"chat_{self.chat_id}"

        self.user = self.scope.get("user")

        if not self.user:
            logger.error(f"User not authenticated for chat {self.chat_id}")
            await self.close()
            return

        if not await self.user_has_access(self.chat_id, self.user.idusers):
            logger.warning(
                f"User {self.user.idusers} attempted to access chat {self.chat_id} without permission"
            )
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()
        logger.info(f"User {self.user.idusers} connected to chat {self.chat_id}")

        messages = await self.get_recent_messages(self.chat_id)
        await self.send(text_data=json.dumps({"type": "history", "messages": messages}))

    async def disconnect(self, close_code):
        """
        Odvezi se sa websocket kanala
        """
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        logger.info(
            f"User {self.user.idusers if self.user else 'Unknown'} disconnected from chat {self.chat_id}"
        )

    async def receive(self, text_data):
        """
        Primi websocket poruku
        """
        try:
            data = json.loads(text_data)
            message_type = data.get("type", "message")

            if message_type == "message":
                message = data.get("message")
                if message and message.strip():
                    # Save message to database
                    saved_message = await self.save_message(
                        self.chat_id, self.user.idusers, message
                    )

                    # Send message to room group
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "chat_message",
                            "message": saved_message["message"],
                            "sender_id": saved_message["sender_id"],
                            "sender_name": saved_message["sender_name"],
                            "sent_at": saved_message["sent_at"],
                            "message_id": saved_message["message_id"],
                        },
                    )

        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received: {text_data}")
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")

    async def chat_message(self, event):
        """
        Posalji poruku na websocket
        """
        await self.send(
            text_data=json.dumps(
                {
                    "type": "message",
                    "message": event["message"],
                    "sender_id": event["sender_id"],
                    "sender_name": event["sender_name"],
                    "sent_at": event["sent_at"],
                    "message_id": event["message_id"],
                }
            )
        )

    @database_sync_to_async
    def user_has_access(self, chat_id, user_id):
        """
        Proveri da li korisnik moze da pristupi ovom chetu
        """
        try:
            chat = Chat.objects.select_related("event_id").get(idchats=chat_id)
            activity = chat.event_id

            if activity.created_by.idusers == user_id:
                return True

            return ActivityParticipant.objects.filter(
                activity_id=activity, user_id=user_id
            ).exists()
        except Chat.DoesNotExist:
            return False

    @database_sync_to_async
    def get_recent_messages(self, chat_id, limit=50):
        """
        Dohvati najskorije poruke iz cheta
        """
        try:
            chat = Chat.objects.get(idchats=chat_id)
            messages = (
                Message.objects.filter(chat_id=chat)
                .select_related("sender_id")
                .order_by("-sent_at")[:limit]
            )

            messages = list(reversed(messages))

            return [
                {
                    "message_id": m.idmessages,
                    "sender_id": m.sender_id.idusers,
                    "sender_name": m.sender_id.username,
                    "message": m.message,
                    "sent_at": m.sent_at.isoformat(),
                }
                for m in messages
            ]
        except Chat.DoesNotExist:
            return []

    @database_sync_to_async
    def save_message(self, chat_id, sender_id, message):
        """
        Sacuvaj poruku u bazi
        """
        try:
            chat = Chat.objects.get(idchats=chat_id)
            user = User.objects.get(idusers=sender_id)

            msg = Message.objects.create(
                chat_id=chat, sender_id=user, message=message.strip()
            )

            return {
                "message_id": msg.idmessages,
                "sender_id": msg.sender_id.idusers,
                "sender_name": msg.sender_id.username,
                "message": msg.message,
                "sent_at": msg.sent_at.isoformat(),
            }
        except (Chat.DoesNotExist, User.DoesNotExist) as e:
            logger.error(f"Error saving message: {str(e)}")
            raise
