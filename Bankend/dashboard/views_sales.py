from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta

from job_cards.models import JobCard
from leads.models import Lead
from invoices.models import Invoice

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sales_dashboard_stats(request):
    today = timezone.now()
    first_day_this_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_month_start = (first_day_this_month - timedelta(days=1)).replace(day=1)

    # 1. Pipeline Summary
    total_leads = Lead.objects.count()
    new_leads_month = Lead.objects.filter(created_at__gte=first_day_this_month).count()
    active_leads = Lead.objects.exclude(status__in=['LOST', 'CONVERTED']).count()
    
    # Calculate Pipeline Value (Sum of estimated_value for non-lost leads)
    pipeline_value = Lead.objects.exclude(status='LOST').aggregate(
        total_value=Sum('estimated_value')
    )['total_value'] or 0

    # 2. Key Performance Indicators (KPIs)
    # Conversion Rate: Converted Leads / Total Leads (All time for simplicity, or 30 days)
    processed_leads = Lead.objects.filter(status__in=['CONVERTED', 'LOST']).count()
    converted_leads = Lead.objects.filter(status='CONVERTED').count()
    conversion_rate = round((converted_leads / processed_leads * 100) if processed_leads > 0 else 0, 1)

    # 3. Advisor Leaderboard (Blending JobCards(Revenue) + Leads(Volume))
    # Note: JobCard uses 'service_advisor' (str) and Lead uses 'assigned_to__user__first_name' (str)
    
    # Aggregating Revenue by Advisor from JobCards
    revenue_by_advisor = JobCard.objects.values('service_advisor').annotate(
        total_revenue=Sum('net_amount'),
        jobs_count=Count('id')
    ).order_by('-total_revenue')
    
    # Convert to dictionary for easy lookup
    leaderboard = {}
    
    for entry in revenue_by_advisor:
        name = entry['service_advisor'] or 'Unknown'
        name = name.strip()
        if not name: continue
        
        if name not in leaderboard:
            leaderboard[name] = {'name': name, 'revenue': 0, 'leads': 0, 'conversions': 0}
        
        leaderboard[name]['revenue'] += float(entry['total_revenue'] or 0)
        leaderboard[name]['jobs_count'] = entry['jobs_count']

    # Aggregating Leads by Advisor
    leads_by_advisor = Lead.objects.values('assigned_to__user__first_name', 'assigned_to__user__last_name').annotate(
        total_leads=Count('id'),
        converted=Count('id', filter=Q(status='CONVERTED'))
    )

    for entry in leads_by_advisor:
        fname = entry['assigned_to__user__first_name'] or ''
        lname = entry['assigned_to__user__last_name'] or ''
        name = f"{fname} {lname}".strip() or 'Unassigned'
        
        if name not in leaderboard:
            leaderboard[name] = {'name': name, 'revenue': 0, 'leads': 0, 'conversions': 0}
            
        leaderboard[name]['leads'] += entry['total_leads']
        leaderboard[name]['conversions'] += entry['converted']

    # Calculate individual conversion rates and sort by Revenue
    final_leaderboard = []
    for data in leaderboard.values():
        total = data.get('leads', 0)
        conv = data.get('conversions', 0)
        data['conversion_rate'] = round((conv / total * 100) if total > 0 else 0, 1)
        final_leaderboard.append(data)
    
    # Sort by Revenue descending
    final_leaderboard.sort(key=lambda x: x['revenue'], reverse=True)

    # 4. Monthly Trends (Revenue & Leads) - Last 6 Months
    six_months_ago = today - timedelta(days=180)
    
    revenue_trend_qs = JobCard.objects.filter(date__gte=six_months_ago)\
        .annotate(month=TruncMonth('date'))\
        .values('month')\
        .annotate(total=Sum('net_amount'))\
        .order_by('month')
        
    leads_trend_qs = Lead.objects.filter(created_at__gte=six_months_ago)\
        .annotate(month=TruncMonth('created_at'))\
        .values('month')\
        .annotate(count=Count('id'))\
        .order_by('month')
    
    # Merge trends
    trends_map = {}
    for r in revenue_trend_qs:
        m = r['month'].strftime('%b')
        if m not in trends_map: trends_map[m] = {'name': m, 'revenue': 0, 'leads': 0}
        trends_map[m]['revenue'] = float(r['total'])
        
    for l in leads_trend_qs:
        m = l['month'].strftime('%b')
        if m not in trends_map: trends_map[m] = {'name': m, 'revenue': 0, 'leads': 0}
        trends_map[m]['leads'] = l['count']
        
    # Sort trends chronologically? (Simple dict might strip order, assuming standard months)
    # Re-list based on QS order would be safer but let's trust month extraction for now or use list
    
    chart_data = list(trends_map.values())

    return Response({
        'pipeline': {
            'total_leads': total_leads,
            'active_leads': active_leads,
            'new_this_month': new_leads_month,
            'value': pipeline_value
        },
        'kpi': {
            'conversion_rate': conversion_rate,
            'target_revenue': 500000, # Mock target for visual comparison
        },
        'leaderboard': final_leaderboard[:10], # Top 10
        'chart_data': chart_data
    })
