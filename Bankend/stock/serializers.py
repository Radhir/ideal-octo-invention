from rest_framework import serializers
from .models import (
    StockForm, StockItem, StockMovement, Supplier, 
    PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseReturn,
    StockTransfer, StockTransferItem
)

class StockFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockForm
        fields = '__all__'

class StockItemSerializer(serializers.ModelSerializer):
    branch_name = serializers.ReadOnlyField(source='branch.name')
    class Meta:
        model = StockItem
        fields = '__all__'

class StockMovementSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = StockMovement
        fields = '__all__'
        read_only_fields = ('status', 'date')

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    class Meta:
        model = PurchaseOrderItem
        fields = '__all__'

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    
    class Meta:
        model = PurchaseOrder
        fields = '__all__'

class PurchaseInvoiceSerializer(serializers.ModelSerializer):
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    class Meta:
        model = PurchaseInvoice
        fields = '__all__'

class PurchaseReturnSerializer(serializers.ModelSerializer):
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    class Meta:
        model = PurchaseReturn
        fields = '__all__'

class StockTransferItemSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    sku = serializers.ReadOnlyField(source='item.sku')
    
    class Meta:
        model = StockTransferItem
        fields = '__all__'

class StockTransferSerializer(serializers.ModelSerializer):
    items = StockTransferItemSerializer(many=True, read_only=True)
    from_branch_name = serializers.ReadOnlyField(source='from_branch.name')
    to_branch_name = serializers.ReadOnlyField(source='to_branch.name')
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = StockTransfer
        fields = '__all__'
