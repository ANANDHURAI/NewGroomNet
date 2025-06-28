from django.urls import path
from .views import (
    StartTravelAPIView,
    StopTravelAPIView,
    UpdateBarberLocationAPIView,
    TravelStatusAPIView
)

urlpatterns = [
    path('start-travel/', StartTravelAPIView.as_view(), name='start-travel'),
    path('stop-travel/', StopTravelAPIView.as_view(), name='stop-travel'),
    path('update-location/', UpdateBarberLocationAPIView.as_view(), name='update-location'),
    path('travel-status/<int:booking_id>/', TravelStatusAPIView.as_view(), name='travel-status'),
]