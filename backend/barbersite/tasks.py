from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from customersite.models import Booking

@shared_task
def notify_barber_before_appointment(booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        if booking.status != "CANCELLED":
            # you can also use SMS, in-app notification, etc.
            print(f"Reminder sent to Barber: {booking.barber.name} for Booking ID {booking.id}")
            
            send_mail(
                subject="Upcoming Booking Reminder",
                message=f"Hi {booking.barber.name}, your scheduled booking at {booking.slot.time} is in 15 minutes.",
                from_email="noreply@example.com",
                recipient_list=[booking.barber.email],
            )
    except Booking.DoesNotExist:
        pass
