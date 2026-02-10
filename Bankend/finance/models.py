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

import uuid

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('DEBIT', 'Debit'),
        ('CREDIT', 'Credit'),
    ]
    
    audit_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    regulatory_status = models.CharField(max_length=50, default='FINAL', choices=[
        ('DRAFT', 'Draft'),
        ('FINAL', 'Finalized'),
        ('VOID', 'Voided'),
    ])
    
    account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    department_ref = models.ForeignKey('hr.Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    department = models.CharField(max_length=50, choices=DEPARTMENTS, default='GENERAL') # Legacy
    date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    description = models.TextField()
    reference = models.CharField(max_length=100, blank=True) # Invoice #, Receipt #
    receipt = models.ImageField(upload_to='receipts/', null=True, blank=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            # Update account balance
            if self.transaction_type == 'CREDIT':
                self.account.balance += self.amount
            else:
                self.account.balance -= self.amount
            self.account.save()

    def delete(self, *args, **kwargs):
        raise PermissionError("Transaction history is part of the permanent audit trail and cannot be removed.")

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} ({self.account.name})"

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
            self.employee.total_commissions_earned += self.amount
            self.employee.save()
