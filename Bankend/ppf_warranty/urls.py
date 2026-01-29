from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'warranties', views.PPFWarrantyViewSet)

urlpatterns = [
    path('', views.ppf_warranty_list, name='ppf_warranty_list'),
    path('create/', views.ppf_warranty_create, name='ppf_warranty_create'),
    # API endpoints
    path('api/', include(router.urls)),
]
