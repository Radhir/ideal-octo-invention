from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SLAViewSet, SLAViolationViewSet, SLAReportViewSet

router = DefaultRouter()
router.register(r'agreements', SLAViewSet)
router.register(r'violations', SLAViolationViewSet)
router.register(r'reports', SLAReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
