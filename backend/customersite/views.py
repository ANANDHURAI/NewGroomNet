from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializer import HomeSerializer
from adminsite.models import CategoryModel , ServiceModel
from profileservice.models import UserProfile
import logging

logger = logging.getLogger(__name__)


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

            # Get or create user profile
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