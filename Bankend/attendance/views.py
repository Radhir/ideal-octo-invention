from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Attendance
from .serializers import AttendanceSerializer
from hr.models import Employee

def attendance_list(request):
    records = Attendance.objects.all().order_by('-date')
    return render(request, 'forms/attendance_list.html', {'records': records})

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Attendance.objects.all().order_by('-date')
        # Regular users only see their own attendance
        try:
            employee = Employee.objects.get(user=user)
            return Attendance.objects.filter(employee=employee).order_by('-date')
        except Employee.DoesNotExist:
            return Attendance.objects.none()

    @action(detail=False, methods=['post'])
    def check_in(self, request):
        user = request.user
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee profile not found'}, status=status.HTTP_404_NOT_FOUND)
            
        today = timezone.now().date()
        
        # Check if already checked in
        if Attendance.objects.filter(employee=employee, date=today).exists():
           return Response({'error': 'Already checked in for today'}, status=status.HTTP_400_BAD_REQUEST)
           
        attendance = Attendance.objects.create(
            employee=employee,
            check_in_time=timezone.now().time(),
            status='PRESENT' # Model logic will auto-correct to LATE if needed
        )
        # Re-save to trigger model logic (double-check)
        attendance.save()
        
        return Response(AttendanceSerializer(attendance).data)

    @action(detail=False, methods=['post'])
    def check_out(self, request):
        user = request.user
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
             return Response({'error': 'Employee profile not found'}, status=status.HTTP_404_NOT_FOUND)
             
        today = timezone.now().date()
        
        try:
            attendance = Attendance.objects.get(employee=employee, date=today)
        except Attendance.DoesNotExist:
            return Response({'error': 'No check-in record found for today'}, status=status.HTTP_404_NOT_FOUND)
            
        if attendance.check_out_time:
             return Response({'error': 'Already checked out today'}, status=status.HTTP_400_BAD_REQUEST)
             
        attendance.check_out_time = timezone.now().time()
        attendance.save() # Triggers total_hours and OT calc
        
        return Response(AttendanceSerializer(attendance).data)
