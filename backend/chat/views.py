from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from customersite.models import Booking
from .models import ChatMessage
from .serializers import ChatMessageSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_messages(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    if booking.customer != request.user and booking.barber != request.user:
        return Response(
            {'error': 'You are not authorized to access this chat'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    messages = ChatMessage.objects.filter(booking=booking).select_related('sender')
    ChatMessage.objects.filter(
        booking=booking,
        is_read=False
    ).exclude(sender=request.user).update(is_read=True)
    
    serializer = ChatMessageSerializer(messages, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)

    if booking.customer != request.user and booking.barber != request.user:
        return Response(
            {'error': 'You are not authorized to send messages to this chat'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    if booking.status in ['COMPLETED', 'CANCELLED']:
        return Response(
            {'error': 'Cannot send messages to completed or cancelled bookings'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    message_text = request.data.get('message', '').strip()
    if not message_text:
        return Response(
            {'error': 'Message cannot be empty'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    message = ChatMessage.objects.create(
        booking=booking,
        sender=request.user,
        message=message_text
    )
    
    serializer = ChatMessageSerializer(message, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_count(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    
    if booking.customer != request.user and booking.barber != request.user:
        return Response(
            {'error': 'You are not authorized to access this chat'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    unread_count = ChatMessage.objects.filter(
        booking=booking,
        is_read=False
    ).exclude(sender=request.user).count()
    
    return Response({'unread_count': unread_count})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_booking_status(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    if booking.customer != request.user and booking.barber != request.user:
        return Response(
            {'error': 'You are not authorized to access this booking'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    return Response({'status': booking.status})