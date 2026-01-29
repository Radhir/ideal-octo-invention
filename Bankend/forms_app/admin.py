from django.contrib import admin
from .models import *

@admin.register(PPFWarrantyRegistration)
class PPFWarrantyRegistrationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'vehicle_brand', 'vehicle_model', 'license_plate', 'installation_date']
    list_filter = ['branch_location', 'film_type', 'installation_date']
    search_fields = ['full_name', 'license_plate', 'vin', 'email']
    date_hierarchy = 'installation_date'

@admin.register(JobCard)
class JobCardAdmin(admin.ModelAdmin):
    list_display = ['job_card_number', 'customer_name', 'brand', 'model', 'registration_number', 'net_amount', 'date']
    list_filter = ['brand', 'date']
    search_fields = ['job_card_number', 'customer_name', 'registration_number', 'vin']
    date_hierarchy = 'date'

@admin.register(RequestForm)
class RequestFormAdmin(admin.ModelAdmin):
    list_display = ['request_by', 'car_type', 'plate_number', 'amount', 'date']
    list_filter = ['payment_type', 'date']
    search_fields = ['request_by', 'plate_number', 'chassis_number']

@admin.register(StockForm)
class StockFormAdmin(admin.ModelAdmin):
    list_display = ['department', 'request_by', 'car_type', 'amount', 'date']
    list_filter = ['department', 'payment_type', 'date']
    search_fields = ['request_by', 'plate_number', 'item_description']

@admin.register(LeaveApplication)
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = ['employee_name', 'position', 'leave_type', 'leave_period_from', 'leave_period_to', 'total_days']
    list_filter = ['leave_type', 'manager_approval', 'hr_approval', 'leave_period_from']
    search_fields = ['employee_name', 'position']

@admin.register(Checklist)
class ChecklistAdmin(admin.ModelAdmin):
    list_display = ['checklist_number', 'vehicle_brand', 'vehicle_model', 'registration_number', 'technician_name', 'date']
    list_filter = ['date', 'vehicle_brand']
    search_fields = ['checklist_number', 'registration_number', 'vin']

@admin.register(CeramicWarrantyRegistration)
class CeramicWarrantyRegistrationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'vehicle_brand', 'vehicle_model', 'license_plate', 'installation_date']
    list_filter = ['branch_location', 'coating_type', 'installation_date']
    search_fields = ['full_name', 'license_plate', 'vin', 'email']
    date_hierarchy = 'installation_date'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'vehicle_details', 'service_type', 'booking_date', 'status']
    list_filter = ['status', 'booking_date']
    search_fields = ['customer_name', 'vehicle_details']

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'phone', 'source', 'status', 'created_at']
    list_filter = ['status', 'source']
    search_fields = ['customer_name', 'phone']

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'customer_name', 'date', 'grand_total', 'payment_status']
    list_filter = ['payment_status', 'date']
    search_fields = ['invoice_number', 'customer_name']

@admin.register(Operation)
class OperationAdmin(admin.ModelAdmin):
    list_display = ['operation_name', 'assigned_to', 'status', 'start_date']
    list_filter = ['status']
    search_fields = ['operation_name', 'assigned_to']
