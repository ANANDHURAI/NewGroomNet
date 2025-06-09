
from django.urls import path
from .views import BarberDashboard,BarberPortfolioView

urlpatterns = [
    path('barber-dash/', BarberDashboard.as_view(), name='barber-dash'),
    path('barber-portfolio/', BarberPortfolioView.as_view(), name='barber-portfolio'),
    
]