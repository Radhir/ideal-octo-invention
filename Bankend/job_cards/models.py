from django.db import models
from django.contrib.auth.models import User
import uuid

class JobCard(models.Model):
    STATUS_CHOICES = [
        ('RECEPTION', 'Step 1: Reception'),
        ('ESTIMATION', 'Step 2: Estimation'),
        ('WORK_ASSIGNMENT', 'Step 3: Work Assignment'),
        ('WIP', 'Step 4: Work In Progress'),
        ('QC', 'Step 5: QC Approval'),
        ('INVOICING', 'Step 6: Invoicing'),
        ('DELIVERY', 'Step 7: Delivery'),
        ('CLOSED', 'Job Card Closed'),
    ]

    job_card_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='RECEPTION')
    date = models.DateField()
    
    # Reception Info
    customer_name = models.CharField(max_length=255)
    customer_profile = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    related_lead = models.ForeignKey('leads.Lead', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    related_booking = models.ForeignKey('bookings.Booking', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    phone = models.CharField(max_length=20)
    address = models.TextField()
    
    registration_number = models.CharField(max_length=50)
    vin = models.CharField(max_length=50)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    color = models.CharField(max_length=50)
    kilometers = models.PositiveIntegerField()
    
    service_advisor = models.CharField(max_length=255, blank=True)
    initial_inspection_notes = models.TextField(blank=True)

    # Work Assignment
    assigned_technician = models.CharField(max_length=255, blank=True)
    assigned_bay = models.CharField(max_length=100, blank=True)
    estimated_timeline = models.DateTimeField(null=True, blank=True)

    # Description
    job_description = models.TextField()
    
    # Financial Summary
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Banking (optional/legacy)
    account_name = models.CharField(max_length=255, blank=True)
    bank_name = models.CharField(max_length=255, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    iban = models.CharField(max_length=50, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    
    # QC Sign-offs
    qc_sign_off = models.BooleanField(default=False)
    pre_work_head_sign_off = models.BooleanField(default=False)
    post_work_tl_sign_off = models.BooleanField(default=False)
    post_work_head_sign_off = models.BooleanField(default=False)
    floor_incharge_sign_off = models.BooleanField(default=False)
    
    # Final Acceptance
    customer_signature = models.ImageField(upload_to='signatures/', null=True, blank=True)
    signature_data = models.TextField(null=True, blank=True) # Base64 for touch signature
    loyalty_points = models.IntegerField(default=0)
    feedback_notes = models.TextField(blank=True)
    
    portal_token = models.UUIDField(default=uuid.uuid4, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.portal_token:
            self.portal_token = uuid.uuid4()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.job_card_number} - {self.get_status_display()}"

    @property
    def status_index(self):
        statuses = [c[0] for c in self.STATUS_CHOICES]
        return statuses.index(self.status)

class JobCardPhoto(models.Model):
    job_card = models.ForeignKey(JobCard, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='job_card_photos/')
    caption = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class JobCardTask(models.Model):
    job_card = models.ForeignKey(JobCard, related_name='tasks', on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    parts_consumed = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ServiceCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class Service(models.Model):
    category = models.ForeignKey(ServiceCategory, related_name='services', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} - {self.price}"
