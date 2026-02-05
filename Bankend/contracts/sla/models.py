from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from customers.models import Customer
# Assuming these apps/models exist based on context, if not I'll need to fix or comment out
# job_cards.JobCard, invoices.Invoice, invoice.CreditNote (Wait, CreditNote was used in views? Check view code later)

class ServiceLevelAgreement(models.Model):
    """SLA agreements with commercial clients"""
    AGREEMENT_TYPES = [
        ('CORPORATE', 'Corporate Fleet'),
        ('DEALERSHIP', 'Dealership'),
        ('RENTAL', 'Rental Company'),
        ('INSURANCE', 'Insurance Partner'),
        ('GOVERNMENT', 'Government'),
        ('INDIVIDUAL', 'Individual Commercial'),
    ]
    
    SERVICE_LEVELS = [
        ('PLATINUM', 'Platinum (24/7)'),
        ('GOLD', 'Gold (Business Hours)'),
        ('SILVER', 'Silver (Next Business Day)'),
        ('BRONZE', 'Bronze (48 Hours)'),
    ]
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    agreement_type = models.CharField(max_length=50, choices=AGREEMENT_TYPES)
    agreement_number = models.CharField(max_length=50, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    service_level = models.CharField(max_length=50, choices=SERVICE_LEVELS)
    
    # Response Time SLAs (in hours)
    emergency_response_time = models.IntegerField(  # For platinum
        validators=[MinValueValidator(1), MaxValueValidator(24)],
        null=True, blank=True
    )
    standard_response_time = models.IntegerField(  # In business hours
        validators=[MinValueValidator(1), MaxValueValidator(72)]
    )
    resolution_time = models.IntegerField(  # Time to complete job
        validators=[MinValueValidator(1), MaxValueValidator(168)]
    )
    
    # Service Credits
    service_credit_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=5.00
    )
    min_service_credit = models.DecimalField(
        max_digits=10, decimal_places=2,
        default=100.00
    )
    
    # Pricing
    monthly_retainer = models.DecimalField(
        max_digits=12, decimal_places=2, 
        null=True, blank=True
    )
    discount_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=0.00
    )
    priority_surcharge = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(50)],
        default=0.00
    )
    
    # Terms
    auto_renew = models.BooleanField(default=True)
    notice_period_days = models.IntegerField(default=30)
    termination_penalty = models.DecimalField(
        max_digits=10, decimal_places=2,
        default=0.00
    )
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    signed_by = models.CharField(max_length=100, blank=True)
    signed_date = models.DateField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['agreement_number']),
            models.Index(fields=['customer', 'is_active']),
            models.Index(fields=['end_date']),
        ]
    
    def __str__(self):
        return f"{self.agreement_number} - {self.customer.name}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return self.end_date < timezone.now().date()
    
    @property
    def days_until_expiry(self):
        from django.utils import timezone
        return (self.end_date - timezone.now().date()).days

class SLAMetric(models.Model):
    """Track SLA compliance metrics"""
    sla = models.ForeignKey(ServiceLevelAgreement, on_delete=models.CASCADE)
    month = models.DateField()  # First day of month
    
    # Response Time Metrics
    total_requests = models.IntegerField(default=0)
    on_time_responses = models.IntegerField(default=0)
    average_response_time = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    
    # Resolution Time Metrics
    total_jobs = models.IntegerField(default=0)
    on_time_completions = models.IntegerField(default=0)
    average_completion_time = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    
    # Quality Metrics
    customer_satisfaction_score = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        null=True, blank=True
    )
    rework_rate = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=0
    )
    
    # Financial Impact
    service_credits_issued = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    revenue_impact = models.DecimalField(
        max_digits=12, decimal_places=2, default=0
    )
    
    calculated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['sla', 'month']
        indexes = [
            models.Index(fields=['sla', 'month']),
        ]
    
    @property
    def response_time_compliance(self):
        if self.total_requests == 0:
            return 100
        return (self.on_time_responses / self.total_requests) * 100
    
    @property
    def completion_time_compliance(self):
        if self.total_jobs == 0:
            return 100
        return (self.on_time_completions / self.total_jobs) * 100

class SLAViolation(models.Model):
    """Track SLA violations and service credits"""
    VIOLATION_TYPES = [
        ('RESPONSE_TIME', 'Response Time Exceeded'),
        ('RESOLUTION_TIME', 'Resolution Time Exceeded'),
        ('QUALITY', 'Quality Issue'),
        ('AVAILABILITY', 'Service Unavailable'),
        ('COMMUNICATION', 'Communication Failure'),
    ]
    
    sla = models.ForeignKey(ServiceLevelAgreement, on_delete=models.CASCADE)
    job_card = models.ForeignKey(
        'job_cards.JobCard', 
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    violation_type = models.CharField(max_length=50, choices=VIOLATION_TYPES)
    violation_date = models.DateTimeField()
    
    # Details
    expected_time = models.DecimalField(max_digits=10, decimal_places=2)
    actual_time = models.DecimalField(max_digits=10, decimal_places=2)
    time_exceeded = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    
    # Impact
    service_credit_amount = models.DecimalField(
        max_digits=10, decimal_places=2
    )
    invoice_adjusted = models.BooleanField(default=False)
    adjusted_invoice = models.ForeignKey(
        'invoices.Invoice',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    
    # Resolution
    is_acknowledged = models.BooleanField(default=False)
    acknowledged_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='acknowledged_violations'
    )
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    
    root_cause = models.TextField(blank=True)
    corrective_action = models.TextField(blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['sla', 'violation_date']),
            models.Index(fields=['violation_type']),
        ]

class SLAReport(models.Model):
    """Monthly SLA reports for customers"""
    REPORT_TYPES = [
        ('MONTHLY', 'Monthly Performance Report'),
        ('QUARTERLY', 'Quarterly Business Review'),
        ('ANNUAL', 'Annual Contract Review'),
        ('ADHOC', 'Ad-hoc Report'),
    ]
    
    sla = models.ForeignKey(ServiceLevelAgreement, on_delete=models.CASCADE)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Metrics Summary
    overall_compliance_score = models.DecimalField(
        max_digits=5, decimal_places=2
    )
    total_violations = models.IntegerField(default=0)
    total_service_credits = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    
    # Generated Content
    executive_summary = models.TextField()
    detailed_analysis = models.TextField()
    recommendations = models.TextField()
    
    # Delivery
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True
    )
    sent_to_customer = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    customer_acknowledged = models.BooleanField(default=False)
    
    # File
    report_file = models.FileField(
        upload_to='sla_reports/%Y/%m/',
        null=True, blank=True
    )
    
    class Meta:
        indexes = [
            models.Index(fields=['sla', 'period_end']),
        ]

class SLARenewal(models.Model):
    """Track SLA renewals"""
    original_sla = models.ForeignKey(ServiceLevelAgreement, on_delete=models.CASCADE, related_name='renewals')
    renewed_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
    renewal_months = models.IntegerField()
    new_end_date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class CreditNote(models.Model):
    """Credit note for invoice adjustments due to SLA violations"""
    invoice = models.ForeignKey('invoices.Invoice', on_delete=models.CASCADE, related_name='credit_notes')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField()
    created_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
