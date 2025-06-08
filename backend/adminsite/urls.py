from django.urls import path
from .views import (
    UsersListView, 
    UserDetailView,
    PendingBarbersRequestsView, 
    AllBarbersRequestsView,
    BarberApprovalActionView,
    BarberDetailsView,
    BarbersListView,
    BlockingView
)

urlpatterns = [
    path('customers-list/', UsersListView.as_view(), name='customers-list'),
    path('customers-details/<int:id>/', UserDetailView.as_view(), name='customer-detail'), 

    path('barbers-list/', BarbersListView.as_view(), name='barbers-list'),
    path('pending-requests/', PendingBarbersRequestsView.as_view(), name='pending-barber-requests'),
    path('all-requests/', AllBarbersRequestsView.as_view(), name='all-barber-requests'),
    path('approve-barber/', BarberApprovalActionView.as_view(), name='approve-barber'),
    path('barber-details/<int:barber_id>/', BarberDetailsView.as_view(), name='barber-details'),
    path('users-block/<int:id>/', BlockingView.as_view(), name='users-block'),
 
]
