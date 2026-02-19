import os
import django
from decimal import Decimal
from datetime import date, time
import sys

# Add project root to path
sys.path.append('/app')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee, HRAttendance, Payroll
from hr.services import HRService
from django.contrib.auth.models import User

def run():
    print("Setting up test data...")
    # Create user and employee
    user, _ = User.objects.get_or_create(username='test_payroll_user')
    emp, _ = Employee.objects.get_or_create(
        employee_id='TEST-001',
        defaults={
            'user': user,
            'full_name_passport': 'Test Payroll Employee',
            'basic_salary': Decimal('12000.00'),
            'housing_allowance': Decimal('0.00'),
            'transport_allowance': Decimal('0.00'),
            'pin_code': '999999',
            'role': 'Test Role',
            'date_joined': date(2023, 1, 1),
        }
    )

    # Create attendance for today
    today = date.today()
    HRAttendance.objects.filter(employee=emp, date=today).delete()
    
    # 10 hours work (no OT threshold is >10 in service logic? let's check)
    # Service says: if hours > 10: total_ot += (hours - 10)
    # So 10 hours is all basic.
    
    HRAttendance.objects.create(
        employee=emp,
        date=today,
        clock_in=time(8, 0),
        clock_out=time(18, 0),
        total_hours=Decimal('10.00')
    )
    
    print("Running payroll cycle...")
    count = HRService.generate_payroll_cycle()
    print(f"Processed {count} records.")
    
    # Verify
    payroll = Payroll.objects.get(employee=emp, month__month=today.month, month__year=today.year)
    print(f"Payroll created for {payroll.month}:")
    print(f"Basic Paid: {payroll.basic_paid}")
    print(f"Overtime Paid: {payroll.overtime_paid}")
    print(f"Net Salary: {payroll.net_salary}")
    
    # Expected: 
    # Hourly rate = 12000 / 240 = 50
    # Basic Earned = 10 * 50 = 500
    # OT = 0
    
    expected = Decimal('500.00')
    # Use approximate comparison for floats/decimals if needed, but Decimal should be exact
    if abs(payroll.net_salary - expected) < Decimal('0.01'):
        print("SUCCESS: Payroll calculation matches expected value.")
    else:
        print(f"FAILURE: Expected {expected}, got {payroll.net_salary}")

if __name__ == '__main__':
    run()
