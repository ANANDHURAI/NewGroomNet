import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from customersite.models import Booking
from .models import ChatMessage
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from jwt import decode as jwt_decode
from django.conf import settings
import asyncio
import time

User = get_user_model()

# In-memory storage for online users (use this if cache is not working)
ONLINE_USERS = {}

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

    def set_user_online_status(self, booking_id, user_id, is_online):
        """Set user online status in memory"""
        key = f"{booking_id}_{user_id}"
        if is_online:
            ONLINE_USERS[key] = time.time()
            print(f"Memory: Set user {user_id} ONLINE for booking {booking_id}")
        else:
            ONLINE_USERS.pop(key, None)
            print(f"Memory: Set user {user_id} OFFLINE for booking {booking_id}")

    def get_user_online_status(self, booking_id, user_id):
        """Get user online status from memory"""
        key = f"{booking_id}_{user_id}"
        if key in ONLINE_USERS:
            # Check if the status is still valid (within 2 minutes)
            if time.time() - ONLINE_USERS[key] < 120:
                print(f"Memory: User {user_id} is ONLINE for booking {booking_id}")
                return True
            else:
                # Remove expired status
                ONLINE_USERS.pop(key, None)
                print(f"Memory: User {user_id} status EXPIRED for booking {booking_id}")
        
        print(f"Memory: User {user_id} is OFFLINE for booking {booking_id}")
        return False

    def get_other_user_id(self, booking, current_user_id):
        """Get the other user's ID in the booking"""
        if booking.customer_id == current_user_id:
            return booking.barber_id
        return booking.customer_id

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
                    print(f"WebSocket: User authenticated - ID: {self.user.id}, Name: {self.user.name}")
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

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket: Connection accepted and joined group {self.room_group_name}")

        # Set user as online
        await database_sync_to_async(self.set_user_online_status)(
            self.booking_id, self.user.id, True
        )

        # Get other user's online status and broadcast current user's online status
        other_user_id = await database_sync_to_async(self.get_other_user_id)(
            self.booking, self.user.id
        )
        other_user_online = await database_sync_to_async(self.get_user_online_status)(
            self.booking_id, other_user_id
        )

        # Send other user's status to the current user
        await self.send(text_data=json.dumps({
            'type': 'user_status',
            'is_online': other_user_online
        }))
        print(f"WebSocket: Sent other user online status: {other_user_online}")

        # Broadcast current user's online status to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_status_update',
                'user_id': self.user.id,
                'is_online': True
            }
        )
        print("WebSocket: Broadcasted user online status")

        # Start heartbeat to maintain online status
        self.heartbeat_task = asyncio.create_task(self.heartbeat())

    async def disconnect(self, close_code):
        print(f"WebSocket: Starting disconnect process with code {close_code}")
        
        # Cancel heartbeat
        if hasattr(self, 'heartbeat_task'):
            self.heartbeat_task.cancel()
            print("WebSocket: Heartbeat task cancelled")

        # Set user as offline
        if hasattr(self, 'user') and hasattr(self, 'booking_id'):
            await database_sync_to_async(self.set_user_online_status)(
                self.booking_id, self.user.id, False
            )

            # Broadcast user offline status
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_status_update',
                    'user_id': self.user.id,
                    'is_online': False
                }
            )
            print("WebSocket: Broadcasted user offline status")

        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        print(f"WebSocket: Disconnected and left group")

    async def heartbeat(self):
        """Maintain user online status with periodic updates"""
        try:
            while True:
                await asyncio.sleep(30)  # Update every 30 seconds
                await database_sync_to_async(self.set_user_online_status)(
                    self.booking_id, self.user.id, True
                )
                print(f"Heartbeat: Updated online status for user {self.user.id}")
        except asyncio.CancelledError:
            print("Heartbeat: Task cancelled")
            pass

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
            
            # Handle typing indicator
            if data.get('type') == 'typing':
                is_typing = data.get('is_typing', False)
                print(f"WebSocket: Processing typing indicator - User {self.user.id} is_typing: {is_typing}")
                
                # Broadcast typing status to other users in the group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'typing_indicator',
                        'user_id': self.user.id,
                        'is_typing': is_typing
                    }
                )
                print(f"WebSocket: Typing indicator broadcasted to group")
                return

            # Handle regular message
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

            message = await self.create_chat_message(
                booking=self.booking,
                user=self.user,
                message_text=message_text
            )
            print(f"WebSocket: Message saved - ID: {message.id}")

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

    async def chat_message(self, event):
        """Handle chat message events"""
        message_data = event['message_data']
        await self.send(text_data=json.dumps({
            'type': 'message',
            'data': message_data
        }))
        print("WebSocket: Message sent to client")

    async def typing_indicator(self, event):
        """Handle typing indicator events"""
        user_id = event['user_id']
        is_typing = event['is_typing']
        
        print(f"WebSocket: Received typing event - User {user_id}, is_typing: {is_typing}, current_user: {self.user.id}")
        
        # Don't send typing indicator to the sender
        if user_id != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'is_typing': is_typing
            }))
            print(f"WebSocket: Typing indicator sent to client - {is_typing}")
        else:
            print(f"WebSocket: Skipping typing indicator for sender")

    async def user_status_update(self, event):
        """Handle user status update events"""
        user_id = event['user_id']
        is_online = event['is_online']
        
        print(f"WebSocket: Received status event - User {user_id}, is_online: {is_online}, current_user: {self.user.id}")
        
        # Don't send status update to the sender
        if user_id != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_status',
                'is_online': is_online
            }))
            print(f"WebSocket: User status update sent to client - {is_online}")
        else:
            print(f"WebSocket: Skipping status update for sender")