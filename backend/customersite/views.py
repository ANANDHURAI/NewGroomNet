from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status ,generics
from .serializer import (
HomeSerializer , 
CategorySerializer, 
ServiceSerializer , 
BarberSerializer , 
AvailableSlotSerializer,
AddressSerializer,
BookingCreateSerializer,
)
from adminsite.models import CategoryModel , ServiceModel
from profileservice.models import UserProfile
import logging
from barbersite.models import BarberSlot, BarberService
from django.contrib.auth.models import User
from django.utils import timezone
from profileservice.models import Address
from profileservice.serializers import AddressSerializer
from authservice.models import User
from.models import Booking 
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
logger = logging.getLogger(__name__)
from django.utils import timezone


class Home(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = CategoryModel.objects.filter(is_blocked=False).order_by('-id')
        services = ServiceModel.objects.filter(is_blocked=False).order_by('-id')

        data = {
            'greeting_message': f'Hello, welcome {request.user.name}!',
            'categories': categories,
            'services': services,
        }
        serializer = HomeSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UserLocationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
            user_type = request.data.get('user_type')

            if not latitude or not longitude:
                return Response({
                    'error': 'Latitude and longitude are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                lat = float(latitude)
                lng = float(longitude)
                
                if not (-90 <= lat <= 90):
                    return Response({
                        'error': 'Invalid latitude. Must be between -90 and 90'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if not (-180 <= lng <= 180):
                    return Response({
                        'error': 'Invalid longitude. Must be between -180 and 180'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            except (ValueError, TypeError):
                return Response({
                    'error': 'Invalid latitude or longitude format'
                }, status=status.HTTP_400_BAD_REQUEST)

            profile, created = UserProfile.objects.get_or_create(
                user=request.user,
                defaults={
                    'latitude': lat,
                    'longitude': lng
                }
            )
            
          
            if not created:
                profile.latitude = lat
                profile.longitude = lng
                profile.save(update_fields=['latitude', 'longitude'])

            logger.info(f"Location updated for user {request.user.id}: ({lat}, {lng})")

            return Response({
                'message': 'Location updated successfully',
                'latitude': lat,
                'longitude': lng,
                'user_type': request.user.user_type
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error updating location for user {request.user.id}: {str(e)}")
            return Response({
                'error': 'An error occurred while updating location'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


class CategoryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CategoryModel.objects.filter(is_blocked=False)
    serializer_class = CategorySerializer


class ServiceListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceSerializer
    
    def get_queryset(self):
        category_id = self.request.query_params.get('category_id')
        queryset = ServiceModel.objects.filter(is_blocked=False)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


class BarberListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BarberSerializer
    
    def get_queryset(self):
        service_id = self.request.query_params.get('service_id')
        if not service_id:
            return User.objects.none()
        
        try:
            barber_ids = BarberService.objects.filter(
                service_id=service_id,
                is_active=True
            ).values_list('barber_id', flat=True)
            
            return User.objects.filter(
                id__in=barber_ids,
                user_type='barber',
                is_active=True,
                is_blocked=False
            )
        except Exception as e:
            print(f"Error in BarberListView: {e}")
            return User.objects.none()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_dates(request):
    barber_id = request.query_params.get('barber_id')
    if not barber_id:
        return Response({"error": "barber_id is required"}, status=400)

    dates = BarberSlot.objects.filter(
        barber_id=barber_id,
        is_booked=False,
        date__gte=timezone.now().date()
    ).values_list('date', flat=True).distinct().order_by('date')
    
    return Response({"available_dates": list(dates)})


class AvailableSlotListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AvailableSlotSerializer
    
    def get_queryset(self):
        barber_id = self.request.query_params.get('barber_id')
        date = self.request.query_params.get('date')
        
        if not barber_id or not date:
            return BarberSlot.objects.none()
        
        return BarberSlot.objects.filter(
            barber_id=barber_id,
            date=date,
            is_booked=False
        ).order_by('start_time')


class AddressListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def booking_summary(request):
    service_id = request.data.get('service_id')
    barber_id = request.data.get('barber_id')
    slot_id = request.data.get('slot_id')
    address_id = request.data.get('address_id')
    
    try:
        service = ServiceModel.objects.get(id=service_id)
        barber = User.objects.get(id=barber_id, user_type='barber')
        slot = BarberSlot.objects.get(id=slot_id, is_booked=False)
        address = Address.objects.get(id=address_id, user=request.user)
        
        service_amount = float(service.price)
        platform_fee = round(0.05 * service_amount, 2)
        total_amount = round(service_amount + platform_fee, 2)
        
        summary = {
            'service': {
                'name': service.name,
                'price': float(service.price),
                'duration': service.duration_minutes
            },
            'barber': {
                'name': barber.name,
                'phone': barber.phone
            },
            'slot': {
                'date': slot.date,
                'start_time': slot.start_time,
                'end_time': slot.end_time
            },
            'address': {
                'full_address': f"{address.building}, {address.street}, {address.city}, {address.state} - {address.pincode}",
                'mobile': address.mobile
            },
            'service_amount': service_amount,
            'platform_fee': platform_fee,
            'total_amount': total_amount
        }
        
        print(f"Debug - API Response: {summary}")
        return Response(summary)
        
    except Exception as e:
        print(f"Error in booking_summary: {str(e)}") 
        return Response({"error": str(e)}, status=400)


class BookingCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = BookingCreateSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            logger.error(f"Booking validation failed: {serializer.errors}")
            return Response(
                {
                    "detail": "Validation failed",
                    "errors": serializer.errors
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            booking = serializer.save()
            logger.info(f"Booking created successfully: {booking.id}")
            
            return Response(
                {
                    "detail": "Booking created successfully",
                    "booking_id": booking.id,
                    "success": True,
                    "total_amount": float(booking.total_amount),
                    "payment_method": request.data.get('payment_method')
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Error creating booking: {str(e)}")
            return Response(
                {"detail": "Failed to create booking", "error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BookingSuccessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        booking = Booking.objects.filter(customer=request.user).order_by('-created_at').first()
        if not booking:
            return Response({"detail": "No bookings found"}, status=404)
        payment = getattr(booking, 'payment', None)
        data = {
            "orderid": booking.id,
            "name": booking.customer.name,
            "barbername": booking.barber.name,
            "slottime": f"{booking.slot.start_time} - {booking.slot.end_time}",
            "start_time": str(booking.slot.start_time),
            "end_time": str(booking.slot.end_time),
            "date": str(booking.slot.date),
            "service": booking.service.name,
            "total_amount": str(booking.total_amount),"payment_method": payment.payment_method if payment else "N/A",
            "booking_status": booking.status,
            "booking_type":booking.booking_type
        }
        return Response(data)
    
class BookingHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(customer=request.user).order_by('-created_at')
        data = []
        for b in bookings:
            data.append({
                "id": b.id,
                "service": b.service.name,
                "barbername": b.barber.name,
                "slottime": f"{b.slot.start_time} - {b.slot.end_time}",
                "date": str(b.slot.date),
                "booking_status": b.status
            })
        return Response(data)
    
class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, customer=request.user)
        except Booking.DoesNotExist:
            return Response({"detail": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

        payment = getattr(booking, 'payment', None)
        data = {
            "orderid": booking.id,
            "name": booking.customer.name,
            "barbername": booking.barber.name,
            "slottime": f"{booking.slot.start_time} - {booking.slot.end_time}",
            "start_time": str(booking.slot.start_time),
            "end_time": str(booking.slot.end_time),
            "date": str(booking.slot.date),
            "service": booking.service.name,
            "booking_type": booking.booking_type,
            "total_amount": str(booking.total_amount),
            "payment_method": payment.payment_method if payment else "N/A",
            "booking_status": booking.status,
            "booking_type": booking.booking_type,
        }
        return Response(data)
    
import requests
class TravelStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
            barber_profile = UserProfile.objects.filter(user=booking.barber).first()
            customer_profile = UserProfile.objects.filter(user=request.user).first()

            if not barber_profile or not customer_profile:
                return Response({'detail': 'Location not available'}, status=400)

            origin = f"{barber_profile.latitude},{barber_profile.longitude}"
            destination = f"{customer_profile.latitude},{customer_profile.longitude}"
            api_key = settings.GOOGLE_MAPS_API_KEY

            url = (
                f"https://maps.googleapis.com/maps/api/directions/json"
                f"?origin={origin}&destination={destination}&key={api_key}"
            )
            response = requests.get(url)
            data = response.json()

            if data['status'] != 'OK':
                return Response({'detail': 'Google API error'}, status=500)

            leg = data['routes'][0]['legs'][0]
            distance = leg['distance']['text']
            duration = leg['duration']['text']
            duration_seconds = leg['duration']['value']


            if duration_seconds > 900:
                travel_status = "Barber started"
            elif 900 >= duration_seconds > 300:
                travel_status = "On the way"
            elif 300 >= duration_seconds > 60:
                travel_status = "Almost near"
            else:
                travel_status = "Arrived"

            return Response({
                'eta': duration,
                'distance': distance,
                'travel_status': travel_status
            })

        except Booking.DoesNotExist:
            return Response({'detail': 'Invalid booking ID'}, status=404)
        except Exception as e:
            return Response({'detail': str(e)}, status=500)