from rest_framework import serializers
from .models import Risk, RiskMitigationAction, Incident

class RiskMitigationActionSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)
    
    class Meta:
        model = RiskMitigationAction
        fields = '__all__'

class IncidentSerializer(serializers.ModelSerializer):
    reported_by_name = serializers.CharField(source='reported_by.full_name', read_only=True)
    
    class Meta:
        model = Incident
        fields = '__all__'

class RiskSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    severity_score = serializers.ReadOnlyField()
    severity_level = serializers.ReadOnlyField()
    severity_color = serializers.ReadOnlyField()
    
    mitigation_actions = RiskMitigationActionSerializer(many=True, read_only=True)
    incidents = IncidentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Risk
        fields = '__all__'

class RiskListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    severity_score = serializers.ReadOnlyField()
    severity_level = serializers.ReadOnlyField()
    severity_color = serializers.ReadOnlyField()
    
    class Meta:
        model = Risk
        fields = [
            'id', 'title', 'description', 'impact', 'probability',
            'status', 'escalation_level', 'owner_name', 'department_name',
            'severity_score', 'severity_level', 'severity_color',
            'created_at', 'updated_at'
        ]
