import os
import django
import sys
from decimal import Decimal

# Add the project directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from finance.models import Account, Budget
from invoices.models import Invoice
from django.utils import timezone

def seed_finance():
    print("Seeding Finance Data...")
    
    # Create Accounts if they don't exist
    marketing_acc, _ = Account.objects.get_or_create(
        code='6001', 
        name='Marketing Expense',
        defaults={'category': 'EXPENSE', 'balance': 0}
    )
    ops_acc, _ = Account.objects.get_or_create(
        code='6002', 
        name='Operations Expense',
        defaults={'category': 'EXPENSE', 'balance': 0}
    )
    hr_acc, _ = Account.objects.get_or_create(
        code='6003', 
        name='HR & Staff Expense',
        defaults={'category': 'EXPENSE', 'balance': 0}
    )
    inventory_acc, _ = Account.objects.get_or_create(
        code='1200', 
        name='Inventory Asset',
        defaults={'category': 'ASSET', 'balance': 500000}
    )

    # Create Budgets
    Budget.objects.get_or_create(
        account=marketing_acc,
        period='2024-01',
        department='MARKETING',
        defaults={'amount': 50000, 'spent': 5000}
    )
    Budget.objects.get_or_create(
        account=ops_acc,
        period='2024-01',
        department='OPERATIONS',
        defaults={'amount': 150000, 'spent': 25000}
    )
    Budget.objects.get_or_create(
        account=hr_acc,
        period='2024-01',
        department='HR',
        defaults={'amount': 100000, 'spent': 85000}
    )
    Budget.objects.get_or_create(
        account=inventory_acc,
        period='2024-01',
        department='INVENTORY',
        defaults={'amount': 90000, 'spent': 12000}
    )

    # Create some PAID invoices to see dynamic spent increase
    Invoice.objects.get_or_create(
        invoice_number='INV-SEED-001',
        defaults={
            'date': timezone.now().date(),
            'customer_name': 'Demo Customer',
            'items': 'Ceramic Coating|1|5000',
            'total_amount': 5000,
            'vat_amount': 250,
            'grand_total': 5250,
            'payment_status': 'PAID',
            'department': 'OPERATIONS'
        }
    )
    
    Invoice.objects.get_or_create(
        invoice_number='INV-SEED-002',
        defaults={
            'date': timezone.now().date(),
            'customer_name': 'Demo Corporate',
            'items': 'Fleet Marketing|1|15000',
            'total_amount': 15000,
            'vat_amount': 750,
            'grand_total': 15750,
            'payment_status': 'PAID',
            'department': 'MARKETING'
        }
    )

    print("Finance Seeding Complete.")

if __name__ == "__main__":
    seed_finance()
