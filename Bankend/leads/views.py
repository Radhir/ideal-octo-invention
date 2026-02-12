from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from rest_framework import viewsets, filters
from locations.filters import BranchFilterBackend
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

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from rest_framework.exceptions import PermissionDenied

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    filter_backends = [BranchFilterBackend]

    def get_queryset(self):
        # Default list excludes INBOX (Ghost) leads
        return Lead.objects.exclude(status='INBOX').order_by('-created_at')

    @action(detail=False, methods=['get'])
    def inbox(self, request):
        """Fetch only INBOX / Ghost leads"""
        leads = Lead.objects.filter(status='INBOX').order_by('-created_at')
        page = self.paginate_queryset(leads)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(leads, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # Handle regular creation
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        lead = serializer.instance
        
        # Handle Photos
        # Frontend sends: photos (list of files), captions (list of strings matching index)
        photos = request.FILES.getlist('photos')
        captions = request.data.getlist('captions') if 'captions' in request.data else []
        
        if photos:
            from .models import LeadPhoto
            for idx, photo in enumerate(photos):
                caption = captions[idx] if idx < len(captions) else ''
                LeadPhoto.objects.create(lead=lead, image=photo, caption=caption)
                
        headers = self.get_success_headers(serializer.data)
        # Re-serialize to include photos
        return Response(self.get_serializer(lead).data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        # Auto-assign 'INBOX' for API created leads unless specified
        status = serializer.validated_data.get('status', 'INBOX')
        serializer.save(status=status)

    def perform_update(self, serializer):
        # Access Control: Only Sales Team/Admin can update status/transfer
        user = self.request.user
        
        # Check if sensitive fields are being modified
        is_sensitive_update = 'status' in serializer.validated_data or 'assigned_to' in serializer.validated_data
        
        if is_sensitive_update:
            if not user.is_staff and not user.groups.filter(name='Sales').exists():
                raise PermissionDenied("Permission Denied: Only members of the Sales Team can transfer leads or update status.")
        
        serializer.save()
