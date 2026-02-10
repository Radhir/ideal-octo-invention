from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
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

class WarrantyPortalView(APIView):
    """Public warranty portal accessible via QR code"""
    permission_classes = [AllowAny]

    def get(self, request, token):
        warranty = get_object_or_404(PPFWarrantyRegistration, portal_token=token)
        
        # Build warranty data for public display
        data = {
            'certificate_number': f"PPF-{warranty.id:05d}",
            'customer_name': warranty.full_name,
            'vehicle': {
                'brand': warranty.vehicle_brand,
                'model': warranty.vehicle_model,
                'year': warranty.vehicle_year,
                'color': warranty.vehicle_color,
                'license_plate': warranty.license_plate,
                'vin': warranty.vin
            },
            'warranty': {
                'installation_date': warranty.installation_date,
                'duration_years': warranty.warranty_duration_years,
                'expiry_date': warranty.expiry_date,
                'film_brand': warranty.film_brand,
                'film_type': warranty.film_type,
                'film_lot_number': warranty.film_lot_number,
                'roll_number': warranty.roll_number,
                'coverage_area': warranty.coverage_area,
                'branch': warranty.get_branch_location_display()
            },
            'qr_code_url': request.build_absolute_uri(warranty.qr_code.url) if warranty.qr_code else None,
            'terms': [
                'Valid only with original purchase invoice',
                'Does not cover damage from accidents or misuse',
                'Annual inspection recommended for coverage validity',
                'Film warranty as per manufacturer specifications',
                'Installation warranty guaranteed by Elite Shine'
            ]
        }
        
        return Response(data)

class PPFWarrantyViewSet(viewsets.ModelViewSet):
    queryset = PPFWarrantyRegistration.objects.all().order_by('-created_at')
    serializer_class = PPFWarrantySerializer

    @action(detail=True, methods=['post'])
    def record_checkup(self, request, pk=None):
        """Record a checkup for a PPF warranty"""
        warranty = self.get_object()
        checkup_number = request.data.get('checkup_number')
        notes = request.data.get('notes', '')
        date = request.data.get('date', timezone.now().date())

        checkup_map = {
            1: ('first_checkup_date', 'first_checkup_notes'),
            2: ('second_checkup_date', 'second_checkup_notes'),
            3: ('third_checkup_date', 'third_checkup_notes'),
            4: ('fourth_checkup_date', 'fourth_checkup_notes'),
            5: ('fifth_checkup_date', 'fifth_checkup_notes'),
        }

        if checkup_number not in checkup_map:
            return Response({'error': 'Invalid checkup_number. Must be 1-5.'}, status=status.HTTP_400_BAD_REQUEST)

        date_field, notes_field = checkup_map[checkup_number]
        setattr(warranty, date_field, date)
        setattr(warranty, notes_field, notes)
        warranty.save()

        return Response({
            'message': f'Checkup {checkup_number} recorded successfully',
            'checkup_date': getattr(warranty, date_field),
            'checkup_notes': getattr(warranty, notes_field)
        })

    @action(detail=True, methods=['get'])
    def checkup_history(self, request, pk=None):
        """Get all checkup history for a warranty"""
        warranty = self.get_object()
        history = []
        for i, label in enumerate(['First', 'Second', 'Third', 'Fourth', 'Fifth'], 1):
            date_field = f'{label.lower()}_checkup_date'
            notes_field = f'{label.lower()}_checkup_notes'
            date_val = getattr(warranty, date_field)
            if date_val:
                history.append({
                    'checkup_number': i,
                    'label': f'{label} Checkup',
                    'date': date_val,
                    'notes': getattr(warranty, notes_field) or ''
                })
        return Response({
            'warranty_id': warranty.id,
            'customer': warranty.full_name,
            'vehicle': f'{warranty.vehicle_brand} {warranty.vehicle_model}',
            'checkups_completed': len(history),
            'history': history
        })

    @action(detail=False, methods=['get'])
    def due_for_checkup(self, request):
        """Get warranties due for checkup (no checkup in last 6 months)"""
        from datetime import timedelta
        six_months_ago = timezone.now().date() - timedelta(days=180)

        due_list = []
        for warranty in self.queryset:
            # Find the latest checkup date
            checkup_dates = [
                warranty.first_checkup_date, warranty.second_checkup_date,
                warranty.third_checkup_date, warranty.fourth_checkup_date,
                warranty.fifth_checkup_date
            ]
            valid_dates = [d for d in checkup_dates if d]
            last_checkup = max(valid_dates) if valid_dates else warranty.installation_date

            if last_checkup and last_checkup < six_months_ago:
                due_list.append({
                    'id': warranty.id,
                    'customer': warranty.full_name,
                    'contact': warranty.contact_number,
                    'vehicle': f'{warranty.vehicle_brand} {warranty.vehicle_model}',
                    'license_plate': warranty.license_plate,
                    'last_checkup': last_checkup,
                    'days_overdue': (timezone.now().date() - last_checkup).days - 180
                })

        return Response(due_list)
