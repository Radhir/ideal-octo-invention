from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WorkTeam, ScheduleAssignment, AdvisorSheet, DailyClosing, EmployeeDailyReport
from .serializers import (
    WorkTeamSerializer, ScheduleAssignmentSerializer, 
    AdvisorSheetSerializer, DailyClosingSerializer, 
    EmployeeDailyReportSerializer
)

class WorkTeamViewSet(viewsets.ModelViewSet):
    queryset = WorkTeam.objects.all()
    serializer_class = WorkTeamSerializer

class ScheduleAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ScheduleAssignment.objects.all()
    serializer_class = ScheduleAssignmentSerializer
    filterset_fields = ['date', 'team']

class AdvisorSheetViewSet(viewsets.ModelViewSet):
    queryset = AdvisorSheet.objects.all()
    serializer_class = AdvisorSheetSerializer
    filterset_fields = ['date', 'advisor']

class DailyClosingViewSet(viewsets.ModelViewSet):
    queryset = DailyClosing.objects.all()
    serializer_class = DailyClosingSerializer
    filterset_fields = ['date']

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        from job_cards.models import JobCard
        from .models import ScheduleAssignment
        import datetime
        today = datetime.date.today()
        
        return Response({
            'active': ScheduleAssignment.objects.filter(date=today).count(),
            'completed': JobCard.objects.filter(status='DELIVERY', updated_at__date=today).count(),
            'pending': JobCard.objects.filter(status='QC', updated_at__date=today).count(),
            'urgent': JobCard.objects.filter(initial_inspection_notes__icontains='urgent').count(),
        })

    @action(detail=False, methods=['get'])
    def aggregation_report(self, request):
        from django.db.models import Sum, Count
        from django.db.models.functions import TruncYear, TruncMonth, TruncDay
        period = request.query_params.get('period', 'daily') # daily, weekly, monthly, yearly
        
        if period == 'yearly':
            trunc_func = TruncYear('date')
        elif period == 'monthly':
            trunc_func = TruncMonth('date')
        else:
            trunc_func = TruncDay('date')

        # Since we want a list for "yearly reports"
        report = DailyClosing.objects.annotate(
            period_label=trunc_func
        ).values('period_label').annotate(
            total_revenue=Sum('revenue_daily'),
            total_received=Sum('total_jobs_received'),
            total_delivered=Sum('total_jobs_delivered'),
            count=Count('id')
        ).order_by('-period_label')

        return Response(list(report))

class EmployeeDailyReportViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDailyReport.objects.all()
    serializer_class = EmployeeDailyReportSerializer
    filterset_fields = ['date', 'user', 'role']
