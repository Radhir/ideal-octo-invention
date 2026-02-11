from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubscriptionPlanViewSet, CustomerSubscriptionViewSet, CreateCheckoutSessionView
from .webhooks import stripe_webhook

router = DefaultRouter()
router.register('plans', SubscriptionPlanViewSet)
router.register('active', CustomerSubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout'),
    path('webhook/', stripe_webhook, name='stripe-webhook'),
]
