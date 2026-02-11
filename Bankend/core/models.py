from django.db import models
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class CacheEntry(models.Model):
    """Store cache data in database for persistence"""
    key = models.CharField(max_length=255, unique=True, db_index=True)
    value = models.TextField()
    expires_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['key', 'expires_at']),
        ]
    
    def __str__(self):
        return f"Cache: {self.key}"
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at


class CacheCollectorLog(models.Model):
    """Log cache cleaning operations (runs 4x per month)"""
    run_date = models.DateTimeField(auto_now_add=True)
    entries_deleted = models.IntegerField(default=0)
    entries_kept = models.IntegerField(default=0)
    execution_time_ms = models.IntegerField(help_text="Execution time in milliseconds")
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-run_date']
    
    def __str__(self):
        return f"Cache Cleanup - {self.run_date.strftime('%Y-%m-%d %H:%M')}"


class ErrorLog(models.Model):
    """Log all application errors for debugging"""
    SEVERITY_CHOICES = [
        ('DEBUG', 'Debug'),
        ('INFO', 'Info'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('CRITICAL', 'Critical'),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='ERROR')
    
    # Error Details
    error_type = models.CharField(max_length=255)
    error_message = models.TextField()
    stack_trace = models.TextField(blank=True)
    
    # Request Details
    endpoint = models.CharField(max_length=500, blank=True)
    method = models.CharField(max_length=10, blank=True)  # GET, POST, etc.
    user = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    # Additional Context
    request_data = models.TextField(blank=True, help_text="JSON of request body")
    user_agent = models.TextField(blank=True)
    
    resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_errors')
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp', 'severity']),
            models.Index(fields=['resolved', 'timestamp']),
        ]
    
    def __str__(self):
        return f"[{self.severity}] {self.error_type} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


# ==================== AUDIT TRAIL SYSTEM ====================

class AuditLog(models.Model):
    """Track all changes to database records with full traceability"""
    
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('VIEW', 'View'),
        ('EXPORT', 'Export'),
        ('PRINT', 'Print'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
    ]
    
    # When & Who
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    user = models.ForeignKey(
        'auth.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='audit_logs_v2'
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # What (Generic Foreign Key)
    content_type = models.ForeignKey(
        ContentType, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    object_id = models.CharField(max_length=50, null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    object_repr = models.CharField(max_length=255, blank=True)
    
    action = models.CharField(max_length=10, choices=ACTION_CHOICES, db_index=True)
    
    # Changes Detail
    field_changes = models.JSONField(
        null=True, 
        blank=True, 
        help_text="JSON diff of before/after values"
    )
    
    # Request Info
    endpoint = models.CharField(max_length=500, blank=True)
    method = models.CharField(max_length=10, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['action', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.action} {self.object_repr or self.object_id} at {self.timestamp}"

class NoAudit(models.Model):
    """Inherit this model to skip audit logging for specific data"""
    class Meta:
        abstract = True


class LoginHistory(models.Model):
    """Track user login/logout activity"""
    
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='login_history')
    login_time = models.DateTimeField(auto_now_add=True, db_index=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    
    # Login Details
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    device_type = models.CharField(max_length=50, blank=True)
    browser = models.CharField(max_length=100, blank=True)
    
    # Session Info
    session_key = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Status
    login_successful = models.BooleanField(default=True)
    failure_reason = models.CharField(max_length=255, blank=True)
    
    class Meta:
        ordering = ['-login_time']
        indexes = [
            models.Index(fields=['user', '-login_time']),
            models.Index(fields=['login_time']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.login_time.strftime('%Y-%m-%d %H:%M')}"



