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
