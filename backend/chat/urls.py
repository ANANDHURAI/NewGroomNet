from django.urls import path
from . import views

urlpatterns = [
    path('chat/<int:booking_id>/messages/', views.get_chat_messages, name='chat-messages'),
    path('chat/<int:booking_id>/send/', views.send_message, name='send-message'),
    path('chat/<int:booking_id>/unread-count/', views.get_unread_count, name='unread-count'),
    path('booking/<int:booking_id>/status/', views.get_booking_status, name='booking-status'), 
]
