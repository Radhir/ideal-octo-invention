from twilio.rest import Client
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def get_twilio_client():
    return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

def send_sms(to, body):
    try:
        client = get_twilio_client()
        message = client.messages.create(
            from_=settings.TWILIO_SMS_NUMBER,
            to=to,
            body=body
        )
        return message.sid
    except Exception as e:
        logger.error(f"Failed to send SMS: {e}")
        return None

def send_whatsapp(to, body):
    try:
        client = get_twilio_client()
        # Ensure 'to' number is prefixed with 'whatsapp:'
        whatsapp_to = f"whatsapp:{to}" if not to.startswith('whatsapp:') else to
        message = client.messages.create(
            from_=settings.TWILIO_WHATSAPP_NUMBER,
            to=whatsapp_to,
            body=body
        )
        return message.sid
    except Exception as e:
        logger.error(f"Failed to send WhatsApp: {e}")
        return None
