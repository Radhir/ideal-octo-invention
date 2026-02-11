from rest_framework import serializers
from .models import Lead, LeadPhoto

class LeadPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadPhoto
        fields = ['id', 'image', 'caption', 'created_at']

class LeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.user.get_full_name')
    photos = LeadPhotoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lead
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
