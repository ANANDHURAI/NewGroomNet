import requests
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking, BarberLocation
from barbersite.tasks import send_travel_notification


class StartTravelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        barber_lat = request.data.get('latitude')
        barber_lng = request.data.get('longitude')

        try:
            booking = Booking.objects.get(id=booking_id, barber=request.user)
            
            if booking.status != 'CONFIRMED':
                return Response({'detail': 'Booking must be confirmed to start travel'}, status=400)

            booking.status = 'TRAVELLING'
            booking.travel_started_at = timezone.now()
            booking.save()

            barber_location, created = BarberLocation.objects.get_or_create(
                barber=request.user,
                defaults={
                    'latitude': barber_lat,
                    'longitude': barber_lng,
                    'is_travelling': True,
                    'current_booking': booking
                }
            )
            if not created:
                barber_location.latitude = barber_lat
                barber_location.longitude = barber_lng
                barber_location.is_travelling = True
                barber_location.current_booking = booking
                barber_location.save()

            send_travel_notification.delay(booking.id, 'started')

            return Response({'message': 'Travel started successfully'})

        except Booking.DoesNotExist:
            return Response({'detail': 'Booking not found'}, status=404)
        except Exception as e:
            return Response({'detail': str(e)}, status=500)


class StopTravelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            barber_location = BarberLocation.objects.get(barber=request.user)
            booking = barber_location.current_booking

            if booking:
                booking.status = 'ARRIVED'
                booking.arrived_at = timezone.now()
                booking.save()

            barber_location.is_travelling = False
            barber_location.current_booking = None
            barber_location.save()

            if booking:
                send_travel_notification.delay(booking.id, 'arrived')

            return Response({'message': 'Travel stopped successfully'})

        except BarberLocation.DoesNotExist:
            return Response({'detail': 'No active travel found'}, status=404)
        except Exception as e:
            return Response({'detail': str(e)}, status=500)


class UpdateBarberLocationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        try:
            barber_location = BarberLocation.objects.get(barber=request.user)
            barber_location.latitude = latitude
            barber_location.longitude = longitude
            barber_location.save()

            return Response({'message': 'Location updated successfully'})

        except BarberLocation.DoesNotExist:
            return Response({'detail': 'Barber location not found'}, status=404)


class TravelStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
            
            if booking.status not in ['TRAVELLING', 'ARRIVED']:
                return Response({
                    'travel_status': booking.status.replace('_', ' ').title(),
                    'eta': 'N/A',
                    'distance': 'N/A',
                    'barber_location': None
                })

            barber_location = BarberLocation.objects.filter(barber=booking.barber).first()
            if not barber_location:
                return Response({'detail': 'Barber location not available'}, status=400)

            customer_lat, customer_lng = self.get_address_coordinates(booking.address.full_address)
            if not customer_lat or not customer_lng:
                return Response({'detail': 'Customer address coordinates not available'}, status=400)

            origin = f"{barber_location.latitude},{barber_location.longitude}"
            destination = f"{customer_lat},{customer_lng}"
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
                travel_status = "On the way"
            elif 900 >= duration_seconds > 300:  
                travel_status = "Almost there"
            elif 300 >= duration_seconds > 60:  
                travel_status = "Very close"
            else: 
                travel_status = "Arrived"
                if booking.status != 'ARRIVED':
                    booking.status = 'ARRIVED'
                    booking.arrived_at = timezone.now()
                    booking.save()

            return Response({
                'eta': duration,
                'distance': distance,
                'travel_status': travel_status,
                'barber_location': {
                    'latitude': float(barber_location.latitude),
                    'longitude': float(barber_location.longitude)
                },
                'customer_location': {
                    'latitude': customer_lat,
                    'longitude': customer_lng
                }
            })

        except Booking.DoesNotExist:
            return Response({'detail': 'Invalid booking ID'}, status=404)
        except Exception as e:
            return Response({'detail': str(e)}, status=500)