from django.db import models
from hr.models import Employee
from leads.models import Lead

class SocialMediaPost(models.Model):
    PLATFORM_CHOICES = [
        ('INSTAGRAM', 'Instagram'),
        ('FACEBOOK', 'Facebook'),
        ('TIKTOK', 'TikTok'),
        ('YOUTUBE', 'YouTube'),
        ('LINKEDIN', 'LinkedIn'),
    ]
    CONTENT_TYPE = [
        ('REEL', 'Reel / Short'),
        ('POST', 'Static Post'),
        ('STORY', 'Story'),
        ('AD', 'Paid Advertisement'),
    ]
    
    title = models.CharField(max_length=255)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE)
    post_date = models.DateTimeField()
    link = models.URLField(blank=True)
    
    creator = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='social_posts')
    leads_generated = models.ManyToManyField(Lead, blank=True, related_name='sourced_posts')
    
    engagement_likes = models.IntegerField(default=0)
    engagement_comments = models.IntegerField(default=0)
    engagement_shares = models.IntegerField(default=0)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.platform} - {self.title} ({self.post_date.date()})"

class SEOKeyword(models.Model):
    keyword = models.CharField(max_length=255)
    target_url = models.URLField()
    current_ranking = models.IntegerField(default=0)
    previous_ranking = models.IntegerField(default=0)
    monthly_volume = models.IntegerField(default=0)
    difficulty = models.IntegerField(default=0) # 1-100
    
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='seo_keywords')
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.keyword

class VideoProject(models.Model):
    STATUS_CHOICES = [
        ('PLANNING', 'Planning'),
        ('SHOOTING', 'Shooting'),
        ('EDITING', 'In Editing'),
        ('REVIEW', 'Client Review'),
        ('PUBLISHED', 'Published'),
    ]
    
    project_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNING')
    
    videographer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='video_projects')
    raw_footage_link = models.URLField(blank=True)
    final_video_link = models.URLField(blank=True)
    
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.project_name
