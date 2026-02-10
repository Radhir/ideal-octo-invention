from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from core.permissions import IsAdminOrOwner, IsManager, IsEliteAdmin
from .models import (
    Employee, HRRule, Payroll, Roster, HRAttendance, Team, Mistake, 
    Department, Company, Branch, ModulePermission, SalarySlip, EmployeeDocument, WarningLetter, Notification
)
from .serializers import (
    EmployeeSerializer, HRRuleSerializer, PayrollSerializer,
    RosterSerializer, HRAttendanceSerializer, TeamSerializer, MistakeSerializer, DepartmentSerializer,
    CompanySerializer, BranchSerializer, ModulePermissionSerializer,
    SalarySlipSerializer, EmployeeDocumentSerializer, WarningLetterSerializer, NotificationSerializer
)

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

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsEliteAdmin]

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsEliteAdmin]

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


    @action(detail=False, methods=['post'])
    def generate_payroll_cycle(self, request):
        today = timezone.now().date()
        month_start = today.replace(day=1)
        employees = Employee.objects.all()
        processed_count = 0
        from decimal import Decimal

        try:
            for emp in employees:
                # 1. Fetch all attendance for this month
                attendances = HRAttendance.objects.filter(
                    employee=emp, 
                    date__month=today.month, 
                    date__year=today.year
                )
                
                # 2. Calculate Total Hours & Overtime
                # Standard Shift = 10 Hours
                total_logged = Decimal('0.00')
                total_ot = Decimal('0.00')
                
                for att in attendances:
                    if att.total_hours:
                        hours = Decimal(str(att.total_hours))
                        total_logged += hours
                        if hours > 10:
                            total_ot += (hours - 10)
                
                # 3. Calculate Rates
                # Assuming 24 work days * 10 hours = 240 hours standard/month
                standard_hours_month = Decimal('240.00')
                hourly_rate = emp.basic_salary / standard_hours_month if emp.basic_salary > 0 else Decimal(0)
                ot_rate = hourly_rate * Decimal('1.25') # 25% premium for OT
                
                # 4. Financial Components
                basic_earned = (total_logged - total_ot) * hourly_rate
                ot_earned = total_ot * ot_rate
                
                # Fixed allowances are paid if at least some attendance is logged
                attendance_factor = Decimal('1.0') if total_logged > 0 else Decimal('0.0')
                housing = emp.housing_allowance * attendance_factor
                transport = emp.transport_allowance * attendance_factor
                
                net_pay = basic_earned + ot_earned + housing + transport
                
                # 5. Create/Update Payroll Record
                Payroll.objects.update_or_create(
                    employee=emp,
                    month=month_start,
                    defaults={
                        'basic_paid': basic_earned,
                        'overtime_paid': ot_earned,
                        'incentives': Decimal('0.00'),
                        'deductions': Decimal('0.00'),
                        'net_salary': net_pay,
                        'status': 'PROCESSED'
                    }
                )
                processed_count += 1
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)

        return Response({
            "message": f"Successfully processed payroll for {processed_count} employees.",
            "processed": processed_count
        })

class RosterViewSet(viewsets.ModelViewSet):
    queryset = Roster.objects.all()
    serializer_class = RosterSerializer

class HRAttendanceViewSet(viewsets.ModelViewSet):
    queryset = HRAttendance.objects.all()
    serializer_class = HRAttendanceSerializer

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
    queryset = Team.objects.all().order_by('-created_at')
    serializer_class = TeamSerializer

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
    queryset = Mistake.objects.all().order_by('-date', '-created_at')
    serializer_class = MistakeSerializer

class SalarySlipViewSet(viewsets.ModelViewSet):
    queryset = SalarySlip.objects.all().order_by('-month')
    serializer_class = SalarySlipSerializer

class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDocument.objects.all().order_by('employee__user__first_name')
    serializer_class = EmployeeDocumentSerializer

class WarningLetterViewSet(viewsets.ModelViewSet):
    queryset = WarningLetter.objects.all().order_by('-date_issued')
    serializer_class = WarningLetterSerializer

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
