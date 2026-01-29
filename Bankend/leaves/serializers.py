from rest_framework import serializers
from .models import LeaveApplication

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveApplication
        fields = '__all__'
