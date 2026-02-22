from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets
from core.permissions import IsAdminOrOwner
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F
from django.contrib import messages
from .models import (
    StockForm, StockItem, StockMovement, Supplier, 
    PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseReturn,
    StockTransfer, StockTransferItem
)
from .forms import StockFormForm
from finance.models import Voucher, VoucherDetail, LinkingAccount, Account
import uuid
import datetime
from django.utils import timezone
from .serializers import (
    StockFormSerializer, StockItemSerializer, StockMovementSerializer,
    SupplierSerializer, PurchaseOrderSerializer, PurchaseOrderItemSerializer,
    PurchaseInvoiceSerializer, PurchaseReturnSerializer,
    StockTransferSerializer, StockTransferItemSerializer
)
from decimal import Decimal

class PurchaseInvoiceViewSet(viewsets.ModelViewSet):
    module_name = 'Inventory'
    queryset = PurchaseInvoice.objects.all().order_by('-invoice_date')
    serializer_class = PurchaseInvoiceSerializer
    permission_classes = [IsAdminOrOwner]

    @action(detail=True, methods=['post'])
    def post_to_ledger(self, request, pk=None):
        invoice = self.get_object()
        try:
            inventory_acc = LinkingAccount.objects.get(module='INVENTORY').account
            payable_acc = LinkingAccount.objects.get(module='PURCHASE').account 
        except LinkingAccount.DoesNotExist:
            return Response({"error": "Finance link accounts for INVENTORY/PURCHASE not configured"}, status=400)

        voucher = Voucher.objects.create(
            voucher_number=f"PV-{uuid.uuid4().hex[:8].upper()}",
            voucher_type='JOURNAL',
            date=invoice.invoice_date,
            reference_number=invoice.invoice_number,
            narration=f"Purchase Invoice Posting: {invoice.invoice_number} from {invoice.supplier.name}",
            status='POSTED'
        )

        VoucherDetail.objects.create(
            voucher=voucher, account=inventory_acc,
            debit=invoice.net_amount, credit=0,
            description=f"Inventory Increase - {invoice.invoice_number}"
        )

        VoucherDetail.objects.create(
            voucher=voucher, account=payable_acc,
            debit=0, credit=invoice.net_amount,
            description=f"Payable to {invoice.supplier.name}"
        )

        return Response({"message": "Invoice posted to ledger successfully", "voucher": voucher.voucher_number})

class PurchaseReturnViewSet(viewsets.ModelViewSet):
    module_name = 'Inventory'
    queryset = PurchaseReturn.objects.all().order_by('-voucher_date')
    serializer_class = PurchaseReturnSerializer
    permission_classes = [IsAdminOrOwner]

class StockFormViewSet(viewsets.ModelViewSet):
    module_name = 'Inventory'
    queryset = StockForm.objects.all().order_by('-created_at')
    serializer_class = StockFormSerializer
    permission_classes = [IsAdminOrOwner]

class StockItemViewSet(viewsets.ModelViewSet):
    module_name = 'Inventory'
    serializer_class = StockItemSerializer
    queryset = StockItem.objects.all()
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = StockItem.objects.all().order_by('category', 'name')
        sku = self.request.query_params.get('sku')
        branch = self.request.query_params.get('branch')
        if sku: queryset = queryset.filter(sku=sku)
        if branch: queryset = queryset.filter(branch_id=branch)
        return queryset

    @action(detail=False, methods=['get'])
    def inventory_stats(self, request):
        branch_id = request.query_params.get('branch')
        items = StockItem.objects.all()
        if branch_id: items = items.filter(branch_id=branch_id)
        
        total_value = items.aggregate(value=Sum(F('current_stock') * F('unit_cost')))['value'] or 0
        low_stock_count = items.filter(current_stock__lte=F('safety_level')).count()
        
        breakdown = []
        for cat, label in StockItem.CATEGORIES:
            cat_items = items.filter(category=cat)
            count = cat_items.count()
            if count > 0:
                cat_value = cat_items.aggregate(val=Sum(F('current_stock') * F('unit_cost')))['val'] or 0
                breakdown.append({'label': label, 'count': count, 'value': float(cat_value)})

        return Response({
            'total_value': float(total_value),
            'low_stock_count': low_stock_count,
            'total_items': items.count(),
            'category_breakdown': breakdown
        })

    @action(detail=False, methods=['get'])
    def forecast_stock(self, request):
        branch_id = request.query_params.get('branch')
        today = timezone.now().date()
        thirty_days_ago = today - datetime.timedelta(days=30)
        
        items = StockItem.objects.all()
        if branch_id: items = items.filter(branch_id=branch_id)
        
        forecasts = []
        for item in items:
            total_used = StockMovement.objects.filter(
                item=item, type='OUT', date__gte=thirty_days_ago, status='APPROVED'
            ).aggregate(Sum('quantity'))['quantity__sum'] or 0
            
            daily_rate = float(total_used) / 30.0
            days_remaining = 999
            if daily_rate > 0:
                days_remaining = int(float(item.current_stock) / daily_rate)
            
            projected_date = today + datetime.timedelta(days=min(days_remaining, 365))

            if days_remaining < 60 or item.current_stock <= item.safety_level:
                forecasts.append({
                    "id": item.id, "name": item.name, "sku": item.sku,
                    "current_stock": float(item.current_stock),
                    "days_remaining": days_remaining,
                    "projected_stock_out": projected_date,
                    "status": "CRITICAL" if days_remaining < 7 else "WARNING" if days_remaining < 30 else "OK"
                })

        return Response({
            "forecasts": sorted(forecasts, key=lambda x: x['days_remaining']),
            "critical_count": len([f for f in forecasts if f['status'] == "CRITICAL"]),
            "recommendations": [f['name'] for f in forecasts if f['status'] != "OK"][:5]
        })

