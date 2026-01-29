from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StockFormViewSet, StockItemViewSet, StockMovementViewSet,
    SupplierViewSet, PurchaseOrderViewSet, PurchaseOrderItemViewSet
)

router = DefaultRouter()
router.register(r'requests', StockFormViewSet)
router.register(r'items', StockItemViewSet)
router.register(r'movements', StockMovementViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'po-items', PurchaseOrderItemViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
