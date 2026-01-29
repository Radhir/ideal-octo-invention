from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RiskViewSet, RiskMitigationActionViewSet, IncidentViewSet

router = DefaultRouter()
router.register(r'risks', RiskViewSet)
router.register(r'mitigation-actions', RiskMitigationActionViewSet)
router.register(r'incidents', IncidentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
