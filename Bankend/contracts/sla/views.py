from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import ServiceLevelAgreement, SLAViolation, SLAReport, SLAMetric, SLARenewal, CreditNote
from .serializers import SLASerializer, SLAMetricSerializer, SLAViolationSerializer, SLAReportSerializer
from django.db.models import Sum, Avg
from .tasks import calculate_sla_metrics  # Assuming Celery task for heavy calculation
# from invoices.models import Invoice # Implicitly needed for CreditNote logic?

class SLAViewSet(viewsets.ModelViewSet):
    queryset = ServiceLevelAgreement.objects.all()
    serializer_class = SLASerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        return queryset
    
    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        sla = self.get_object()
        months = int(request.data.get('months', 12))
        
        # Calculate new end date
        new_end_date = sla.end_date + timezone.timedelta(days=months*30)
        
        # Create renewal record
        SLARenewal.objects.create(
            original_sla=sla,
            renewed_by=request.user,
            renewal_months=months,
            new_end_date=new_end_date,
            notes=request.data.get('notes', '')
        )
        
        # Update SLA
        sla.end_date = new_end_date
        sla.save()
        
        return Response({'status': 'renewed', 'new_end_date': new_end_date})

    @action(detail=True, methods=['get'])
    def metrics(self, request, pk=None):
        sla = self.get_object()
        month_str = request.query_params.get('month') # YYYY-MM
        
        if month_str:
            metrics = SLAMetric.objects.filter(sla=sla, month__startswith=month_str).first()
        else:
            # Get last 6 months
            metrics = SLAMetric.objects.filter(sla=sla).order_by('-month')[:6]
            
        return Response(SLAMetricSerializer(metrics, many=not month_str).data)
    
    @action(detail=True, methods=['post'])
    def calculate_metrics(self, request, pk=None):
        """Trigger ad-hoc metric calculation"""
        sla = self.get_object()
        year = request.data.get('year', timezone.now().year)
        month = request.data.get('month', timezone.now().month)
        
        calculate_sla_metrics.delay(sla.id, year, month)
        
        return Response({'status': 'calculation_queued'})

class SLAViolationViewSet(viewsets.ModelViewSet):
    queryset = SLAViolation.objects.all()
    serializer_class = SLAViolationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        violation = self.get_object()
        violation.is_acknowledged = True
        violation.acknowledged_by = request.user
        violation.acknowledged_at = timezone.now()
        violation.save()
        return Response({'status': 'acknowledged'})
        
    @action(detail=True, methods=['post'])
    def apply_credit(self, request, pk=None):
        """Apply service credit to next invoice"""
        violation = self.get_object()
        
        if violation.invoice_adjusted:
             return Response(
                 {'error': 'Credit already applied'},
                 status=status.HTTP_400_BAD_REQUEST
             )
             
        # Create Credit Note logic (simplified)
        # Ideally find the next pending invoice for this customer
        # For now, we assume we just record the CreditNote
        
        CreditNote.objects.create(
            invoice=violation.job_card.invoice if violation.job_card and hasattr(violation.job_card, 'invoice') else None, # Fail safe
            amount=violation.service_credit_amount,
            reason=f"SLA Violation: {violation.get_violation_type_display()}",
            created_by=request.user
        )
        
        violation.invoice_adjusted = True
        violation.save()
        
        return Response({'status': 'credit_applied'})

class SLAReportViewSet(viewsets.ModelViewSet):
    queryset = SLAReport.objects.all()
    serializer_class = SLAReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def generate_pdf(self, request, pk=None):
        report = self.get_object()
        # Call PDF generation service
        # generate_sla_report_pdf.delay(report.id)
        return Response({'status': 'pdf_generation_queued'})
