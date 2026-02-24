from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VehicleViewSet, VehicleBrandViewSet, VehicleModelViewSet, 
    InsuranceCompanyViewSet, VehicleColorViewSet, VehicleTypeViewSet, ServiceViewSet
)

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet)
router.register(r'brands', VehicleBrandViewSet)
router.register(r'models', VehicleModelViewSet)
router.register(r'types', VehicleTypeViewSet)
router.register(r'insurance-companies', InsuranceCompanyViewSet)
router.register(r'vehicle-colors', VehicleColorViewSet)
router.register(r'services', ServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
