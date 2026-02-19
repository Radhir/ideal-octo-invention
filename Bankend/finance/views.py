from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsAdminOrOwner, HasModulePermission
from .models import Account, AccountCategory, Budget, Transaction, Commission
from .serializers import (
    AccountSerializer, AccountCategorySerializer, 
    BudgetSerializer, TransactionSerializer, CommissionSerializer
)
from .services import FinanceService

class AccountCategoryViewSet(viewsets.ModelViewSet):
    module_name = 'Finance'
    queryset = AccountCategory.objects.all()
    serializer_class = AccountCategorySerializer
    permission_classes = [IsAuthenticated, HasModulePermission]

class AccountViewSet(viewsets.ModelViewSet):
    module_name = 'Finance'
    queryset = Account.objects.all().order_by('code')
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated, HasModulePermission]

class BudgetViewSet(viewsets.ModelViewSet):
    module_name = 'Finance'
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, HasModulePermission]

from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from invoices.models import Invoice

class TransactionViewSet(viewsets.ModelViewSet):
    module_name = 'Finance'
    queryset = Transaction.objects.all().order_by('-date')
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated, HasModulePermission]

    @action(detail=False, methods=['get'])
    def financial_summary(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        summary = FinanceService.get_financial_summary(start_date, end_date)
        return Response(summary)

class CommissionViewSet(viewsets.ModelViewSet):
    module_name = 'Finance'
    queryset = Commission.objects.all().order_by('-date')
    serializer_class = CommissionSerializer
    permission_classes = [IsAuthenticated, HasModulePermission]

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
