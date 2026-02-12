from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from .models import JobCard, JobCardPhoto, JobCardTask, ServiceCategory, Service
from .forms import (
    JobCardReceptionForm, JobCardEstimationForm, 
    JobCardAssignmentForm, JobCardQCForm, JobCardDeliveryForm
)
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from locations.filters import BranchFilterBackend
from core.permissions import IsAdminOrOwner
from .serializers import JobCardSerializer, JobCardTaskSerializer, JobCardPhotoSerializer, ServiceCategorySerializer, ServiceSerializer
from invoices.models import Invoice
from .utils import trigger_job_notification

def job_card_list(request):
    job_cards = JobCard.objects.all().order_by('-created_at')
    return render(request, 'forms/job_card_list.html', {'job_cards': job_cards})

def job_card_create(request):
    if request.method == 'POST':
        form = JobCardReceptionForm(request.POST, request.FILES)
        if form.is_valid():
            job_card = form.save()
            messages.success(request, f'Job Card {job_card.job_card_number} created!')
            return redirect('job_card_detail', pk=job_card.pk)
    else:
        form = JobCardReceptionForm()
    return render(request, 'forms/job_card_form.html', {'form': form, 'title': 'New Job Card'})

def job_card_detail(request, pk):
    job_card = get_object_or_404(JobCard, pk=pk)
    
    # Select form based on status
    form_map = {
        'RECEPTION': JobCardReceptionForm,
        'ESTIMATION': JobCardEstimationForm,
        'WORK_ASSIGNMENT': JobCardAssignmentForm,
        'QC': JobCardQCForm,
        'DELIVERY': JobCardDeliveryForm,
    }
    form_class = form_map.get(job_card.status)

    if request.method == 'POST' and form_class:
        form = form_class(request.POST, request.FILES, instance=job_card)
        if form.is_valid():
            form.save()
            messages.success(request, 'Data saved successfully.')
            return redirect('job_card_detail', pk=pk)
    else:
        form = form_class(instance=job_card) if form_class else None

    # Step Progression (Advance)
    if request.GET.get('advance'):
        next_status = {
            'RECEPTION': 'ESTIMATION',
            'ESTIMATION': 'WORK_ASSIGNMENT',
            'WORK_ASSIGNMENT': 'WIP',
            'WIP': 'QC',
            'QC': 'INVOICING',
            'INVOICING': 'DELIVERY',
            'DELIVERY': 'CLOSED',
        }.get(job_card.status)
        
        if next_status:
            # ENFORCEMENT: Cannot advance from INVOICING to DELIVERY without an Invoice
            if job_card.status == 'INVOICING' and not hasattr(job_card, 'invoice'):
                messages.error(request, "Error: You must create an Invoice before advancing to Delivery.")
                return redirect('job_card_detail', pk=pk)
                
            job_card.status = next_status
            job_card.save()
            trigger_job_notification(job_card)
            messages.info(request, f'Workflow moved to: {job_card.get_status_display()}')
            return redirect('job_card_detail', pk=pk)

    return render(request, 'forms/job_card_detail.html', {
        'job_card': job_card,
        'form': form,
    })

def create_invoice_from_job(request, pk):
    job_card = get_object_or_404(JobCard, pk=pk)
    
    # Check if invoice already exists
    if hasattr(job_card, 'invoice'):
        messages.warning(request, "Invoice already exists for this Job Card.")
        return redirect('job_card_detail', pk=pk)

    # Create Invoice pre-filled with Job Card data
    invoice = Invoice.objects.create(
        job_card=job_card,
        invoice_number=f"INV-{job_card.job_card_number}",
        date=job_card.date,
        customer_name=job_card.customer_name,
        items=job_card.job_description,
        total_amount=job_card.total_amount,
        vat_amount=job_card.vat_amount,
        grand_total=job_card.net_amount,
        payment_status='PENDING'
    )
    
    messages.success(request, f"Invoice {invoice.invoice_number} generated successfully.")
    return redirect('job_card_detail', pk=pk)

