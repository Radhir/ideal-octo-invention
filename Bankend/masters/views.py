from rest_framework import viewsets
from core.permissions import IsAdminOrOwner
from .models import Vehicle
from .serializers import VehicleSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    module_name = 'Masters'
    queryset = Vehicle.objects.all().order_by('-created_at')
    serializer_class = VehicleSerializer
    permission_classes = [IsAdminOrOwner]

    def perform_create(self, serializer):
        # Additional logic if needed (e.g., auto-creating customer context)
        serializer.save()
