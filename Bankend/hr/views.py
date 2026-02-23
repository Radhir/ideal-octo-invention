from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from locations.filters import BranchFilterBackend
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from core.permissions import IsAdminOrOwner, IsManager, IsEliteAdmin
from .models import (
    Employee, HRRule, Payroll, Roster, HRAttendance, Team, Mistake, 
    Department, Company, Branch, ModulePermission, SalarySlip, EmployeeDocument, WarningLetter, Notification, Bonus
)
from .serializers import (
    EmployeeSerializer, HRRuleSerializer, PayrollSerializer,
    RosterSerializer, HRAttendanceSerializer, TeamSerializer, MistakeSerializer, DepartmentSerializer,
    CompanySerializer, BranchSerializer, ModulePermissionSerializer,
    SalarySlipSerializer, EmployeeDocumentSerializer, WarningLetterSerializer, NotificationSerializer,
    BonusSerializer
)
from .services import HRService
from .services_performance import PerformanceService

class PerformanceViewSet(viewsets.ViewSet):
    permission_classes = [IsEliteAdmin]

    @action(detail=False, methods=['get'])
    def technician_efficiency(self, request):
        employee_id = request.query_params.get('employee_id')
        month = request.query_params.get('month') # YYYY-MM
        
        if not employee_id:
            return Response({"error": "employee_id is required"}, status=400)
            
        stats = PerformanceService.calculate_technician_efficiency(employee_id, month)
        return Response(stats)

    @action(detail=False, methods=['post'])
    def accrue_bonuses(self, request):
        month = request.data.get('month') # YYYY-MM
        results = PerformanceService.accrue_monthly_bonuses(month)
        return Response({
            "message": f"Successfully processed bonuses for {len(results)} technicians.",
            "details": results
        })

class BonusViewSet(viewsets.ModelViewSet):
    queryset = Bonus.objects.all().select_related('employee', 'employee__user')
    serializer_class = BonusSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'date']

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsEliteAdmin]

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsEliteAdmin]

class ModulePermissionViewSet(viewsets.ModelViewSet):
    queryset = ModulePermission.objects.all()
    serializer_class = ModulePermissionSerializer
    permission_classes = [IsEliteAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee']

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsEliteAdmin]

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().select_related(
        'user', 
        'department', 
        'branch', 
        'company'
    ).prefetch_related(
        'module_permissions'
    )
    serializer_class = EmployeeSerializer
    permission_classes = [IsEliteAdmin]
    filter_backends = [BranchFilterBackend]

    @action(detail=False, methods=['get'])
    def technician_leaderboard(self, request):
        from job_cards.models import JobCard
        from django.db.models import Count, Sum, Q
        
        # Aggregate closed jobs by technician (CharField in JobCard)
        stats = JobCard.objects.filter(status='CLOSED').values('assigned_technician').annotate(
            total_jobs=Count('id'),
            total_revenue=Sum('net_amount'),
            qc_passes=Count('id', filter=Q(qc_sign_off=True))
        ).order_by('-total_revenue')
        
        # Calculate rates
        leaderboard = []
        for entry in stats:
            if not entry['assigned_technician']: continue
            
            pass_rate = (entry['qc_passes'] / entry['total_jobs'] * 100) if entry['total_jobs'] > 0 else 0
            leaderboard.append({
                'technician': entry['assigned_technician'],
                'jobs_closed': entry['total_jobs'],
                'revenue_generated': float(entry['total_revenue'] or 0),
                'qc_pass_rate': round(pass_rate, 1)
            })
            
        return Response(leaderboard)

    def destroy(self, request, *args, **kwargs):
        # Override delete to just deactivate
        employee = self.get_object()
        user = employee.user
        
        # Deactivate
        user.is_active = False
        user.save()
        
        employee.is_active = False
        employee.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


    def perform_create(self, serializer):
        from django.contrib.auth.models import User
        import random
        import string
        
        # 1. Extract non-model data or handle User creation
        full_name = self.request.data.get('fullName', 'New Employee')
        email = self.request.data.get('workEmail', '')
        emp_id = self.request.data.get('employee_id', '')
        
        # Generate username from employee_id or name
        username = emp_id.lower().replace('-', '_') if emp_id else full_name.lower().replace(' ', '.')
        if User.objects.filter(username=username).exists():
            username += f"_{random.randint(100, 999)}"
            
        # Create User
        names = full_name.split(' ', 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ''
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=User.objects.make_random_password(),
            first_name=first_name,
            last_name=last_name
        )
        
        # 2. Map and Save Employee
        serializer.save(user=user)

