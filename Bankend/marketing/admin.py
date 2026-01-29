from django.contrib import admin
from .models import SocialMediaPost, SEOKeyword, VideoProject

@admin.register(SocialMediaPost)
class SocialMediaPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'platform', 'content_type', 'post_date', 'creator')
    list_filter = ('platform', 'content_type', 'post_date')
    search_fields = ('title', 'notes')

@admin.register(SEOKeyword)
class SEOKeywordAdmin(admin.ModelAdmin):
    list_display = ('keyword', 'target_url', 'current_ranking', 'monthly_volume', 'assigned_to')
    list_filter = ('assigned_to',)
    search_fields = ('keyword', 'target_url')

@admin.register(VideoProject)
class VideoProjectAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'status', 'videographer', 'deadline')
    list_filter = ('status', 'videographer')
    search_fields = ('project_name', 'description')
