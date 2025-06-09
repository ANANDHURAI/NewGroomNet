from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .serializers import UserProfileSerializer
from .models import UserProfile
from rest_framework import status

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request):
        try:
            user_profile, created = UserProfile.objects.get_or_create(user=request.user)
            serializer = UserProfileSerializer(user_profile, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Profile GET error: {str(e)}")
            return Response(
                {'error': 'Failed to fetch profile'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        try:
            user_profile, created = UserProfile.objects.get_or_create(user=request.user)
            
            # Handle profile image upload
            if 'profileimage' in request.FILES:
                request.user.profileimage = request.FILES['profileimage']
                request.user.save()
            
            # Handle other profile fields
            serializer = UserProfileSerializer(user_profile, data=request.data, partial=True, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                # Return fresh data to ensure image URL is correct
                updated_serializer = UserProfileSerializer(user_profile, context={'request': request})
                return Response(updated_serializer.data, status=status.HTTP_200_OK)
            else:
                print(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            print(f"Profile PUT error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Failed to update profile: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )