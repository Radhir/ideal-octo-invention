from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    advisor_name = serializers.ReadOnlyField(source='advisor.user.get_full_name')
    service_category_name = serializers.ReadOnlyField(source='service_category.name')
    class Meta:
        model = Booking
        fields = '__all__'

    def create(self, validated_data):
        # Auto-link or create Customer Profile based on Phone
        phone = validated_data.get('phone')
        customer_name = validated_data.get('customer_name')
        
        if phone:
            from customers.models import Customer
            customer, created = Customer.objects.get_or_create(
                phone=phone,
                defaults={'name': customer_name}
            )
            validated_data['customer_profile'] = customer
            
        return super().create(validated_data)
