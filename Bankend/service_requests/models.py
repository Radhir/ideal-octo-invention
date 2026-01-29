from django.db import models

class RequestForm(models.Model):
    request_by = models.CharField(max_length=255)
    car_type = models.CharField(max_length=100)
    plate_number = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    payment_type = models.CharField(max_length=50)
    chassis_number = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request by {self.request_by} - {self.plate_number}"
