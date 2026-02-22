from rest_framework import viewsets
from core.permissions import IsAdminOrOwner
from .models import Vehicle, VehicleBrand, VehicleModel, InsuranceCompany, VehicleColor
from .serializers import (
    VehicleSerializer, VehicleBrandSerializer, VehicleModelSerializer,
    InsuranceCompanySerializer, VehicleColorSerializer
)

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

class InsuranceCompanyViewSet(viewsets.ModelViewSet):
    module_name = 'Masters'
    queryset = InsuranceCompany.objects.all().order_by('name')
    serializer_class = InsuranceCompanySerializer
    permission_classes = [IsAdminOrOwner]

class VehicleColorViewSet(viewsets.ModelViewSet):
    module_name = 'Masters'
    queryset = VehicleColor.objects.all().order_by('name')
    serializer_class = VehicleColorSerializer
    permission_classes = [IsAdminOrOwner]
