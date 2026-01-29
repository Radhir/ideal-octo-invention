from rest_framework import serializers
from .models import SocialMediaPost, SEOKeyword, VideoProject

class SocialMediaPostSerializer(serializers.ModelSerializer):
    creator_name = serializers.ReadOnlyField(source='creator.full_name')
    class Meta:
        model = SocialMediaPost
        fields = '__all__'

class SEOKeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOKeyword
        fields = '__all__'

class VideoProjectSerializer(serializers.ModelSerializer):
    videographer_name = serializers.ReadOnlyField(source='videographer.full_name')
    class Meta:
        model = VideoProject
        fields = '__all__'
