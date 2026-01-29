from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, webhooks

router = DefaultRouter()
router.register(r'list', views.LeadViewSet)

urlpatterns = [
    path('', views.lead_list, name='lead_list'),
    path('create/', views.lead_create, name='lead_create'),
    path('webhook/meta/', webhooks.meta_webhook, name='meta_webhook'),
    # API
    path('api/', include(router.urls)),
]
