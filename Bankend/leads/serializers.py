from rest_framework import serializers
from .models import Lead, LeadPhoto
from masters.serializers import VehicleSerializer

class LeadPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadPhoto
        fields = ['id', 'image', 'caption', 'created_at']

class LeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.user.get_full_name')
    photos = LeadPhotoSerializer(many=True, read_only=True)
    vehicle_details = VehicleSerializer(source='vehicle_node', read_only=True)
    
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
            
        # Extract vehicle info if available in request (Lead doesn't have these fields in model)
        # We assume the frontend sends vin, brand, model in the data
        request = self.context.get('request')
        if request and 'vin' in request.data:
            from masters.models import Vehicle
            vin = request.data.get('vin')
            if vin:
                vehicle, created = Vehicle.objects.get_or_create(
                    vin=vin,
                    defaults={
                        'registration_number': request.data.get('registration_number', ''),
                        'brand': request.data.get('brand', ''),
                        'model': request.data.get('model', ''),
                        'year': request.data.get('year', 2024),
                        'color': request.data.get('color', ''),
                        'customer': validated_data.get('customer_profile')
                    }
                )
                validated_data['vehicle_node'] = vehicle

        return super().create(validated_data)
