from datetime import date
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
from .models import Employee, Payroll, SalarySlip, HRAttendance

class HRService:
    @staticmethod
    def generate_payroll_cycle(month_str=None):
        """
        Logic to calculate and generate SalarySlips for all active employees.
        month_str format: 'YYYY-MM'
        """
        from django.db.models import Sum
        from finance.models import Commission
        from .models import Bonus, EmployeeDeduction

        today = timezone.now().date()
        if not month_str:
            month_str = today.strftime('%Y-%m-%d')[:7]
        
        month_date = date(int(month_str.split('-')[0]), int(month_str.split('-')[1]), 1)
        employees = Employee.objects.filter(is_active=True)
        processed_count = 0

        with transaction.atomic():
            for emp in employees:
                # 1. Aggregate Bonuses for the month
                bonus_total = Bonus.objects.filter(
                    employee=emp, 
                    date__month=month_date.month, 
                    date__year=month_date.year
                ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

                # 2. Aggregate Deductions for the month
                deduction_total = EmployeeDeduction.objects.filter(
                    employee=emp, 
                    date__month=month_date.month, 
                    date__year=month_date.year
                ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

                # 3. Aggregate Commissions for the month
                commission_total = Commission.objects.filter(
                    employee=emp,
                    date__month=month_date.month,
                    date__year=month_date.year,
                    status='ACCRUED' # Only process unpaid commissions
                ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

                # 4. Create or Update SalarySlip
                slip, created = SalarySlip.objects.update_or_create(
                    employee=emp,
                    month=month_str,
                    defaults={
                        'basic_salary': emp.basic_salary,
                        'allowances': emp.housing_allowance + emp.transport_allowance,
                        'bonuses': bonus_total,
                        'deductions': deduction_total,
                        'commissions_earned': commission_total,
                        'payment_status': 'PENDING'
                    }
                )

                # 5. Trigger Internal Calculation (Attendance based)
                slip.calculate_salary()
                processed_count += 1
                
        return processed_count
