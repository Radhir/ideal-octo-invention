from django.db import models
from hr.models import Employee
from datetime import datetime, timedelta

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
        ('LATE', 'Late'),
        ('HALF_DAY', 'Half Day'),
        ('ON_LEAVE', 'On Leave'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField(auto_now_add=True)
    
    check_in_time = models.TimeField(null=True, blank=True)
    check_out_time = models.TimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ABSENT')
    
    # Roster & Calculation Fields
    is_late = models.BooleanField(default=False)
    total_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('employee', 'date')

    def save(self, *args, **kwargs):
        # 1. Universal 10-Hour Roster Logic (e.g., Shift starts at 9:00 AM)
        ROSTER_START_HOUR = 9
        ROSTER_SHIFT_HOURS = 10
        
        # Check Late Status
        if self.check_in_time:
            if self.check_in_time.hour > ROSTER_START_HOUR: # LATE after 9 AM
                self.is_late = True
                self.status = 'LATE'
            elif self.status == 'ABSENT': # If checking in on time
                self.status = 'PRESENT'

        # Calculate Total Hours & Overtime
        if self.check_in_time and self.check_out_time:
            dummy_date = datetime.today().date()
            start = datetime.combine(dummy_date, self.check_in_time)
            end = datetime.combine(dummy_date, self.check_out_time)
            
            duration = (end - start).total_seconds() / 3600 # hours
            self.total_hours = round(duration, 2)
            
            # Simple OT Calculation: Anything above 10 hours is OT
            if self.total_hours > ROSTER_SHIFT_HOURS:
                self.overtime_hours = self.total_hours - ROSTER_SHIFT_HOURS
            else:
                self.overtime_hours = 0
                
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee} - {self.date} ({self.status})"
