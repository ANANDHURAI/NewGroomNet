import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from customersite.models import Booking
from .models import ChatMessage
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from jwt import decode as jwt_decode
from django.conf import settings

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def is_user_in_booking(self, booking, user):
        return booking.customer_id == user.id or booking.barber_id == user.id

    @database_sync_to_async
    def get_booking(self, booking_id):
        try:
            return Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return None

    async def connect(self):
        print("WebSocket: Trying to connect...")

        self.booking_id = self.scope['url_route']['kwargs']['booking_id']
        self.room_group_name = f'chat_{self.booking_id}'
        print(f"WebSocket: Booking ID - {self.booking_id}")

        self.user = AnonymousUser()

        query_string = self.scope.get('query_string', b'').decode()
        print(f"WebSocket: Query string - {query_string}")

        token = None
        if 'token=' in query_string:
            token = query_string.split('token=')[1].split('&')[0]
            print(f"WebSocket: Token found - {token}")

        if token:
            try:
                UntypedToken(token)
                print("WebSocket: Token is valid")

                decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = decoded_data.get("user_id")
                print(f"WebSocket: Decoded user ID - {user_id}")
                
                if user_id:
                    self.user = await database_sync_to_async(User.objects.get)(id=user_id)
                    print(f"WebSocket: User authenticated - ID: {self.user.id}, Name: {self.user.name}, Email: {self.user.email}")
                else:
                    print("WebSocket: User ID not found in token")
                    await self.close(code=4001)
                    return
                    
            except (InvalidToken, TokenError, User.DoesNotExist, Exception) as e:
                print(f"WebSocket: Token validation error: {e}")
                await self.close(code=4001)
                return
        else:
            print("WebSocket: No token provided")
            await self.close(code=4001)
            return

        self.booking = await self.get_booking(self.booking_id)
        if not self.booking:
            print("WebSocket: Booking does not exist")
            await self.close()
            return

        print(f"WebSocket: Booking found - ID: {self.booking.id}, Status: {self.booking.status}")

        authorized = await self.is_user_in_booking(self.booking, self.user)
        if not authorized:
            print("WebSocket: User not authorized for this booking")
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket: Connection accepted and joined group {self.room_group_name}")

    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        print(f"WebSocket: Disconnected with code {close_code} and left group")

    @database_sync_to_async
    def create_chat_message(self, booking, user, message_text):
        return ChatMessage.objects.create(
            booking=booking,
            sender=user,
            message=message_text
        )

    async def receive(self, text_data):
        print(f"WebSocket: Received data - {text_data}")
        try:
            data = json.loads(text_data)
            message_text = data.get('message', '').strip()

            if not message_text:
                print("WebSocket: Empty message, ignoring")
                return

            if self.booking.status in ['COMPLETED', 'CANCELLED']:
                print("WebSocket: Booking is not active")
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Cannot send messages to completed or cancelled bookings'
                }))
                return

            # Create message in database
            message = await self.create_chat_message(
                booking=self.booking,
                user=self.user,
                message_text=message_text
            )
            print(f"WebSocket: Message saved - ID: {message.id}")

            # Prepare message data
            message_data = {
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

            # Send message to room group (all connected clients in this chat)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message_data': message_data
                }
            )
            print("WebSocket: Message broadcast to group")

        except Exception as e:
            print(f"WebSocket: Error in receive - {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Failed to send message'
            }))

    # Receive message from room group
    async def chat_message(self, event):
        message_data = event['message_data']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'data': message_data
        }))
        print("WebSocket: Message sent to client")