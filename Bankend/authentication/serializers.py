from django.contrib.auth.models import User
from rest_framework import serializers
from guardian.shortcuts import get_objects_for_user

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    hr_profile = serializers.SerializerMethodField()
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    role = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()
    accent_color = serializers.SerializerMethodField()
    basic_salary = serializers.SerializerMethodField()
    
    # Enhanced Profile Fields
    medical_history = serializers.SerializerMethodField()
    family_members_count = serializers.SerializerMethodField()
    visa_start_date = serializers.SerializerMethodField()
    experience_summary = serializers.SerializerMethodField()
    emergency_contact_1 = serializers.SerializerMethodField()
    emergency_contact_2 = serializers.SerializerMethodField()
    
    # Identification Metadata
    passport_no = serializers.SerializerMethodField()
    visa_uid = serializers.SerializerMethodField()
    nationality = serializers.SerializerMethodField()

    # Financials (Protected)
    net_earnings = serializers.SerializerMethodField()
    mistakes_this_month = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'full_name', 'role', 'hr_profile', 'bio', 'profile_image', 'accent_color', 'basic_salary', 'net_earnings', 'mistakes_this_month', 'medical_history', 'family_members_count', 'visa_start_date', 'experience_summary', 'emergency_contact_1', 'emergency_contact_2', 'passport_no', 'visa_uid', 'nationality')

    def _get_profile(self, obj):
        if not hasattr(self, '_cached_profile'):
            try:
                self._cached_profile = obj.hr_profile
            except:
                self._cached_profile = None
        return self._cached_profile

    def get_hr_profile(self, obj):
        profile = self._get_profile(obj)
        if not profile: return None
        
        from hr.serializers import ModulePermissionSerializer
        return {
            'id': profile.id,
            'employee_id': profile.employee_id,
            'role': profile.role,
            'department': profile.department.name if profile.department else None,
            'company': profile.company.name if profile.company else None,
            'branch': profile.branch.name if profile.branch else None,
            'permissions': ModulePermissionSerializer(profile.module_permissions.all(), many=True).data,
            'config': profile.permissions_config
        }

    def get_role(self, obj):
        profile = self._get_profile(obj)
        return profile.role if profile else "Elite Member"

    def get_bio(self, obj):
        profile = self._get_profile(obj)
        return profile.bio if profile else None

    def get_profile_image(self, obj):
        profile = self._get_profile(obj)
        return profile.profile_image.url if profile and profile.profile_image else None

    def get_accent_color(self, obj):
        profile = self._get_profile(obj)
        return profile.accent_color if profile else "#b08d57"

    def _can_view_financials(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
            
        user = request.user
        # Superuser can see everything
        if user.is_superuser:
            return True
            
        # Check if user has object permission for this specific employee profile
        # Note: hr_profile is the Employee model instance
        if hasattr(obj, 'hr_profile'):
            return user.has_perm('hr.view_financials', obj.hr_profile)
            
        return False

    def get_basic_salary(self, obj):
        if not self._can_view_financials(obj):
            return 0
        profile = self._get_profile(obj)
        return profile.basic_salary if profile else 0

    def get_net_earnings(self, obj):
        if not self._can_view_financials(obj):
            return 0
        profile = self._get_profile(obj)
        if not profile: return 0
        try:
            from django.utils import timezone
            from django.db.models import Sum
            current_month = timezone.now().month
            current_year = timezone.now().year
            
            basic = profile.basic_salary
            mistakes = profile.mistakes.filter(date__month=current_month, date__year=current_year).aggregate(total=Sum('amount'))['total'] or 0
            return basic - mistakes
        except:
            return 0

    def get_mistakes_this_month(self, obj):
        if not self._can_view_financials(obj):
            return []
        profile = self._get_profile(obj)
        if not profile: return []
        try:
            from django.utils import timezone
            from hr.serializers import MistakeSerializer 
            current_month = timezone.now().month
            current_year = timezone.now().year
            mistakes = profile.mistakes.filter(date__month=current_month, date__year=current_year)
            return MistakeSerializer(mistakes, many=True).data
        except:
            return []

    def get_medical_history(self, obj):
        try: return obj.hr_profile.medical_history
        except: return None

    def get_family_members_count(self, obj):
        profile = self._get_profile(obj)
        return profile.family_members_count if profile else 0

    def get_visa_start_date(self, obj):
        profile = self._get_profile(obj)
        return profile.visa_start_date if profile else None
    
    def get_experience_summary(self, obj):
        profile = self._get_profile(obj)
        return profile.experience_summary if profile else None

    def get_passport_no(self, obj):
        profile = self._get_profile(obj)
        return profile.passport_no if profile else None
    
    def get_visa_uid(self, obj):
        profile = self._get_profile(obj)
        return profile.visa_uid if profile else None

    def get_nationality(self, obj):
        profile = self._get_profile(obj)
        return profile.nationality if profile else None

    def get_emergency_contact_1(self, obj):
        profile = self._get_profile(obj)
        if not profile: return None
        try:
            return {
                'name': profile.emergency_contact_1_name,
                'phone': profile.emergency_contact_1_phone,
                'relation': profile.emergency_contact_1_relation,
                'photo': profile.emergency_contact_1_photo.url if profile.emergency_contact_1_photo else None
            }
        except: return None

    def get_emergency_contact_2(self, obj):
        profile = self._get_profile(obj)
        if not profile: return None
        try:
            return {
                'name': profile.emergency_contact_2_name,
                'phone': profile.emergency_contact_2_phone,
                'relation': profile.emergency_contact_2_relation,
                'photo': profile.emergency_contact_2_photo.url if profile.emergency_contact_2_photo else None
            }
        except: return None

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
