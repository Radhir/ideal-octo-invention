from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'portal', CustomerPortalViewSet, basename='customer-portal')
router.register(r'my-jobs', CustomerJobCardViewSet, basename='customer-jobs')
router.register(r'feedback', CustomerFeedbackViewSet, basename='customer-feedback')

urlpatterns = [
    path('', include(router.urls)),
    path('invoices/', CustomerInvoiceListView.as_view(), 
         name='customer-invoices'),
    # path('bookings/create/', CustomerBookingCreateView.as_view(), 
    #      name='customer-booking-create'),
]
