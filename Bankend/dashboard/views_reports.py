from django.shortcuts import render
from django.utils import timezone
from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from core.permissions import IsAdminOrOwner
from .models import WorkshopDiary
from .serializers import WorkshopDiarySerializer
from job_cards.models import JobCard
from bookings.models import Booking
from invoices.models import Invoice
from leads.models import Lead
from job_cards.serializers import JobCardSerializer

def workshop_diary_view_context(request):
    today = timezone.now().date()
    
    # 1. Daily Receiving (New Jobs & Bookings)
    new_jobs = JobCard.objects.filter(created_at__date=today)
    new_bookings = Booking.objects.filter(created_at__date=today)
    
    # 2. Daily Closing (Jobs closed today)
    closed_jobs = JobCard.objects.filter(status='CLOSED', updated_at__date=today)
    
    # 3. Daily Sales (Invoices generated today)
    daily_invoices = Invoice.objects.filter(created_at__date=today)
    total_sales = daily_invoices.aggregate(Sum('grand_total'))['grand_total__sum'] or 0
    
    return {
        'today': today,
        'new_jobs': new_jobs,
        'new_bookings': new_bookings,
        'closed_jobs': closed_jobs,
        'total_sales': total_sales,
        'invoice_count': daily_invoices.count(),
        'new_count': new_jobs.count() + new_bookings.count(),
        'closed_count': closed_jobs.count(),
        'now': timezone.now(),
    }

def workshop_diary_view(request):
    context = workshop_diary_view_context(request)
    return render(request, 'dashboard/workshop_diary.html', context)

def get_dashboard_stats(request):
    """Auxiliary logic used by both traditional Django templates and REST API."""
    today = timezone.now().date()
    month_start = today.replace(day=1)
    
    stats = {
        'active_jobs': JobCard.objects.exclude(status='CLOSED').count(),
        'wip_count': JobCard.objects.filter(status='WIP').count(),
        'reception_count': JobCard.objects.filter(status='RECEPTION').count(),
        'todays_bookings': Booking.objects.filter(created_at__date=today).count(),
        'new_leads': Lead.objects.filter(created_at__date=today).count(),
        'monthly_revenue': Invoice.objects.filter(created_at__date__gte=month_start).aggregate(Sum('grand_total'))['grand_total__sum'] or 0,
        'recent_activity': JobCardSerializer(JobCard.objects.order_by('-updated_at')[:5], many=True).data
    }
    return stats

@api_view(['GET'])
def get_dashboard_stats_api(request):
    return Response(get_dashboard_stats(request))

class WorkshopDiaryViewSet(viewsets.ModelViewSet):
    serializer_class = WorkshopDiarySerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = WorkshopDiary.objects.all().order_by('-date')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        return queryset

    @action(detail=False, methods=['post'])
    def capture_snapshot(self, request):
        """Manually trigger or auto-update today's snapshot."""
        today = timezone.now().date()
        context = workshop_diary_view_context(request)
        
        diary, created = WorkshopDiary.objects.update_or_create(
            date=today,
            defaults={
                'new_bookings_count': context['new_bookings'].count(),
                'new_jobs_count': context['new_jobs'].count(),
                'closed_jobs_count': context['closed_jobs'].count(),
                'revenue': context['total_sales']
            }
        )
        return Response(WorkshopDiarySerializer(diary).data)

    @action(detail=False, methods=['get'])
    def chart_data(self, request):
        """Returns 30 days of history for charts."""
        history = WorkshopDiary.objects.all().order_by('date')[:30]
        return Response(WorkshopDiarySerializer(history, many=True).data)
