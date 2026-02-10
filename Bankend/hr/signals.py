from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Employee, Notification

@receiver(post_save, sender=Employee)
def notify_on_employee_creation(sender, instance, created, **kwargs):
    if created:
        # Find all superusers (like Ruchika) to notify
        superusers = User.objects.filter(is_superuser=True)
        
        # Determine who added the employee (simple version: everyone else gets a notification)
        # Note: In a production app, we'd track the 'creator' field, but for now we notify all admins.
        for admin in superusers:
            Notification.objects.create(
                recipient=admin,
                title="New Employee Added",
                message=f"Operative {instance.full_name} has been registered in the system by {instance.user.username if instance.user else 'unknown'}."
            )
