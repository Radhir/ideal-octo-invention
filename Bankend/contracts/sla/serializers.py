from rest_framework import serializers
from .models import ServiceLevelAgreement, SLAMetric, SLAViolation, SLAReport, SLARenewal, CreditNote

class SLASerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    days_until_expiry = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = ServiceLevelAgreement
        fields = '__all__'

class SLAMetricSerializer(serializers.ModelSerializer):
    response_time_compliance = serializers.FloatField(read_only=True)
    completion_time_compliance = serializers.FloatField(read_only=True)
    
    class Meta:
        model = SLAMetric
        fields = '__all__'

class SLAViolationSerializer(serializers.ModelSerializer):
    job_card_number = serializers.CharField(source='job_card.job_card_number', read_only=True)
    
    class Meta:
        model = SLAViolation
        fields = '__all__'

class SLAReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SLAReport
        fields = '__all__'

class CreditNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditNote
        fields = '__all__'
