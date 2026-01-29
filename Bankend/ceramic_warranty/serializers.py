from rest_framework import serializers
from .models import CeramicWarrantyRegistration

class CeramicWarrantySerializer(serializers.ModelSerializer):
    class Meta:
        model = CeramicWarrantyRegistration
        fields = '__all__'
