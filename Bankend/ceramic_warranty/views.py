from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from rest_framework import viewsets
from .models import CeramicWarrantyRegistration
from .forms import CeramicWarrantyRegistrationForm
from .serializers import CeramicWarrantySerializer

def ceramic_warranty_create(request):
    if request.method == 'POST':
        form = CeramicWarrantyRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Ceramic Warranty Registration created successfully!')
            return redirect('ceramic_warranty_list')
    else:
        form = CeramicWarrantyRegistrationForm()
    
    return render(request, 'forms/ceramic_warranty_form.html', {'form': form, 'title': 'Ceramic Warranty Registration'})

def ceramic_warranty_list(request):
    warranties = CeramicWarrantyRegistration.objects.all().order_by('-created_at')
    return render(request, 'forms/ceramic_warranty_list.html', {'warranties': warranties})

class CeramicWarrantyViewSet(viewsets.ModelViewSet):
    queryset = CeramicWarrantyRegistration.objects.all().order_by('-created_at')
    serializer_class = CeramicWarrantySerializer
