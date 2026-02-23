from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JobCard
from notifications.models import NotificationLog
from notifications.tasks import send_whatsapp_message, send_sms_message
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=JobCard)
def notify_job_completion(sender, instance, created, **kwargs):
    """
    Triggers a notification to the customer when a job is marked as READY or CLOSED.
    """
    if not created:
        # Check if status has changed to a 'completion' state
        # Note: In a production environment, you might want to track 'previous_status' 
        # using django-simple-history or a custom field to avoid double-sending.
        
        if instance.status in ['READY', 'CLOSED']:
            customer_name = instance.customer_name
            phone = instance.phone
            job_number = instance.job_card_number
            
            message = ""
            if instance.status == 'READY':
                message = f"Hi {customer_name}, your vehicle (Job: {job_number}) is now READY for collection at Elite Shine. See you soon!"
            else:
                message = f"Hi {customer_name}, your vehicle (Job: {job_number}) has been DELIVERED. Thank you for choosing Elite Shine!"

            if phone:
                # 1. Create Notification Log for WhatsApp
                whatsapp_log = NotificationLog.objects.create(
                    recipient=phone,
                    notification_type='WHATSAPP',
                    message=message,
                    content_object=instance
                )
                # 2. Queue the task
                send_whatsapp_message.delay(whatsapp_log.id)
                
                logger.info(f"Queued WhatsApp notification for JobCard {job_number} (Status: {instance.status})")
            else:
                logger.warning(f"No phone number found for JobCard {job_number}, skipping notification.")
