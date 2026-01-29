from rest_framework import serializers
from .models import (
    Customer, Product, Shipment, ShipmentItem,
    SalesOrder, SalesOrderItem, CostOfSales, SellingExpense,
    DriverLicense, Pickup
)

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    needs_reorder = serializers.ReadOnlyField()
    margin_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = '__all__'

class ShipmentItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    total_cost = serializers.ReadOnlyField()
    
    class Meta:
        model = ShipmentItem
        fields = '__all__'

class ShipmentSerializer(serializers.ModelSerializer):
    total_logistics_cost = serializers.ReadOnlyField()
    is_delayed = serializers.ReadOnlyField()
    items = ShipmentItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Shipment
        fields = '__all__'

class ShipmentListSerializer(serializers.ModelSerializer):
    total_logistics_cost = serializers.ReadOnlyField()
    is_delayed = serializers.ReadOnlyField()
    
    class Meta:
        model = Shipment
        fields = ['id', 'shipment_number', 'shipment_type', 'origin', 'destination',
                  'shipping_method', 'status', 'shipped_date', 'expected_arrival',
                  'total_logistics_cost', 'is_delayed']

class SalesOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    line_total = serializers.ReadOnlyField()
    
    class Meta:
        model = SalesOrderItem
        fields = '__all__'

class SalesOrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    balance_due = serializers.ReadOnlyField()
    is_paid = serializers.ReadOnlyField()
    items = SalesOrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = SalesOrder
        fields = '__all__'

class SalesOrderListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    balance_due = serializers.ReadOnlyField()
    
    class Meta:
        model = SalesOrder
        fields = ['id', 'order_number', 'customer_name', 'order_date',
                  'total_amount', 'status', 'balance_due', 'created_at']

class CostOfSalesSerializer(serializers.ModelSerializer):
    total_cost_of_sales = serializers.ReadOnlyField()
    
    class Meta:
        model = CostOfSales
        fields = '__all__'

class SellingExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellingExpense
        fields = '__all__'

class DriverLicenseSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    
    class Meta:
        model = DriverLicense
        fields = '__all__'

class PickupSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    shipment_number = serializers.CharField(source='shipment.shipment_number', read_only=True)
    driver_name = serializers.CharField(source='driver.full_name', read_only=True)
    
    class Meta:
        model = Pickup
        fields = '__all__'
