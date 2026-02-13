from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from crum import get_current_request
from .models import AuditLog, NoAudit
import sys

# Disable auditing during migrations to prevent transaction errors
IS_MIGRATING = 'migrate' in sys.argv or 'makemigrations' in sys.argv
def get_request_metadata():
    request = get_current_request()
    if request:
        return {
            'user': request.user if request.user.is_authenticated else None,
            'ip': getattr(request, 'audit_ip', None),
            'ua': getattr(request, 'audit_user_agent', ''),
            'endpoint': getattr(request, 'audit_endpoint', ''),
            'method': getattr(request, 'audit_method', ''),
        }
    return {}

def get_field_changes(instance, created):
    if created:
        return None
    try:
        old_instance = instance.__class__.objects.get(pk=instance.pk)
        changes = {}
        for field in instance._meta.fields:
            name = field.name
            old_val = getattr(old_instance, name)
            new_val = getattr(instance, name)
            if old_val != new_val:
                changes[name] = {
                    'before': str(old_val),
                    'after': str(new_val)
                }
        return changes or None
    except:
        return None

@receiver(post_save)
def audit_post_save(sender, instance, created, **kwargs):
    if IS_MIGRATING:
        return
    if sender == AuditLog or issubclass(sender, NoAudit):
        return
    if sender._meta.app_label in ('admin', 'contenttypes', 'sessions', 'auth'):
        return

    meta = get_request_metadata()
    action = 'CREATE' if created else 'UPDATE'
    changes = None if created else get_field_changes(instance, created)

    try:
        AuditLog.objects.create(
            user=meta.get('user'),
            ip_address=meta.get('ip'),
            user_agent=meta.get('ua'),
            content_type=ContentType.objects.get_for_model(instance),
            object_id=str(instance.pk),
            object_repr=str(instance)[:255],
            action=action,
            field_changes=changes,
            endpoint=meta.get('endpoint', ''),
            method=meta.get('method', ''),
        )
    except Exception as e:
        print(f"Audit failed: {e}")

@receiver(post_delete)
def audit_post_delete(sender, instance, **kwargs):
    if IS_MIGRATING:
        return
    if sender == AuditLog or issubclass(sender, NoAudit):
        return
    if sender._meta.app_label in ('admin', 'contenttypes', 'sessions', 'auth'):
        return

    meta = get_request_metadata()
    try:
        AuditLog.objects.create(
            user=meta.get('user'),
            ip_address=meta.get('ip'),
            user_agent=meta.get('ua'),
            content_type=ContentType.objects.get_for_model(instance),
            object_id=str(instance.pk),
            object_repr=str(instance)[:255],
            action='DELETE',
            endpoint=meta.get('endpoint', ''),
            method=meta.get('method', ''),
        )
    except Exception as e:
        print(f"Audit delete failed: {e}")
