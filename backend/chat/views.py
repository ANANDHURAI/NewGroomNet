from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from customersite.models import Booking
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from rest_framework.views import APIView
from django.db.models import Q

class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id)

        # Check if user has access to this booking
        if booking.customer != request.user and booking.barber != request.user:
            return Response(
                {'error': 'You do not have access to this chat'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        messages = ChatMessage.objects.filter(
            booking=booking
        ).select_related('sender').order_by('timestamp')
        
        # Mark messages as read (exclude sender's own messages)
        ChatMessage.objects.filter(
            booking=booking,
            is_read=False
        ).exclude(sender=request.user).update(is_read=True)
    
        serializer = ChatMessageSerializer(messages, many=True, context={'request': request})
        
        booking_info = {
            'id': booking.id,
            'customer_name': booking.customer.name,
            'barber_name': booking.barber.name,
            'service_name': booking.service.name,
            'status': booking.status,
            'booking_date': booking.slot.date,
            'booking_time': booking.slot.start_time,
            'current_user_id': request.user.id  # Add current user ID
        }
        
        return Response({
            'messages': serializer.data,
            'booking_info': booking_info
        })
    
    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id)
        
 
        if booking.customer != request.user and booking.barber != request.user:
            return Response(
                {'error': 'You do not have access to this chat'}, 
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
            {'error': 'You do not have access to this chat'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    unread_count = ChatMessage.objects.filter(
        booking=booking,
        is_read=False
    ).exclude(sender=request.user).count()
    
    return Response({'unread_count': unread_count})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_booking_info(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    
    if booking.customer != request.user and booking.barber != request.user:
        return Response(
            {'error': 'You do not have access to this booking'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    other_user = booking.barber if request.user == booking.customer else booking.customer
    
    booking_info = {
        'id': booking.id,
        'other_user': {
            'id': other_user.id,
            'name': other_user.name,
            'profile_image': request.build_absolute_uri(other_user.profileimage.url) if other_user.profileimage else None
        },
        'service_name': booking.service.name,
        'service_price': booking.service.price,
        'status': booking.status,
        'created_at': booking.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'booking_date': booking.slot.date,  
        'booking_time': booking.slot.start_time,
        'current_user_id': request.user.id 
    }
    return Response(booking_info, status=status.HTTP_200_OK)
