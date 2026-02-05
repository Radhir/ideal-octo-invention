from django.db import models
from django.conf import settings
from invoices.models import Invoice

class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]
    
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payment_transactions')
    stripe_payment_intent_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='aed')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    customer_email = models.EmailField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.stripe_payment_intent_id} - {self.status}"
