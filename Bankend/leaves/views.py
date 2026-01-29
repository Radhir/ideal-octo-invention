from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from rest_framework import viewsets
from .models import LeaveApplication
from .forms import LeaveApplicationForm
from .serializers import LeaveSerializer

def leave_create(request):
    if request.method == 'POST':
        form = LeaveApplicationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Leave Application created successfully!')
            return redirect('leave_list')
    else:
        form = LeaveApplicationForm()
    
    return render(request, 'forms/leave_application_form.html', {'form': form, 'title': 'Leave Application'})

def leave_list(request):
    leaves = LeaveApplication.objects.all().order_by('-created_at')
    return render(request, 'leaves/leave_list.html', {'leaves': leaves})

class LeaveViewSet(viewsets.ModelViewSet):
    queryset = LeaveApplication.objects.all().order_by('-created_at')
    serializer_class = LeaveSerializer
