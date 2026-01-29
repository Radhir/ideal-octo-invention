from django.db import models

class Operation(models.Model):
    operation_name = models.CharField(max_length=255)
    
    # Linked to Workflow
    job_card = models.ForeignKey('job_cards.JobCard', on_delete=models.CASCADE, related_name='operations', null=True)
    
    # Linked to HR
    assigned_to = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_operations')
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    estimated_completion = models.DateTimeField(null=True, blank=True)
    
    progress_percentage = models.IntegerField(default=0)
    status = models.CharField(max_length=50, choices=[
        ('PENDING', 'Pending Start'),
        ('IN_PROGRESS', 'In Progress'), 
        ('COMPLETED', 'Completed'), 
        ('ON_HOLD', 'On Hold')
    ], default='PENDING')
    
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.operation_name} - {self.job_card.job_card_number if self.job_card else 'NO JC'}"
