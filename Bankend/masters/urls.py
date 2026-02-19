from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, VehicleBrandViewSet, VehicleModelViewSet

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet)
router.register(r'brands', VehicleBrandViewSet)
router.register(r'models', VehicleModelViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
