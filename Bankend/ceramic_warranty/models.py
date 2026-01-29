from django.db import models
from invoices.models import Invoice

class CeramicWarrantyRegistration(models.Model):
    BRANCH_CHOICES = [
        ('DXB', 'Dubai'),
        ('AUH', 'Abu Dhabi'),
        ('SHJ', 'Sharjah'),
    ]
    COATING_CHOICES = [
        ('CERAMIC', 'Ceramic Coating'),
        ('GRAPHENE', 'Graphene Coating'),
        ('QUARTZ', 'Quartz Coating'),
    ]

    # LINK TO INVOICE
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, related_name='ceramic_warranty', null=True, blank=True)
    
    # Legacy field
    invoice_number = models.CharField(max_length=50, blank=True)
    
    full_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField()
    
    vehicle_brand = models.CharField(max_length=100)
    vehicle_model = models.CharField(max_length=100)
    vehicle_year = models.IntegerField()
    vehicle_color = models.CharField(max_length=50)
    license_plate = models.CharField(max_length=50)
    vin = models.CharField(max_length=50, verbose_name="VIN")
    
    installation_date = models.DateField()
    branch_location = models.CharField(max_length=10, choices=BRANCH_CHOICES)
    coating_brand = models.CharField(max_length=100)
    coating_type = models.CharField(max_length=20, choices=COATING_CHOICES)
    warranty_period = models.CharField(max_length=50)
    
    m1_date = models.DateField(null=True, blank=True, verbose_name="1st Maintenance Date")
    m1_notes = models.TextField(null=True, blank=True)
    m2_date = models.DateField(null=True, blank=True, verbose_name="2nd Maintenance Date")
    m2_notes = models.TextField(null=True, blank=True)
    m3_date = models.DateField(null=True, blank=True, verbose_name="3rd Maintenance Date")
    m3_notes = models.TextField(null=True, blank=True)
    m4_date = models.DateField(null=True, blank=True, verbose_name="4th Maintenance Date")
    m4_notes = models.TextField(null=True, blank=True)
    
    signature_data = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ceramic: {self.full_name} - {self.license_plate}"
