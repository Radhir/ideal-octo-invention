from django.contrib import admin
from .models import CeramicWarrantyRegistration

@admin.register(CeramicWarrantyRegistration)
class CeramicWarrantyRegistrationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'vehicle_brand', 'vehicle_model', 'license_plate', 'installation_date']
    list_filter = ['branch_location', 'coating_type', 'installation_date']
    search_fields = ['full_name', 'license_plate', 'vin', 'email']
    date_hierarchy = 'installation_date'
