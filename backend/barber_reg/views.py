from authservice.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ApprovelRequestSerializer, PersonalDetailsSerializer
from rest_framework import status
from .models import BarberRequest
from rest_framework_simplejwt.authentication import JWTAuthentication

class PersonalDetailsView(APIView):
    authentication_classes = [JWTAuthentication]  # Add this
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer_data = {
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'gender': user.gender,
        }
        return Response(serializer_data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PersonalDetailsSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.name = serializer.validated_data['name']
            user.phone = serializer.validated_data['phone']
            user.gender = serializer.validated_data['gender']
            user.user_type = 'barber'
            
            user.save()
            return Response({
                'message': 'Personal details updated successfully',
                'user': {
                    'name': user.name,
                    'email': user.email,
                    'phone': user.phone,
                    'gender': user.gender,
                    'user_type': user.user_type
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ApprovelRequestView(APIView):
    authentication_classes = [JWTAuthentication] 
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            barber_request = BarberRequest.objects.get(user=user)
            return Response({
                'status': barber_request.status,
                'created_at': barber_request.created_at,
                'admin_comment': barber_request.admin_comment
            }, status=status.HTTP_200_OK)
        except BarberRequest.DoesNotExist:
            return Response({'message': 'No approval request found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        user = request.user
        
        if BarberRequest.objects.filter(user=user).exists():
            return Response({'error': 'Request already submitted'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ApprovelRequestSerializer(data=request.data)
        if serializer.is_valid():
            BarberRequest.objects.create(user=user, **serializer.validated_data)
            return Response({'message': 'Documents submitted for approval'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)