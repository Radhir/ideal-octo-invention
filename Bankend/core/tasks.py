from celery import shared_task
from django.contrib.contenttypes.models import ContentType
from .models import AuditLog
import logging

logger = logging.getLogger(__name__)

@shared_task
def log_audit_event(user_id, content_type_id, object_id, object_repr, action, field_changes=None, ip_address=None, user_agent=None, endpoint=None, method=None):
    """
    Background task to create an AuditLog entry.
    """
    try:
        from django.contrib.auth.models import User
        user = User.objects.get(id=user_id) if user_id else None
        content_type = ContentType.objects.get(id=content_type_id)
        
        AuditLog.objects.create(
            user=user,
            content_type=content_type,
            object_id=object_id,
            object_repr=object_repr,
            action=action,
            field_changes=field_changes,
            ip_address=ip_address,
            user_agent=user_agent,
            endpoint=endpoint,
            method=method
        )
    except Exception as e:
        logger.error(f"Failed to log background audit event: {e}")
