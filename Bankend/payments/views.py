import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from invoices.models import Invoice
from .models import PaymentTransaction

# Initialize Stripe
stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', 'sk_test_placeholder')

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.AllowAny] # Or IsAuthenticated depending on flow

    def post(self, request):
        try:
            invoice_id = request.data.get('invoice_id')
            invoice = get_object_or_404(Invoice, id=invoice_id)
            
            # Create a PaymentIntent with the order amount and currency
            payment_intent = stripe.PaymentIntent.create(
                amount=int(invoice.balance_due * 100), # Amount in cents/fils
                currency='aed',
                automatic_payment_methods={
                    'enabled': True,
                },
                metadata={
                    'invoice_id': invoice.id,
                    'invoice_number': invoice.invoice_number,
                    'customer_email': request.user.email if request.user.is_authenticated else 'guest@example.com' # simplistic
                }
            )

            # Record pending transaction
            PaymentTransaction.objects.create(
                invoice=invoice,
                stripe_payment_intent_id=payment_intent['id'],
                amount=invoice.balance_due,
                status='PENDING',
                customer_email=request.user.email if request.user.is_authenticated else ''
            )

            return Response({
                'clientSecret': payment_intent['client_secret']
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', '')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            self.handle_payment_success(payment_intent)
        
        return Response({'status': 'success'})

    def handle_payment_success(self, payment_intent):
        try:
            transaction = PaymentTransaction.objects.get(stripe_payment_intent_id=payment_intent['id'])
            transaction.status = 'COMPLETED'
            transaction.save()
            
            # Update Invoice
            invoice = transaction.invoice
            invoice.payment_status = 'PAID'
            # invoice.amount_paid += transaction.amount # If we tracked partials, but simplified here
            invoice.save()
            
        except PaymentTransaction.DoesNotExist:
            print(f"Transaction not found for intent {payment_intent['id']}")
