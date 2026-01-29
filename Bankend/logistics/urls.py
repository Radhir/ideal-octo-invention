from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerViewSet, ProductViewSet, ShipmentViewSet,
    SalesOrderViewSet, CostOfSalesViewSet, SellingExpenseViewSet,
    DriverLicenseViewSet, PickupViewSet
)

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'products', ProductViewSet)
router.register(r'shipments', ShipmentViewSet)
router.register(r'sales-orders', SalesOrderViewSet)
router.register(r'cost-of-sales', CostOfSalesViewSet)
router.register(r'selling-expenses', SellingExpenseViewSet)
router.register(r'driver-licenses', DriverLicenseViewSet)
router.register(r'pickups', PickupViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
