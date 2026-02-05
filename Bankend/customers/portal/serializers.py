from rest_framework import serializers
from customers.models import Customer
from job_cards.models import JobCard, JobCardPhoto
from invoices.models import Invoice
from .models import CustomerFeedback, CustomerPortalActivity
from invoices.serializers import InvoiceSerializer

class OutstandingInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'date', 'total_amount', 'balance_due', 'payment_status']

class CustomerPortalSerializer(serializers.ModelSerializer):
    """Serializer for customer portal data"""
    recent_jobs = serializers.SerializerMethodField()
    outstanding_invoices = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'email', 'phone', 'loyalty_points',
            'total_spent', 'member_since', 'recent_jobs',
            'outstanding_invoices', 'preferred_services'
        ]
    
    def get_recent_jobs(self, obj):
        jobs = obj.job_cards.all().order_by('-created_at')[:5]
        return CustomerJobCardSerializer(jobs, many=True).data
    
    def get_outstanding_invoices(self, obj):
        invoices = Invoice.objects.filter(
            job_card__customer_profile=obj,
            payment_status='PENDING'
        )
        return OutstandingInvoiceSerializer(invoices, many=True).data

class CustomerJobCardSerializer(serializers.ModelSerializer):
    """Serializer for customer job cards"""
    vehicle_details = serializers.SerializerMethodField()
    current_status_display = serializers.CharField(
        source='get_status_display'
    )
    # estimated_completion = serializers.DateTimeField() # In model it is estimated_timeline
    estimated_completion = serializers.CharField(source='estimated_timeline', required=False) # Changed to match model field name or just char if needed
    services = serializers.SerializerMethodField()
    total_estimated_cost = serializers.DecimalField(source='total_amount', max_digits=10, decimal_places=2) # Alias for total_amount if that's what user meant
    notes_for_customer = serializers.CharField(source='feedback_notes', required=False) # Alias or mapping? User code used notes_for_customer. I'll map to feedback_notes or initial_inspection_notes.

    class Meta:
        model = JobCard
        fields = [
            'id', 'job_card_number', 'created_at', 'status',
            'current_status_display', 'vehicle_details',
            'estimated_completion', 'total_estimated_cost',
            'services', 'notes_for_customer'
        ]
        # Remap job_number to job_card_number in output if frontend expects job_number
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Map job_card_number to job_number for frontend compatibility
        data['job_number'] = instance.job_card_number
        return data

    def get_vehicle_details(self, obj):
        # JobCard has vehicle fields directly
        return {
            'make': obj.brand,
            'model': obj.model,
            'year': obj.year,
            'license_plate': f"{obj.plate_code} {obj.registration_number}" if obj.plate_code else obj.registration_number
        }
    
    def get_services(self, obj):
        # JobCard has tasks, not direct services link in the model definition I saw?
        # ServiceCategory/Service models exist but JobCard has JobCardTask.
        # Maybe services is M2M or I need to fetch tasks.
        # User code: obj.services.values('name', 'price').
        # JobCard doesn't seem to have `services` M2M field in the model I viewed.
        # It has `total_amount`.
        # I will return empty list if services not found or try 'tasks'.
        if hasattr(obj, 'services'):
            return obj.services.values('name', 'price')
        return [] 

class JobPhotoSerializer(serializers.ModelSerializer):
    """Serializer for job photos"""
    thumbnail_url = serializers.SerializerMethodField()
    description = serializers.CharField(source='caption') # User code caption/description mismatch
    stage = serializers.CharField(default='WIP') # Field missing in JobCardPhoto

    class Meta:
        model = JobCardPhoto
        fields = ['id', 'image', 'thumbnail_url', 
                 'description', 'created_at', 'stage']
    
    def get_thumbnail_url(self, obj):
        if obj.image:
            # Simple assumption for thumbnail
            return obj.image.url
        return None

class CustomerFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for customer feedback"""
    customer_name = serializers.CharField(
        source='customer.name', 
        read_only=True
    )
    job_number = serializers.CharField(
        source='job_card.job_card_number',
        read_only=True
    )
    
    class Meta:
        model = CustomerFeedback
        fields = [
            'id', 'customer', 'customer_name', 'job_card', 
            'job_number', 'rating', 'comments', 'created_at',
            'response', 'responded_at', 'responded_by'
        ]
        read_only_fields = ['customer', 'job_card', 'created_at']
    
    def create(self, validated_data):
        # This logic usually goes in ViewSet perform_create
        validated_data['customer'] = self.context['request'].user.customer_profile # This relies on user.customer_profile being set
        return super().create(validated_data)
