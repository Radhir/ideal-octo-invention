from django.db import models
from customers.models import Customer
from locations.models import Branch
from decimal import Decimal
import uuid

class JobCard(models.Model):
    STATUS_CHOICES = [
        ('RECEIVED', 'Received (Reception)'),
        ('IN_PROGRESS', 'In Process (Workshop)'),
        ('READY', 'Ready for Quality Control'),
        ('INVOICED', 'Invoiced (Accounted)'),
        ('CLOSED', 'Closed & Delivered'),
    ]

    job_card_number = models.CharField(max_length=50, unique=True)
    estimation_number = models.CharField(max_length=50, blank=True, null=True, unique=True)
    appointment_number = models.CharField(max_length=50, blank=True, null=True, unique=True)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='RECEIVED')
    date = models.DateField()
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    
    # Reception Info
    title = models.CharField(max_length=10, choices=[('Mr', 'Mr'), ('Mrs', 'Mrs'), ('Ms', 'Ms'), ('Dr', 'Dr')], default='Mr', blank=True)
    customer_name = models.CharField(max_length=255)
    customer_profile = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    related_lead = models.ForeignKey('leads.Lead', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    related_booking = models.ForeignKey('bookings.Booking', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    vehicle_node = models.ForeignKey('masters.Vehicle', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    
    registration_number = models.CharField(max_length=50, blank=True, null=True)
    plate_emirate = models.CharField(max_length=50, blank=True, null=True) # Unified with 'emirate' in UI
    plate_category = models.CharField(max_length=10, blank=True, null=True) # e.g. 'A', 'B', 'C'
    plate_code = models.CharField(max_length=10, blank=True, null=True)
    vin = models.CharField(max_length=50, blank=True, default='')
    brand = models.CharField(max_length=100, blank=True, default='')
    model = models.CharField(max_length=100, blank=True, default='')
    year = models.IntegerField(default=2025)
    color = models.CharField(max_length=50, blank=True, default='')
    kilometers = models.PositiveIntegerField(default=0)
    
    service_advisor_legacy = models.CharField(max_length=255, blank=True, null=True)
    service_advisor = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='advised_jobs')
    initial_inspection_notes = models.TextField(blank=True)

    # Work Assignment
    assigned_technician_legacy = models.CharField(max_length=255, blank=True, null=True)
    assigned_technician = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_jobs')
    assigned_bay = models.CharField(max_length=100, blank=True)
    estimated_timeline = models.DateTimeField(null=True, blank=True)

    # Description
    job_description = models.TextField(blank=True, default='')
    
    # Financial Summary
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Estimation & Inspection Details
    inspection_number = models.CharField(max_length=50, blank=True, null=True, unique=True)
    cylinder_type = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. 4, 6, 8, 12 Cylinder")
    no_of_days = models.IntegerField(default=0, help_text="Estimated days for completion")
    actual_days = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Actual days taken")
    efficiency_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Calculated efficiency score")
    customer_approval_status = models.CharField(max_length=20, choices=[('WAITING', 'Waiting'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected')], default='WAITING')
    customer_estimated_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    checklist_remarks = models.TextField(blank=True)
    job_category = models.CharField(max_length=50, default='Regular', choices=[('Regular', 'Regular'), ('Campaign', 'Campaign'), ('Warranty', 'Warranty'), ('Internal', 'Internal')])
    attendee = models.CharField(max_length=255, blank=True) # Or ForeignKey to Employee
    
    # Delivery & Tech Details
    supervisor = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_jobs')
    driver = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='driven_jobs')
    salesman = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='sold_jobs', verbose_name="Sales Man")
    brought_by_name = models.CharField(max_length=255, blank=True)
    mulkiya_number = models.CharField(max_length=100, blank=True)
    delivery_date = models.DateTimeField(null=True, blank=True)
    revise_date = models.DateField(null=True, blank=True)
    committed_date = models.DateField(null=True, blank=True)
    order_type = models.CharField(max_length=50, blank=True, choices=[('Normal', 'Normal'), ('Urgent', 'Urgent'), ('VVIP', 'VVIP')])
    
    # Commission Tracking
    commission_applied = models.BooleanField(default=False)
    advisor_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    technician_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Banking (optional/legacy)
    account_name = models.CharField(max_length=255, blank=True)
    bank_name = models.CharField(max_length=255, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    iban = models.CharField(max_length=50, blank=True)
    
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
    is_released = models.BooleanField(default=False, help_text="Released by manager for scheduling/workshop")
    
    # Paint Specific Fields
    paint_stage = models.CharField(max_length=50, choices=[
        ('NONE', 'Not Required'),
        ('PENDING_MIX', 'Pending Paint Mixing'),
        ('STRIPPING', 'Stripping/Prep'),
        ('PRIMER', 'Primer Application'),
        ('BASE_COAT', 'Base Coat'),
        ('CLEAR_COAT', 'Clear Coat'),
        ('BAKING', 'Baking'),
        ('QC', 'Paint Quality Control'),
        ('COMPLETED', 'Paint Work Completed'),
    ], default='NONE')
    current_booth = models.ForeignKey('workshop.Booth', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_jobs')
    
    sla_clock_start = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.portal_token:
            self.portal_token = uuid.uuid4()
            
        # Start SLA clock when status moves to Estimation
        if self.status == 'ESTIMATION_ASSIGNMENT' and not self.sla_clock_start:
            from django.utils import timezone
            self.sla_clock_start = timezone.now()
            
        old_status = None
        if self.pk:
            try:
                old_status = JobCard.objects.get(pk=self.pk).status
            except JobCard.DoesNotExist:
                pass
        
        super().save(*args, **kwargs)
        
        if self.status == 'CLOSED' and old_status != 'CLOSED':
            # Performance Tracking
            if self.date and self.delivery_date:
                delta = self.delivery_date.date() - self.date
                self.actual_days = Decimal(str(max(delta.days, 1))) # Minimum 1 day
                if self.no_of_days > 0:
                    self.efficiency_score = (Decimal(str(self.no_of_days)) / self.actual_days) * Decimal('100')
            
            self.sync_to_finance()

    def sync_to_finance(self):
        from finance.models import Transaction, Account, Commission
        
        # 1. Revenue Recognition
        revenue_account, _ = Account.objects.get_or_create(
            code='4001',
            defaults={'name': 'Workshop Service Revenue', 'category': 'REVENUE'}
        )
        
        Transaction.objects.create(
            account=revenue_account,
            department='OPERATIONS',
            amount=self.net_amount,
            transaction_type='CREDIT',
            description=f"Revenue: Job #{self.job_card_number} | {self.customer_name}",
            reference=self.job_card_number
        )

        # 2. VAT Recognition (Output VAT)
        if self.vat_amount > 0:
            vat_account, _ = Account.objects.get_or_create(
                code='2050',
                defaults={'name': 'VAT Payable (Output)', 'category': 'LIABILITY'}
            )
            Transaction.objects.create(
                account=vat_account,
                amount=self.vat_amount,
                transaction_type='CREDIT', # Liability increases with Credit
                description=f"VAT Output: Job #{self.job_card_number}",
                reference=self.job_card_number
            )

        # 3. Commission Accrual
        if not self.commission_applied:
            # Advisor Commission
            if self.service_advisor and self.service_advisor.commission_rate > 0:
                comm_amt = (self.total_amount * self.service_advisor.commission_rate) / 100
                self.advisor_commission = comm_amt
                Commission.objects.create(
                    employee=self.service_advisor,
                    job_card=self,
                    amount=comm_amt,
                    notes=f"Advisor Commission for Job #{self.job_card_number}"
                )
            
            # Technician Commission (Standard 2% if not specified, or use advisor rate as proxy for now)
            if self.assigned_technician:
                tech_comm = (self.total_amount * Decimal('2')) / Decimal('100') # Default 2% for tech
                self.technician_commission = tech_comm
                Commission.objects.create(
                    employee=self.assigned_technician,
                    job_card=self,
                    amount=tech_comm,
                    notes=f"Technician Commission for Job #{self.job_card_number}"
                )
            
            self.commission_applied = True
            self.save()

    def __str__(self):
        return f"{self.job_card_number} - {self.get_status_display()}"

    @property
    def status_index(self):
        statuses = [c[0] for c in self.STATUS_CHOICES]
        return statuses.index(self.status)

class JobCardPhoto(models.Model):
    job_card = models.ForeignKey(JobCard, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='job_card_photos/')
    panel_name = models.CharField(max_length=100, blank=True, null=True) # e.g., 'Front Bumper', 'Hood'
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
    image = models.ImageField(upload_to='service_icons/', null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Service Categories"

    def __str__(self):
        return self.name

class Service(models.Model):
    category = models.ForeignKey(ServiceCategory, related_name='services', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Estimated cost to company")
    
    # Accounting & Segmentation
    income_account = models.ForeignKey('finance.Account', on_delete=models.SET_NULL, null=True, blank=True, related_name='services')
    department = models.ForeignKey('hr.Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='services')
    
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.price}"

class WarrantyClaim(models.Model):
    WARRANTY_TYPES = [
        ('PPF', 'Paint Protection Film'),
        ('WRAP', 'Vinyl Wrap'),
        ('TINT', 'Window Tinting'),
        ('PAINT', 'Body Paint'),
        ('CERAMIC', 'Ceramic Coating'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Inspection'),
        ('APPROVED', 'Approved for Re-work'),
        ('REJECTED', 'Rejected'),
        ('COMPLETED', 'Claim Resolved'),
    ]

    claim_number = models.CharField(max_length=50, unique=True)
    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='warranty_claims')
    customer = models.ForeignKey('customers.Customer', on_delete=models.CASCADE, related_name='warranty_claims')
    type = models.CharField(max_length=20, choices=WARRANTY_TYPES)
    
    issue_description = models.TextField()
    inspection_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    findings = models.TextField(blank=True)
    resolution_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.claim_number:
            # Simple serial for now
            last_claim = WarrantyClaim.objects.order_by('-id').first()
            if last_claim:
                new_id = int(last_claim.claim_number.split('-')[-1]) + 1
            else:
                new_id = 1
            self.claim_number = f"WRN-{new_id:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.claim_number} - {self.customer.full_name} ({self.type})"

class JobCardStatusHistory(models.Model):
    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='status_history')
    old_status = models.CharField(max_length=50, blank=True, null=True)
    new_status = models.CharField(max_length=50)
    changed_by = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.job_card.job_card_number}: {self.old_status} -> {self.new_status}"

class JobCardRemark(models.Model):
    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='remarks_list')
    remark = models.TextField()
    added_by = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Remark on {self.job_card.job_card_number} by {self.added_by}"
