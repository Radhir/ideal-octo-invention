from django.contrib import admin
from .models import JobCard

@admin.register(JobCard)
class JobCardAdmin(admin.ModelAdmin):
    list_display = ['job_card_number', 'customer_name', 'brand', 'model', 'registration_number', 'net_amount', 'date']
    list_filter = ['brand', 'date']
    search_fields = ['job_card_number', 'customer_name', 'registration_number', 'vin']
    date_hierarchy = 'date'
