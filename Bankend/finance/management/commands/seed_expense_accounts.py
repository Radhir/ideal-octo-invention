"""
Pre-populate 35 Expense Account Categories
Run: python manage.py seed_expense_accounts
"""
from django.core.management.base import BaseCommand
from finance.models import Account


class Command(BaseCommand):
    help = 'Seed 35 expense account categories'

    def handle(self, *args, **options):
        self.stdout.write('Creating 35 expense account categories...')
        
        expense_accounts = [
            # 5100 - Operating Expenses
            ('5101', 'Rent Expense', 'Expense - Operating'),
            ('5102', 'Utilities Expense (Electricity, Water)', 'Expense - Operating'),
            ('5103', 'Internet & Phone Expense', 'Expense - Operating'),
            ('5104', 'Office Supplies Expense', 'Expense - Operating'),
            ('5105', 'Cleaning Supplies Expense', 'Expense - Operating'),
            ('5106', 'Security Expense', 'Expense - Operating'),
            
            # 5200 - Employee Expenses
            ('5201', 'Salaries - Management', 'Expense - Personnel'),
            ('5202', 'Salaries - Technicians', 'Expense - Personnel'),
            ('5203', 'Salaries - Service Advisors', 'Expense - Personnel'),
            ('5204', 'Salaries - Marketing Team', 'Expense - Personnel'),
            ('5205', 'Employee Benefits', 'Expense - Personnel'),
            ('5206', 'Employee Insurance', 'Expense - Personnel'),
            ('5207', 'Training & Development', 'Expense - Personnel'),
            ('5208', 'Employee Uniforms', 'Expense - Personnel'),
            
            # 5300 - Marketing & Advertising
            ('5301', 'Digital Marketing Expense', 'Expense - Marketing'),
            ('5302', 'Social Media Advertising', 'Expense - Marketing'),
            ('5303', 'Google Ads Expense', 'Expense - Marketing'),
            ('5304', 'Cobone/Groupon Commission', 'Expense - Marketing'),
            ('5305', 'Photography & Videography', 'Expense - Marketing'),
            ('5306', 'Promotional Materials', 'Expense - Marketing'),
            
            # 5400 - Vehicle & Equipment
            ('5401', 'Vehicle Fuel Expense', 'Expense - Vehicle'),
            ('5402', 'Vehicle Maintenance', 'Expense - Vehicle'),
            ('5403', 'Equipment Maintenance', 'Expense - Equipment'),
            ('5404', 'Equipment Depreciation', 'Expense - Equipment'),
            
            # 5500 - Materials & Inventory
            ('5501', 'PPF Film Purchase', 'Expense - Materials'),
            ('5502', 'Ceramic Coating Materials', 'Expense - Materials'),
            ('5503', 'Detailing Products', 'Expense - Materials'),
            ('5504', 'Consumables & Supplies', 'Expense - Materials'),
            
            # 5600 - Administrative
            ('5601', 'Bank Charges & Fees', 'Expense - Administrative'),
            ('5602', 'Professional Fees (Legal, Accounting)', 'Expense - Administrative'),
            ('5603', 'Licenses & Permits', 'Expense - Administrative'),
            ('5604', 'Business Insurance', 'Expense - Administrative'),
            ('5605', 'Depreciation Expense', 'Expense - Administrative'),
            
            # 5700 - Other Expenses
            ('5701', 'Miscellaneous Expense', 'Expense - Other'),
            ('5702', 'Bad Debt Expense', 'Expense - Other'),
        ]
        
        created_count = 0
        updated_count = 0
        
        for code, name, category in expense_accounts:
            account, created = Account.objects.get_or_create(
                code=code,
                defaults={
                    'name': name,
                    'category': category,
                    'balance': 0.00,
                    'description': f'Automatically created expense account'
                }
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'✓ Created: {code} - {name}'))
            else:
                # Update if exists
                account.name = name
                account.category = category
                account.save()
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'→ Updated: {code} - {name}'))
        
        self.stdout.write(self.style.SUCCESS(
            f'\n✅ Expense accounts setup complete!'
            f'\n   Created: {created_count}'
            f'\n   Updated: {updated_count}'
            f'\n   Total: {len(expense_accounts)}'
        ))
