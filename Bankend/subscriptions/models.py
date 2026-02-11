from django.db import models
from django.conf import settings
from customers.models import Customer
from django.utils import timezone

class SubscriptionPlan(models.Model):
    INTERVAL_CHOICES = [
        ('MONTHLY', 'Monthly'),
        ('YEARLY', 'Yearly'),
    ]
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='AED')
    interval = models.CharField(max_length=20, choices=INTERVAL_CHOICES, default='MONTHLY')
    features = models.JSONField(default=list) # List of feature strings
    is_active = models.BooleanField(default=True)
    stripe_price_id = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.interval})"

class CustomerSubscription(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('PAST_DUE', 'Past Due'),
        ('CANCELED', 'Canceled'),
        ('EXPIRED', 'Expired'),
    ]
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT)
    stripe_customer_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    start_date = models.DateTimeField(auto_now_add=True)
    current_period_end = models.DateTimeField()
    cancel_at_period_end = models.BooleanField(default=False)
    stripe_subscription_id = models.CharField(max_length=100, blank=True, db_index=True)
    
    def __str__(self):
        return f"{self.customer} - {self.plan}"
    
    @property
    def is_valid(self):
        return self.status == 'ACTIVE' and self.current_period_end > timezone.now()
