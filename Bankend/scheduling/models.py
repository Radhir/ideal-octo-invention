from django.db import models
from django.contrib.auth.models import User
from job_cards.models import JobCard
from bookings.models import Booking

class WorkTeam(models.Model):
    SECTION_CHOICES = [
        ('DETAILING', 'Detailing'),
        ('PAINTING', 'Painting'),
        ('PPF_WRAPPING', 'PPF & Wrapping'),
    ]
    name = models.CharField(max_length=100)
    section = models.CharField(max_length=20, choices=SECTION_CHOICES)
    leader = models.CharField(max_length=100, blank=True)
    capacity = models.PositiveIntegerField(default=4)
    spacer = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.name} ({self.get_section_display()})"

class ScheduleAssignment(models.Model):
    team = models.ForeignKey(WorkTeam, on_delete=models.CASCADE, related_name='assignments')
    job_card = models.ForeignKey(JobCard, on_delete=models.SET_NULL, null=True, blank=True)
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    slot_number = models.PositiveIntegerField()
    is_overtime = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ('team', 'date', 'slot_number', 'is_overtime')

    def __str__(self):
        return f"{self.team.name} - {self.date} - Slot {self.slot_number}"

class AdvisorSheet(models.Model):
    advisor = models.CharField(max_length=100)
    date = models.DateField()
    targets = models.TextField(blank=True)
    receiving_count = models.PositiveIntegerField(default=0)
    delivery_count = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.advisor} - {self.date}"

class DailyClosing(models.Model):
    date = models.DateField(unique=True)
    total_jobs_received = models.PositiveIntegerField(default=0)
    total_jobs_delivered = models.PositiveIntegerField(default=0)
    revenue_daily = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    summary_notes = models.TextField(blank=True)
    is_closed = models.BooleanField(default=False)
    closed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Closing for {self.date}"

class EmployeeDailyReport(models.Model):
    ROLE_CHOICES = [
        ('SALES', 'Sales/Service Advisor'),
        ('ACCOUNTS', 'Accounts/Finance'),
        ('OPERATIONS', 'Workshop Operations'),
        ('GENERAL', 'General Staff'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    # Common Tasks
    tasks_completed = models.TextField(blank=True, help_text="List of tasks done today")
    
    # Sales Specific
    upsell_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    upsell_count = models.PositiveIntegerField(default=0)
    complaints_received = models.PositiveIntegerField(default=0)
    complaints_resolved = models.PositiveIntegerField(default=0)
    new_bookings = models.PositiveIntegerField(default=0)
    
    # Accounts Specific
    collections_today = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payments_processed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    petty_cash_closing = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Operations Specific
    workshop_delivery_count = models.PositiveIntegerField(default=0)
    qc_passed_count = models.PositiveIntegerField(default=0)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date} ({self.role})"
