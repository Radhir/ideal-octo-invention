from django.db import models

class PickAndDrop(models.Model):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('PICKED_UP', 'Picked Up'),
        ('IN_TRANSIT', 'In Transit'),
        ('AT_WORKSHOP', 'At Workshop'),
        ('DROP_OFF_READY', 'Ready for Drop-off'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    customer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    
    # Normalized vehicle details
    vehicle_brand = models.CharField(max_length=100, blank=True)
    vehicle_model = models.CharField(max_length=100, blank=True)
    license_plate = models.CharField(max_length=50)
    
    pickup_location = models.CharField(max_length=255)
    drop_off_location = models.CharField(max_length=255)
    scheduled_time = models.DateTimeField()
    
    # Linked to HR
    driver = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='driver_logs')
    
    # Linked to Workflow
    job_card = models.ForeignKey('job_cards.JobCard', on_delete=models.SET_NULL, null=True, blank=True, related_name='pick_drop_logs')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} ({self.license_plate}) - {self.status}"
