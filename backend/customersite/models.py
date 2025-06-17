from django.db import models
from authservice.models import User
from adminsite.models import ServiceModel
from barbersite.models import BarberSlot
from profileservice.models import Address

class Booking(models.Model):
    BOOKING_STATUS = [
        ("PENDING", "Pending"), 
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed")
    ]
    
    customer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="customer_bookings", 
        limit_choices_to={'user_type': 'customer'}
    )
    barber = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="barber_bookings", 
        limit_choices_to={'user_type': 'barber'}
    )
    service = models.ForeignKey(ServiceModel, on_delete=models.CASCADE)
    slot = models.ForeignKey(BarberSlot, on_delete=models.CASCADE)
    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=BOOKING_STATUS, default="PENDING")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_payment_done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer.name} - {self.service.name} - {self.slot.date}"


class PaymentModel(models.Model):
    PAYMENT_METHODS = [
        ("COD", "Cash on Delivery"), 
        ("UPI", "UPI")
    ]
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default="COD")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    payment_status = models.CharField(max_length=20, choices=[('SUCCESS', 'Success'), ('FAILED', 'Failed')], default='SUCCESS')

    


