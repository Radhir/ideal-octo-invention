from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Employee, HRRule, Payroll, Roster, HRAttendance, 
    Team, Mistake, Department, Company, Branch, ModulePermission,
    SalarySlip, EmployeeDocument, WarningLetter, Notification
)

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class ModulePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModulePermission
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source='head.user.get_full_name', read_only=True)
    class Meta:
        model = Department
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True, default='Unknown')
    username = serializers.CharField(source='user.username', read_only=True, default='anonymous')
    department = serializers.SlugRelatedField(slug_field='name', queryset=Department.objects.all(), allow_null=True, required=False)
    department_name = serializers.CharField(source='department.name', read_only=True)
    company = serializers.SlugRelatedField(slug_field='name', queryset=Company.objects.all(), allow_null=True, required=False)
    company_name = serializers.CharField(source='company.name', read_only=True)
    branch = serializers.SlugRelatedField(slug_field='name', queryset=Branch.objects.all(), allow_null=True, required=False)
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    module_permissions = ModulePermissionSerializer(many=True, read_only=True)
    
    # Explicitly add workEmail and fullName for User creation context
    workEmail = serializers.EmailField(write_only=True, required=False)
    fullName = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_id', 'username', 'full_name', 'full_name_passport', 'department', 'department_name',
            'company', 'company_name', 'branch', 'branch_name', 'pin_code', 'role', 
            'basic_salary', 'housing_allowance', 'transport_allowance', 'date_joined', 
            'is_active', 'bio', 'profile_image', 'accent_color', 'module_permissions',
            'nationality', 'gender', 'dob', 'marital_status', 'salary_type',
            'passport_no', 'passport_expiry', 'visa_uid', 'visa_expiry', 'skills',
            'uae_address', 'uae_mobile', 'home_country', 'home_address', 'home_mobile',
            'uae_emer_name', 'uae_emer_phone', 'uae_emer_relation',
            'home_emer_name', 'home_emer_phone', 'home_emer_relation',
            'workEmail', 'fullName'
        ]

    def create(self, validated_data):
        # Extract fields needed for User creation and REMOVE from validated_data
        email = validated_data.pop('workEmail', '').lower()
        full_name_input = validated_data.pop('fullName', '')
        employee_id = validated_data.get('employee_id')
        
        # Split full name
        names = full_name_input.split(' ', 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ''

        # Create or Get User
        # Username defaults to email, or employee_id if email is missing
        username = email if email else employee_id
        
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'is_active': True
            }
        )
        
        if created:
            # Set default password: Elite@{employee_id}
            user.set_password(f"Elite@{employee_id}")
            user.save()
            
        # Link User to Employee
        validated_data['user'] = user
        
        # Remove fields that are not part of Employee model if they were passed in for User creation logic
        # (Though DRF mostly filters out non-model fields, ensuring safety)
        
        return super().create(validated_data)

class HRRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HRRule
        fields = '__all__'

class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    class Meta:
        model = Payroll
        fields = '__all__'

class RosterSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    class Meta:
        model = Roster
        fields = '__all__'

class HRAttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    class Meta:
        model = HRAttendance
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    leader_name = serializers.CharField(source='leader.user.get_full_name', read_only=True, default='')
    member_count = serializers.IntegerField(read_only=True)
    members_detail = EmployeeSerializer(source='members', many=True, read_only=True)

    class Meta:
        model = Team
        fields = '__all__'

class MistakeSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    class Meta:
        model = Mistake
        fields = '__all__'

class SalarySlipSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    class Meta:
        model = SalarySlip
        fields = '__all__'

class EmployeeDocumentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    class Meta:
        model = EmployeeDocument
        fields = '__all__'

class WarningLetterSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    issued_by_name = serializers.CharField(source='issued_by.full_name', read_only=True)
    class Meta:
        model = WarningLetter
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
