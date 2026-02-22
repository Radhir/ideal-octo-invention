from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsAdminOrOwner, HasModulePermission
from .models import Account, AccountCategory, Budget, Voucher, VoucherDetail, Commission, FixedAsset
from .serializers import (
    AccountSerializer, AccountCategorySerializer, BudgetSerializer, 
    VoucherSerializer, CommissionSerializer, FixedAssetSerializer,
    AccountGroupSerializer
)
from .services import FinanceService
from rest_framework.views import APIView

class FixedAssetViewSet(viewsets.ModelViewSet):
    module_name = 'Finance'
    queryset = FixedAsset.objects.all().order_by('-purchase_date')
    serializer_class = FixedAssetSerializer
    filterset_fields = ['branch', 'asset_type']

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

class VoucherViewSet(viewsets.ModelViewSet):
    module_name = 'Finance'
    queryset = Voucher.objects.all().order_by('-date')
    serializer_class = VoucherSerializer
    permission_classes = [IsAuthenticated, HasModulePermission]

    @action(detail=False, methods=['get'])
    def ledger(self, request):
        """
        Flattened list of voucher details for the General Ledger.
        """
        start = request.query_params.get('start_date')
        end = request.query_params.get('end_date')
        account_id = request.query_params.get('account_id')
        
        details = VoucherDetail.objects.filter(voucher__status='POSTED')
        
        if start and end:
            details = details.filter(voucher__date__range=[start, end])
        if account_id:
            details = details.filter(account_id=account_id)
            
        details = details.select_related('voucher', 'account').order_by('-voucher__date', '-voucher__created_at')
        
        data = []
        for d in details:
            data.append({
                'id': d.id,
                'date': d.voucher.date,
                'voucher_number': d.voucher.voucher_number,
                'account_name': d.account.name,
                'narration': d.description or d.voucher.narration,
                'debit': float(d.debit),
                'credit': float(d.credit),
                'reference': d.voucher.reference_number,
                'department': 'OPERATIONS' # Placeholder for migration
            })
            
        return Response(data)

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

class FinancialReportViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _get_dates(self, request):
        now = timezone.now()
        start = request.query_params.get('start_date', now.replace(day=1).strftime('%Y-%m-%d'))
        end = request.query_params.get('end_date', now.strftime('%Y-%m-%d'))
        return start, end

    @action(detail=False, methods=['get'])
    def profit_loss(self, request):
        start, end = self._get_dates(request)
        
        # Get Income and Expense accounts
        accounts = Account.objects.filter(category__in=['INCOME', 'EXPENSE']).select_related('group')
        
        report_data = {
            'income': [],
            'expense': [],
            'total_income': 0,
            'total_expense': 0,
            'net_profit': 0
        }

        for acc in accounts:
            # Sum VoucherDetails for this account in range
            details = VoucherDetail.objects.filter(
                account=acc,
                voucher__date__range=[start, end],
                voucher__status='POSTED'
            ).aggregate(debit=Sum('debit'), credit=Sum('credit'))

            debit = details['debit'] or 0
            credit = details['credit'] or 0
            
            # Income = Credit - Debit, Expense = Debit - Credit
            balance = (credit - debit) if acc.category == 'INCOME' else (debit - credit)
            
            if balance == 0: continue

            item = {
                'id': acc.id,
                'code': acc.code,
                'name': acc.name,
                'group': acc.group.name if acc.group else 'Uncategorized',
                'balance': float(balance)
            }

            if acc.category == 'INCOME':
                report_data['income'].append(item)
                report_data['total_income'] += float(balance)
            else:
                report_data['expense'].append(item)
                report_data['total_expense'] += float(balance)

        report_data['net_profit'] = report_data['total_income'] - report_data['total_expense']
        return Response(report_data)

    @action(detail=False, methods=['get'])
    def balance_sheet(self, request):
        start, end = self._get_dates(request)
        
        accounts = Account.objects.filter(category__in=['ASSET', 'LIABILITY', 'EQUITY']).select_related('group')
        
        report_data = {
            'assets': [],
            'liabilities': [],
            'equity': [],
            'total_assets': 0,
            'total_liabilities': 0,
            'total_equity': 0
        }

        for acc in accounts:
            # For Balance Sheet, we usually want the cumulative balance up to 'end' date
            details = VoucherDetail.objects.filter(
                account=acc,
                voucher__date__lte=end,
                voucher__status='POSTED'
            ).aggregate(debit=Sum('debit'), credit=Sum('credit'))

            debit = details['debit'] or 0
            credit = details['credit'] or 0
            
            # Asset = Debit - Credit, Liability/Equity = Credit - Debit
            balance = (debit - credit) if acc.category == 'ASSET' else (credit - debit)
            
            if balance == 0: continue

            item = {
                'id': acc.id,
                'code': acc.code,
                'name': acc.name,
                'group': acc.group.name if acc.group else 'Uncategorized',
                'balance': float(balance)
            }

            if acc.category == 'ASSET':
                report_data['assets'].append(item)
                report_data['total_assets'] += float(balance)
            elif acc.category == 'LIABILITY':
                report_data['liabilities'].append(item)
                report_data['total_liabilities'] += float(balance)
            else:
                report_data['equity'].append(item)
                report_data['total_equity'] += float(balance)

        return Response(report_data)

    @action(detail=False, methods=['get'])
    def trial_balance(self, request):
        start, end = self._get_dates(request)
        accounts = Account.objects.all().order_by('code')
        
        report_data = []
        total_debit = 0
        total_credit = 0

        for acc in accounts:
            details = VoucherDetail.objects.filter(
                account=acc,
                voucher__date__lte=end,
                voucher__status='POSTED'
            ).aggregate(debit=Sum('debit'), credit=Sum('credit'))

            debit = details['debit'] or 0
            credit = details['credit'] or 0
            
            if debit == 0 and credit == 0: continue

            report_data.append({
                'code': acc.code,
                'name': acc.name,
                'debit': float(debit),
                'credit': float(credit)
            })
            total_debit += float(debit)
            total_credit += float(credit)

        return Response({
            'accounts': report_data,
            'totals': {
                'debit': total_debit,
                'credit': total_credit,
                'difference': total_debit - total_credit
            }
        })

    @action(detail=False, methods=['get'])
    def vat_report(self, request):
        start, end = self._get_dates(request)
        
        # Identify VAT accounts (usually Input VAT and Output VAT)
        vat_accounts = Account.objects.filter(name__icontains='VAT')
        
        report_data = {
            'input_vat': [], # Debit balance (Purchases)
            'output_vat': [], # Credit balance (Sales)
            'total_input': 0,
            'total_output': 0,
            'net_payable': 0
        }

        for acc in vat_accounts:
            details = VoucherDetail.objects.filter(
                account=acc,
                voucher__date__range=[start, end],
                voucher__status='POSTED'
            ).aggregate(debit=Sum('debit'), credit=Sum('credit'))

            debit = float(details['debit'] or 0)
            credit = float(details['credit'] or 0)
            
            if debit == 0 and credit == 0: continue

            item = {
                'code': acc.code,
                'name': acc.name,
                'debit': debit,
                'credit': credit
            }

            # Input VAT is typically a Debit balance Asset
            # Output VAT is typically a Credit balance Liability
            if 'input' in acc.name.lower():
                report_data['input_vat'].append(item)
                report_data['total_input'] += debit
            else:
                report_data['output_vat'].append(item)
                report_data['total_output'] += credit

        report_data['net_payable'] = report_data['total_output'] - report_data['total_input']
        return Response(report_data)

    @action(detail=False, methods=['get'])
    def registers(self, request):
        """
        Specialized summary for Payment and Receipt registers.
        """
        start, end = self._get_dates(request)
        
        # Payment Register Summary (Vouchers of type PAYMENT)
        payments = Voucher.objects.filter(
            voucher_type='PAYMENT',
            date__range=[start, end],
            status='POSTED'
        ).aggregate(total=Sum('details__debit')) # Payment is usually a Debit to an expense/asset
        
        # Receipt Register Summary (Vouchers of type RECEIPT)
        receipts = Voucher.objects.filter(
            voucher_type='RECEIPT',
            date__range=[start, end],
            status='POSTED'
        ).aggregate(total=Sum('details__credit')) # Receipt is usually a Credit to an income/liability
        
        return Response({
            'period': {'start': start, 'end': end},
            'summary': {
                'total_payments': float(payments['total'] or 0),
                'total_receipts': float(receipts['total'] or 0),
            }
        })
