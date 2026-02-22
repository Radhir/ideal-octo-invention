from django.db import models

class LeaveType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    def __str__(self): return self.name

class LeaveApplication(models.Model):
    employee = models.ForeignKey('hr.Employee', on_delete=models.CASCADE, related_name='leave_applications', null=True)
    employee_name = models.CharField(max_length=255, blank=True) # Legacy
    leave_type_ref = models.ForeignKey(LeaveType, on_delete=models.SET_NULL, null=True, blank=True)
    leave_type = models.CharField(max_length=20, blank=True) # Legacy
    
    leave_period_from = models.DateField()
    leave_period_to = models.DateField()
    total_days = models.IntegerField(editable=False)
    
    reason = models.TextField(blank=True)
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
        return f"{self.employee.full_name if self.employee else self.employee_name} - {self.leave_type_ref.name if self.leave_type_ref else self.leave_type}"
