import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import SubscriptionPlan, CustomerSubscription
from customers.models import Customer
import json

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_completed(session)

    elif event['type'] == 'invoice.payment_succeeded':
        invoice = event['data']['object']
        handle_payment_succeeded(invoice)

    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        handle_subscription_deleted(subscription)

    return HttpResponse(status=200)

def handle_checkout_completed(session):
    """Create CustomerSubscription after successful checkout."""
    # Metadata keys might be integers or strings, ensure consistency
    plan_id = session['metadata'].get('plan_id')
    customer_id = session['metadata'].get('customer_id')
    stripe_subscription_id = session['subscription']

    if not plan_id or not customer_id:
        return

    try:
        plan = SubscriptionPlan.objects.get(id=plan_id)
        customer = Customer.objects.get(id=customer_id)

        # Get subscription details from Stripe
        stripe_sub = stripe.Subscription.retrieve(stripe_subscription_id)
        current_period_end = timezone.datetime.fromtimestamp(stripe_sub.current_period_end, tz=timezone.utc)

        CustomerSubscription.objects.create(
            customer=customer,
            plan=plan,
            stripe_subscription_id=stripe_subscription_id,
            stripe_customer_id=session['customer'],
            status='ACTIVE',
            current_period_end=current_period_end,
            cancel_at_period_end=False
        )
    except Exception as e:
        print(f"Error handling checkout completion: {e}")

def handle_payment_succeeded(invoice):
    """Update subscription period end."""
    stripe_subscription_id = invoice['subscription']
    try:
        sub = CustomerSubscription.objects.get(stripe_subscription_id=stripe_subscription_id)
        # Extend period
        stripe_sub = stripe.Subscription.retrieve(stripe_subscription_id)
        sub.current_period_end = timezone.datetime.fromtimestamp(stripe_sub.current_period_end, tz=timezone.utc)
        sub.save()
    except CustomerSubscription.DoesNotExist:
        pass

def handle_subscription_deleted(subscription):
    """Mark subscription as canceled."""
    stripe_subscription_id = subscription['id']
    CustomerSubscription.objects.filter(
        stripe_subscription_id=stripe_subscription_id
    ).update(status='CANCELED', cancel_at_period_end=False)
