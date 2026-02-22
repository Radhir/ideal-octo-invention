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
    Refactored for Voucher System (Double Entry).
    """
    def get(self, request):
        from finance.models import VoucherDetail, Account
        from django.db.models import Sum
        
        year = request.query_params.get('year', timezone.now().year)
        
        # Filter details by voucher date year
        details = VoucherDetail.objects.filter(voucher__date__year=year)
        
        # 1. Total Revenue 
        # Revenue is Credit normal. Net Revenue = Credits - Debits
        revenue_q = details.filter(account__category='REVENUE')
        rev_stats = revenue_q.aggregate(c=Sum('credit'), d=Sum('debit'))
        total_revenue = (rev_stats['c'] or 0) - (rev_stats['d'] or 0)
        
        # 2. Total Expenses 
        # Expense is Debit normal. Net Expense = Debits - Credits
        expense_q = details.filter(account__category='EXPENSE')
        exp_stats = expense_q.aggregate(d=Sum('debit'), c=Sum('credit'))
        total_expenses = (exp_stats['d'] or 0) - (exp_stats['c'] or 0)
        
        # 3. Departmental Breakdown (via Voucher creator)
        from hr.models import Department
        dept_stats = []
        for dept in Department.objects.all():
            # Revenue for dept
            d_rev_stats = revenue_q.filter(voucher__created_by__department=dept).aggregate(c=Sum('credit'), d=Sum('debit'))
            d_rev = (d_rev_stats['c'] or 0) - (d_rev_stats['d'] or 0)
            
            # Expense for dept
            d_exp_stats = expense_q.filter(voucher__created_by__department=dept).aggregate(d=Sum('debit'), c=Sum('credit'))
            d_exp = (d_exp_stats['d'] or 0) - (d_exp_stats['c'] or 0)
            
            if d_rev > 0 or d_exp > 0:
                dept_stats.append({
                    'name': dept.name,
                    'revenue': d_rev,
                    'expenses': d_exp,
                    'net': d_rev - d_exp
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
        from django.db.models import Count, Sum, Q

        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        advisor_id = request.query_params.get('advisor')
        status = request.query_params.get('status')
        branch_id = request.query_params.get('branch')
        plate_no = request.query_params.get('plate_no')
        search_query = request.query_params.get('search')
        
        jobs = JobCard.objects.all().order_by('-date')
        
        # Date Range Filter
        if start_date and end_date:
            jobs = jobs.filter(date__range=[start_date, end_date])
            
        # Advisor Filter
        if advisor_id and advisor_id != 'ALL':
            jobs = jobs.filter(service_advisor_id=advisor_id)

        # Status Filter
        if status and status != 'ALL':
            jobs = jobs.filter(status=status)

        # Branch Filter
        if branch_id and branch_id != 'ALL':
            jobs = jobs.filter(branch_id=branch_id)

        # Plate Number Filter
        if plate_no:
            jobs = jobs.filter(registration_number__icontains=plate_no)

        # General Search Filter
        if search_query:
            jobs = jobs.filter(
                Q(job_card_number__icontains=search_query) |
                Q(customer_name__icontains=search_query) |
                Q(registration_number__icontains=search_query) |
                Q(vin__icontains=search_query)
            )
        
        summary = jobs.aggregate(
            total_jobs=Count('id'),
            total_value=Sum('net_amount'),
            total_vat=Sum('vat_amount')
        )

        job_data = []
        for j in jobs:
            # Safe advisor name resolution
            advisor_name = j.service_advisor_legacy
            if j.service_advisor:
                advisor_name = f"{j.service_advisor.first_name} {j.service_advisor.last_name}"
            elif hasattr(j, 'advisor') and j.advisor: # Handle potential direct foreign key if named 'advisor'
                 advisor_name = f"{j.advisor.first_name} {j.advisor.last_name}"

            job_data.append({
                'id': j.id,
                'number': j.job_card_number,
                'date': j.date,
                'customer': j.customer_name,
                'asset': f"{j.brand} {j.model} ({j.registration_number})",
                'status': j.status,
                'net_amount': j.net_amount,
                'advisor': advisor_name
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

class PayrollExportView(APIView):
    """
    Handles CSV exports for Payroll Data.
    Types: 'slips', 'overtime', 'bank'
    """
    def get(self, request):
        import csv
        from django.http import HttpResponse
        from hr.models import SalarySlip, HRAttendance, Employee
        
        export_type = request.query_params.get('type')
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        dept_id = request.query_params.get('department')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="payroll_export_{export_type}_{year}_{month}.csv"'
        
        writer = csv.writer(response)
        
        if export_type == 'slips':
            writer.writerow(['Month', 'Employee ID', 'Name', 'Department', 'Basic', 'Allowances', 'OT Amount', 'Bonuses', 'Deductions', 'Net Salary', 'Status'])
            slips = SalarySlip.objects.filter(month__startswith=f"{year}-" if year else "")
            if month:
                 month_fmt = f"-{str(month).zfill(2)}"
                 slips = slips.filter(month__contains=month_fmt)
            if dept_id:
                slips = slips.filter(employee__department_id=dept_id)
                
            for slip in slips:
                writer.writerow([
                    slip.month,
                    slip.employee.employee_id,
                    slip.employee.full_name,
                    slip.employee.department.name if slip.employee.department else 'N/A',
                    slip.basic_salary,
                    slip.allowances,
                    slip.overtime_amount,
                    slip.bonuses,
                    slip.total_deductions,
                    slip.net_salary,
                    slip.payment_status
                ])
                
        elif export_type == 'overtime':
            writer.writerow(['Date', 'Employee', 'Department', 'Clock In', 'Clock Out', 'Total Hours', 'OT Hours'])
            # Filter attendance
            attendance = HRAttendance.objects.all()
            if year:
                attendance = attendance.filter(date__year=year)
            if month:
                attendance = attendance.filter(date__month=month)
            if dept_id:
                attendance = attendance.filter(employee__department_id=dept_id)
            
            # Only show records with OT > 0
            attendance = attendance.filter(total_hours__gt=9) # Assuming > 9 is OT, strictly logic might vary but generic check
            
            for att in attendance:
                ot_hours = float(att.total_hours) - 9 if float(att.total_hours) > 9 else 0
                if ot_hours > 0:
                    writer.writerow([
                        att.date,
                        att.employee.full_name,
                        att.employee.department.name if att.employee.department else 'N/A',
                        att.clock_in,
                        att.clock_out,
                        att.total_hours,
                        round(ot_hours, 2)
                    ])

        elif export_type == 'bank':
            writer.writerow(['Employee ID', 'Name', 'Bank', 'IBAN', 'Account No', 'Net Salary'])
            slips = SalarySlip.objects.filter(month__startswith=f"{year}-" if year else "")
            if month:
                 month_fmt = f"-{str(month).zfill(2)}"
                 slips = slips.filter(month__contains=month_fmt)
            if dept_id:
                slips = slips.filter(employee__department_id=dept_id)
            
            for slip in slips:
                bank = getattr(slip.employee, 'bank_details', None)
                writer.writerow([
                    slip.employee.employee_id,
                    slip.employee.full_name,
                    bank.bank_name if bank else 'N/A',
                    bank.iban if bank else 'N/A',
                    bank.account_number if bank else 'N/A',
                    slip.net_salary
                ])
                
        else:
            return Response({'error': 'Invalid export type'}, status=400)
            
        return response

class EmployeeReportView(APIView):
    """
    Consolidated API for Employee Related Reports.
    Types: family, bank, contact, resign, loan, leave, expiry
    """
    def get(self, request):
        from hr.models import (
            Employee, EmployeeFamilyDetails, EmployeeBankDetails, 
            Loan, EmployeeDocument
        )
        from leaves.models import LeaveApplication
        from django.utils import timezone
        
        report_type = request.query_params.get('type')
        data = []
        
        if report_type == 'family':
            qs = EmployeeFamilyDetails.objects.select_related('employee').all()
            for item in qs:
                data.append({
                    'employee_id': item.employee.employee_id,
                    'employee_name': item.employee.full_name,
                    'relative_name': item.name,
                    'relationship': item.relationship,
                    'contact': item.contact_number
                })
                
        elif report_type == 'bank':
            qs = EmployeeBankDetails.objects.select_related('employee').all()
            for item in qs:
                data.append({
                    'employee_id': item.employee.employee_id,
                    'employee_name': item.employee.full_name,
                    'bank_name': item.bank_name,
                    'iban': item.iban,
                    'account_number': item.account_number
                })
                
        elif report_type == 'contact':
            qs = Employee.objects.all()
            for emp in qs:
                data.append({
                    'employee_id': emp.employee_id,
                    'name': emp.full_name,
                    'mobile': emp.uae_mobile,
                    'email': emp.user.email if emp.user else '',
                    'emergency_contact': emp.uae_emer_name,
                    'emergency_phone': emp.uae_emer_phone
                })
                
        elif report_type == 'resign':
            qs = Employee.objects.filter(is_active=False)
            for emp in qs:
                data.append({
                    'employee_id': emp.employee_id,
                    'name': emp.full_name,
                    'department': emp.department.name if emp.department else 'N/A',
                    'join_date': emp.date_joined,
                    'status': 'Inactive'
                })
                
        elif report_type == 'loan':
            qs = Loan.objects.select_related('employee').all()
            for loan in qs:
                data.append({
                    'employee_id': loan.employee.employee_id,
                    'name': loan.employee.full_name,
                    'amount': loan.amount,
                    'monthly_deduction': loan.monthly_deduction,
                    'balance': 'N/A', # Todo: Calculate balance
                    'status': 'Active' if loan.is_active else 'Closed'
                })
                
        elif report_type == 'leave':
            qs = LeaveApplication.objects.all().order_by('-created_at')
            for leave in qs:
                data.append({
                    'name': leave.employee_name,
                    'type': leave.leave_type,
                    'from': leave.leave_period_from,
                    'to': leave.leave_period_to,
                    'days': leave.total_days,
                    'status': 'Approved' if leave.hr_approval else 'Pending'
                })
                
        elif report_type == 'expiry':
            today = timezone.now().date()
            # Show all documents, frontend can filter for "expiring soon"
            qs = EmployeeDocument.objects.select_related('employee').order_by('expiry_date')
            for doc in qs:
                days_left = (doc.expiry_date - today).days
                data.append({
                    'employee_id': doc.employee.employee_id,
                    'name': doc.employee.full_name,
                    'document': doc.document_type,
                    'number': doc.document_number,
                    'expiry_date': doc.expiry_date,
                    'days_left': days_left
                })
                
        else:
            return Response({'error': 'Invalid report type'}, status=400)
            
        return Response(data)
