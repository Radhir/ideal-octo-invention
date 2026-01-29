from rest_framework import serializers
from .models import Lead

class LeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.user.get_full_name')
    class Meta:
        model = Lead
        fields = '__all__'
