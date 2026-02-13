from datetime import date
from django.db import transaction
from django.utils import timezone
from django.db.models import Sum
from datetime import timedelta
from .models import Transaction, Account, Budget

class FinanceService:
    @staticmethod
    def get_financial_summary(start_date=None, end_date=None):
        now = timezone.now()
        
        if start_date and end_date:
            from django.utils.dateparse import parse_date
            if isinstance(start_date, str): start_date = parse_date(start_date)
            if isinstance(end_date, str): end_date = parse_date(end_date)
            
            # Make end_date inclusive (end of day)
            end_date = timezone.make_aware(timezone.datetime.combine(end_date, timezone.datetime.max.time()))
            start_date = timezone.make_aware(timezone.datetime.combine(start_date, timezone.datetime.min.time()))
        else:
            # Default to this month
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = now

        first_day_last_month = (start_date - timedelta(days=1)).replace(day=1)
        
        # Metrics for filtered range
        range_revenue = Transaction.objects.filter(
            transaction_type='CREDIT', 
            date__range=(start_date, end_date)
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        range_expense = Transaction.objects.filter(
            transaction_type='DEBIT', 
            date__range=(start_date, end_date)
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Metrics for previous period (same duration)
        duration = end_date - start_date
        prev_start = start_date - duration
        prev_end = start_date
        
        prev_revenue = Transaction.objects.filter(
            transaction_type='CREDIT', 
            date__range=(prev_start, prev_end)
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        prev_expense = Transaction.objects.filter(
            transaction_type='DEBIT', 
            date__range=(prev_start, prev_end)
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Totals
        total_revenue = Transaction.objects.filter(transaction_type='CREDIT').aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = Transaction.objects.filter(transaction_type='DEBIT').aggregate(total=Sum('amount'))['total'] or 0
        total_assets = Account.objects.filter(category__icontains='ASSET').aggregate(total=Sum('balance'))['total'] or 0
        
        # Budget Calculations
        budgets = Budget.objects.all()
        budget_data = []
        for b in budgets:
            if b.department_ref:
                dept_spent = Transaction.objects.filter(
                    department_ref=b.department_ref, 
                    transaction_type='DEBIT',
                    date__range=(start_date, end_date)
                ).aggregate(total=Sum('amount'))['total'] or 0
            else:
                dept_spent = Transaction.objects.filter(
                    department=b.department, 
                    transaction_type='DEBIT',
                    date__range=(start_date, end_date)
                ).aggregate(total=Sum('amount'))['total'] or 0
                
            budget_data.append({
                'label': b.department_ref.name if b.department_ref else b.get_department_display(),
                'used': dept_spent,
                'total': b.amount,
                'percent': (float(dept_spent) / float(b.amount) * 100) if b.amount > 0 else 0
            })
        
        return {
            'summary': {
                'total_revenue': total_revenue,
                'total_expenses': total_expenses,
                'total_assets': total_assets,
                'net_worth': total_revenue - total_expenses,
                'period_revenue': range_revenue,
                'period_expense': range_expense,
                'period_net': range_revenue - range_expense,
                'trends': {
                    'revenue_growth': ((float(range_revenue) / float(prev_revenue) - 1) * 100) if prev_revenue > 0 else 0,
                    'expense_growth': ((float(range_expense) / float(prev_expense) - 1) * 100) if prev_expense > 0 else 0,
                }
            },
            'budgets': budget_data,
            'accounts_count': Account.objects.count()
        }
