from django.contrib import admin
from .models import LeaveApplication

@admin.register(LeaveApplication)
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type_ref', 'leave_period_from', 'leave_period_to', 'total_days', 'manager_approval', 'hr_approval']
    list_filter = ['leave_type_ref', 'manager_approval', 'hr_approval', 'leave_period_from']
    search_fields = ['employee__user__username', 'employee__full_name_passport', 'leave_type_ref__name']
