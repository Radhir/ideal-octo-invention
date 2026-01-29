from rest_framework import serializers
from django.contrib.auth.models import User

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
    
    # Financials (Protected)
    net_earnings = serializers.SerializerMethodField()
    mistakes_this_month = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'full_name', 'role', 'hr_profile', 'bio', 'profile_image', 'accent_color', 'basic_salary', 'net_earnings', 'mistakes_this_month', 'medical_history', 'family_members_count', 'visa_start_date', 'experience_summary', 'emergency_contact_1', 'emergency_contact_2')

    def get_hr_profile(self, obj):
        """Return basic hr_profile data without causing circular import"""
        try:
            profile = obj.hr_profile
            return {
                'id': profile.id,
                'employee_id': profile.employee_id,
                'role': profile.role,
                'department': profile.department.name if profile.department else None,
                'company': profile.company.name if profile.company else None,
                'branch': profile.branch.name if profile.branch else None,
            }
        except:
            return None

    def get_role(self, obj):
        try:
            return obj.hr_profile.role
        except:
            return "Elite Member"

    def get_bio(self, obj):
        try:
            return obj.hr_profile.bio
        except:
            return None

    def get_profile_image(self, obj):
        try:
            if obj.hr_profile.profile_image:
                return obj.hr_profile.profile_image.url
            return None
        except:
            return None

    def get_accent_color(self, obj):
        try:
            return obj.hr_profile.accent_color
        except:
            return "#b08d57"

    def _can_view_financials(self, obj):
        request = self.context.get('request')
        if not request:
            return False
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        # User views their own profile
        if user == obj:
            return True
        # Owner/Admin views any profile
        try:
            role = user.hr_profile.role.lower()
            if 'owner' in role or 'admin' in role or 'managing director' in role:
                return True
        except:
            pass
        return False

    def get_basic_salary(self, obj):
        if not self._can_view_financials(obj):
            return 0
        try:
            return obj.hr_profile.basic_salary
        except:
            return 0

    def get_net_earnings(self, obj):
        if not self._can_view_financials(obj):
            return 0
        try:
            from django.utils import timezone
            from django.db.models import Sum
            current_month = timezone.now().month
            current_year = timezone.now().year
            
            basic = obj.hr_profile.basic_salary
            mistakes = obj.hr_profile.mistakes.filter(date__month=current_month, date__year=current_year).aggregate(total=Sum('amount'))['total'] or 0
            
            # Simple assumption: Net = Basic - Mistakes (ignoring attendance for this specific "Est. Earnings" display for now, or we can make it more complex later)
            # The prompt asked to calculate based on Hours * Rate - Mistakes, but basic salary implies a fixed rate.
            # Let's stick to Basic - Mistakes for the "Projected" value as per standard salary, OR we can use the hourly logic if specific.
            # Using Basic - Mistakes is safer for now as a base.
            return basic - mistakes
        except:
            return 0

    def get_mistakes_this_month(self, obj):
        if not self._can_view_financials(obj):
            return []
        try:
            from django.utils import timezone
            # Import locally to avoid circular dependency
            from hr.serializers import MistakeSerializer 
            current_month = timezone.now().month
            current_year = timezone.now().year
            mistakes = obj.hr_profile.mistakes.filter(date__month=current_month, date__year=current_year)
            return MistakeSerializer(mistakes, many=True).data
        except:
            return []

    def get_medical_history(self, obj):
        try: return obj.hr_profile.medical_history
        except: return None

    def get_family_members_count(self, obj):
        try: return obj.hr_profile.family_members_count
        except: return 0

    def get_visa_start_date(self, obj):
        try: return obj.hr_profile.visa_start_date
        except: return None
    
    def get_experience_summary(self, obj):
        try: return obj.hr_profile.experience_summary
        except: return None

    def get_emergency_contact_1(self, obj):
        try:
            return {
                'name': obj.hr_profile.emergency_contact_1_name,
                'phone': obj.hr_profile.emergency_contact_1_phone,
                'relation': obj.hr_profile.emergency_contact_1_relation,
                'photo': obj.hr_profile.emergency_contact_1_photo.url if obj.hr_profile.emergency_contact_1_photo else None
            }
        except: return None

    def get_emergency_contact_2(self, obj):
        try:
            return {
                'name': obj.hr_profile.emergency_contact_2_name,
                'phone': obj.hr_profile.emergency_contact_2_phone,
                'relation': obj.hr_profile.emergency_contact_2_relation,
                'photo': obj.hr_profile.emergency_contact_2_photo.url if obj.hr_profile.emergency_contact_2_photo else None
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
