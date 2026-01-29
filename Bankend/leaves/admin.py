from django.contrib import admin
from .models import LeaveApplication

@admin.register(LeaveApplication)
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = ['employee_name', 'position', 'leave_type', 'leave_period_from', 'leave_period_to', 'total_days']
    list_filter = ['leave_type', 'manager_approval', 'hr_approval', 'leave_period_from']
    search_fields = ['employee_name', 'position']
