from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from customersite.models import Booking
from travel_tracking.models import BarberLocation
import logging
from .utils import send_push_notification

logger = logging.getLogger(__name__)

@shared_task
def send_travel_notification(booking_id, status):

    try:
        booking = Booking.objects.get(id=booking_id)
        customer = booking.customer
        barber_name = booking.barber.name

        if status == 'started':
            title = "Barber On The Way!"
            message = f"{barber_name} has started traveling to your location. Track their live location in the app."
            
        elif status == 'arrived':
            title = "Barber Arrived!"
            message = f"{barber_name} has arrived at your location. Please get ready for your service."
            
        elif status == 'reminder':
            title = "Appointment Reminder"
            message = f"Your appointment with {barber_name} is in 15 minutes. Please be ready!"
            
        else:
            return

        send_push_notification(customer.id, title, message, {
            'booking_id': booking_id,
            'type': 'travel_update',
            'status': status
        })

        if status in ['started', 'arrived']:
            pass
            # send_sms_notification(customer.phone, message)

        # logger.info(f"Travel notification sent: {status} for booking {booking_id}")

    except Booking.DoesNotExist:
        logger.error(f"Booking {booking_id} not found for travel notification")
    except Exception as e:
        logger.error(f"Failed to send travel notification: {str(e)}")


@shared_task
def schedule_travel_reminders():
    now = timezone.now()
    reminder_time = now + timedelta(minutes=15)
    
    bookings = Booking.objects.filter(
        status='CONFIRMED',
        booking_type='SCHEDULE_BOOKING',
        slot__date=reminder_time.date(),
        slot__time__range=(
            (reminder_time - timedelta(minutes=2)).time(),
            (reminder_time + timedelta(minutes=2)).time()
        )
    )
    
    for booking in bookings:
        send_push_notification(
            booking.barber.id,
            "Travel Reminder",
            f"Your appointment with {booking.customer.name} is in 15 minutes. Start traveling now!",
            {
                'booking_id': booking.id,
                'type': 'travel_reminder',
                'customer_address': booking.address.full_address
            }
        )
        
        send_travel_notification.delay(booking.id, 'reminder')
        
        logger.info(f"Travel reminder sent for booking {booking.id}")


@shared_task
def check_instant_bookings():
    recent_time = timezone.now() - timedelta(minutes=5)
    
    instant_bookings = Booking.objects.filter(
        booking_type='INSTANT_BOOKING',
        status='PENDING',
        created_at__gte=recent_time
    )
    
    for booking in instant_bookings:
        send_push_notification(
            booking.barber.id,
            "New Instant Booking!",
            f"You have a new instant booking from {booking.customer.name}. Please confirm quickly!",
            {
                'booking_id': booking.id,
                'type': 'instant_booking',
                'service': booking.service.name
            }
        )


# @shared_task
# def update_booking_status_by_location():
#     active_travels = BarberLocation.objects.filter(
#         is_travelling=True,
#         current_booking__isnull=False
#     )
    
#     for barber_location in active_travels:
#         booking = barber_location.current_booking
#         if not booking or booking.status not in ['TRAVELLING']:
#             continue
            
#         try:
#             customer_lat, customer_lng = get_address_coordinates(booking.address.full_address)
#             if not customer_lat or not customer_lng:
#                 continue
                
#             origin = f"{barber_location.latitude},{barber_location.longitude}"
#             destination = f"{customer_lat},{customer_lng}"
            
#             distance_data = get_distance_and_duration(origin, destination)
#             if not distance_data:
#                 continue
                
#             duration_seconds = distance_data.get('duration_seconds', 0)
            
#             if duration_seconds <= 120 and booking.status != 'ARRIVED':
#                 booking.status = 'ARRIVED'
#                 booking.arrived_at = timezone.now()
#                 booking.save()
                
#                 barber_location.is_travelling = False
#                 barber_location.current_booking = None
#                 barber_location.save()
                
#                 send_travel_notification.delay(booking.id, 'arrived')
                
#                 logger.info(f"Auto-updated booking {booking.id} to ARRIVED")
                
#         except Exception as e:
#             logger.error(f"Error updating booking status by location: {str(e)}")


@shared_task
def cleanup_old_locations():
    cutoff_time = timezone.now() - timedelta(hours=24)
    
    old_locations = BarberLocation.objects.filter(
        is_travelling=False,
        last_updated__lt=cutoff_time
    )
    
    count = old_locations.count()
    old_locations.delete()
    
    logger.info(f"Cleaned up {count} old barber locations")