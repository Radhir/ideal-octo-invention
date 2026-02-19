from django.db import models
from hr.models import Employee
from job_cards.models import JobCard, Service
from customers.models import Customer

class ServiceDelay(models.Model):
    DELAY_SEVERITY = [
        ('LOW', 'Minor Delay (1-2 hours)'),
        ('MEDIUM', 'Moderate Delay (3-6 hours)'),
        ('HIGH', 'Significant Delay (6+ hours)'),
        ('CRITICAL', 'Major Delay (24+ hours)'),
    ]
    
    STATUS_CHOICES = [
        ('REPORTED', 'Reported'),
        ('CUSTOMER_INFORMED', 'Customer Informed'),
        ('APPROVED', 'Extention Approved'),
        ('RESOLVED', 'Delay Resolved'),
    ]

    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='delays')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    delay_number = models.CharField(max_length=50, unique=True)
    
    delay_reason = models.CharField(max_length=255)
    detailed_reason = models.TextField(blank=True)
    severity = models.CharField(max_length=20, choices=DELAY_SEVERITY, default='LOW')
    
    original_completion_date = models.DateTimeField()
    new_estimated_completion_date = models.DateTimeField()
    delay_duration_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    corrective_action_taken = models.TextField(blank=True)
    
    customer_informed = models.BooleanField(default=False)
    customer_informed_at = models.DateTimeField(null=True, blank=True)
    customer_informed_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='informed_delays')
    customer_response = models.TextField(blank=True)
    
    additional_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cost_borne_by = models.CharField(max_length=100, default='COMPANY', choices=[('COMPANY', 'Company'), ('CUSTOMER', 'Customer'), ('STAFF', 'Staff Responsibility')])
    
    approved_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_delays')
    approval_date = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REPORTED')
    reported_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='reported_delays')
    reported_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(blank=True)

    def __str__(self):
        return f"Delay {self.delay_number} - {self.job_card.job_card_number}"

class WorkshopIncident(models.Model):
    INCIDENT_TYPE = [
        ('VEHICLE_DAMAGE', 'Vehicle Damage during Service'),
        ('EQUIPMENT_FAILURE', 'Equipment Failure'),
        ('STAFF_INJURY', 'Staff Injury'),
        ('CUSTOMER_DISPUTE', 'Customer Dispute'),
        ('LOST_ITEM', 'Lost Property'),
    ]
    
    SEVERITY_LEVELS = [
        ('MINOR', 'Minor (No cost/Low risk)'),
        ('MAJOR', 'Major (Cost/Risk involved)'),
        ('SEVERE', 'Severe (Legal/Safety concern)'),
    ]

    incident_number = models.CharField(max_length=50, unique=True)
    job_card = models.ForeignKey(JobCard, on_delete=models.SET_NULL, null=True, blank=True, related_name='incidents')
    incident_type = models.CharField(max_length=50, choices=INCIDENT_TYPE)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='MINOR')
    
    incident_date = models.DateTimeField()
    incident_location = models.CharField(max_length=255)
    incident_description = models.TextField()
    what_happened = models.TextField(help_text="Detailed sequence of events")
    how_it_happened = models.TextField(help_text="Root cause analysis")
    
    reported_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='workshop_incidents')
    witnesses = models.TextField(blank=True)
    
    customer_affected = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    customer_notified = models.BooleanField(default=False)
    customer_notified_at = models.DateTimeField(null=True, blank=True)
    
    damage_description = models.TextField(blank=True)
    damage_photos = models.JSONField(default=list, blank=True)
    
    estimated_repair_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    actual_repair_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    insurance_claim_filed = models.BooleanField(default=False)
    insurance_claim_number = models.CharField(max_length=100, blank=True)
    insurance_company = models.CharField(max_length=255, blank=True)
    claim_status = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)


class Booth(models.Model):
    STATUS_CHOICES = [
        ('READY', 'Ready / Empty'),
        ('ACTIVE', 'Active / Painting'),
        ('BAKING', 'Baking Cycle'),
        ('MAINTENANCE', 'Maintenance'),
        ('QC', 'Quality Control'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='READY')
    current_job = models.OneToOneField('job_cards.JobCard', on_delete=models.SET_NULL, null=True, blank=True, related_name='active_booth')
    
    # Telemetry (Mocked/Future proof)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, default=25.0)
    humidity = models.DecimalField(max_digits=5, decimal_places=2, default=45.0)
    
    last_service_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class PaintMix(models.Model):
    job_card = models.ForeignKey('job_cards.JobCard', on_delete=models.CASCADE, related_name='paint_mixes')
    paint_code = models.CharField(max_length=100)
    color_name = models.CharField(max_length=255)
    formula_data = models.JSONField(default=dict, help_text="Detailed mix weights")
    total_quantity = models.DecimalField(max_digits=10, decimal_places=2, help_text="Quantity in Liters")
    mixed_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='paint_mixes')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mix: {self.paint_code} for {self.job_card.job_card_number}"
