from rest_framework import viewsets, views, filters
from locations.filters import BranchFilterBackend
from rest_framework.response import Response
from django.db.models import Sum, F, ExpressionWrapper, fields
from django.utils import timezone
from .models import Invoice
from .forms import InvoiceForm
from .serializers import InvoiceSerializer

def invoice_create(request):
    if request.method == 'POST':
        form = InvoiceForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Invoice generated successfully!')
            return redirect('invoice_list')
    else:
        form = InvoiceForm()
    return render(request, 'forms/invoice_form.html', {'form': form, 'title': 'Generate Invoice'})

def invoice_list(request):
    invoices = Invoice.objects.all().order_by('-date')
    return render(request, 'forms/invoice_list.html', {'invoices': invoices})

from core.permissions import IsAdminOrOwner

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-date')
    serializer_class = InvoiceSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = [BranchFilterBackend]

class ARAgingReportView(views.APIView):
    permission_classes = [IsAdminOrOwner]

    def get(self, request):
        today = timezone.now().date()
        unpaid_invoices = Invoice.objects.filter(balance_due__gt=0).exclude(payment_status='CANCELLED')
        
        report = {
            'summary': {
                'current': 0,
                '30_days': 0,
                '60_days': 0,
                '90_plus': 0,
                'total_ar': 0
            },
            'by_customer': {}
        }

        for inv in unpaid_invoices:
            days_old = (today - inv.date).days
            amount = float(inv.balance_due)
            report['summary']['total_ar'] += amount
            
            # Bucketing
            if days_old <= 30:
                bucket = 'current'
            elif days_old <= 60:
                bucket = '30_days'
            elif days_old <= 90:
                bucket = '60_days'
            else:
                bucket = '90_plus'
            
            report['summary'][bucket] += amount
            
            # Customer breakdown
            cust_name = inv.customer_name
            if cust_name not in report['by_customer']:
                report['by_customer'][cust_name] = {
                    'total': 0,
                    'current': 0,
                    '30_days': 0,
                    '60_days': 0,
                    '90_plus': 0,
                }
            report['by_customer'][cust_name]['total'] += amount
            report['by_customer'][cust_name][bucket] += amount

        return Response(report)
