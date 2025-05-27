from authservice.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import BarberLoginSerliasers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.authentication import JWTAuthentication

class BarberLoginView(APIView):
    def post(self, request):
        serializer = BarberLoginSerliasers(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)
            
            if user and user.user_type == 'barber':
                if user.is_blocked:
                    return Response({"error": "User is blocked"}, status=status.HTTP_403_FORBIDDEN)
                
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                        'user_type': user.user_type,
                        'phone': user.phone,
                        'gender': user.gender
                    }
                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials or not a barber"}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


      

class BarberDashboard(APIView):
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.user_type != 'barber':
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
        
        return Response({
            'message': 'Welcome to Barber Dashboard',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'user_type': user.user_type
            }
        }, status=status.HTTP_200_OK)