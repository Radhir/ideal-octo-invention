from django.conf import settings
from notifications.models import NotificationLog


def _get_portal_url(job_card):
    """Build portal URL from settings."""
    base = settings.FRONTEND_URL
    return f"{base}/portal/{job_card.portal_token}"


def trigger_job_notification(job_card):
    """
    Triggers WhatsApp + SMS notifications for the customer on each status change.
    """
    portal_url = _get_portal_url(job_card)
    name = job_card.customer_name
    vehicle = f"{job_card.brand} {job_card.model}"

    status_messages = {
        'RECEPTION': (
            f"Dear {name}, your vehicle {vehicle} has been received at Elite Shine. "
            f"Track your job live: {portal_url}"
        ),
        'ESTIMATION': (
            f"Dear {name}, the estimate for your {vehicle} is ready for review. "
            f"View details: {portal_url}"
        ),
        'WORK_ASSIGNMENT': (
            f"Dear {name}, a technician has been assigned to your {vehicle}. "
            f"Work will begin shortly."
        ),
        'WIP': (
            f"Good news {name}! Work has officially started on your {vehicle}. "
            f"Follow progress: {portal_url}"
        ),
        'QC': (
            f"Dear {name}, work on your {vehicle} is complete. "
            f"We are now performing final quality checks."
        ),
        'INVOICING': (
            f"Dear {name}, your invoice for {vehicle} is being prepared. "
            f"You will receive billing details shortly."
        ),
        'DELIVERY': (
            f"Great news {name}! Your {vehicle} is ready for collection. "
            f"Please visit us at your convenience. Track: {portal_url}"
        ),
        'CLOSED': (
            f"Thank you for choosing Elite Shine, {name}. "
            f"Your job card for {vehicle} has been closed. We appreciate your business!"
        ),
    }

    from notifications.tasks import send_whatsapp_message, send_sms_message

    msg = status_messages.get(job_card.status)
    if not msg:
        return

    # Create logs and trigger tasks
    # WhatsApp
    wa_log = NotificationLog.objects.create(
        recipient=job_card.phone,
        notification_type='WHATSAPP',
        subject=f"Job Update: {job_card.get_status_display()}",
        message=msg,
        content_object=job_card,
        status='QUEUED'
    )
    send_whatsapp_message.delay(wa_log.id)

    # SMS
    sms_log = NotificationLog.objects.create(
        recipient=job_card.phone,
        notification_type='SMS',
        subject=f"Job Update: {job_card.get_status_display()}",
        message=msg,
        content_object=job_card,
        status='QUEUED'
    )
    send_sms_message.delay(sms_log.id)
