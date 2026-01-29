from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from rest_framework import viewsets
from .models import Lead
from .forms import LeadForm
from .serializers import LeadSerializer

def lead_create(request):
    if request.method == 'POST':
        form = LeadForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Lead captured successfully!')
            return redirect('lead_list')
    else:
        form = LeadForm()
    return render(request, 'forms/lead_form.html', {'form': form, 'title': 'New Lead'})

def lead_list(request):
    leads = Lead.objects.all().order_by('-created_at')
    return render(request, 'forms/lead_list.html', {'leads': leads})

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().order_by('-created_at')
    serializer_class = LeadSerializer
