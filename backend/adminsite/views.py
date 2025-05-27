from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from authservice.models import User
from rest_framework.generics import RetrieveAPIView
from .serializers import ApproveTheBarberRequestSerializer, BarberApprovalActionSerializer , UsersListSerializer
from django.http import Http404

class BarbersRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        barbers = User.objects.filter(
            user_type='barber', 
            approval_request__isnull=False,
            approval_request__status='pending'
        ).select_related('approval_request')
        
        serializer = ApproveTheBarberRequestSerializer(barbers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BarberApprovalActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_id = serializer.validated_data['user_id']
        action = serializer.validated_data['action']
        comment = serializer.validated_data.get('comment', '')

        try:
            user = User.objects.get(id=user_id)
            req = user.approval_request
            
            if action == "approve":
                req.status = "approved"
            elif action == "reject":
                req.status = "rejected"
            
            req.admin_comment = comment
            req.save()
            
            return Response({
                'message': f'Request {action}d successfully',
                'user_id': user_id,
                'new_status': req.status
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except AttributeError:
            return Response({'error': 'No approval request found for this user'}, status=status.HTTP_404_NOT_FOUND)

class BarberRequestDocumentView(RetrieveAPIView):
    queryset = User.objects.filter(user_type='barber', approval_request__isnull=False)
    serializer_class = ApproveTheBarberRequestSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_object(self):
        try:
            return super().get_object()
        except:
            raise Http404("Barber request not found")

class AllBarbersRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        barbers = User.objects.filter(
            user_type='barber', 
            approval_request__isnull=False
        ).select_related('approval_request')
        
        serializer = ApproveTheBarberRequestSerializer(barbers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class UsersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.filter(user_type='customer') 
        serializer = UsersListSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UsersListSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
        


        