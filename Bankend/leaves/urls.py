from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'applications', views.LeaveViewSet)

urlpatterns = [
    path('', views.leave_list, name='leave_list'),
    path('create/', views.leave_create, name='leave_create'),
    # API
    path('api/', include(router.urls)),
]
