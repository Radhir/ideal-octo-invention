import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import SubscriptionPlan, CustomerSubscription
from customers.models import Customer

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    def post(self, request):
        plan_id = request.data.get('plan_id')
        customer_id = request.data.get('customer_id')

        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
            customer = Customer.objects.get(id=customer_id)

            # Create or retrieve Stripe customer
            if customer.stripe_customer_id:
                stripe_customer_id = customer.stripe_customer_id
            else:
                stripe_customer = stripe.Customer.create(
                    email=customer.email,
                    name=customer.name,
                    metadata={'customer_id': customer.id}
                )
                customer.stripe_customer_id = stripe_customer.id
                customer.save()
                stripe_customer_id = stripe_customer.id

            # Create checkout session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                customer=stripe_customer_id,
                line_items=[{
                    'price': plan.stripe_price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=f"{settings.FRONTEND_URL}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.FRONTEND_URL}/subscription/cancel",
                metadata={
                    'plan_id': plan_id,
                    'customer_id': customer_id,
                }
            )

            return Response({'sessionId': checkout_session.id, 'url': checkout_session.url})

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import viewsets
from .serializers import SubscriptionPlanSerializer, CustomerSubscriptionSerializer

class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer

class CustomerSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = CustomerSubscription.objects.all()
    serializer_class = CustomerSubscriptionSerializer
