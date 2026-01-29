from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class NotificationLog(models.Model):
    NOTIFICATION_TYPES = [
        ('WHATSAPP', 'WhatsApp'),
        ('EMAIL', 'Email'),
        ('SMS', 'SMS'),
    ]
    
    recipient = models.CharField(max_length=255) # Phone or Email
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    subject = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    
    # Generic relation to link to any object (JobCard, Invoice, etc.)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='SENT') # SENT, FAILED, DELIVERED
    
    def __str__(self):
        return f"{self.notification_type} to {self.recipient} at {self.sent_at}"
