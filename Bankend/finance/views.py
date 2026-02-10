from rest_framework import viewsets
from .models import Account, AccountCategory, Budget, Transaction
from .serializers import AccountSerializer, AccountCategorySerializer, BudgetSerializer, TransactionSerializer

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
        first_day_this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        first_day_last_month = (first_day_this_month - timedelta(days=1)).replace(day=1)
        
        # Monthly Metrics (This Month)
        monthly_revenue = Transaction.objects.filter(
            transaction_type='CREDIT', 
            date__gte=first_day_this_month
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        monthly_expense = Transaction.objects.filter(
            transaction_type='DEBIT', 
            date__gte=first_day_this_month
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Monthly Metrics (Last Month)
        prev_monthly_revenue = Transaction.objects.filter(
            transaction_type='CREDIT', 
            date__gte=first_day_last_month,
            date__lt=first_day_this_month
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        prev_monthly_expense = Transaction.objects.filter(
            transaction_type='DEBIT', 
            date__gte=first_day_last_month,
            date__lt=first_day_this_month
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Totals
        total_revenue = Transaction.objects.filter(transaction_type='CREDIT').aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = Transaction.objects.filter(transaction_type='DEBIT').aggregate(total=Sum('amount'))['total'] or 0
        total_assets = Account.objects.filter(category__icontains='ASSET').aggregate(total=Sum('balance'))['total'] or 0
        
        # Budget Calculations
        budgets = Budget.objects.all()
        budget_data = []
        for b in budgets:
            # Use specific department filter if department_ref is available, else fallback
            if b.department_ref:
                dept_spent = Transaction.objects.filter(department_ref=b.department_ref, transaction_type='DEBIT').aggregate(total=Sum('amount'))['total'] or 0
            else:
                dept_spent = Transaction.objects.filter(department=b.department, transaction_type='DEBIT').aggregate(total=Sum('amount'))['total'] or 0
                
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
                'monthly_revenue': monthly_revenue,
                'monthly_expense': monthly_expense,
                'monthly_net': monthly_revenue - monthly_expense,
                'trends': {
                    'revenue_growth': ((float(monthly_revenue) / float(prev_monthly_revenue) - 1) * 100) if prev_monthly_revenue > 0 else 0,
                    'expense_growth': ((float(monthly_expense) / float(prev_monthly_expense) - 1) * 100) if prev_monthly_expense > 0 else 0,
                }
            },
            'budgets': budget_data,
            'accounts_count': Account.objects.count()
        })
