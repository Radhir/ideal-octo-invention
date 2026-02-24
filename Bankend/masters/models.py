from django.db import models

class VehicleBrand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='brands/', null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class VehicleModel(models.Model):
    brand = models.ForeignKey(VehicleBrand, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('brand', 'name')

    def __str__(self):
        return f"{self.brand.name} {self.name}"

class VehicleType(models.Model):
    name = models.CharField(max_length=50, unique=True) # e.g. Sedan, SUV, Luxury
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    vin = models.CharField(max_length=100, unique=True, verbose_name="VIN/Chassis")
    registration_number = models.CharField(max_length=50, unique=True, verbose_name="Plate Number")
    plate_emirate = models.CharField(max_length=50, default="Dubai")
    plate_code = models.CharField(max_length=20, blank=True)
    
    brand = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    
    # New relationships for managed registry
    brand_node = models.ForeignKey(VehicleBrand, on_delete=models.SET_NULL, null=True, blank=True)
    model_node = models.ForeignKey(VehicleModel, on_delete=models.SET_NULL, null=True, blank=True)
    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.SET_NULL, null=True, blank=True)
    
    year = models.IntegerField(null=True, blank=True)
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

class InsuranceCompany(models.Model):
    # ... (remains same)
    name = models.CharField(max_length=255, unique=True)
    address = models.TextField(blank=True)
    contact_person = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    trn = models.CharField(max_length=50, blank=True, verbose_name="TRN / Tax ID")
    payment_terms = models.CharField(max_length=100, blank=True, help_text="e.g. 30 Days Credit")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Insurance Companies"

    def __str__(self):
        return self.name

class VehicleColor(models.Model):
    name = models.CharField(max_length=50, unique=True)
    hex_code = models.CharField(max_length=7, default="#000000", help_text="Hex color code (e.g. #FF0000)")
    
    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=255, unique=True)
    department = models.ForeignKey('hr.Department', on_delete=models.SET_NULL, null=True, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
