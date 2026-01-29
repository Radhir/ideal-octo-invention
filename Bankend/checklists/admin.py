from django.contrib import admin
from .models import Checklist

@admin.register(Checklist)
class ChecklistAdmin(admin.ModelAdmin):
    list_display = ['checklist_number', 'vehicle_brand', 'vehicle_model', 'registration_number', 'technician_name', 'date']
    list_filter = ['date', 'vehicle_brand']
    search_fields = ['checklist_number', 'registration_number', 'vin']
