from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'logs', views.AttendanceViewSet)

urlpatterns = [
    path('', views.attendance_list, name='attendance_list'),
    path('clock-in/', views.clock_in, name='clock_in'),
    # API
    path('api/', include(router.urls)),
]
