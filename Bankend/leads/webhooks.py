import json
import logging
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Lead

logger = logging.getLogger(__name__)

# Mock Verify Token - in production, this should be in settings/env
VERIFY_TOKEN = "ELITE_SHINE_WEBHOOK_2026"

@csrf_exempt
def meta_webhook(request):
    """
    Unified webhook for Meta (Instagram, FB, WhatsApp).
    Handles verification (GET) and incoming messages (POST).
    """
    if request.method == 'GET':
        # Meta Webhook Verification
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')

        if mode == 'subscribe' and token == VERIFY_TOKEN:
            logger.info("WEBHOOK_VERIFIED")
            return HttpResponse(challenge)
        else:
            return HttpResponse("Verification failed", status=403)

    elif request.method == 'POST':
        # Meta Payload Processing
        try:
            data = json.loads(request.body.decode('utf-8'))
            logger.info(f"Incoming Webhook Payload: {json.dumps(data)}")

            # Check if it's a message event
            # Meta payloads are deeply nested: entry[] -> changes[] or messaging[]
            for entry in data.get('entry', []):
                # WhatsApp uses 'changes'
                for change in entry.get('changes', []):
                    if change.get('field') == 'messages':
                        value = change.get('value', {})
                        contacts = value.get('contacts', [])
                        messages = value.get('messages', [])
                        
                        if messages:
                            msg = messages[0]
                            contact = contacts[0] if contacts else {}
                            
                            sender_phone = contact.get('wa_id') or msg.get('from')
                            sender_name = contact.get('profile', {}).get('name') or "WA Customer"
                            message_text = msg.get('text', {}).get('body') or "No text content"

                            # Create Lead
                            Lead.objects.create(
                                customer_name=sender_name,
                                phone=f"+{sender_phone}",
                                source='WHATSAPP',
                                interested_service=message_text[:100],
                                notes=f"Automated Lead from WhatsApp Webhook.\nMessage: {message_text}",
                                status='NEW',
                                priority='MEDIUM'
                            )
                            logger.info(f"Lead created from WhatsApp: {sender_name}")

                # Instagram/FB use 'messaging'
                for messaging_event in entry.get('messaging', []):
                    if 'message' in messaging_event:
                        sender_id = messaging_event['sender']['id']
                        message_text = messaging_event['message'].get('text', 'Binary/Image Content')
                        
                        # Note: Instagram ID is not a phone number. We'd usually need a profile lookup
                        # but for now we store the ID as the contact.
                        Lead.objects.create(
                            customer_name=f"IG User {sender_id}",
                            phone=sender_id, # Placeholder
                            source='INSTAGRAM',
                            interested_service=message_text[:100],
                            notes=f"Automated Lead from Instagram Webhook.\nMessage: {message_text}",
                            status='NEW',
                            priority='HOT'
                        )
                        logger.info(f"Lead created from Instagram: {sender_id}")

            return JsonResponse({"status": "received"}, status=200)

        except Exception as e:
            logger.error(f"Webhook Processing Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)

    return HttpResponse("Method not allowed", status=405)
