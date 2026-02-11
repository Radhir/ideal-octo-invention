from celery import shared_task
from django.utils import timezone
from .models import NotificationLog
from core.twilio_utils import send_sms, send_whatsapp
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import F
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_whatsapp_message(log_id):
    """Worker task to send WhatsApp message and update log."""
    try:
        log = NotificationLog.objects.get(id=log_id)
        sid = send_whatsapp(log.recipient, log.message)
        if sid:
            log.status = 'SENT'
        else:
            log.status = 'FAILED'
        log.save()
    except Exception as e:
        logger.error(f"WhatsApp task failed for log {log_id}: {e}")

@shared_task
def send_sms_message(log_id):
    """Worker task to send SMS message and update log."""
    try:
        log = NotificationLog.objects.get(id=log_id)
        sid = send_sms(log.recipient, log.message)
        if sid:
            log.status = 'SENT'
        else:
            log.status = 'FAILED'
        log.save()
    except Exception as e:
        logger.error(f"SMS task failed for log {log_id}: {e}")

@shared_task
def check_low_stock():
    """Daily task to scan for items below safety level."""
    from stock.models import StockItem
    low_stock_items = StockItem.objects.filter(current_stock__lte=F('safety_level'))
    if low_stock_items.exists():
        subject = f"Low Stock Alert - {timezone.now().date()}"
        message = "The following items are below their safety level:\n\n"
        for item in low_stock_items:
            message += f"- {item.name}: Current {item.current_stock}, Safety {item.safety_level}\n"
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.EMAIL_HOST_USER],
            fail_silently=False,
        )
    return f"Checked stock for {low_stock_items.count()} low items."
