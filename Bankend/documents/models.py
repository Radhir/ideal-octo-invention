from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
import uuid
import os

class DocumentCategory(models.Model):
    CATEGORY_TYPES = [
        ('TECHNICAL', 'Technical Manuals'),
        ('LEGAL', 'Legal/Contracts'),
        ('HR', 'HR/Employee Records'),
        ('FINANCE', 'Financial Records'),
        ('OPERATIONS', 'SOPs & Workflows'),
        ('MARKETING', 'Marketing Assets'),
    ]
    
    name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=50, choices=CATEGORY_TYPES)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True)
    allowed_groups = models.ManyToManyField('auth.Group', blank=True)
    retention_period_years = models.IntegerField(default=7)
    
    class Meta:
        verbose_name_plural = "Document Categories"
    
    def __str__(self):
        return self.name

class Document(models.Model):
    ACCESS_LEVELS = [
        ('PUBLIC', 'Public (All Staff)'),
        ('RESTRICTED', 'Restricted (Department Only)'),
        ('CONFIDENTIAL', 'Confidential (Management Only)'),
        ('PRIVATE', 'Private (Owner Only)'),
    ]

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('ARCHIVED', 'Archived'),
    ]
    
    document_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    category = models.ForeignKey(DocumentCategory, on_delete=models.PROTECT)
    
    # File Storage
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    file_type = models.CharField(max_length=50) # pdf, docx, etc
    file_size = models.BigIntegerField()
    
    # Context (Polymorphic Association)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    linked_object = GenericForeignKey('content_type', 'object_id')
    
    # Access Control
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='owned_documents')
    access_level = models.CharField(max_length=50, choices=ACCESS_LEVELS, default='RESTRICTED')
    
    # Versioning
    version = models.CharField(max_length=20, default='1.0')
    is_latest = models.BooleanField(default=True)
    
    # Search & Metadata
    tags = models.ManyToManyField('DocumentTag', blank=True)
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict) # For flexible attributes
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expiry_date = models.DateField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['document_number']),
            models.Index(fields=['content_type', 'object_id']),
        ]
        permissions = [
            ("can_archive_document", "Can archive documents"),
            ("can_view_confidential", "Can view confidential documents"),
        ]

class DocumentVersion(models.Model):
    """Store history of document versions"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    file = models.FileField(upload_to='documents/versions/%Y/%m/')
    version_number = models.CharField(max_length=20)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    change_log = models.TextField()
    
    class Meta:
        ordering = ['-created_at']

class DocumentAccessLog(models.Model):
    """Audit trail for document access"""
    ACCESS_TYPES = [
        ('VIEW', 'Viewed'),
        ('DOWNLOAD', 'Downloaded'),
        ('EDIT', 'Edited Metadata'),
        ('NEW_VERSION', 'Uploaded New Version'),
        ('DELETE', 'Deleted'),
        ('SHARE', 'Shared'),
    ]
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    access_type = models.CharField(max_length=50, choices=ACCESS_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']

class DocumentShareLink(models.Model):
    """Temporary public links for external sharing"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    password_hash = models.CharField(max_length=128, blank=True) # Optional password protection
    access_count = models.IntegerField(default=0)

class DocumentTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name

class DocumentWorkflow(models.Model):
    """Approval workflows for documents"""
    document = models.OneToOneField(Document, on_delete=models.CASCADE)
    current_step = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=Document.STATUS_CHOICES)
    initiated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class WorkflowStep(models.Model):
    workflow = models.ForeignKey(DocumentWorkflow, on_delete=models.CASCADE, related_name='steps')
    step_number = models.IntegerField()
    approver_group = models.ForeignKey('auth.Group', on_delete=models.SET_NULL, null=True)
    approver_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected')], default='PENDING')
    comments = models.TextField(blank=True)
    actioned_at = models.DateTimeField(null=True, blank=True)
    actioned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='actioned_steps')
