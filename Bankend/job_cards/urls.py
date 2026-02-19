from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'jobs', views.JobCardViewSet, basename='jobcard')
router.register(r'tasks', views.JobCardTaskViewSet)
router.register(r'photos', views.JobCardPhotoViewSet)
router.register(r'service-categories', views.ServiceCategoryViewSet)
router.register(r'services', views.ServiceViewSet)
router.register(r'warranty-claims', views.WarrantyClaimViewSet)

urlpatterns = [
    path('', views.job_card_list, name='job_card_list'),
    path('create/', views.job_card_create, name='job_card_create'),
    path('<int:pk>/', views.job_card_detail, name='job_card_detail'),
    path('<int:pk>/invoice/', views.create_invoice_from_job, name='create_invoice_from_job'),
    # API endpoints
    path('api/', include(router.urls)),
    path('api/portal/<uuid:token>/', views.CustomerPortalDetailView.as_view(), name='customer_portal_api'),
]
