from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from rest_framework import viewsets
from .models import PPFWarrantyRegistration
from .forms import PPFWarrantyRegistrationForm
from .serializers import PPFWarrantySerializer

def ppf_warranty_create(request):
    if request.method == 'POST':
        form = PPFWarrantyRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'PPF Warranty Registration created successfully!')
            return redirect('ppf_warranty_list')
    else:
        form = PPFWarrantyRegistrationForm()
    
    return render(request, 'forms/ppf_warranty_form.html', {'form': form, 'title': 'PPF Warranty Registration'})

def ppf_warranty_list(request):
    warranties = PPFWarrantyRegistration.objects.all().order_by('-created_at')
    return render(request, 'forms/ppf_warranty_list.html', {'warranties': warranties})

class PPFWarrantyViewSet(viewsets.ModelViewSet):
    queryset = PPFWarrantyRegistration.objects.all().order_by('-created_at')
    serializer_class = PPFWarrantySerializer
