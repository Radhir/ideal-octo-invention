from django.db import models
from job_cards.models import JobCard
from locations.models import Branch

class Invoice(models.Model):
    ORDER_STATUS_CHOICES = [
        ('PAID', 'Paid'),
        ('PENDING', 'Pending'),
        ('CANCELLED', 'Cancelled'),
    ]

    job_card = models.OneToOneField(JobCard, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoice')
    invoice_number = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    
    # Customer Info (usually inherited from Job Card)
    customer_name = models.CharField(max_length=255)
    customer_trn = models.CharField(max_length=50, blank=True, verbose_name="Customer TRN")
    
    # Billing details
    items = models.TextField(help_text="format: item|qty|price per line")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Advance payment tracking
    advance_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Total advance payments received")
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Remaining balance after advances")
    
    payment_status = models.CharField(max_length=50, choices=ORDER_STATUS_CHOICES, default='PENDING')
    department_ref = models.ForeignKey('hr.Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    department = models.CharField(max_length=50, choices=[
        ('MARKETING', 'Marketing'),
        ('OPERATIONS', 'Operations'),
        ('HR', 'HR & Visa'),
        ('INVENTORY', 'Inventory'),
        ('GENERAL', 'General & Admin'),
    ], default='OPERATIONS') # Legacy
    
    # Financial Link
    finance_transaction = models.OneToOneField(
        'finance.Transaction', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='related_invoice'
    )
    
    signature_data = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calculate balance due
        self.balance_due = self.grand_total - self.advance_paid
        
        # Detect payment status change to PAID
        if self.pk:
            old_instance = Invoice.objects.get(pk=self.pk)
            if old_instance.payment_status != 'PAID' and self.payment_status == 'PAID':
                self.record_revenue_transaction()
            self.update_workshop_diary()
        elif self.payment_status == 'PAID':
            # This is a new invoice already marked as paid
            super().save(*args, **kwargs) # Save first to get PK
            self.record_revenue_transaction()
            self.update_workshop_diary()
            return
            
        super().save(*args, **kwargs)

    def record_revenue_transaction(self):
        from finance.models import Account, Transaction
        # Find or create a default Revenue account (4000)
        revenue_acc, _ = Account.objects.get_or_create(
            code='4000', 
            defaults={'name': 'Sales Revenue', 'category': 'REVENUE'}
        )
        
        # Create the transaction
        if not self.finance_transaction:
            tx = Transaction.objects.create(
                account=revenue_acc,
                department=self.department,
                amount=self.grand_total,
                transaction_type='CREDIT', # Revenue is Credit
                description=f"Revenue from Invoice {self.invoice_number} - {self.customer_name}",
                reference=self.invoice_number
            )
            self.finance_transaction = tx

    def update_workshop_diary(self):
        """Auto-complete the Workshop Diary entry when Invoice is Paid"""
        if self.job_card:
            from workshop.models import WorkshopDiary
            # Find diary entry linked to this job card
            diary_entries = WorkshopDiary.objects.filter(job_card=self.job_card)
            diary_entries.update(status='COMPLETED')

    def __str__(self):
        return f"{self.invoice_number} - {self.customer_name}"


class Payment(models.Model):
    """Track all payments made against a job card"""
    PAYMENT_TYPE_CHOICES = [
        ('ADVANCE', 'Advance Payment'),
        ('PARTIAL', 'Partial Payment'),
        ('FINAL', 'Final Payment'),
        ('REFUND', 'Refund'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('CASH', 'Cash'),
        ('CARD', 'Card'),
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('CHEQUE', 'Cheque'),
        ('ONLINE', 'Online Payment'),
    ]
    
    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='payments')
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    
    payment_slip_number = models.CharField(max_length=50, unique=True)
    payment_date = models.DateField()
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES, default='ADVANCE')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='CASH')
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    
    received_by = models.CharField(max_length=255, blank=True, help_text="Employee who received the payment")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update job card advance amount
        if self.job_card:
            total_advance = self.job_card.payments.filter(
                payment_type__in=['ADVANCE', 'PARTIAL']
            ).aggregate(models.Sum('amount'))['amount__sum'] or 0
            
            self.job_card.advance_amount = total_advance
            self.job_card.balance_amount = self.job_card.net_amount - total_advance
            self.job_card.save()
    
    def __str__(self):
        return f"Payment #{self.payment_slip_number} - {self.amount} AED ({self.payment_type})"
