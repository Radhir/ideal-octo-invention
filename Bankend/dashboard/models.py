from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class WorkshopDiary(models.Model):
    date = models.DateField(unique=True, default=timezone.now)
    new_bookings_count = models.IntegerField(default=0)
    new_jobs_count = models.IntegerField(default=0)
    closed_jobs_count = models.IntegerField(default=0)
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    audit_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Workshop Diary - {self.date}"

    class Meta:
        verbose_name_plural = "Workshop Diaries"


class ChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    text = models.TextField()
    is_system = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.get_full_name() or self.sender.username}: {self.text[:50]}"


class DailyReport(models.Model):
    """Daily Report submitted by department heads, managers, and service advisors"""
    
    REPORT_TYPE_CHOICES = [
        ('DEPARTMENT_HEAD', 'Department Head Report'),
        ('OPERATIONS_MANAGER', 'Operations Manager Report'),
        ('MANAGER', 'Manager Report'),
        ('SERVICE_ADVISOR', 'Service Advisor Report'),
        ('MEDIA_TEAM', 'Media Team Report'),
    ]
    
    # Reporter Info - Import models at top
    employee = models.ForeignKey('hr.Employee', on_delete=models.CASCADE, related_name='daily_reports')
    company = models.ForeignKey('hr.Company', on_delete=models.CASCADE, related_name='daily_reports')
    department = models.ForeignKey('hr.Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='daily_reports')
    
    # Report Details
    report_date = models.DateField()
    report_type = models.CharField(max_length=30, choices=REPORT_TYPE_CHOICES)
    shift = models.CharField(max_length=20, choices=[('MORNING', 'Morning'), ('EVENING', 'Evening'), ('FULL_DAY', 'Full Day')], default='FULL_DAY')
    
    # Summary
    summary = models.TextField(help_text="Brief summary of the day's activities")
    
    # Performance Metrics
    jobs_completed = models.IntegerField(default=0, help_text="Number of jobs completed today")
    jobs_in_progress = models.IntegerField(default=0, help_text="Number of jobs currently in progress")
    new_customers = models.IntegerField(default=0, help_text="New customers acquired")
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Revenue generated today")
    
    # Media Team Specific
    photos_uploaded = models.IntegerField(default=0, help_text="Number of photos uploaded (Media Team)")
    videos_uploaded = models.IntegerField(default=0, help_text="Number of videos uploaded (Media Team)")
    
    # Issues & Challenges
    issues_faced = models.TextField(blank=True, help_text="Any issues or challenges faced today")
    pending_tasks = models.TextField(blank=True, help_text="Tasks pending for next day")
    
    # Team Performance
    team_attendance = models.CharField(max_length=255, blank=True, help_text="e.g., '8/10 present'")
    team_notes = models.TextField(blank=True, help_text="Notes about team performance")
    
    # Closing Notes
    closing_notes = models.TextField(blank=True, help_text="End of day closing notes")
    next_day_plan = models.TextField(blank=True, help_text="Plan for next day")
    
    # Reviewed By Elite Admins
    reviewed_by_radhir = models.BooleanField(default=False)
    reviewed_by_ruchika = models.BooleanField(default=False)
    reviewed_by_afsar = models.BooleanField(default=False)
    
    radhir_comments = models.TextField(blank=True)
    ruchika_comments = models.TextField(blank=True)
    afsar_comments = models.TextField(blank=True)
    
    # Status
    is_submitted = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-report_date', '-created_at']
        unique_together = ['employee', 'report_date', 'shift']
    
    def __str__(self):
        return f"{self.employee.user.username} - {self.report_date} ({self.get_report_type_display()})"
    
    @property
    def is_fully_reviewed(self):
        """Check if all three admins have reviewed"""
        return self.reviewed_by_radhir and self.reviewed_by_ruchika and self.reviewed_by_afsar
