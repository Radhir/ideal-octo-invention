from rest_framework import serializers
from .models import SubscriptionPlan, CustomerSubscription

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class CustomerSubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    plan_price = serializers.DecimalField(source='plan.price', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CustomerSubscription
        fields = '__all__'
