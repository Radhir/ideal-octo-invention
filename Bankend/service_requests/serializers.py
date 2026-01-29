from rest_framework import serializers
from .models import RequestForm

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestForm
        fields = '__all__'
