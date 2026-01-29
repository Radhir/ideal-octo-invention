from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, AccountCategoryViewSet, BudgetViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'categories', AccountCategoryViewSet)
router.register(r'budgets', BudgetViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
