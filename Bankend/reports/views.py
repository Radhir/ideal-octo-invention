from django.shortcuts import render
from django.db import models
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

class WorkshopDiaryReportView(APIView):
    """
    Detailed Audit log of all Job Cards within a date range.
    """
    def get(self, request):
        from job_cards.models import JobCard
        from django.db.models import Count, Sum

        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        jobs = JobCard.objects.all().order_by('-date')
        if start_date and end_date:
            jobs = jobs.filter(date__range=[start_date, end_date])
        
        summary = jobs.aggregate(
            total_jobs=Count('id'),
            total_value=Sum('net_amount'),
            total_vat=Sum('vat_amount')
        )

        # Serialize manually or use a lightweight serializer for the list
        job_data = []
        for j in jobs:
            job_data.append({
                'id': j.id,
                'number': j.job_card_number,
                'date': j.date,
                'customer': j.customer_name,
                'asset': f"{j.brand} {j.model} ({j.registration_number})",
                'status': j.status,
                'net_amount': j.net_amount,
                'advisor': (j.service_advisor.first_name + ' ' + j.service_advisor.last_name) if j.service_advisor else j.service_advisor_legacy
            })

        return Response({
            'summary': summary,
            'entries': job_data
        })

class InvoiceBookReportView(APIView):
    """
    Detailed log of all Invoices within a date range.
    """
    def get(self, request):
        from invoices.models import Invoice
        from django.db.models import Sum, Count

        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        invoices = Invoice.objects.all().order_by('-date')
        if start_date and end_date:
            invoices = invoices.filter(date__range=[start_date, end_date])
            
        summary = invoices.aggregate(
            total_invoices=Count('id'),
            total_grand=Sum('grand_total'),
            total_vat=Sum('vat_amount'),
            pending_count=Count('id', filter=models.Q(payment_status='PENDING')),
            paid_count=Count('id', filter=models.Q(payment_status='PAID'))
        )

        entries = []
        for inv in invoices:
            entries.append({
                'id': inv.id,
                'number': inv.invoice_number,
                'date': inv.date,
                'customer': inv.customer_name,
                'status': inv.payment_status,
                'grand_total': inv.grand_total,
                'vat_amount': inv.vat_amount
            })

        return Response({
            'summary': summary,
            'entries': entries
        })
