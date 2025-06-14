from django.urls import path
from .views import (
    Home,
    UserLocationUpdateView,
    ServiceListView,
    CategoryListView,
    BarberListView,
    available_dates,
    AvailableSlotListView,
    AddressListCreateView,
    BookingCreateView,
    booking_summary,
    
)

urlpatterns = [
    path('home/', Home.as_view(), name='home'),
    path('user-location/', UserLocationUpdateView.as_view(), name='user-location-update'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('services/', ServiceListView.as_view(), name='services'),
    path('barbers/', BarberListView.as_view(), name='barbers'),
    path('available-dates/', available_dates, name='available-dates'),
    path('available-slots/', AvailableSlotListView.as_view(), name='available-slots'),

    path('addresses/', AddressListCreateView.as_view(), name='addresses'),
    
    path('booking-summary/', booking_summary, name='booking-summary'),
    path('create-booking/', BookingCreateView.as_view(), name='create-booking'),
]

