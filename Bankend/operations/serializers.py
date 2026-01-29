from rest_framework import serializers
from .models import Operation

class OperationSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.user.get_full_name')
    jc_number = serializers.ReadOnlyField(source='job_card.job_card_number')
    class Meta:
        model = Operation
        fields = '__all__'
