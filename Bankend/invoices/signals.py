from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Invoice
from notifications.models import NotificationLog
from notifications.tasks import send_whatsapp_message, send_sms_message
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Invoice)
def notify_invoice_generation(sender, instance, created, **kwargs):
    """
    Triggers a notification to the customer when a new invoice is generated.
    """
    if created:
        customer_name = instance.customer_name
        invoice_number = instance.invoice_number
        amount = instance.grand_total
        balance = instance.balance_due
        
        # Try to get phone from job_card
        phone = None
        if instance.job_card:
            phone = instance.job_card.phone
        
        if phone:
            message = (
                f"Hi {customer_name}, your invoice {invoice_number} for AED {amount} "
                f"ha been generated. Balance due: AED {balance}. "
                f"View your portal at https://srv1306978.hstgr.cloud/portal for details!"
            )
            
            # 1. Create Notification Log
            whatsapp_log = NotificationLog.objects.create(
                recipient=phone,
                notification_type='WHATSAPP',
                message=message,
                content_object=instance
            )
            # 2. Queue the task
            send_whatsapp_message.delay(whatsapp_log.id)
            
            logger.info(f"Queued WhatsApp notification for Invoice {invoice_number}")
        else:
            logger.warning(f"No phone number linked to Invoice {invoice_number}, skipping notification.")
