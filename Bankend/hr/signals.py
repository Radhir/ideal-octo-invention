from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from guardian.shortcuts import assign_perm
from .models import Employee

@receiver(post_save, sender=Employee)
def assign_employee_permissions(sender, instance, created, **kwargs):
    """Grant view_financials permission to the employee themselves."""
    if created:
        content_type = ContentType.objects.get_for_model(Employee)
        # Perm is defined in Employee.Meta
        assign_perm('view_financials', instance.user, obj=instance)
