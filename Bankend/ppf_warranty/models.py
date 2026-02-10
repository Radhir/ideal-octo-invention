from django.db import models
from invoices.models import Invoice
import uuid
import qrcode
from io import BytesIO
from django.core.files import File

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
    WARRANTY_DURATION_CHOICES = [
        (2, '2 Years'),
        (5, '5 Years'),
        (10, '10 Years - Lifetime'),
    ]

    # LINK TO INVOICE
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, related_name='ppf_warranty', null=True, blank=True)
    
    # Legacy field for compatibility during migration
    invoice_number = models.CharField(max_length=50, blank=True)
    
    # Portal Access
    portal_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    qr_code = models.ImageField(upload_to='warranty_qr_codes/', blank=True, null=True)
    
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
    warranty_duration_years = models.IntegerField(choices=WARRANTY_DURATION_CHOICES, default=5)
    expiry_date = models.DateField(null=True, blank=True)
    
    branch_location = models.CharField(max_length=10, choices=BRANCH_CHOICES)
    film_brand = models.CharField(max_length=100)
    film_type = models.CharField(max_length=20, choices=FILM_CHOICES)
    film_lot_number = models.CharField(max_length=100, blank=True)
    roll_number = models.CharField(max_length=100, blank=True)
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

    def generate_qr_code(self):
        """Generate QR code pointing to the warranty portal"""
        from django.conf import settings
        warranty_url = f"{settings.SITE_URL}/warranty/{self.portal_token}"
        
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(warranty_url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        filename = f'warranty_qr_{self.portal_token}.png'
        self.qr_code.save(filename, File(buffer), save=False)

    def calculate_expiry_date(self):
        """Auto-calculate warranty expiry based on duration"""
        from datetime import timedelta
        if self.installation_date and self.warranty_duration_years:
            self.expiry_date = self.installation_date + timedelta(days=365 * self.warranty_duration_years)

    def save(self, *args, **kwargs):
        # Auto-calculate expiry date
        if not self.expiry_date:
            self.calculate_expiry_date()
        
        # Generate QR code on first save
        is_new = not self.pk
        super().save(*args, **kwargs)
        
        if is_new and not self.qr_code:
            self.generate_qr_code()
            super().save(update_fields=['qr_code'])

    def __str__(self):
        return f"PPF: {self.full_name} - {self.license_plate}"
