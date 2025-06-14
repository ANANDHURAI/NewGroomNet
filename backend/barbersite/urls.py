
from django.urls import path , include
from .views import BarberDashboard,BarberPortfolioView,BarberServiceViewSet,BarberSlotViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'barber-services', BarberServiceViewSet, basename='barber-services')
router.register(r'barber-slots', BarberSlotViewSet, basename='barber-slots')

urlpatterns = [
    path('barber-dash/', BarberDashboard.as_view(), name='barber-dash'),
    path('barber-portfolio/', BarberPortfolioView.as_view(), name='barber-portfolio'),
    path('', include(router.urls)),
    
]
