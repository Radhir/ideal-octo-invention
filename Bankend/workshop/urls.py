from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceDelayViewSet, WorkshopIncidentViewSet

router = DefaultRouter()
router.register(r'delays', ServiceDelayViewSet)
router.register(r'incidents', WorkshopIncidentViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
