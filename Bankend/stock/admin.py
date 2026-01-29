from django.contrib import admin
from .models import StockForm, StockItem, StockMovement, Supplier, PurchaseOrder, PurchaseOrderItem

@admin.register(StockForm)
class StockFormAdmin(admin.ModelAdmin):
    list_display = ['department', 'request_by', 'car_type', 'amount', 'date']
    list_filter = ['department', 'payment_type', 'date']
    search_fields = ['request_by', 'plate_number', 'item_description']

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'contact_person', 'phone', 'email']
    search_fields = ['name', 'contact_person', 'trade_license']

class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 1

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ['po_number', 'supplier', 'status', 'order_date', 'total_amount']
    list_filter = ['status', 'order_date']
    search_fields = ['po_number', 'supplier__name']
    inlines = [PurchaseOrderItemInline]
