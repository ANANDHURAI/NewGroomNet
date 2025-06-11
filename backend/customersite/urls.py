from django.urls import path
from .views import (
Home,UserLocationUpdateView)

urlpatterns = [
    path('home/', Home.as_view(), name='home'),
    path('user-location/', UserLocationUpdateView.as_view(), name='user-location-update'),
]
