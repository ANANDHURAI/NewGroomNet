from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], blank=True)
    bio = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.user.name}'s Profile"

class Address(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='addresses')
    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)
    building = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    pincode = models.CharField(max_length=10)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}, {self.city} - {self.pincode}"