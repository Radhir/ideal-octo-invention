from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True)
    
    # Metrics (Optional, can be computed)
    total_spend = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_visit = models.DateField(null=True, blank=True)
    
    # System
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.phone})"
