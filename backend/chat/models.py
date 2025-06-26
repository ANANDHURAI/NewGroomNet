from django.db import models
from authservice.models import User

class ChatMessage(models.Model):
    booking = models.ForeignKey('customersite.Booking', on_delete=models.CASCADE, related_name='chat_messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.name}: {self.message[:30]}"

    class Meta:
        ordering = ['timestamp']