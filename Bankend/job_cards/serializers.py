from rest_framework import serializers
from .models import JobCard, JobCardPhoto, JobCardTask, Service, ServiceCategory

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
            
            # Update name if existing customer but new name provided (optional, or keep original)
            # For now, we respect the Job Card Entry as the source of truth for this specific job,
            # but we link to the profile.
            
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
    class Meta:
        model = Service
        fields = '__all__'

class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    class Meta:
        model = ServiceCategory
        fields = '__all__'
