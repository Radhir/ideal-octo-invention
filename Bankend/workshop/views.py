from rest_framework import viewsets
from .models import ServiceDelay, WorkshopIncident
from .serializers import ServiceDelaySerializer, WorkshopIncidentSerializer

class ServiceDelayViewSet(viewsets.ModelViewSet):
    queryset = ServiceDelay.objects.all().order_by('-reported_at')
    serializer_class = ServiceDelaySerializer

class WorkshopIncidentViewSet(viewsets.ModelViewSet):
    queryset = WorkshopIncident.objects.all().order_by('-incident_date')
    serializer_class = WorkshopIncidentSerializer
