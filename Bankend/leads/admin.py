from django.contrib import admin
from .models import Lead

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'phone', 'source', 'status', 'created_at']#car_plate_number , reverted complaints ,
    list_filter = ['status', 'source']
    search_fields = ['customer_name', 'phone']
