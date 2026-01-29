from rest_framework import serializers
from .models import (
    Project, ProjectMilestone, ProjectTask, ProjectResource,
    ProjectBudget, ProjectForecast
)
from hr.serializers import EmployeeSerializer, DepartmentSerializer

class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = '__all__'

class ProjectTaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)
    
    class Meta:
        model = ProjectTask
        fields = '__all__'

class ProjectResourceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    
    class Meta:
        model = ProjectResource
        fields = '__all__'

class ProjectBudgetSerializer(serializers.ModelSerializer):
    variance = serializers.ReadOnlyField()
    
    class Meta:
        model = ProjectBudget
        fields = '__all__'

class ProjectForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectForecast
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    manager_name = serializers.CharField(source='manager.full_name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    budget_variance = serializers.ReadOnlyField()
    is_over_budget = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)
    tasks = ProjectTaskSerializer(many=True, read_only=True)
    resources = ProjectResourceSerializer(many=True, read_only=True)
    budget_items = ProjectBudgetSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'

class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    manager_name = serializers.CharField(source='manager.full_name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    budget_variance = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'status', 'priority',
            'start_date', 'end_date', 'budget', 'actual_cost', 'progress',
            'risk_score', 'manager_name', 'department_name', 'budget_variance',
            'created_at'
        ]
