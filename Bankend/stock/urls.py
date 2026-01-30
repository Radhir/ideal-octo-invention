from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StockFormViewSet, StockItemViewSet, StockMovementViewSet,
    SupplierViewSet, PurchaseOrderViewSet, PurchaseOrderItemViewSet,
    stock_list, stock_create
)

router = DefaultRouter()
router.register(r'requests', StockFormViewSet)
router.register(r'items', StockItemViewSet)
router.register(r'movements', StockMovementViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'po-items', PurchaseOrderItemViewSet)

urlpatterns = [
    path('', stock_list, name='stock_form_list'),
    path('create/', stock_create, name='stock_form_create'),
    path('api/', include(router.urls)),
]
