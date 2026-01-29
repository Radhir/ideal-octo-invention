from django.contrib import admin
from .models import RequestForm

@admin.register(RequestForm)
class RequestFormAdmin(admin.ModelAdmin):
    list_display = ['request_by', 'car_type', 'plate_number', 'amount', 'date']
    list_filter = ['payment_type', 'date']
    search_fields = ['request_by', 'plate_number', 'chassis_number']
