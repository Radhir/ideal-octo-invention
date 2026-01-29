from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NavigationTreeView
from .views_reports import workshop_diary_view, WorkshopDiaryViewSet, get_dashboard_stats_api
from .views_sales import get_sales_dashboard_stats
from .views_chat import ChatMessageViewSet

router = DefaultRouter()
router.register(r'workshop-diary', WorkshopDiaryViewSet, basename='workshop-diary')
router.register(r'chat', ChatMessageViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),
    path('navigation/', NavigationTreeView.as_view(), name='navigation'),
    path('workshop-diary/', workshop_diary_view, name='workshop_diary'),
    path('api/stats/', get_dashboard_stats_api, name='dashboard_stats_api'),
    path('api/sales/', get_sales_dashboard_stats, name='sales_dashboard_stats'),
]
