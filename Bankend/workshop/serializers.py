from rest_framework import serializers
from .models import ServiceDelay, WorkshopIncident

class ServiceDelaySerializer(serializers.ModelSerializer):
    job_card_number = serializers.CharField(source='job_card.job_card_number', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.full_name', read_only=True)
    
    class Meta:
        model = ServiceDelay
        fields = '__all__'

class WorkshopIncidentSerializer(serializers.ModelSerializer):
    job_card_number = serializers.CharField(source='job_card.job_card_number', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.full_name', read_only=True)
    witness_names = serializers.SerializerMethodField()
    
    class Meta:
        model = WorkshopIncident
        fields = '__all__'
        
    def get_witness_names(self, obj):
        return [w.full_name for w in obj.witnesses.all()]
