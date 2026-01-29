from rest_framework import serializers
from .models import WorkTeam, ScheduleAssignment, AdvisorSheet, DailyClosing, EmployeeDailyReport
from job_cards.serializers import JobCardSerializer
from bookings.serializers import BookingSerializer

class WorkTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkTeam
        fields = '__all__'

class ScheduleAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleAssignment
        fields = '__all__'

class AdvisorSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvisorSheet
        fields = '__all__'

class DailyClosingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyClosing
        fields = '__all__'

class EmployeeDailyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDailyReport
        fields = '__all__'
