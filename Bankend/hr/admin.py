from django.contrib import admin
from .models import Employee, HRRule, Payroll, Roster, HRAttendance, Team, Department

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'monthly_sales_target', 'monthly_expense_budget', 'head')
    search_fields = ('name',)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'employee_id', 'role', 'is_active')
    search_fields = ('user__username', 'employee_id')

admin.site.register(HRRule)
admin.site.register(Payroll)
admin.site.register(Roster)
admin.site.register(HRAttendance)
admin.site.register(Team)
