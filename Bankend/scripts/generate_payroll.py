from hr.models import Employee, HRAttendance, Payroll
from django.utils import timezone
from decimal import Decimal
from django.db import transaction

today = timezone.now().date()
month_start = today.replace(day=1)
employees = Employee.objects.all()
count = 0

with transaction.atomic():
    for emp in employees:
        attendances = HRAttendance.objects.filter(
            employee=emp, 
            date__month=today.month, 
            date__year=today.year
        )
        total_logged = Decimal('0.00')
        total_ot = Decimal('0.00')
        
        for att in attendances:
            if att.total_hours:
                hours = Decimal(str(att.total_hours))
                total_logged += hours
                if hours > 10:
                    total_ot += (hours - 10)
        
        standard_hours_month = Decimal('240.00')
        hourly_rate = emp.basic_salary / standard_hours_month if emp.basic_salary > 0 else Decimal(0)
        ot_rate = hourly_rate * Decimal('1.25')
        
        basic_earned = (total_logged - total_ot) * hourly_rate
        ot_earned = total_ot * ot_rate
        
        attendance_factor = Decimal('1.0') if total_logged > 0 else Decimal('0.0')
        housing = emp.housing_allowance * attendance_factor
        transport = emp.transport_allowance * attendance_factor
        
        net_pay = basic_earned + ot_earned + housing + transport
        
        Payroll.objects.update_or_create(
            employee=emp,
            month=month_start,
            defaults={
                'basic_paid': basic_earned,
                'overtime_paid': ot_earned,
                'incentives': Decimal('0.00'),
                'deductions': Decimal('0.00'),
                'net_salary': net_pay,
                'status': 'PROCESSED'
            }
        )
        count += 1

print(f'Successfully processed payroll for {count} employees.')
