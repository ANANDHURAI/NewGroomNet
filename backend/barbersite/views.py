
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

      
class BarberDashboard(APIView): 
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