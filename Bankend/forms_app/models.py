from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class PPFWarrantyRegistration(models.Model):
    BRANCH_CHOICES = [
        ('DXB', 'Dubai'),
        ('AUH', 'Abu Dhabi'),
        ('SHJ', 'Sharjah'),
    ]
    FILM_CHOICES = [
        ('GLOSS', 'Gloss'),
        ('MATTE', 'Matte'),
        ('CERAMIC', 'Ceramic'),
    ]

    full_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    invoice_number = models.CharField(max_length=50)
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
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.license_plate}"

class JobCard(models.Model):
    job_card_number = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    customer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    
    registration_number = models.CharField(max_length=50)
    vin = models.CharField(max_length=50)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    color = models.CharField(max_length=50)
    kilometers = models.PositiveIntegerField()
    
    job_description = models.TextField()
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    account_name = models.CharField(max_length=255, blank=True)
    bank_name = models.CharField(max_length=255, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    iban = models.CharField(max_length=50, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    
    customer_signature = models.ImageField(upload_to='signatures/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.job_card_number

class RequestForm(models.Model):
    request_by = models.CharField(max_length=255)
    car_type = models.CharField(max_length=100)
    plate_number = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    payment_type = models.CharField(max_length=50)
    chassis_number = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request by {self.request_by} - {self.plate_number}"

class StockForm(models.Model):
    department = models.CharField(max_length=100)
    request_by = models.CharField(max_length=255)
    car_type = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    payment_type = models.CharField(max_length=50)
    plate_number = models.CharField(max_length=50)
    item_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stock Request - {self.department}"

class LeaveApplication(models.Model):
    LEAVE_CHOICES = [
        ('ANNUAL', 'Annual Leave'),
        ('SICK', 'Sick Leave'),
        ('EMERGENCY', 'Emergency Leave'),
        ('UNPAID', 'Unpaid Leave'),
    ]
    employee_name = models.CharField(max_length=255)
    position = models.CharField(max_length=100)
    leave_type = models.CharField(max_length=20, choices=LEAVE_CHOICES)
    leave_period_from = models.DateField()
    leave_period_to = models.DateField()
    total_days = models.IntegerField(editable=False)
    
    manager_approval = models.BooleanField(default=False)
    hr_approval = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_total_days(self):
        if self.leave_period_from and self.leave_period_to:
            return (self.leave_period_to - self.leave_period_from).days + 1
        return 0

    def save(self, *args, **kwargs):
        self.total_days = self.calculate_total_days()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee_name} - {self.leave_type}"

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

    full_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    invoice_number = models.CharField(max_length=50)
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
    
    # Maintenance History (Check-ups every 6-12 months)
    m1_date = models.DateField(null=True, blank=True, verbose_name="1st Maintenance Date")
    m1_notes = models.TextField(null=True, blank=True)
    m2_date = models.DateField(null=True, blank=True, verbose_name="2nd Maintenance Date")
    m2_notes = models.TextField(null=True, blank=True)
    m3_date = models.DateField(null=True, blank=True, verbose_name="3rd Maintenance Date")
    m3_notes = models.TextField(null=True, blank=True)
    m4_date = models.DateField(null=True, blank=True, verbose_name="4th Maintenance Date")
    m4_notes = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ceramic: {self.full_name} - {self.license_plate}"

class Checklist(models.Model):
    checklist_number = models.CharField(max_length=50, unique=True)
    vehicle_brand = models.CharField(max_length=100)
    vehicle_model = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=50)
    technician_name = models.CharField(max_length=255)
    date = models.DateField()
    vin = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.checklist_number

class Booking(models.Model):
    customer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    vehicle_details = models.CharField(max_length=255)
    service_type = models.CharField(max_length=100)
    booking_date = models.DateField()
    booking_time = models.TimeField()
    status = models.CharField(max_length=50, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} - {self.booking_date}"

class Lead(models.Model):
    SOURCE_CHOICES = [
        ('INSTAGRAM', 'Instagram'),
        ('FACEBOOK', 'Facebook'),
        ('WHATSAPP', 'WhatsApp'),
        ('WALKIN', 'Walk-in'),
        ('REFERRAL', 'Referral'),
    ]
    customer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES)
    interested_service = models.CharField(max_length=255)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=50, default='New')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.customer_name

class Invoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    customer_name = models.CharField(max_length=255)
    customer_trn = models.CharField(max_length=50, blank=True, verbose_name="Customer TRN")
    items = models.TextField(help_name="format: item|qty|price per line")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=50, choices=[('PAID', 'Paid'), ('PENDING', 'Pending')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number

class Operation(models.Model):
    operation_name = models.CharField(max_length=255)
    assigned_to = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=[('IN_PROGRESS', 'In Progress'), ('COMPLETED', 'Completed'), ('ON_HOLD', 'On Hold')])
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.operation_name
