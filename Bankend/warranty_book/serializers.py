from rest_framework import serializers
from .models import WarrantyRegistration

class WarrantyRegistrationSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    duration_display = serializers.CharField(source='get_duration_years_display', read_only=True)
    
    class Meta:
        model = WarrantyRegistration
        fields = [
            'id', 'warranty_number', 'portal_token', 'category', 'category_display', 
            'status', 'status_display', 'customer_name', 'customer_phone', 'customer_email',
            'vehicle_brand', 'vehicle_model', 'plate_number', 'vin',
            'installation_date', 'duration_years', 'duration_display', 'expiry_date',
            'specifications', 'qr_code', 'signature_data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['warranty_number', 'portal_token', 'expiry_date', 'qr_code', 'created_at']

    def validate(self, data):
        # Additional validation logic if needed
        return data
