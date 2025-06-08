
from django.urls import path
from .views import BarberDashboard

urlpatterns = [
    path('barber-dash/', BarberDashboard.as_view(), name='barber-dash'),
    
]