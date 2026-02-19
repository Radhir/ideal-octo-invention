from rest_framework import viewsets
from .models import ServiceDelay, WorkshopIncident, Booth, PaintMix
from .serializers import (
    ServiceDelaySerializer, 
    WorkshopIncidentSerializer, 
    BoothSerializer, 
    PaintMixSerializer
)

class ServiceDelayViewSet(viewsets.ModelViewSet):
    queryset = ServiceDelay.objects.all().order_by('-reported_at')
    serializer_class = ServiceDelaySerializer

class WorkshopIncidentViewSet(viewsets.ModelViewSet):
    queryset = WorkshopIncident.objects.all().order_by('-incident_date')
    serializer_class = WorkshopIncidentSerializer

class BoothViewSet(viewsets.ModelViewSet):
    queryset = Booth.objects.all().order_by('name')
    serializer_class = BoothSerializer

class PaintMixViewSet(viewsets.ModelViewSet):
    queryset = PaintMix.objects.all().order_by('-created_at')
    serializer_class = PaintMixSerializer
