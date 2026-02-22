from django.db import models

class AccountCategory(models.Model):
    name = models.CharField(max_length=100) # Asset, Liability, etc.
    code_range = models.CharField(max_length=20) # 1000, 2000, etc.

    def __str__(self):
        return self.name

DEPARTMENTS = [
    ('MARKETING', 'Marketing'),
    ('OPERATIONS', 'Operations'),
    ('HR', 'HR & Visa'),
    ('INVENTORY', 'Inventory'),
    ('GENERAL', 'General & Admin'),
]

class Account(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100) # Asset - Current, Revenue, etc.
    description = models.TextField(blank=True, null=True)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Budget(models.Model):
    account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='budgets')
    department_ref = models.ForeignKey('hr.Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='budgets')
    department = models.CharField(max_length=50, choices=DEPARTMENTS, default='GENERAL') # Legacy
    period = models.CharField(max_length=20) # e.g. "2024-Q1", "2024-01"
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    spent = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.account.name} - {self.period}"

class AccountGroup(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subgroups')
    
    def __str__(self):
        full_path = [self.name]
        curr = self.parent
        while curr:
            full_path.append(curr.name)
            curr = curr.parent
        return " > ".join(reversed(full_path))

class LinkingAccount(models.Model):
    LINK_MODULES = [
        ('PAYROLL', 'Payroll'),
        ('INVENTORY', 'Inventory'),
        ('SALES', 'Sales'),
        ('PURCHASE', 'Purchase'),
        ('CASH_IN_HAND', 'Cash in Hand'),
        ('BANK', 'Bank Accounts'),
    ]
    module = models.CharField(max_length=50, choices=LINK_MODULES, unique=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='linked_modules')
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.get_module_display()} -> {self.account.name}"

class Voucher(models.Model):
    VOUCHER_TYPES = [
        ('JOURNAL', 'Journal Voucher'),
        ('PAYMENT', 'Payment Voucher'),
        ('RECEIPT', 'Receipt Voucher'),
        ('PETTY_CASH', 'Petty Cash'),
        ('CONTRA', 'Contra Voucher'),
    ]
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('APPROVED', 'Approved'),
        ('POSTED', 'Posted'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    voucher_number = models.CharField(max_length=50, unique=True)
    voucher_type = models.CharField(max_length=20, choices=VOUCHER_TYPES)
    date = models.DateField()
    reference_number = models.CharField(max_length=100, blank=True) # External ref
    narration = models.TextField(blank=True)
    
    # Payment Details
    payment_mode = models.CharField(max_length=20, choices=[('CASH', 'Cash'), ('CHEQUE', 'Cheque'), ('CARD', 'Credit Card'), ('TRANSFER', 'Bank Transfer')], default='CASH')
    cheque_number = models.CharField(max_length=50, blank=True)
    cheque_date = models.DateField(null=True, blank=True)
    payee_name = models.CharField(max_length=255, blank=True, verbose_name="Receipt To / Paid To")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    created_by = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    branch = models.ForeignKey('locations.Branch', on_delete=models.SET_NULL, null=True, blank=True)

    @property
    def total_amount(self):
        from django.db.models import Sum
        return self.details.aggregate(total=Sum('debit'))['total'] or 0

    def __str__(self):
        return f"{self.voucher_number} ({self.get_voucher_type_display()})"

class VoucherDetail(models.Model):
    voucher = models.ForeignKey(Voucher, on_delete=models.CASCADE, related_name='details')
    account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='voucher_details')
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    description = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.account.name}: Dr {self.debit} | Cr {self.credit}"

class Commission(models.Model):
    COMMISSION_STATUS = [
        ('ACCRUED', 'Accrued (Unpaid)'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    employee = models.ForeignKey('hr.Employee', on_delete=models.CASCADE, related_name='commissions')
    job_card = models.ForeignKey('job_cards.JobCard', on_delete=models.CASCADE, related_name='commissions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=COMMISSION_STATUS, default='ACCRUED')
    date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Comm: {self.employee.full_name} - {self.amount} AED"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            # Simple increment, logically should be handled by a signal or transaction
            self.employee.total_commissions_earned += self.amount
            self.employee.save()

class FixedAsset(models.Model):
    ASSET_TYPES = [
        ('EQUIPMENT', 'Workshop Equipment'),
        ('VEHICLE', 'Company Vehicle'),
        ('FURNITURE', 'Office Furniture'),
        ('ELECTRONICS', 'IT & Electronics'),
        ('LAND', 'Land & Property'),
    ]
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPES)
    purchase_date = models.DateField()
    purchase_cost = models.DecimalField(max_digits=12, decimal_places=2)
    salvage_value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    useful_life_years = models.PositiveIntegerField(help_text="Expected life in years")
    
    accumulated_depreciation = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    
    branch = models.ForeignKey('locations.Branch', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def current_book_value(self):
        return self.purchase_cost - self.accumulated_depreciation

    @property
    def monthly_depreciation(self):
        """Straight-line depreciation calculation"""
        if self.useful_life_years == 0: return 0
        annual = (self.purchase_cost - self.salvage_value) / self.useful_life_years
        return annual / 12

    def __str__(self):
        return f"{self.name} ({self.get_asset_type_display()})"
