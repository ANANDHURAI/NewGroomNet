from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
HomeSerializer ,
RegisterSerializer , 
OtpSerializer , 
AdminLoginSerializer , 
CustomerBarberLoginSerializer,
ForgotPasswordSerializer,
ResetPasswordSerializer)
import random
from .models import User
from django.conf import settings
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings
import logging
from rest_framework.permissions import AllowAny
logger = logging.getLogger(__name__)
from utils import send_mail

class Home(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        data = {'great_massage': f'Hello welcome {request.user.name}!'}
        serializer = HomeSerializer(data)
        return Response(serializer.data)


class CustomerBarberLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomerBarberLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'user_type': user.user_type,
                    'is_active': user.is_active,     
                    'is_verified': user.is_verified,
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
          
            if serializer.validated_data.get('user_type', 'customer') != 'customer':
                return Response(
                    {'error': 'Only customer registration is allowed.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            email = serializer.validated_data['email']
            if User.objects.filter(email=email).exists():
                return Response(
                    {'error': 'User with this email already exists.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
            otp = random.randint(1000, 9999)
            cache.set(f"registration_{email}", {
                'data': serializer.validated_data, 
                'otp': otp
            }, timeout=300) 
            try:
                send_mail(
                    subject='GroomNet OTP Verification',
                    message=f'Your OTP for GroomNet registration is: {otp}\n\nThis OTP will expire in 5 minutes.',
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=False,
                )
                
                logger.info(f"OTP sent successfully to {email}")
                return Response(
                    {
                        'message': 'OTP sent to your email successfully', 
                        'email': email,
                        'expires_in': 300 
                    }, 
                    status=status.HTTP_200_OK
                )
            except Exception as email_error:
                logger.error(f"Email sending failed: {str(email_error)}")
               
                cache.delete(f"registration_{email}")
                return Response(
                    {'error': 'Failed to send OTP. Please try again.'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response(
                {'error': 'Registration failed. Please try again.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class OTPVerification(APIView):
    def post(self, request):
        serializer = OtpSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        otp = serializer.validated_data['otp']
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            
            user_data = cache.get(f"registration_{email}")
            if not user_data:
                return Response(
                    {'error': 'OTP expired or not found. Please register again.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

           
            if user_data['otp'] != otp:
                return Response(
                    {'error': 'Invalid OTP. Please try again.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            
            data = user_data['data']
            user = User.objects.create_user(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                user_type='customer',
                password=data.get('password', '')
            )

           
            refresh = RefreshToken.for_user(user)
            
            
            cache.delete(f"registration_{email}")
            
            logger.info(f"User registered successfully: {email}")
            
            return Response({
                'message': 'User registered successfully',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'user_type': user.user_type,
                    'phone': user.phone
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"OTP verification error: {str(e)}")
            return Response(
                {'error': 'Verification failed. Please try again.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
         
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            user_type = request.data.get("user_type")
            
            if not refresh_token or not user_type:
                return Response(
                    {'error': 'User type and refresh_token is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                     
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {'message': 'Successfully logged out'}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response(
                {'error': 'Invalid token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class AdminLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'user_type': user.user_type
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminDashboard(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {'great_massage': f'Hello welcome Admin {request.user.name}!'}
        return Response(data)
    
class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp = random.randint(1000, 9999)
        cache.set(f"otp_{email}", str(otp), timeout=300)

        if send_otp(email, otp):
            return Response({"message": "OTP sent to your email for password reset.", "email": email})
        return Response({"error": "Failed to send OTP"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']

        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        cache.delete(f"otp_{email}")

        return Response({"message": "Password reset successfully."})