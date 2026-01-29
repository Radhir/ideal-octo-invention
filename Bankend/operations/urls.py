from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'list', views.OperationViewSet)

urlpatterns = [
    path('', views.operation_list, name='operation_list'),
    path('create/', views.operation_create, name='operation_create'),
    # API
    path('api/', include(router.urls)),
]
