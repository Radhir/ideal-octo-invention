from rest_framework import serializers
from .models import PickAndDrop

class PickAndDropSerializer(serializers.ModelSerializer):
    driver_name = serializers.ReadOnlyField(source='driver.user.get_full_name')
    jc_number = serializers.ReadOnlyField(source='job_card.job_card_number')
    class Meta:
        model = PickAndDrop
        fields = '__all__'
