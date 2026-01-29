from django.db import models

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
