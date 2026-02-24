from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'records', views.AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
    # Explicit endpoints for clock in/out
    path('check-in/', views.AttendanceViewSet.as_view({'post': 'check_in'}), name='attendance-check-in'),
    path('check-out/', views.AttendanceViewSet.as_view({'post': 'check_out'}), name='attendance-check-out'),
    path('today/', views.AttendanceViewSet.as_view({'get': 'today'}), name='attendance-today'),
    path('summary/', views.AttendanceViewSet.as_view({'get': 'summary'}), name='attendance-summary'),
]
