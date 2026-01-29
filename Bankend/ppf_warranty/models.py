from django.db import models
from invoices.models import Invoice

class PPFWarrantyRegistration(models.Model):
    BRANCH_CHOICES = [
        ('DXB', 'Dubai'),
        ('AUH', 'Abu Dhabi'),
        ('SHJ', 'Sharjah'),
    ]
    FILM_CHOICES = [
        ('GLOSS', 'Gloss'),
        ('MATTE', 'Matte'),
        ('SATIN', 'Satin'),
        ('VINYL', 'Vinyl Wrap'),
        ('COLOR', 'Color PPF'),
        ('OTHER', 'Other'),
    ]

    # LINK TO INVOICE
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, related_name='ppf_warranty', null=True, blank=True)
    
    # Legacy field for compatibility during migration
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
    film_brand = models.CharField(max_length=100)
    film_type = models.CharField(max_length=20, choices=FILM_CHOICES)
    coverage_area = models.CharField(max_length=255)
    
    # Service History
    first_checkup_date = models.DateField(null=True, blank=True)
    first_checkup_notes = models.TextField(null=True, blank=True)
    second_checkup_date = models.DateField(null=True, blank=True)
    second_checkup_notes = models.TextField(null=True, blank=True)
    third_checkup_date = models.DateField(null=True, blank=True)
    third_checkup_notes = models.TextField(null=True, blank=True)
    fourth_checkup_date = models.DateField(null=True, blank=True)
    fourth_checkup_notes = models.TextField(null=True, blank=True)
    fifth_checkup_date = models.DateField(null=True, blank=True)
    fifth_checkup_notes = models.TextField(null=True, blank=True)
    
    signature_data = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PPF: {self.full_name} - {self.license_plate}"