class StockMovementViewSet(viewsets.ModelViewSet):
    module_name = 'Inventory'
    queryset = StockMovement.objects.all().order_by('-date')
    serializer_class = StockMovementSerializer
    permission_classes = [IsAdminOrOwner]

    def perform_create(self, serializer):
        user = self.request.user
        status = 'APPROVED' if (user.is_superuser or user.role_name in ['Manager', 'Admin']) else 'PENDING'
        serializer.save(recorded_by=user.username, status=status)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        movement = self.get_object()
        if movement.status == 'APPROVED': return Response({'status': 'Already approved'}, status=400)
        movement.status = 'APPROVED'
        movement.save()
        return Response({'status': 'approved'})

class StockTransferViewSet(viewsets.ModelViewSet):
    queryset = StockTransfer.objects.all().order_by('-created_at')
    serializer_class = StockTransferSerializer
    permission_classes = [IsAdminOrOwner]

    @action(detail=True, methods=['post'])
    def commence_transfer(self, request, pk=None):
        transfer = self.get_object()
        if transfer.status != 'PENDING':
            return Response({"error": "Only PENDING transfers can be commenced"}, status=400)
        
        for ti in transfer.items.all():
            StockMovement.objects.create(
                item=ti.item, type='ICT_OUT', quantity=ti.quantity,
                status='APPROVED', transfer=transfer,
                reason=f"ICT Out: {transfer.transfer_number} to {transfer.to_branch.code}",
                recorded_by=request.user.username
            )
        transfer.status = 'TRANSIT'
        transfer.save()
        return Response({"status": "Transfer commenced"})

    @action(detail=True, methods=['post'])
    def receive_transfer(self, request, pk=None):
        transfer = self.get_object()
        if transfer.status != 'TRANSIT':
            return Response({"error": "Only TRANSIT transfers can be received"}, status=400)
        
        for ti in transfer.items.all():
            source_item = ti.item
            target_item, created = StockItem.objects.get_or_create(
                sku=source_item.sku, branch=transfer.to_branch,
                defaults={
                    'name': source_item.name, 'category': source_item.category,
                    'unit': source_item.unit, 'unit_cost': source_item.unit_cost,
                    'safety_level': source_item.safety_level
                }
            )
            StockMovement.objects.create(
                item=target_item, type='ICT_IN', quantity=ti.quantity,
                status='APPROVED', transfer=transfer,
                reason=f"ICT In: {transfer.transfer_number} from {transfer.from_branch.code}",
                recorded_by=request.user.username
            )
        transfer.status = 'COMPLETED'
        transfer.save()
        return Response({"status": "Transfer received"})

class StockTransferItemViewSet(viewsets.ModelViewSet):
    queryset = StockTransferItem.objects.all()
    serializer_class = StockTransferItemSerializer
    permission_classes = [IsAdminOrOwner]

class SupplierViewSet(viewsets.ModelViewSet):
    module_name = 'Inventory'
    queryset = Supplier.objects.all().order_by('name')
    serializer_class = SupplierSerializer
    permission_classes = [IsAdminOrOwner]

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    module_name = 'Inventory'
    queryset = PurchaseOrder.objects.all().order_by('-created_at')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAdminOrOwner]

    @action(detail=True, methods=['post'])
    def receive_item(self, request, pk=None):
        po = self.get_object()
        item_id = request.data.get('item_id')
        qty = float(request.data.get('quantity', 0))
        if po.status == 'COMPLETED': return Response({"error": "PO is already completed"}, status=400)
        try:
            po_item = po.items.get(id=item_id)
            po_item.received_quantity += Decimal(str(qty))
            po_item.save()
            StockMovement.objects.create(
                item=po_item.item, type='IN', quantity=Decimal(str(qty)),
                purchase_order=po, recorded_by=request.user.username
            )
            all_received = all(i.received_quantity >= i.quantity for i in po.items.all())
            po.status = 'COMPLETED' if all_received else 'RECEIVED'
            po.save()
            return Response({"status": "Stock received"})
        except Exception as e: return Response({"error": str(e)}, status=400)

class PurchaseOrderItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderItem.objects.all()
    serializer_class = PurchaseOrderItemSerializer
    permission_classes = [IsAdminOrOwner]
