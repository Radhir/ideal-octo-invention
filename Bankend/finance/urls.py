from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, AccountCategoryViewSet, BudgetViewSet, VoucherViewSet, CommissionViewSet, FinancialReportViewSet, FixedAssetViewSet

router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'categories', AccountCategoryViewSet)
router.register(r'budgets', BudgetViewSet)
router.register(r'vouchers', VoucherViewSet)
router.register(r'commissions', CommissionViewSet)
router.register(r'reports', FinancialReportViewSet, basename='financial-reports')
router.register(r'fixed-assets', FixedAssetViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
