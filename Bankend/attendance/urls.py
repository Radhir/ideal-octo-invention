from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'records', views.AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('api/', include(router.urls)),
    # Explicit endpoints for clock in/out (in case router actions don't work)
    path('api/check-in/', views.AttendanceViewSet.as_view({'post': 'check_in'}), name='attendance-check-in'),
    path('api/check-out/', views.AttendanceViewSet.as_view({'post': 'check_out'}), name='attendance-check-out'),
    path('api/today/', views.AttendanceViewSet.as_view({'get': 'today'}), name='attendance-today'),
    path('api/summary/', views.AttendanceViewSet.as_view({'get': 'summary'}), name='attendance-summary'),
]
