from django.urls import path
from .views import UserProfileView,AddressListView

urlpatterns = [
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('address/', AddressListView.as_view(), name='address-list'),
]
