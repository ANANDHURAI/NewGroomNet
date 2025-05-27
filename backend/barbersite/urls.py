
from django.urls import path
from .views import BarberDashboard,BarberLoginView

urlpatterns = [
    path('barber-dash/', BarberDashboard.as_view(), name='barber-dash'),
    path('barber-login/', BarberLoginView.as_view(), name='barber-login'),

]
