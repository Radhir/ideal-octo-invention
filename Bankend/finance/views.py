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
from invoices.models import Invoice

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-date')
    serializer_class = TransactionSerializer

    @action(detail=False, methods=['get'])
    def financial_summary(self, request):
        total_revenue = Invoice.objects.filter(payment_status='PAID').aggregate(total=Sum('grand_total'))['total'] or 0
        budgets = Budget.objects.all()
        budget_data = []
        for b in budgets:
            # Calculate spent dynamically from paid invoices of the same department
            invoice_spent = Invoice.objects.filter(department=b.department, payment_status='PAID').aggregate(total=Sum('grand_total'))['total'] or 0
            # Combine with manual spent field if needed, or just use invoice_spent
            total_spent = b.spent + invoice_spent
            
            budget_data.append({
                'label': b.get_department_display(),
                'used': total_spent,
                'total': b.amount,
                'percent': (total_spent / b.amount * 100) if b.amount > 0 else 0
            })
        
        return Response({
            'total_revenue': total_revenue,
            'budgets': budget_data,
            'total_assets': Account.objects.filter(category='ASSET').aggregate(total=Sum('balance'))['total'] or 0
        })
