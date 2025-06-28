from django.db import models
from authservice.models import User
from customersite.models import Booking

class BarberLocation(models.Model):
    barber = models.OneToOneField(User, on_delete=models.CASCADE, related_name='current_location')
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    is_travelling = models.BooleanField(default=False)
    current_booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.barber.name} - Location"