from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from core.permissions import IsAdminOrOwner, IsManager, IsEliteAdmin
from .models import (
    Employee, HRRule, Payroll, Roster, HRAttendance, Team, Mistake, 
    Department, Company, Branch, ModulePermission, SalarySlip, EmployeeDocument, WarningLetter
)
from .serializers import (
    EmployeeSerializer, HRRuleSerializer, PayrollSerializer,
    RosterSerializer, HRAttendanceSerializer, TeamSerializer, MistakeSerializer, DepartmentSerializer,
    CompanySerializer, BranchSerializer, ModulePermissionSerializer,
    SalarySlipSerializer, EmployeeDocumentSerializer, WarningLetterSerializer
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
