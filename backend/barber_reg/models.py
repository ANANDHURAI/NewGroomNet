
from django.db import models
from authservice.models import User

class BarberRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='approval_request')
    licence = models.FileField(upload_to='documents/licences/')
    certificate = models.FileField(upload_to='documents/certificates/')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    admin_comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - {self.status}"

    @property
    def is_approved(self):
        return self.status == 'approved'
    
    @property
    def is_rejected(self):
        return self.status == 'rejected'
    
    @property
    def is_pending(self):
        return self.status == 'pending'
