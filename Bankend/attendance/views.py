from django.shortcuts import render, redirect
from rest_framework import viewsets
from .models import Attendance
from django.utils import timezone
from .serializers import AttendanceSerializer

def attendance_list(request):
    records = Attendance.objects.all().order_by('-date')
    return render(request, 'forms/attendance_list.html', {'records': records})

def clock_in(request):
    Attendance.objects.create(
        employee=request.user,
        clock_in=timezone.now().time()
    )
    return redirect('attendance_list')

from core.permissions import IsEliteAdmin, IsAttendanceOnly

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAttendanceOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.username.lower() in ['radhir', 'ruchika', 'afsar']:
            return Attendance.objects.all().order_by('-date')
        # Regular users only see their own attendance
        return Attendance.objects.filter(employee=user).order_by('-date')

    def perform_create(self, serializer):
        # Automatically set employee to current user if not elite admin
        user = self.request.user
        if user.username.lower() not in ['radhir', 'ruchika', 'afsar']:
            serializer.save(employee=user)
        else:
            serializer.save()
