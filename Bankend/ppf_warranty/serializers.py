from rest_framework import serializers
from .models import PPFWarrantyRegistration

class PPFWarrantySerializer(serializers.ModelSerializer):
    class Meta:
        model = PPFWarrantyRegistration
        fields = '__all__'
