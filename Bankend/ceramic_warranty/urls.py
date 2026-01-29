from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'warranties', views.CeramicWarrantyViewSet)

urlpatterns = [
    path('', views.ceramic_warranty_list, name='ceramic_warranty_list'),
    path('create/', views.ceramic_warranty_create, name='ceramic_warranty_create'),
    # API endpoints
    path('api/', include(router.urls)),
]
