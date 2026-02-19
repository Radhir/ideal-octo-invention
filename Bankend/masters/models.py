from django.db import models

class Vehicle(models.Model):
    vin = models.CharField(max_length=100, unique=True, verbose_name="VIN/Chassis")
    registration_number = models.CharField(max_length=50, unique=True, verbose_name="Plate Number")
    plate_emirate = models.CharField(max_length=50, default="Dubai")
    plate_code = models.CharField(max_length=20, blank=True)
    
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    color = models.CharField(max_length=50, blank=True)
    
    engine_number = models.CharField(max_length=100, blank=True)
    chassis_number = models.CharField(max_length=100, blank=True) # Usually same as VIN
    
    # Relationships
    customer = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicles')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Vehicle Node"
        verbose_name_plural = "Vehicle Registry"

    def __str__(self):
        return f"{self.brand} {self.model} ({self.registration_number})"
