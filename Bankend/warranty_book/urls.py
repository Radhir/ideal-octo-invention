from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WarrantyRegistrationViewSet

router = DefaultRouter()
router.register(r'registrations', WarrantyRegistrationViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
