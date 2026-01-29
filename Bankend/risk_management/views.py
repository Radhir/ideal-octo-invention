from rest_framework import viewsets
from .models import Risk, RiskMitigationAction, Incident
from .serializers import (
    RiskSerializer, RiskListSerializer, 
    RiskMitigationActionSerializer, IncidentSerializer
)

class RiskViewSet(viewsets.ModelViewSet):
    queryset = Risk.objects.all().order_by('-updated_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RiskListSerializer
        return RiskSerializer

class RiskMitigationActionViewSet(viewsets.ModelViewSet):
    queryset = RiskMitigationAction.objects.all().order_by('due_date')
    serializer_class = RiskMitigationActionSerializer

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all().order_by('-occurred_at')
    serializer_class = IncidentSerializer
