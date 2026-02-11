import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from dashboard.models import ChatMessage
from pick_and_drop.models import PickAndDrop

class GlobalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'global_chat'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        if not message:
            return
            
        user = self.scope['user']
        if not user.is_authenticated:
            return

        chat_msg = await self.save_global_message(user, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': chat_msg.id,
                'message': chat_msg.text,
                'sender': chat_msg.sender.username,
                'sender_name': chat_msg.sender.get_full_name() or chat_msg.sender.username,
                'timestamp': chat_msg.created_at.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_global_message(self, user, text):
        return ChatMessage.objects.create(
            sender=user,
            text=text,
            is_system=False
        )


class TripChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.trip_id = self.scope['url_route']['kwargs']['trip_id']
        self.room_group_name = f'trip_{self.trip_id}'

        if not self.scope['user'].is_authenticated:
            await self.close()
        else:
            # Verify user has access to this trip (driver or dispatcher)
            has_access = await self.check_trip_access(self.scope['user'], self.trip_id)
            if not has_access:
                await self.close()
            else:
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        if not message:
            return
            
        user = self.scope['user']

        chat_msg = await self.save_trip_message(user, message, self.trip_id)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': chat_msg.id,
                'message': chat_msg.text,
                'sender': chat_msg.sender.username,
                'sender_name': chat_msg.sender.get_full_name() or chat_msg.sender.username,
                'timestamp': chat_msg.created_at.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_trip_message(self, user, text, trip_id):
        trip = PickAndDrop.objects.get(id=trip_id)
        return ChatMessage.objects.create(
            sender=user,
            text=text,
            trip=trip,
            is_system=False
        )

    @database_sync_to_async
    def check_trip_access(self, user, trip_id):
        try:
            trip = PickAndDrop.objects.get(id=trip_id)
            if user.is_staff or user.is_superuser:
                return True
            if trip.driver and trip.driver.user == user:
                return True
            return False
        except PickAndDrop.DoesNotExist:
            return False
