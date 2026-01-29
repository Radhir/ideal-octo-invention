from django.contrib import admin
from .models import Invoice

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'customer_name', 'date', 'grand_total', 'payment_status']
    list_filter = ['payment_status', 'date']
    search_fields = ['invoice_number', 'customer_name']
