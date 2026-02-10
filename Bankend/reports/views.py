from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.management import call_command
from django.utils import timezone
from io import StringIO

class TriggerDailyReportView(APIView):
    # ... (existing code preserved)
    def post(self, request):
        out = StringIO()
        try:
            call_command('send_daily_report', stdout=out)
            output = out.getvalue()
            return Response({'status': 'success', 'output': output}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PayrollReportView(APIView):
    """
    Consolidated API for Payroll and Performance Reports.
    Filters: month, year, department, employee.
    """
    def get(self, request):
        from hr.models import SalarySlip, Employee, Department
        from django.db.models import Sum, Count, Avg
        
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        dept_id = request.query_params.get('department')
        emp_id = request.query_params.get('employee')
        
        # Base QuerySet
        slips = SalarySlip.objects.all()
        
        if year:
            slips = slips.filter(month__startswith=str(year))
        if month:
            # month expected as 1-12 or 01-12
            month_fmt = f"-{month.zfill(2)}"
            slips = slips.filter(month__contains=month_fmt)
        if dept_id:
            slips = slips.filter(employee__department_id=dept_id)
        if emp_id:
            slips = slips.filter(employee_id=emp_id)
            
        # Aggregations
        summary = slips.aggregate(
            total_net_salary=Sum('net_salary'),
            total_deductions=Sum('total_deductions'),
            total_ot_amount=Sum('overtime_amount'),
            avg_salary=Avg('net_salary'),
            employee_count=Count('employee', distinct=True)
        )
        
        # Dept Breakdown if dept not filtered
        dept_breakdown = []
        if not dept_id:
            depts = Department.objects.all()
            for d in depts:
                dept_slips = slips.filter(employee__department=d)
                if dept_slips.exists():
                    dept_breakdown.append({
                        'id': d.id,
                        'name': d.name,
                        'total_cost': dept_slips.aggregate(Sum('net_salary'))['net_salary__sum'],
                        'headcount': dept_slips.count()
                    })

        return Response({
            'filters': {'month': month, 'year': year, 'dept': dept_id, 'emp': emp_id},
            'summary': summary,
            'department_breakdown': dept_breakdown,
            'slips_count': slips.count()
        })

class YearlyPLReportView(APIView):
    """
    Yearly Profit & Loss Statement API.
    Provides comparison across departments for a specific year.
    """
    def get(self, request):
        from finance.models import Transaction, Account
        from django.db.models import Sum
        
        year = request.query_params.get('year', timezone.now().year)
        
        # 1. Total Revenue (Transactions in REVENUE categories)
        revenue_tx = Transaction.objects.filter(
            date__year=year,
            account__category='REVENUE'
        )
        total_revenue = revenue_tx.aggregate(Sum('amount'))['amount__sum'] or 0
        
        # 2. Total Expenses (Transactions in EXPENSE categories)
        expense_tx = Transaction.objects.filter(
            date__year=year,
            account__category='EXPENSE'
        )
        total_expenses = expense_tx.aggregate(Sum('amount'))['amount__sum'] or 0
        
        # 3. Departmental Breakdown
        from hr.models import Department
        dept_stats = []
        for dept in Department.objects.all():
            dept_rev = revenue_tx.filter(department_ref=dept).aggregate(Sum('amount'))['amount__sum'] or 0
            dept_exp = expense_tx.filter(department_ref=dept).aggregate(Sum('amount'))['amount__sum'] or 0
            if dept_rev > 0 or dept_exp > 0:
                dept_stats.append({
                    'name': dept.name,
                    'revenue': dept_rev,
                    'expenses': dept_exp,
                    'net': dept_rev - dept_exp
                })

        return Response({
            'year': year,
            'p_l_statement': {
                'total_revenue': total_revenue,
                'total_expenses': total_expenses,
                'net_profit_loss': total_revenue - total_expenses
            },
            'departmental_performance': dept_stats
        })
