from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import (
    BarberPersonalDetailsSerializer, 
    DocumentUploadSerializer,
    BarberRegistrationStatusSerializer
)
from .models import BarberRequest

User = get_user_model()

class BarberPersonalDetailsView(APIView):

    def post(self, request):
        serializer = BarberPersonalDetailsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
         
            user = User.objects.create_user(
                name=serializer.validated_data['name'],
                email=serializer.validated_data['email'],
                phone=serializer.validated_data['phone'],
                gender=serializer.validated_data['gender'],
                password=serializer.validated_data['password'],
                user_type='barber',
                is_active=True  
            )

         
            barber_request = BarberRequest.objects.create(
                user=user,
                registration_step='personal_details',
                status='pending'
            )

          
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                "message": "Personal details submitted successfully. Please upload documents to continue.",
                "user_id": user.id,
                "user_type": user.user_type,
                "barber_request_id": barber_request.id,
                "registration_step": barber_request.registration_step,
                "status": barber_request.status,
                "access": access_token,
                "refresh": str(refresh),
                "user_data": {
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone,
                    "gender": user.gender
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                "error": "Failed to create barber account",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class DocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.user_type != 'barber':
            return Response({
                'error': 'Only barbers can upload documents'
            }, status=status.HTTP_403_FORBIDDEN)
        try:
            barber_request = user.barber_request
        except BarberRequest.DoesNotExist:
            return Response({
                'error': 'No barber registration found. Please complete personal details first.'
            }, status=status.HTTP_404_NOT_FOUND)

       
        if barber_request.is_documents_complete:
            return Response({
                'error': 'Documents already uploaded'
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = DocumentUploadSerializer(barber_request, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        
            barber_request.mark_documents_uploaded()

            if 'profile_image' in serializer.validated_data:
                user.profileimage = serializer.validated_data['profile_image']
                user.save()

            return Response({
                'message': 'Documents uploaded successfully. Your application is now under review.',
                'registration_step': barber_request.registration_step,
                'status': barber_request.status
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BarberRegistrationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            barber_request = user.barber_request
            serializer = BarberRegistrationStatusSerializer(user)
            
            return Response({
                'user_data': serializer.data,
                'next_step': self._get_next_step(barber_request),
                'can_continue': self._can_continue_registration(barber_request)
            }, status=status.HTTP_200_OK)
            
        except BarberRequest.DoesNotExist:
            return Response({
                'message': 'No registration found. Please start with personal details.',
                'next_step': 'personal_details',
                'can_continue': True
            }, status=status.HTTP_404_NOT_FOUND)
    
    def _get_next_step(self, barber_request):

        if barber_request.registration_step == 'personal_details':
            return 'upload_documents'
        elif barber_request.registration_step == 'documents_uploaded':
            return 'wait_for_approval'
        elif barber_request.status == 'approved':
            return 'registration_complete'
        elif barber_request.status == 'rejected':
            return 'registration_rejected'
        return 'unknown'
    
    def _can_continue_registration(self, barber_request):
        return barber_request.status not in ['approved', 'rejected']


