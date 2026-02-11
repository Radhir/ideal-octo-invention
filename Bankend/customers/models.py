from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    
    # Metrics
    total_spend = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_visit = models.DateField(null=True, blank=True)
    loyalty_points = models.IntegerField(default=0)
    preferred_services = models.TextField(blank=True, default='[]')  # Store as JSON string
    
    # System
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def member_since(self):
        return self.created_at

    @property
    def warranties(self):
        from ppf_warranty.models import PPFWarrantyRegistration
        from ceramic_warranty.models import CeramicWarrantyRegistration
        from django.db.models import Q
        import itertools
        
        # Get warranties linked via JobCards -> Invoices
        ppf_warranties = PPFWarrantyRegistration.objects.filter(
            invoice__job_card__customer_profile=self
        )
        ceramic_warranties = CeramicWarrantyRegistration.objects.filter(
            invoice__job_card__customer_profile=self
        )
        
        # Combine querysets (or return a list/custom iterable)
        # Since serializer likely iterates, a list chain is okay
        return list(itertools.chain(ppf_warranties, ceramic_warranties))


    def __str__(self):
        return f"{self.name} ({self.phone})"

# Import Portal Models to register them
try:
    from .portal.models import PortalToken, CustomerPortalActivity, CustomerFeedback
except ImportError:
    pass
