from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    
    class Meta:
        model = Attendance
        fields = [
            'id', 'employee', 'employee_name', 'employee_id',
            'date', 'check_in_time', 'check_out_time',
            'status', 'is_late', 'total_hours', 'overtime_hours',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'date', 'total_hours', 'overtime_hours', 'is_late', 'created_at', 'updated_at']
    
    def get_employee_name(self, obj):
        if obj.employee and obj.employee.user:
            return obj.employee.user.get_full_name() or obj.employee.user.username
        return 'Unknown'
