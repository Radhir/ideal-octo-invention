from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubscriptionPlanViewSet, CustomerSubscriptionViewSet

router = DefaultRouter()
router.register(r'plans', SubscriptionPlanViewSet)
router.register(r'my-subscriptions', CustomerSubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
