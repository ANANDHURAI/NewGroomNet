from django.db import models
from authservice.models import User
from adminsite.models import CategoryModel, ServiceModel
from barbersite.models import BarberSlot
from profileservice.models import Address

class Booking(models.Model):
    BOOKING_STATUS = [
        ("PENDING", "Pending"), 
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed")
    ]
    PAYMENT_METHODS = [
        ("COD", "Cash on Delivery"), 
        ("UPI", "UPI")
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
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default="COD")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer.name} - {self.service.name} - {self.slot.date}"

    


