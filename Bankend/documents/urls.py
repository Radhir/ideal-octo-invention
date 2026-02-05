from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, DocumentCategoryViewSet

router = DefaultRouter()
router.register(r'files', DocumentViewSet)
router.register(r'categories', DocumentCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
