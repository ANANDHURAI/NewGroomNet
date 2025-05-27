from django.urls import path
from .views import (
UsersListView , 
UserDetailView ,
BarbersRequestsView, 
BarberRequestDocumentView, 
AllBarbersRequestsView)

urlpatterns = [
    path('customers-list/', UsersListView.as_view(), name='customers-list'),
    path('customers-details/<int:id>/', UserDetailView.as_view(), name='customer-detail'), 
    path('pending-requests/', BarbersRequestsView.as_view(), name='pending-barber-requests'),
    path('all-requests/', AllBarbersRequestsView.as_view(), name='all-barber-requests'),
    path('barber-details/<int:id>/', BarberRequestDocumentView.as_view(), name='barber-request-detail'),
]