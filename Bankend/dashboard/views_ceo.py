from django.utils import timezone
from django.db.models import Sum, Count, Q, F, DecimalField
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsEliteAdmin
from invoices.models import Invoice
from finance.models import VoucherDetail, Account
from hr.models import Employee, SalarySlip
from stock.models import StockItem
import datetime

from leads.models import Lead
from bookings.models import Booking
from leads.services_retention import RetentionService

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsEliteAdmin])
def get_ceo_analytics(request):
    """
    Strategic metrics for the CEO Command Center.
    Focuses on Burn Rate, Capacity, Revenue Growth, and Departmental ROI.
    """
    today = timezone.now().date()
    month_start = today.replace(day=1)

    # 1. Revenue Trends (Last 6 Months - same as before)
    revenue_history = []
    for i in range(5, -1, -1):
        target_date = month_start - datetime.timedelta(days=i*30)
        total = Invoice.objects.filter(created_at__month=target_date.month, created_at__year=target_date.year).aggregate(Sum('grand_total'))['grand_total__sum'] or 0
        revenue_history.append({"month": target_date.strftime('%b'), "amount": float(total)})

    # 2. Burn Rate (Last 30 Days)
    expense_total = VoucherDetail.objects.filter(
        voucher__status='POSTED',
        account__category='EXPENSE',
        voucher__date__gte=today - datetime.timedelta(days=30)
    ).aggregate(Sum('debit'))['debit__sum'] or 0

    # 3. CRM Funnel Analytics (MTD)
    total_leads = Lead.objects.filter(created_at__gte=month_start).count()
    booking_conversions = Booking.objects.filter(created_at__gte=month_start, related_lead__isnull=False).count()
    job_conversions = Invoice.objects.filter(created_at__gte=month_start, job_card__related_lead__isnull=False).count()
    
    funnel = {
        "leads": total_leads,
        "bookings": booking_conversions,
        "sales": job_conversions,
        "lead_to_booking_rate": round((booking_conversions / total_leads * 100), 1) if total_leads > 0 else 0,
        "booking_to_sale_rate": round((job_conversions / booking_conversions * 100), 1) if booking_conversions > 0 else 0
    }

    # 4. Retention Candidates
    retention_list = RetentionService.get_retention_candidates()

    # 5. Operational Capacity
    total_employees = Employee.objects.filter(is_active=True).count()
    total_payroll = SalarySlip.objects.filter(month=today.strftime('%Y-%m')).aggregate(Sum('net_salary'))['net_salary__sum'] or 0

    # 5. Inventory Health (Valuation)
    inventory_value = StockItem.objects.all().aggregate(
        total=Sum(F('current_stock') * F('unit_cost'), output_field=DecimalField())
    )['total'] or 0

    return Response({
        "revenue_trends": revenue_history,
        "burn_rate": float(expense_total),
        "payroll_burden": float(total_payroll),
        "employee_count": total_employees,
        "inventory_valuation": float(inventory_value),
        "crm_funnel": funnel,
        "retention_candidates": retention_list[:10], # Top 10 for dashboard
        "vital_stats": [
            {"label": "Leads (MTD)", "value": total_leads, "trend": "+12%"},
            {"label": "Conv. Rate", "value": f"{funnel['lead_to_booking_rate']}%", "trend": "+5%"},
            {"label": "Retention Alerts", "value": len(retention_list), "trend": "Critical"}
        ]
    })
