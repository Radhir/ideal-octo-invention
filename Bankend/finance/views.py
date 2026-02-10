from rest_framework import viewsets
from .models import Account, AccountCategory, Budget, Transaction, Commission
from .serializers import (
    AccountSerializer, AccountCategorySerializer, 
    BudgetSerializer, TransactionSerializer, CommissionSerializer
)

class AccountCategoryViewSet(viewsets.ModelViewSet):
    queryset = AccountCategory.objects.all()
    serializer_class = AccountCategorySerializer

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all().order_by('code')
    serializer_class = AccountSerializer

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from invoices.models import Invoice

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-date')
    serializer_class = TransactionSerializer

    @action(detail=False, methods=['get'])
    def financial_summary(self, request):
        now = timezone.now()
        
        # Date Filter Logic
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        
        if start_date_str and end_date_str:
            from django.utils.dateparse import parse_date
            start_date = parse_date(start_date_str)
            end_date = parse_date(end_date_str)
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
        
        # Budget Calculations (always relative to requested range or current month)
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
        
        return Response({
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
        })

class CommissionViewSet(viewsets.ModelViewSet):
    queryset = Commission.objects.all().order_by('-date')
    serializer_class = CommissionSerializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        from django.db.models import Sum, Count, Q
        from django.utils import timezone
        
        # Monthly filtering logic
        now = timezone.now()
        start_date = request.query_params.get('start_date', now.replace(day=1).date())
        end_date = request.query_params.get('end_date', now.date())
        
        commissions = self.queryset.filter(date__range=[start_date, end_date])
        
        summary_agg = commissions.aggregate(
            total_accrued=Sum('amount', filter=Q(status='ACCRUED')),
            total_paid=Sum('amount', filter=Q(status='PAID')),
            job_count=Count('job_card', distinct=True)
        )
        
        employee_breakdown = commissions.values(
            'employee__full_name', 'employee__id'
        ).annotate(
            earned=Sum('amount'),
            jobs=Count('id')
        ).order_by('-earned')

        return Response({
            'period': {'start': start_date, 'end': end_date},
            'summary': {
                'total_accrued': summary_agg['total_accrued'] or 0,
                'total_paid': summary_agg['total_paid'] or 0,
                'job_count': summary_agg['job_count'] or 0
            },
            'breakdown': employee_breakdown
        })
