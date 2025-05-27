from django.urls import path
from .views import ApprovelRequestView , PersonalDetailsView

urlpatterns = [
    path('personal-details/', PersonalDetailsView.as_view(), name='personaldetails'),
    path('approve-request/', ApprovelRequestView.as_view(), name='approve-request'),
]
