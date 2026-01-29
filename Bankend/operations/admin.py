from django.contrib import admin
from .models import Operation

@admin.register(Operation)
class OperationAdmin(admin.ModelAdmin):
    list_display = ['operation_name', 'assigned_to', 'status', 'start_date']
    list_filter = ['status']
    search_fields = ['operation_name', 'assigned_to']
