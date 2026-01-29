from django.shortcuts import render, redirect, get_object_or_404
from django.shortcuts import render, redirect
from rest_framework import viewsets
from django.contrib import messages
from .models import Operation
from .forms import OperationForm
from .serializers import OperationSerializer

def operation_create(request):
    if request.method == 'POST':
        form = OperationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Operation record saved!')
            return redirect('operation_list')
    else:
        form = OperationForm()
    return render(request, 'forms/operation_form.html', {'form': form, 'title': 'Operation Tracking'})

def operation_list(request):
    operations = Operation.objects.all().order_by('-created_at')
    return render(request, 'forms/operation_list.html', {'operations': operations})

class OperationViewSet(viewsets.ModelViewSet):
    queryset = Operation.objects.all().order_by('-start_date')
    serializer_class = OperationSerializer
