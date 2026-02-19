from rest_framework import viewsets
from core.permissions import IsAdminOrOwner
from .models import Vehicle, VehicleBrand, VehicleModel
from .serializers import VehicleSerializer, VehicleBrandSerializer, VehicleModelSerializer

class VehicleBrandViewSet(viewsets.ModelViewSet):
    module_name = 'Masters'
    queryset = VehicleBrand.objects.all().order_by('name')
    serializer_class = VehicleBrandSerializer
    permission_classes = [IsAdminOrOwner]

class VehicleModelViewSet(viewsets.ModelViewSet):
    module_name = 'Masters'
    queryset = VehicleModel.objects.all().order_by('name')
    serializer_class = VehicleModelSerializer
    permission_classes = [IsAdminOrOwner]

class VehicleViewSet(viewsets.ModelViewSet):
    module_name = 'Masters'
    queryset = Vehicle.objects.all().order_by('-created_at')
    serializer_class = VehicleSerializer
    permission_classes = [IsAdminOrOwner]

    def perform_create(self, serializer):
        serializer.save()
