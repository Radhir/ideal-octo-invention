from rest_framework import serializers
from .models import StockForm, StockItem, StockMovement, Supplier, PurchaseOrder, PurchaseOrderItem

class StockFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockForm
        fields = '__all__'

class StockItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockItem
        fields = '__all__'

class StockMovementSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = StockMovement
        fields = '__all__'
        read_only_fields = ('status', 'date') # Status managed via actions, date auto-added

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
