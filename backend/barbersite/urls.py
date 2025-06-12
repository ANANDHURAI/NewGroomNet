
from django.urls import path , include
from .views import BarberDashboard,BarberPortfolioView,BarberServiceViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'barber-services', BarberServiceViewSet, basename='barber-services')

urlpatterns = [
    path('barber-dash/', BarberDashboard.as_view(), name='barber-dash'),
    path('barber-portfolio/', BarberPortfolioView.as_view(), name='barber-portfolio'),
    path('', include(router.urls)),
    
]
