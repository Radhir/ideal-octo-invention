from django.contrib import admin
from .models import WorkTeam, ScheduleAssignment, AdvisorSheet, DailyClosing, EmployeeDailyReport

@admin.register(WorkTeam)
class WorkTeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'section', 'leader', 'capacity')
    list_filter = ('section',)

@admin.register(ScheduleAssignment)
class ScheduleAssignmentAdmin(admin.ModelAdmin):
    list_display = ('team', 'date', 'slot_number', 'is_overtime')
    list_filter = ('date', 'team')

@admin.register(AdvisorSheet)
class AdvisorSheetAdmin(admin.ModelAdmin):
    list_display = ('advisor', 'date', 'receiving_count', 'delivery_count')
    list_filter = ('date', 'advisor')

@admin.register(DailyClosing)
class DailyClosingAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_jobs_received', 'total_jobs_delivered', 'revenue_daily', 'is_closed')
    list_filter = ('date', 'is_closed')

@admin.register(EmployeeDailyReport)
class EmployeeDailyReportAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'role', 'upsell_amount', 'collections_today', 'workshop_delivery_count')
    list_filter = ('date', 'role', 'user')
    search_fields = ('user__username', 'notes', 'tasks_completed')
