from rest_framework import serializers
from .models import ServiceDelay, WorkshopIncident, Booth, PaintMix

class ServiceDelaySerializer(serializers.ModelSerializer):
    job_card_number = serializers.CharField(source='job_card.job_card_number', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.full_name', read_only=True)
    
    class Meta:
        model = ServiceDelay
        fields = '__all__'

class WorkshopIncidentSerializer(serializers.ModelSerializer):
    job_card_number = serializers.CharField(source='job_card.job_card_number', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.full_name', read_only=True)
    
    class Meta:
        model = WorkshopIncident
        fields = '__all__'

class BoothSerializer(serializers.ModelSerializer):
    job_card_number = serializers.CharField(source='current_job.job_card_number', read_only=True)
    vehicle_name = serializers.CharField(source='current_job.vehicle_node.name', read_only=True)
    paint_stage = serializers.CharField(source='current_job.paint_stage', read_only=True)

    class Meta:
        model = Booth
        fields = '__all__'

class PaintMixSerializer(serializers.ModelSerializer):
    job_card_number = serializers.CharField(source='job_card.job_card_number', read_only=True)
    mixed_by_name = serializers.CharField(source='mixed_by.full_name', read_only=True)

    class Meta:
        model = PaintMix
        fields = '__all__'
