from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import PortfolioSerializer , BarberServiceSerializer
from.models import Portfolio   
from adminsite.models import CategoryModel , ServiceModel
from django.shortcuts import get_object_or_404
from adminsite.serializers import CategorySerializer, ServiceSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import BarberService
from adminsite.models import CategoryModel, ServiceModel


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
    

class BarberPortfolioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            portfolio = Portfolio.objects.get(user=request.user)
            serializer = PortfolioSerializer(portfolio)
            return Response(serializer.data)
        except Portfolio.DoesNotExist:
            return Response({"detail": "Portfolio not created yet."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        portfolio, _ = Portfolio.objects.get_or_create(user=request.user)
        serializer = PortfolioSerializer(portfolio, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class BarberServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BarberServiceSerializer
    
    def get_queryset(self):
        return BarberService.objects.filter(barber=self.request.user, is_active=True)
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        categories = CategoryModel.objects.filter(is_blocked=False)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def services_by_category(self, request):
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response({'error': 'category_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        services = ServiceModel.objects.filter(category_id=category_id, is_blocked=False)
        
        selected_service_ids = BarberService.objects.filter(
            barber=request.user,
            is_active=True,
            service__category_id=category_id
        ).values_list('service_id', flat=True)
        
        available_services = services.exclude(id__in=selected_service_ids)
        
        serializer = ServiceSerializer(available_services, many=True)
        return Response({
            'services': serializer.data,
            'category': CategorySerializer(get_object_or_404(CategoryModel, id=category_id)).data
        })
    
    @action(detail=False, methods=['post'])
    def add_service(self, request):
        service_id = request.data.get('service_id')
        if not service_id:
            return Response({'error': 'service_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        service = get_object_or_404(ServiceModel, id=service_id, is_blocked=False)

        if BarberService.objects.filter(barber=request.user, service=service, is_active=True).exists():
            return Response({'error': 'Service already added'}, status=status.HTTP_400_BAD_REQUEST)

        barber_service, created = BarberService.objects.get_or_create(
            barber=request.user,
            service=service,
            defaults={'is_active': True}
        )
        
        if not created:
            barber_service.is_active = True
            barber_service.save()
        
        serializer = BarberServiceSerializer(barber_service)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'])
    def remove_service(self, request, pk=None):
        barber_service = get_object_or_404(BarberService, id=pk, barber=request.user)
        barber_service.is_active = False
        barber_service.save()
        return Response({'message': 'Service removed successfully'})
    
    @action(detail=False, methods=['get'])
    def my_services(self, request):
        services = self.get_queryset()
        serializer = BarberServiceSerializer(services, many=True)
        
        total_price = sum(float(service.service.price) for service in services)
        total_duration = sum(service.service.duration_minutes for service in services)
        
        return Response({
            'services': serializer.data,
            'total_price': total_price,
            'total_duration': total_duration,
            'count': services.count()
        })
