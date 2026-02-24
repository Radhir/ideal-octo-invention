from rest_framework import serializers
from .models import Vehicle, VehicleBrand, VehicleModel, VehicleColor, InsuranceCompany, VehicleType, Service
from customers.models import Customer

class VehicleBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleBrand
        fields = '__all__'

class VehicleModelSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    class Meta:
        model = VehicleModel
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(write_only=True, required=False)
    customer_phone = serializers.CharField(write_only=True, required=False)
    
    customer_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'
        extra_kwargs = {
            'customer': {'read_only': True}
        }

    def get_customer_details(self, obj):
        if obj.customer:
            return {
                'name': obj.customer.name,
                'phone': obj.customer.phone
            }
        return None

    def create(self, validated_data):
        customer_name = validated_data.pop('customer_name', None)
        customer_phone = validated_data.pop('customer_phone', None)
        
        vehicle = Vehicle.objects.create(**validated_data)
        
        if customer_name:
            # Simple get or create logic
            customer, created = Customer.objects.get_or_create(
                name=customer_name,
                defaults={'phone': customer_phone or ''}
            )
            vehicle.customer = customer
            vehicle.save()
            
        return vehicle

class InsuranceCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceCompany
        fields = '__all__'

class VehicleColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleColor
        fields = '__all__'
class VehicleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleType
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    class Meta:
        model = Service
        fields = '__all__'
