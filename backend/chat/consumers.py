import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from customersite.models import Booking
from .models import ChatMessage

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.booking_id = self.scope['url_route']['kwargs']['booking_id']
        self.user = self.scope.get('user')

        if not self.user or not self.user.is_authenticated:
            await self.close()
            return

        try:
            booking = await sync_to_async(Booking.objects.get)(id=self.booking_id)
            if booking.customer != self.user and booking.barber != self.user:
                await self.close()
                return
        except Booking.DoesNotExist:
            await self.close()
            return

        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_text = data.get('message', '').strip()

            if not message_text:
                return

            booking = await sync_to_async(Booking.objects.get)(id=self.booking_id)
            message = await sync_to_async(ChatMessage.objects.create)(
                booking=booking,
                sender=self.user,
                message=message_text
            )

            await self.send(text_data=json.dumps({
                'type': 'message',
                'data': {
                    'id': message.id,
                    'message': message.message,
                    'sender': {
                        'id': self.user.id,
                        'name': self.user.name,
                        'email': self.user.email
                    },
                    'timestamp': message.timestamp.isoformat(),
                    'is_read': message.is_read
                }
            }))
        except Exception as e:
            print(f"Error in receive: {e}")
