from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
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

    @action(detail=True, methods=['post'])
    def record_maintenance(self, request, pk=None):
        """Record a maintenance visit for a ceramic warranty"""
        warranty = self.get_object()
        maintenance_number = request.data.get('maintenance_number')
        notes = request.data.get('notes', '')
        date = request.data.get('date', timezone.now().date())

        maintenance_map = {
            1: ('m1_date', 'm1_notes'),
            2: ('m2_date', 'm2_notes'),
            3: ('m3_date', 'm3_notes'),
            4: ('m4_date', 'm4_notes'),
        }

        if maintenance_number not in maintenance_map:
            return Response({'error': 'Invalid maintenance_number. Must be 1-4.'}, status=status.HTTP_400_BAD_REQUEST)

        date_field, notes_field = maintenance_map[maintenance_number]
        setattr(warranty, date_field, date)
        setattr(warranty, notes_field, notes)
        warranty.save()

        return Response({
            'message': f'Maintenance {maintenance_number} recorded successfully',
            'maintenance_date': getattr(warranty, date_field),
            'maintenance_notes': getattr(warranty, notes_field)
        })

    @action(detail=True, methods=['get'])
    def maintenance_history(self, request, pk=None):
        """Get all maintenance history for a warranty"""
        warranty = self.get_object()
        history = []
        labels = ['1st', '2nd', '3rd', '4th']
        for i, label in enumerate(labels, 1):
            date_field = f'm{i}_date'
            notes_field = f'm{i}_notes'
            date_val = getattr(warranty, date_field)
            if date_val:
                history.append({
                    'maintenance_number': i,
                    'label': f'{label} Maintenance',
                    'date': date_val,
                    'notes': getattr(warranty, notes_field) or ''
                })
        return Response({
            'warranty_id': warranty.id,
            'customer': warranty.full_name,
            'vehicle': f'{warranty.vehicle_brand} {warranty.vehicle_model}',
            'coating_type': warranty.coating_type,
            'maintenance_completed': len(history),
            'history': history
        })

    @action(detail=False, methods=['get'])
    def due_for_maintenance(self, request):
        """Get warranties due for maintenance (no maintenance in last 6 months)"""
        from datetime import timedelta
        six_months_ago = timezone.now().date() - timedelta(days=180)

        due_list = []
        for warranty in self.queryset:
            # Find the latest maintenance date
            maintenance_dates = [warranty.m1_date, warranty.m2_date, warranty.m3_date, warranty.m4_date]
            valid_dates = [d for d in maintenance_dates if d]
            last_maintenance = max(valid_dates) if valid_dates else warranty.installation_date

            if last_maintenance and last_maintenance < six_months_ago:
                due_list.append({
                    'id': warranty.id,
                    'customer': warranty.full_name,
                    'contact': warranty.contact_number,
                    'vehicle': f'{warranty.vehicle_brand} {warranty.vehicle_model}',
                    'license_plate': warranty.license_plate,
                    'coating_type': warranty.coating_type,
                    'last_maintenance': last_maintenance,
                    'days_overdue': (timezone.now().date() - last_maintenance).days - 180
                })

        return Response(due_list)
