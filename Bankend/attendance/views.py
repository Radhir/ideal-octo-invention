from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Attendance
from .serializers import AttendanceSerializer
from hr.models import Employee


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    Attendance API ViewSet.
    Provides list, retrieve, and custom check_in/check_out actions.
    """
    module_name = 'Attendance'
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    from core.permissions import HasModulePermission
    permission_classes = [IsAuthenticated, HasModulePermission]
    
    def get_queryset(self):
        user = self.request.user
        date = self.request.query_params.get('date')
        
        # Admin sees all
        if user.is_staff or user.is_superuser:
            queryset = Attendance.objects.all()
        else:
            # Regular users see their own
            try:
                employee = Employee.objects.get(user=user)
                queryset = Attendance.objects.filter(employee=employee)
            except Employee.DoesNotExist:
                return Attendance.objects.none()

        if date:
            queryset = queryset.filter(date=date)
            
        return queryset.order_by('-date', '-check_in_time')

    @action(detail=False, methods=['post'], url_path='check-in')
    def check_in(self, request):
        """Clock in for today."""
        user = request.user
        
        # Get employee profile
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'No employee profile found. Contact HR.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        today = timezone.now().date()
        now_time = timezone.now().time()
        
        # Check if already clocked in today
        existing = Attendance.objects.filter(employee=employee, date=today).first()
        
        if existing:
            if existing.check_out_time:
                return Response(
                    {'error': 'Already completed shift for today.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return Response(
                {'message': 'Already clocked in', 'data': AttendanceSerializer(existing).data},
                status=status.HTTP_200_OK
            )
        
        # Create new attendance record
        attendance = Attendance.objects.create(
            employee=employee,
            check_in_time=now_time,
            status='PRESENT'
        )
        
        return Response({
            'message': 'Clocked in successfully',
            'data': AttendanceSerializer(attendance).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='check-out')
    def check_out(self, request):
        """Clock out for today."""
        user = request.user
        
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'No employee profile found. Contact HR.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        today = timezone.now().date()
        now_time = timezone.now().time()
        
        # Find today's attendance
        try:
            attendance = Attendance.objects.get(employee=employee, date=today)
        except Attendance.DoesNotExist:
            return Response(
                {'error': 'No clock-in found for today. Please clock in first.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if attendance.check_out_time:
            return Response(
                {'error': 'Already clocked out today.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update checkout time
        attendance.check_out_time = now_time
        attendance.save()  # This triggers total_hours calculation
        
        return Response({
            'message': 'Clocked out successfully',
            'data': AttendanceSerializer(attendance).data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='today')
    def today(self, request):
        """Get today's attendance for current user."""
        user = request.user
        
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'No employee profile found.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        today = timezone.now().date()
        attendance = Attendance.objects.filter(employee=employee, date=today).first()
        
        if attendance:
            return Response(AttendanceSerializer(attendance).data)
        return Response({'message': 'No attendance record for today'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """Get attendance summary for salary calculation."""
        user = request.user
        
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
            return Response({'error': 'No employee profile found.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get this month's attendance
        today = timezone.now().date()
        first_day = today.replace(day=1)
        
        records = Attendance.objects.filter(
            employee=employee,
            date__gte=first_day,
            date__lte=today
        )
        
        total_hours = sum(float(r.total_hours or 0) for r in records)
        overtime_hours = sum(float(r.overtime_hours or 0) for r in records)
        days_worked = records.count()
        days_late = records.filter(is_late=True).count()
        
        return Response({
            'employee': employee.employee_id,
            'period': f"{first_day} to {today}",
            'days_worked': days_worked,
            'days_late': days_late,
            'total_hours': round(total_hours, 2),
            'overtime_hours': round(overtime_hours, 2),
            'regular_hours': round(total_hours - overtime_hours, 2),
        })
