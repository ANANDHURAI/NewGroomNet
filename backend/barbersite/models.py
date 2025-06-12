from django.db import models
from authservice.models import User
from adminsite.models import CategoryModel , ServiceModel

class BarberService(models.Model):
    barber = models.ForeignKey(User, on_delete=models.CASCADE, related_name='barber_services')
    service = models.ForeignKey(ServiceModel, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['barber', 'service']
    
    def __str__(self):
        return f"{self.barber.name} - {self.service.name}"
    


class Portfolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='portfolio')
    expert_at = models.CharField(max_length=100)
    current_location = models.CharField(max_length=255)
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='barber_portfolios/', null=True, blank=True)
    is_available = models.BooleanField(default=True)
    travel_radius_km = models.FloatField(default=10.0, help_text="Maximum distance barber is willing to travel")

    def __str__(self):
        return f"{self.user.name}'s Portfolio"