# API Views
class JobCardViewSet(viewsets.ModelViewSet):
    queryset = JobCard.objects.all().order_by('-created_at')
    serializer_class = JobCardSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = [BranchFilterBackend]

    def perform_create(self, serializer):
        lead_id = self.request.data.get('lead_id')
        booking_id = self.request.data.get('booking_id')
        
        extras = {}
        if lead_id:
             extras['related_lead_id'] = lead_id
        if booking_id:
             extras['related_booking_id'] = booking_id
             
        job_card = serializer.save(**extras)
        
        # Post-save updates
        if lead_id:
            from leads.models import Lead
            Lead.objects.filter(id=lead_id).update(status='CONVERTED')
            
        if booking_id:
            from bookings.models import Booking
            Booking.objects.filter(id=booking_id).update(status='ARRIVED')

    @action(detail=True, methods=['post'])
    def release(self, request, pk=None):
        job_card = self.get_object()
        job_card.is_released = True
        job_card.save()
        return Response({'status': 'released', 'is_released': True})

    @action(detail=True, methods=['post'])
    def advance_status(self, request, pk=None):
        job_card = self.get_object()
        next_status_map = {
            'RECEPTION': 'ESTIMATION_ASSIGNMENT',
            'ESTIMATION_ASSIGNMENT': 'WIP_QC',
            'WIP_QC': 'INVOICING_DELIVERY',
            'INVOICING_DELIVERY': 'CLOSED',
        }
        next_status = next_status_map.get(job_card.status)
        
        if next_status:
            if job_card.status == 'RECEPTION' and not job_card.checklists.exists():
                # For now, allowing bypass if user really wants to, but keeping the logic
                # For high-level production we might want to enforce it.
                # return Response({'error': 'Vehicle Intake Checklist required to advance from Reception'}, status=status.HTTP_400_BAD_REQUEST)
                pass
                
            # Removed strict invoice requirement for delivery as per "Software Remarks"
            # if job_card.status == 'INVOICING' and not hasattr(job_card, 'invoice'):
            #     return Response({'error': 'Invoice required to advance to Delivery'}, status=status.HTTP_400_BAD_REQUEST)
            
            job_card.status = next_status
            job_card.save()
            trigger_job_notification(job_card)
            return Response({'status': job_card.status, 'display': job_card.get_status_display()})
        
        return Response({'error': 'Cannot advance further'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def create_invoice(self, request, pk=None):
        job_card = self.get_object()
        if hasattr(job_card, 'invoice'):
            return Response({'error': 'Invoice already exists'}, status=status.HTTP_400_BAD_REQUEST)

        invoice = Invoice.objects.create(
            job_card=job_card,
            invoice_number=f"INV-{job_card.job_card_number}",
            date=job_card.date,
            customer_name=job_card.customer_name,
            vehicle_brand=job_card.brand,
            vehicle_model=job_card.model,
            vehicle_year=str(job_card.year),
            vehicle_color=job_card.color,
            vehicle_plate=f"{job_card.plate_emirate} {job_card.plate_code} {job_card.registration_number}".strip(),
            vehicle_vin=job_card.vin,
            vehicle_km=str(job_card.kilometers),
            items=job_card.job_description,
            total_amount=job_card.total_amount,
            vat_amount=job_card.vat_amount,
            grand_total=job_card.net_amount,
            payment_status='PENDING'
        )
        return Response({'invoice_id': invoice.id, 'invoice_number': invoice.invoice_number})

    @action(detail=True, methods=['post'])
    def update_signoff(self, request, pk=None):
        """Update individual QC sign-off fields"""
        job_card = self.get_object()
        signoff_fields = [
            'qc_sign_off', 'pre_work_head_sign_off', 'post_work_tl_sign_off',
            'post_work_head_sign_off', 'floor_incharge_sign_off'
        ]
        updated = []
        for field in signoff_fields:
            if field in request.data:
                setattr(job_card, field, request.data[field])
                updated.append(field)

        if updated:
            job_card.save()
            return Response({
                'updated': updated,
                'signoffs': {f: getattr(job_card, f) for f in signoff_fields}
            })
        return Response({'error': 'No valid sign-off fields provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def signoff_status(self, request, pk=None):
        """Get current sign-off status for a job card"""
        job_card = self.get_object()
        signoff_fields = [
            'qc_sign_off', 'pre_work_head_sign_off', 'post_work_tl_sign_off',
            'post_work_head_sign_off', 'floor_incharge_sign_off'
        ]
        return Response({
            'job_card_number': job_card.job_card_number,
            'status': job_card.status,
            'signoffs': {f: getattr(job_card, f) for f in signoff_fields},
            'all_signed': all(getattr(job_card, f) for f in signoff_fields)
        })

class JobCardTaskViewSet(viewsets.ModelViewSet):
    queryset = JobCardTask.objects.all()
    serializer_class = JobCardTaskSerializer
    permission_classes = [IsAdminOrOwner]

class JobCardPhotoViewSet(viewsets.ModelViewSet):
    queryset = JobCardPhoto.objects.all()
    serializer_class = JobCardPhotoSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def random_backgrounds(self, request):
        """
        Return random job card photos for use in the dynamic background carousel.
        Limit to 10 images by default.
        """
        limit = int(request.query_params.get('limit', 10))
        
        # Get random photos - prefer "After" photos if caption contains "after"
        photos = JobCardPhoto.objects.filter(
            job_card__status__in=['CLOSED', 'DELIVERY']  # Only from completed/ready jobs
        ).order_by('?')[:limit]
        
        backgrounds = []
        for photo in photos:
            backgrounds.append({
                'id': photo.id,
                'url': request.build_absolute_uri(photo.image.url) if photo.image else None,
                'caption': photo.caption or f"Job #{photo.job_card.job_card_number}"
            })
        
        return Response(backgrounds)

class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrOwner]

class CustomerPortalDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        job_card = get_object_or_404(JobCard, portal_token=token)

        # Build step statuses correctly: completed / active / pending
        step_definitions = [
            ('RECEPTION', 'Step 1: Reception'),
            ('ESTIMATION', 'Step 2: Estimation'),
            ('WORK_ASSIGNMENT', 'Step 3: Assignment'),
            ('WIP', 'Step 4: In Progress'),
            ('QC', 'Step 5: Quality Check'),
            ('INVOICING', 'Step 6: Billing'),
            ('DELIVERY', 'Step 7: Ready for Delivery'),
        ]
        current = job_card.status_index
        steps = []
        for idx, (step_id, label) in enumerate(step_definitions):
            if idx < current:
                step_status = 'completed'
            elif idx == current:
                step_status = 'active'
            else:
                step_status = 'pending'
            steps.append({'id': step_id, 'label': label, 'status': step_status})

        # Build portal data
        data = {
            'job': JobCardSerializer(job_card).data,
            'steps': steps,
            'invoice': None,
            'warranties': []
        }

        # Add invoice details if exists
        if hasattr(job_card, 'invoice'):
            inv = job_card.invoice
            data['invoice'] = {
                'id': inv.id,
                'number': inv.invoice_number,
                'status': inv.payment_status,
                'total': inv.grand_total,
                'signature': inv.signature_data
            }
            
            # Add warranty certificates if exists
            if hasattr(inv, 'ppf_warranty'):
                data['warranties'].append({
                    'type': 'PPF',
                    'id': inv.ppf_warranty.id,
                    'certificate_id': f"PPF-{inv.ppf_warranty.id:05d}"
                })
            
            if hasattr(inv, 'ceramic_warranty'):
                data['warranties'].append({
                    'type': 'Ceramic',
                    'id': inv.ceramic_warranty.id,
                    'certificate_id': f"CW-{inv.ceramic_warranty.id:05d}"
                })

        return Response(data)
