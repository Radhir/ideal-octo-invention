from django.db import models
from customers.models import Customer
from locations.models import Branch
import uuid

class JobCard(models.Model):
    STATUS_CHOICES = [
        ('RECEPTION', 'Reception'),
        ('ESTIMATION', 'Estimation'),
        ('WORK_ASSIGNMENT', 'Work Assignment'),
        ('WIP', 'Work In Progress'),
        ('QC', 'Quality Check'),
        ('INVOICING', 'Invoicing'),
        ('DELIVERY', 'Ready for Delivery'),
        ('CLOSED', 'Closed'),
    ]

    job_card_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='RECEPTION')
    date = models.DateField()
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    
    # Reception Info
    customer_name = models.CharField(max_length=255)
    customer_profile = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    related_lead = models.ForeignKey('leads.Lead', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    related_booking = models.ForeignKey('bookings.Booking', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    related_booking = models.ForeignKey('bookings.Booking', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    
    registration_number = models.CharField(max_length=50)
    plate_emirate = models.CharField(max_length=50, blank=True, null=True)
    plate_code = models.CharField(max_length=10, blank=True, null=True)
    vin = models.CharField(max_length=50)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    color = models.CharField(max_length=50)
    kilometers = models.PositiveIntegerField()
    
    service_advisor_legacy = models.CharField(max_length=255, blank=True, null=True)
    service_advisor = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='advised_jobs')
    initial_inspection_notes = models.TextField(blank=True)

    # Work Assignment
    assigned_technician_legacy = models.CharField(max_length=255, blank=True, null=True)
    assigned_technician = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_jobs')
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
    
    # Commission Tracking
    commission_applied = models.BooleanField(default=False)
    advisor_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    technician_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
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
            
        old_status = None
        if self.pk:
            try:
                old_status = JobCard.objects.get(pk=self.pk).status
            except JobCard.DoesNotExist:
                pass
        
        super().save(*args, **kwargs)
        
        # Trigger Financial Transaction on Completion
        if self.status == 'CLOSED' and old_status != 'CLOSED':
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
                tech_comm = (self.total_amount * 2) / 100 # Default 2% for tech
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
