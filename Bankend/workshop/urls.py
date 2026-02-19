from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceDelayViewSet, 
    WorkshopIncidentViewSet,
    BoothViewSet,
    PaintMixViewSet
)

router = DefaultRouter()
router.register(r'delays', ServiceDelayViewSet)
router.register(r'incidents', WorkshopIncidentViewSet)
router.register(r'booths', BoothViewSet)
router.register(r'paint-mixes', PaintMixViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
