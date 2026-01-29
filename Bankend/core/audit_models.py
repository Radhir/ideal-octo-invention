"""
Comprehensive Audit Trail System for all database changes
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import json


class AuditLog(models.Model):
    """Track all changes to database records"""
    
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('VIEW', 'View'),
    ]
    
    # When & Who
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    # What & Where
    table_name = models.CharField(max_length=100, db_index=True)
    record_id = models.IntegerField(db_index=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES, db_index=True)
    
    # Changes Detail
    field_changes = models.JSONField(null=True, blank=True, help_text="Before/after values")
    
    # Request Info
    endpoint = models.CharField(max_length=500, blank=True)
    method = models.CharField(max_length=10, blank=True)  # GET, POST, PUT, DELETE
    user_agent = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['table_name', 'record_id']),
            models.Index(fields=['action', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.action} {self.table_name}:{self.record_id} at {self.timestamp}"


class LoginHistory(models.Model):
    """Track user login/logout activity"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    login_time = models.DateTimeField(auto_now_add=True, db_index=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    
    # Login Details
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    device_type = models.CharField(max_length=50, blank=True)  # Desktop, Mobile, Tablet
    browser = models.CharField(max_length=100, blank=True)
    
    # Session Info
    session_key = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Location (optional, if using GeoIP)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    
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
    
    @property
    def session_duration(self):
        """Calculate session duration"""
        if self.logout_time:
            return (self.logout_time - self.login_time).total_seconds() / 60  # minutes
        return None


class DataAccessLog(models.Model):
    """Track sensitive data access (invoices, customer info, etc.)"""
    
    ACCESS_TYPE_CHOICES = [
        ('VIEW', 'View'),
        ('EXPORT', 'Export'),
        ('PRINT', 'Print'),
        ('EMAIL', 'Email'),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    # What was accessed
    data_type = models.CharField(max_length=100)  # Invoice, Customer, JobCard, etc.
    record_id = models.IntegerField()
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPE_CHOICES)
    
    # Context
    reason = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['data_type', 'record_id']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.access_type} {self.data_type}:{self.record_id}"


class SystemChangeLog(models.Model):
    """Track system configuration changes"""
    
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    change_category = models.CharField(max_length=100)  # Settings, Permissions, Configuration
    change_description = models.TextField()
    previous_value = models.TextField(blank=True)
    new_value = models.TextField(blank=True)
    
    # Approval (for critical changes)
    requires_approval = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_changes')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.change_category} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
