from rest_framework import serializers
from .models import JobCard, JobCardPhoto, JobCardTask, Service, ServiceCategory, WarrantyClaim

class JobCardPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCardPhoto
        fields = '__all__'

class JobCardTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCardTask
        fields = '__all__'

class JobCardSerializer(serializers.ModelSerializer):
    photos = JobCardPhotoSerializer(many=True, read_only=True)
    tasks = JobCardTaskSerializer(many=True, read_only=True)
    checklists = serializers.SlugRelatedField(many=True, read_only=True, slug_field='checklist_number')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    invoice = serializers.SerializerMethodField()

    class Meta:
        model = JobCard
        fields = '__all__'
        read_only_fields = ('is_released',)

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
            
            # For now, we respect the Job Card Entry as the source of truth for this specific job,
            # but we link to the profile.

        # Auto-link or create Vehicle Node
        vin = validated_data.get('vin')
        if vin:
            from masters.models import Vehicle
            vehicle, created = Vehicle.objects.get_or_create(
                vin=vin,
                defaults={
                    'registration_number': validated_data.get('registration_number', ''),
                    'brand': validated_data.get('brand', ''),
                    'model': validated_data.get('model', ''),
                    'year': validated_data.get('year', 2024),
                    'color': validated_data.get('color', ''),
                    'customer': validated_data.get('customer_profile')
                }
            )
            validated_data['vehicle_node'] = vehicle
            
        return super().create(validated_data)

    def get_invoice(self, obj):
        if hasattr(obj, 'invoice'):
            return {
                'id': obj.invoice.id,
                'payment_status': obj.invoice.payment_status,
                'invoice_number': obj.invoice.invoice_number
            }
        return None

class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = Service
        fields = ('id', 'name', 'price', 'category', 'category_name')

class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    class Meta:
        model = ServiceCategory
        fields = '__all__'

class WarrantyClaimSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')
    job_card_number = serializers.ReadOnlyField(source='job_card.job_card_number')
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = WarrantyClaim
        fields = '__all__'
