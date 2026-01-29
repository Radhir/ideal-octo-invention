from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SocialMediaPostViewSet, SEOKeywordViewSet, VideoProjectViewSet

router = DefaultRouter()
router.register(r'social-posts', SocialMediaPostViewSet)
router.register(r'seo-keywords', SEOKeywordViewSet)
router.register(r'video-projects', VideoProjectViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
