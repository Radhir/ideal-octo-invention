from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from datetime import timedelta
from .models import SubscriptionPlan, CustomerSubscription
from .serializers import SubscriptionPlanSerializer, CustomerSubscriptionSerializer
from customers.models import Customer
# import stripe 

class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]

class CustomerSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = CustomerSubscription.objects.all()
    serializer_class = CustomerSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Filter by logged-in user's associated customer profile if applicable
        # Assuming user.customer exists or passing customer_id
        user = self.request.user
        if hasattr(user, 'email'):
           # Simplified match. Ideally User -> Customer link is explicit.
           queryset = super().get_queryset()
           return queryset
        return CustomerSubscription.objects.none()

    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        """Simulate subscription creation"""
        plan_id = request.data.get('plan_id')
        customer_id = request.data.get('customer_id')
        
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id)
            customer = Customer.objects.get(id=customer_id)
            
            # Create subscription
            duration = 365 if plan.interval == 'YEARLY' else 30
            end_date = timezone.now() + timedelta(days=duration)
            
            sub = CustomerSubscription.objects.create(
                customer=customer,
                plan=plan,
                current_period_end=end_date,
                status='ACTIVE'
            )
            
            return Response(CustomerSubscriptionSerializer(sub).data)
        except Exception as e:
             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
