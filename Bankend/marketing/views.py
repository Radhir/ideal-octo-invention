from rest_framework import viewsets
from .models import SocialMediaPost, SEOKeyword, VideoProject
from .serializers import SocialMediaPostSerializer, SEOKeywordSerializer, VideoProjectSerializer

class SocialMediaPostViewSet(viewsets.ModelViewSet):
    queryset = SocialMediaPost.objects.all().order_by('-post_date')
    serializer_class = SocialMediaPostSerializer

class SEOKeywordViewSet(viewsets.ModelViewSet):
    queryset = SEOKeyword.objects.all().order_by('-monthly_volume')
    serializer_class = SEOKeywordSerializer

class VideoProjectViewSet(viewsets.ModelViewSet):
    queryset = VideoProject.objects.all().order_by('deadline')
    serializer_class = VideoProjectSerializer
