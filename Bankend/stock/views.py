from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F
from django.contrib import messages
from .models import StockForm, StockItem, StockMovement, Supplier, PurchaseOrder, PurchaseOrderItem
from .forms import StockFormForm
from .serializers import (
    StockFormSerializer, StockItemSerializer, StockMovementSerializer,
    SupplierSerializer, PurchaseOrderSerializer, PurchaseOrderItemSerializer
)
from decimal import Decimal

def stock_create(request):
    if request.method == 'POST':
        form = StockFormForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Stock Form created successfully!')
            return redirect('stock_list')
    else:
        form = StockFormForm()
    
    return render(request, 'forms/stock_form.html', {'form': form, 'title': 'Stock Form'})

def stock_list(request):
    stocks = StockForm.objects.all().order_by('-created_at')
    return render(request, 'forms/stock_list.html', {'stocks': stocks})

class StockFormViewSet(viewsets.ModelViewSet):
    queryset = StockForm.objects.all().order_by('-created_at')
    serializer_class = StockFormSerializer

class StockItemViewSet(viewsets.ModelViewSet):
    serializer_class = StockItemSerializer
    queryset = StockItem.objects.all()

    def get_queryset(self):
        queryset = StockItem.objects.all().order_by('category', 'name')
        sku = self.request.query_params.get('sku')
        if sku:
            queryset = queryset.filter(sku=sku)
        return queryset

    @action(detail=False, methods=['get'])
    def inventory_stats(self, request):
        total_value = StockItem.objects.aggregate(
            value=Sum(F('current_stock') * F('unit_cost'))
        )['value'] or 0
        low_stock_count = StockItem.objects.filter(current_stock__lte=F('safety_level')).count()
        
        # Category breakdown with valuation
        breakdown = []
        for cat, label in StockItem.CATEGORIES:
            items = StockItem.objects.filter(category=cat)
            count = items.count()
            if count > 0:
                cat_value = items.aggregate(
                    val=Sum(F('current_stock') * F('unit_cost'))
                )['val'] or 0
                breakdown.append({
                    'label': label, 
                    'count': count,
                    'value': float(cat_value)
                })

        return Response({
            'total_value': float(total_value),
            'low_stock_count': low_stock_count,
            'total_items': StockItem.objects.count(),
            'category_breakdown': breakdown
        })

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all().order_by('-date')
    serializer_class = StockMovementSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all().order_by('name')
    serializer_class = SupplierSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().order_by('-created_at')
    serializer_class = PurchaseOrderSerializer

    @action(detail=True, methods=['post'])
    def receive_item(self, request, pk=None):
        po = self.get_object()
        item_id = request.data.get('item_id')
        qty = float(request.data.get('quantity', 0))
        
        if po.status == 'COMPLETED':
            return Response({"error": "PO is already completed"}, status=400)
            
        try:
            po_item = po.items.get(id=item_id)
            po_item.received_quantity += Decimal(str(qty))
            po_item.save()
            
            # Create Stock Movement (This automatically updates StockItem.current_stock via model save)
            StockMovement.objects.create(
                item=po_item.item,
                type='IN',
                quantity=Decimal(str(qty)),
                purchase_order=po,
                reason=f"Received against PO: {po.po_number}",
                recorded_by=request.user.username if request.user.is_authenticated else "System"
            )
            
            # Check if all items received
            all_received = True
            for i in po.items.all():
                if i.received_quantity < i.quantity:
                    all_received = False
                    break
            
            if all_received:
                po.status = 'COMPLETED'
            else:
                po.status = 'RECEIVED'
            po.save()
            
            return Response({"status": "Stock received", "po_status": po.status})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class PurchaseOrderItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderItem.objects.all()
    serializer_class = PurchaseOrderItemSerializer
