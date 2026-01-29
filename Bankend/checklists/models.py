from django.db import models

class Checklist(models.Model):
    checklist_number = models.CharField(max_length=50, unique=True)
    vehicle_brand = models.CharField(max_length=100)
    vehicle_model = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=50)
    technician_name = models.CharField(max_length=255)
    date = models.DateField()
    vin = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.checklist_number
