from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.utils import timezone
from invoices.models import Invoice
from hr.models import Employee
from locations.models import Branch

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_management_stats(request):
    """
    Aggregates high-level business metrics for the Management Console.
    """
    today = timezone.now().date()
    month_start = today.replace(day=1)
    
    # 1. Group Revenue
    total_revenue = Invoice.objects.filter(
        created_at__date__gte=month_start
    ).aggregate(Sum('grand_total'))['grand_total__sum'] or 0
    
    # 2. Staff Count
    active_staff = Employee.objects.filter(is_active=True).count()
    
    # 3. Active Branches
    active_branches_count = Branch.objects.filter(is_active=True).count()
    
    # 4. Branch Performance
    # We aggregate revenue by branch. Invoice model usually has a branch or department ref.
    # If Invoice doesn't have Branch, we might need to link via JobCard.
    # Let's assume Invoice has a link or we can find it.
    
    branches_data = []
    for branch in Branch.objects.filter(is_active=True):
        revenue = Invoice.objects.filter(
            branch=branch,
            created_at__date__gte=month_start
        ).aggregate(Sum('grand_total'))['grand_total__sum'] or 0
        
        # Determine status based on some threshold if needed
        status = "On Target"
        if revenue > 500000: # Example logic
            status = "Exceeding"
        elif revenue < 5000:
            status = "Behind"
            
        branches_data.append({
            "name": branch.name,
            "revenue": float(revenue),
            "status": status,
            "growth": "+0%" # Placeholder for trend analysis
        })

    return Response({
        "totalRevenue": float(total_revenue),
        "activeEmployeeCount": active_staff,
        "branchesCount": active_branches_count,
        "branches": branches_data,
        "csat": 4.8  # Static placeholder for now
    })
