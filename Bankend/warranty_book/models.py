from django.db import models
from django.contrib.auth.models import User
from invoices.models import Invoice
import uuid
import qrcode
from io import BytesIO
from django.core.files import File

class WarrantyRegistration(models.Model):
    CATEGORY_CHOICES = [
        ('PPF', 'Paint Protection Film'),
        ('CERAMIC', 'Ceramic Coating'),
        ('TINT', 'Window Tinting'),
        ('PAINT', 'Paint / Bodywork'),
        ('WRAP', 'Vinyl Wrap'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    ]

    duration_choices = [
        (1, '1 Year'),
        (2, '2 Years'),
        (3, '3 Years'),
        (5, '5 Years'),
        (10, '10 Years'),
        (99, 'Lifetime'),
    ]

    # Links
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='warranties')
    portal_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    # Core Data
    warranty_number = models.CharField(max_length=50, unique=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Customer Data (Snapshotted from Job Card / Invoice)
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=20)
    customer_email = models.EmailField(blank=True, null=True)
    
    # Vehicle Data
    vehicle_brand = models.CharField(max_length=100)
    vehicle_model = models.CharField(max_length=100)
    plate_number = models.CharField(max_length=50)
    vin = models.CharField(max_length=50, blank=True, null=True)
    
    # Warranty Data
    installation_date = models.DateField()
    duration_years = models.IntegerField(choices=duration_choices, default=5)
    expiry_date = models.DateField()
    
    # Specifications (Dynamic JSON for category-specific details)
    specifications = models.JSONField(default=dict, blank=True)
    
    # Media & Signs
    qr_code = models.ImageField(upload_to='warranty_qr/', blank=True, null=True)
    signature_data = models.TextField(blank=True, null=True) # Base64 signature
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def generate_warranty_number(self):
        if not self.warranty_number:
            prefix = f"ES-{self.category}"
            count = WarrantyRegistration.objects.filter(category=self.category).count() + 1
            self.warranty_number = f"{prefix}-{1000 + count}"

    def calculate_expiry(self):
        from datetime import timedelta
        if self.installation_date and self.duration_years:
            if self.duration_years == 99: # Lifetime
                self.expiry_date = self.installation_date + timedelta(days=365 * 100)
            else:
                self.expiry_date = self.installation_date + timedelta(days=365 * self.duration_years)

    def generate_qr_code(self):
        """Generate QR code pointing to the unified warranty portal"""
        from django.conf import settings
        # Use FRONTEND_URL if available
        portal_base = getattr(settings, 'FRONTEND_URL', 'https://srv1306978.hstgr.cloud')
        warranty_url = f"{portal_base}/warranty-verify/{self.portal_token}"
        
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(warranty_url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        filename = f'qr_{self.warranty_number}.png'
        self.qr_code.save(filename, File(buffer), save=False)

    def save(self, *args, **kwargs):
        if not self.warranty_number:
            self.generate_warranty_number()
        if not self.expiry_date:
            self.calculate_expiry()
        
        is_new = not self.pk
        super().save(*args, **kwargs)
        
        if is_new and not self.qr_code:
            self.generate_qr_code()
            super().save(update_fields=['qr_code'])

    def __str__(self):
        return f"{self.warranty_number} - {self.customer_name}"

    class Meta:
        verbose_name = "Warranty Registration"
        verbose_name_plural = "Warranty Registrations"
        ordering = ['-created_at']
