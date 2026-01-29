from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Customer, Product, Shipment, ShipmentItem,
    SalesOrder, SalesOrderItem, CostOfSales, SellingExpense,
    DriverLicense, Pickup
)
from .serializers import (
    CustomerSerializer, ProductSerializer, ShipmentSerializer, ShipmentListSerializer,
    SalesOrderSerializer, SalesOrderListSerializer, CostOfSalesSerializer, SellingExpenseSerializer,
    DriverLicenseSerializer, PickupSerializer
)

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('name')
    serializer_class = CustomerSerializer
    
    @action(detail=False, methods=['get'])
    def external(self, request):
        """Get only external customers"""
        external_customers = self.queryset.filter(customer_type__in=['EXTERNAL', 'B2B', 'B2C'])
        serializer = self.get_serializer(external_customers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def internal(self, request):
        """Get only internal customers (Elite Shine Group)"""
        internal_customers = self.queryset.filter(customer_type='INTERNAL')
        serializer = self.get_serializer(internal_customers, many=True)
        return Response(serializer.data)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('sku')
    serializer_class = ProductSerializer
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products below reorder level"""
        low_stock_products = [p for p in self.queryset if p.needs_reorder]
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        """Adjust product stock"""
        product = self.get_object()
        adjustment = request.data.get('adjustment', 0)
        product.current_stock += float(adjustment)
        product.save()
        serializer = self.get_serializer(product)
        return Response(serializer.data)

class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ShipmentListSerializer
        return ShipmentSerializer
    
    @action(detail=False, methods=['get'])
    def in_transit(self, request):
        """Get active shipments"""
        active_shipments = self.queryset.filter(status__in=['PENDING', 'IN_TRANSIT', 'ARRIVED', 'CUSTOMS'])
        serializer = ShipmentListSerializer(active_shipments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update shipment status"""
        shipment = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            shipment.status = new_status
            if new_status == 'DELIVERED' and not shipment.actual_arrival:
                from datetime import date
                shipment.actual_arrival = date.today()
            shipment.save()
        serializer = self.get_serializer(shipment)
        return Response(serializer.data)

class SalesOrderViewSet(viewsets.ModelViewSet):
    queryset = SalesOrder.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SalesOrderListSerializer
        return SalesOrderSerializer
    
    @action(detail=False, methods=['get'])
    def pending_payment(self, request):
        """Get orders with outstanding balance"""
        pending_orders = [o for o in self.queryset if o.balance_due > 0]
        serializer = SalesOrderListSerializer(pending_orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def record_payment(self, request, pk=None):
        """Record a payment"""
        order = self.get_object()
        amount = float(request.data.get('amount', 0))
        order.payment_received += amount
        if order.is_paid:
            order.status = 'PAID'
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

class CostOfSalesViewSet(viewsets.ModelViewSet):
    queryset = CostOfSales.objects.all().order_by('-date')
    serializer_class = CostOfSalesSerializer

class SellingExpenseViewSet(viewsets.ModelViewSet):
    queryset = SellingExpense.objects.all().order_by('-date')
    serializer_class = SellingExpenseSerializer

class DriverLicenseViewSet(viewsets.ModelViewSet):
    queryset = DriverLicense.objects.all().order_by('employee__first_name')
    serializer_class = DriverLicenseSerializer

class PickupViewSet(viewsets.ModelViewSet):
    queryset = Pickup.objects.all().order_by('-pickup_date')
    serializer_class = PickupSerializer