class HRRuleViewSet(viewsets.ModelViewSet):
    queryset = HRRule.objects.all()
    serializer_class = HRRuleSerializer
    permission_classes = [IsEliteAdmin]

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [IsEliteAdmin]

    def get_queryset(self):
        queryset = self.queryset
        month = self.request.query_params.get('month')
        if month:
            queryset = queryset.filter(month__month=month.split('-')[1], month__year=month.split('-')[0])
        return queryset.order_by('-month')


    @action(detail=False, methods=['post'])
    def generate_payroll_cycle(self, request):
        month = request.data.get('month')
        try:
            processed_count = HRService.generate_payroll_cycle(month)
            return Response({
                "message": f"Successfully processed payroll for {processed_count} employees.",
                "processed": processed_count
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class RosterViewSet(viewsets.ModelViewSet):
    module_name = 'HR'
    queryset = Roster.objects.all()
    serializer_class = RosterSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        queryset = self.queryset
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(shift_start__date=date)
        return queryset.order_by('shift_start')

class HRAttendanceViewSet(viewsets.ModelViewSet):
    module_name = 'HR'
    queryset = HRAttendance.objects.all()
    serializer_class = HRAttendanceSerializer
    permission_classes = [IsAdminOrOwner]

    @action(detail=False, methods=['post'])
    def clock_in(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Auth required"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            employee = request.user.hr_profile
        except Employee.DoesNotExist:
            return Response(
                {"error": "No employee profile found for this user. Please contact HR."},
                status=status.HTTP_400_BAD_REQUEST
            )

        today = timezone.now().date()
        attendance, created = HRAttendance.objects.get_or_create(
            employee=employee,
            date=today,
            defaults={'clock_in': timezone.now().time()}
        )

        if not created:
            return Response(
                {"error": "Already clocked in today", "attendance": HRAttendanceSerializer(attendance).data},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(HRAttendanceSerializer(attendance).data)

    @action(detail=False, methods=['post'])
    def clock_out(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Auth required"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            employee = request.user.hr_profile
        except Employee.DoesNotExist:
            return Response(
                {"error": "No employee profile found for this user. Please contact HR."},
                status=status.HTTP_400_BAD_REQUEST
            )

        today = timezone.now().date()
        try:
            attendance = HRAttendance.objects.get(employee=employee, date=today)

            if attendance.clock_out:
                return Response(
                    {"error": "Already clocked out today", "attendance": HRAttendanceSerializer(attendance).data},
                    status=status.HTTP_400_BAD_REQUEST
                )

            attendance.clock_out = timezone.now().time()

            # Calculate total hours
            if attendance.clock_in and attendance.clock_out:
                import datetime
                ci = datetime.datetime.combine(today, attendance.clock_in)
                co = datetime.datetime.combine(today, attendance.clock_out)
                diff = co - ci
                attendance.total_hours = diff.total_seconds() / 3600

            attendance.save()
            return Response(HRAttendanceSerializer(attendance).data)
        except HRAttendance.DoesNotExist:
            return Response({"error": "No clock-in found for today"}, status=status.HTTP_400_BAD_REQUEST)

class TeamViewSet(viewsets.ModelViewSet):
    module_name = 'HR'
    queryset = Team.objects.all().order_by('-created_at')
    serializer_class = TeamSerializer
    permission_classes = [IsAdminOrOwner]

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        team = self.get_object()
        employee_id = request.data.get('employee_id')
        if not employee_id:
            return Response({"error": "employee_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            employee = Employee.objects.get(id=employee_id)
            team.members.add(employee)
            return Response(TeamSerializer(team).data)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        team = self.get_object()
        employee_id = request.data.get('employee_id')
        if not employee_id:
            return Response({"error": "employee_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            employee = Employee.objects.get(id=employee_id)
            team.members.remove(employee)
            return Response(TeamSerializer(team).data)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

class MistakeViewSet(viewsets.ModelViewSet):
    module_name = 'HR'
    queryset = Mistake.objects.all().order_by('-date', '-created_at')
    serializer_class = MistakeSerializer
    permission_classes = [IsAdminOrOwner]

class SalarySlipViewSet(viewsets.ModelViewSet):
    module_name = 'HR'
    queryset = SalarySlip.objects.all()
    serializer_class = SalarySlipSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return SalarySlip.objects.all().order_by('-month')
        return SalarySlip.objects.filter(employee__user=user).order_by('-month')

class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    module_name = 'HR'
    queryset = EmployeeDocument.objects.all()
    serializer_class = EmployeeDocumentSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return EmployeeDocument.objects.all().order_by('employee__user__first_name')
        return EmployeeDocument.objects.filter(employee__user=user).order_by('created_at')

class WarningLetterViewSet(viewsets.ModelViewSet):
    module_name = 'HR'
    queryset = WarningLetter.objects.all()
    serializer_class = WarningLetterSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return WarningLetter.objects.all().order_by('-date_issued')
        return WarningLetter.objects.filter(employee__user=user).order_by('-date_issued')

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.none()
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=False, methods=['POST'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'notifications marked as read'})

    @action(detail=True, methods=['POST'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
