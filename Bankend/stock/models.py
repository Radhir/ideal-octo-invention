from django.db import models

class StockItem(models.Model):
    CATEGORIES = [
        ('PPF', 'Paint Protection Film'),
        ('CERAMIC', 'Ceramic Coating'),
        ('POLISH', 'Polishing Materials'),
        ('CLEANING', 'Cleaning Supplies'),
        ('TOOLS', 'Workshop Tools'),
        ('OTHER', 'Other Consumables'),
    ]
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    unit = models.CharField(max_length=50, default='Units') # Meters, Bottles, etc.
    current_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    safety_level = models.DecimalField(max_digits=10, decimal_places=2, default=10.00)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_restock = models.DateField(null=True, blank=True)
    
    branch = models.ForeignKey('locations.Branch', on_delete=models.SET_NULL, null=True, blank=True, related_name='inventory')
    
    # Location
    location = models.CharField(max_length=100, blank=True, help_text="e.g. Main Warehouse")
    rack = models.CharField(max_length=50, blank=True)
    bin = models.CharField(max_length=50, blank=True)

    def __str__(self):
        branch_prefix = f"[{self.branch.code}] " if self.branch else ""
        return f"{branch_prefix}{self.name} ({self.category})"

class StockMovement(models.Model):
    TYPES = [
        ('IN', 'Restock (Purchase)'),
        ('OUT', 'Consumption (Job)'),
        ('ADJ', 'Adjustment (Audit)'),
        ('ICT_OUT', 'ICT Transfer Out'),
        ('ICT_IN', 'ICT Transfer In'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    item = models.ForeignKey(StockItem, on_delete=models.CASCADE, related_name='movements')
    type = models.CharField(max_length=10, choices=TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    job_card = models.ForeignKey('job_cards.JobCard', on_delete=models.SET_NULL, null=True, blank=True)
    purchase_order = models.ForeignKey('stock.PurchaseOrder', on_delete=models.SET_NULL, null=True, blank=True)
    transfer = models.ForeignKey('stock.StockTransfer', on_delete=models.SET_NULL, null=True, blank=True, related_name='linked_movements')
    reason = models.TextField(blank=True)
    recorded_by = models.CharField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        old_status = None
        
        if not is_new:
            try:
                old_instance = StockMovement.objects.get(pk=self.pk)
                old_status = old_instance.status
            except StockMovement.DoesNotExist:
                pass

        super().save(*args, **kwargs)

        # Logic: Only adjust stock if status is APPROVED
        # Case 1: New record created as APPROVED (e.g. by Admin)
        # Case 2: Existing record changed from NON-APPROVED to APPROVED
        
        should_adjust = False
        if is_new and self.status == 'APPROVED':
            should_adjust = True
        elif not is_new and old_status != 'APPROVED' and self.status == 'APPROVED':
            should_adjust = True
            
        if should_adjust:
            if self.type in ['IN', 'ICT_IN', 'ADJ']:
                self.item.current_stock += self.quantity
            elif self.type in ['OUT', 'ICT_OUT']:
                self.item.current_stock -= self.quantity
            
            self.item.save()

    def __str__(self):
        return f"{self.type} - {self.quantity} {self.item.name}"

class StockTransfer(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Transfer'),
        ('TRANSIT', 'In Transit'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    transfer_number = models.CharField(max_length=50, unique=True)
    from_branch = models.ForeignKey('locations.Branch', on_delete=models.CASCADE, related_name='transfers_out')
    to_branch = models.ForeignKey('locations.Branch', on_delete=models.CASCADE, related_name='transfers_in')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        old_status = None
        if not is_new:
            old_status = StockTransfer.objects.get(pk=self.pk).status
            
        super().save(*args, **kwargs)
        
        # Automation Logic: Create StockMovements based on status change
        if not is_new:
            # 1. Status changed to TRANSIT -> Create ICT_OUT from source branch
            if old_status != 'TRANSIT' and self.status == 'TRANSIT':
                for detail in self.items.all():
                    from .models import StockMovement
                    StockMovement.objects.create(
                        item=detail.item,
                        type='ICT_OUT',
                        status='APPROVED',
                        quantity=detail.quantity,
                        transfer=self,
                        reason=f"Auto-generated from Transfer {self.transfer_number}"
                    )
            
            # 2. Status changed to COMPLETED -> Create ICT_IN for destination branch
            elif old_status != 'COMPLETED' and self.status == 'COMPLETED':
                for detail in self.items.all():
                    from .models import StockItem, StockMovement
                    # Find or create equivalent item in destination branch
                    dest_item = StockItem.objects.filter(
                        branch=self.to_branch,
                        sku=detail.item.sku
                    ).first()
                    
                    if not dest_item:
                        # Create new stock record in destination branch if missing
                        dest_item = StockItem.objects.create(
                            branch=self.to_branch,
                            name=detail.item.name,
                            sku=detail.item.sku,
                            category=detail.item.category,
                            unit=detail.item.unit,
                            unit_cost=detail.item.unit_cost
                        )
                    
                    StockMovement.objects.create(
                        item=dest_item,
                        type='ICT_IN',
                        status='APPROVED',
                        quantity=detail.quantity,
                        transfer=self,
                        reason=f"Auto-generated from Transfer {self.transfer_number}"
                    )

    def __str__(self):
        return f"{self.transfer_number} ({self.from_branch.code} -> {self.to_branch.code})"

class StockTransferItem(models.Model):
    transfer = models.ForeignKey(StockTransfer, on_delete=models.CASCADE, related_name='items')
    item = models.ForeignKey(StockItem, on_delete=models.CASCADE) # Source branch item
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    trade_license = models.CharField(max_length=100, blank=True)
    
    # Financials
    trn = models.CharField(max_length=50, blank=True, verbose_name="TRN / Tax ID")
    payment_terms = models.CharField(max_length=100, blank=True, help_text="e.g. 30 Days Credit")
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    website = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent to Supplier'),
        ('RECEIVED', 'Partially Received'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    po_number = models.CharField(max_length=50, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='purchase_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    order_date = models.DateField()
    expected_date = models.DateField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.po_number} - {self.supplier.name}"

class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    item = models.ForeignKey(StockItem, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    received_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        self.total_cost = self.quantity * self.unit_cost
        super().save(*args, **kwargs)

class StockForm(models.Model):
    department = models.CharField(max_length=100)
    request_by = models.CharField(max_length=255)
    car_type = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    payment_type = models.CharField(max_length=50)
    plate_number = models.CharField(max_length=50)
    item_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stock Request - {self.department}"

class PurchaseInvoice(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    invoice_number = models.CharField(max_length=50, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='invoices')
    branch = models.ForeignKey('locations.Branch', on_delete=models.SET_NULL, null=True, blank=True)
    
    invoice_date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    supplier_invoice_no = models.CharField(max_length=100, blank=True)
    
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    net_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"INV-{self.invoice_number} ({self.supplier.name})"

class PurchaseReturn(models.Model):
    voucher_no = models.CharField(max_length=50, unique=True)
    invoice = models.ForeignKey(PurchaseInvoice, on_delete=models.CASCADE, related_name='returns')
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='returns')
    branch = models.ForeignKey('locations.Branch', on_delete=models.SET_NULL, null=True, blank=True)
    
    voucher_date = models.DateField()
    reason = models.TextField(blank=True)
    
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    net_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"RET-{self.voucher_no} ({self.supplier.name})"
