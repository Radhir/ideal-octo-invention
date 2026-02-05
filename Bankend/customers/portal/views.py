from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Sum
from .models import PortalToken, CustomerPortalActivity, CustomerFeedback
from customers.models import Customer
from job_cards.models import JobCard
from invoices.models import Invoice
from bookings.models import Booking
from invoices.serializers import InvoiceSerializer
from bookings.serializers import BookingSerializer as BaseBookingSerializer # Ensure this exists
from .serializers import *
import secrets
from datetime import timedelta
from django.utils import timezone

class CustomerPortalViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def request_access(self, request):
        """Customer requests portal access link via email"""
        email = request.data.get('email')
        phone = request.data.get('phone')
        
        try:
            customer = Customer.objects.get(
                email=email,
                phone=phone
            )
            
            # Generate secure token
            token = secrets.token_urlsafe(32)
            expiry = timezone.now() + timedelta(days=7)
            
            portal_token, created = PortalToken.objects.update_or_create(
                customer=customer,
                defaults={
                    'token': token,
                    'expires_at': expiry,
                    'is_active': True
                }
            )
            
            # Send email with access link
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            access_link = f"{frontend_url}/portal/{token}"
            
            # In production, use send_mail. For now, we print or just return success (dev mode)
            print(f"Access Link for {customer.email}: {access_link}")
            
            # send_mail(
            #     'Your EliteShine Customer Portal Access',
            #     f'Click here to access your customer portal: {access_link}\n\nThis link expires in 7 days.',
            #     settings.DEFAULT_FROM_EMAIL,
            #     [customer.email],
            #     fail_silently=False,
            # )
            
            return Response({
                'message': 'Access link sent to your email',
                'expires_at': expiry,
                'debug_link': access_link # Remove in production
            })
            
        except Customer.DoesNotExist:
            return Response(
                {'error': 'No customer found with provided details'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def verify_token(self, request):
        """Verify portal token and return customer data"""
        token = request.data.get('token')
        
        try:
            portal_token = PortalToken.objects.get(
                token=token,
                is_active=True,
                expires_at__gt=timezone.now()
            )
            
            # Log activity
            # IP address logic simplified
            ip = request.META.get('REMOTE_ADDR')
            
            CustomerPortalActivity.objects.create(
                customer=portal_token.customer,
                activity_type='LOGIN',
                ip_address=ip,
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            serializer = CustomerPortalSerializer(portal_token.customer)
            return Response(serializer.data)
            
        except PortalToken.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired access token'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get customer dashboard statistics"""
        customer_id = request.query_params.get('customer_id')
        customer = get_object_or_404(Customer, id=customer_id)
        
        # Calculate stats
        total_jobs = JobCard.objects.filter(customer_profile=customer).count()
        active_jobs = JobCard.objects.filter(
            customer_profile=customer,
            status__in=['WIP', 'QC', 'INVOICING']
        ).count()
        total_spent = Invoice.objects.filter(
            job_card__customer_profile=customer,
            payment_status='PAID'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Determine active warranties using model property if available, or calc here
        warranties_count = 0
        if hasattr(customer, 'warranties'):
             # Simplistic count if property returns list
             warranties_count = len(customer.warranties)
        
        return Response({
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'total_spent': total_spent,
            'loyalty_points': getattr(customer, 'loyalty_points', 0),
            'warranties_active': warranties_count
        })

class CustomerJobCardViewSet(viewsets.ReadOnlyModelViewSet):
    """Customer view for their job cards"""
    serializer_class = CustomerJobCardSerializer
    permission_classes = [permissions.AllowAny] # In reality should be token protected
    
    def get_queryset(self):
        # We need to filter by customer ID provided in query param or from token context
        # Since we don't have full auth context setup yet for portal, assume query param for now
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            return JobCard.objects.filter(customer_profile_id=customer_id)
        return JobCard.objects.none()
    
    @action(detail=True, methods=['post'])
    def approve_estimate(self, request, pk=None):
        """Customer approves job estimate"""
        job_card = self.get_object()
        
        if job_card.status != 'ESTIMATION':
            return Response(
                {'error': 'Job is not in estimation stage'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job_card.status = 'WORK_ASSIGNMENT'
        job_card.save()
        
        # Create activity log
        CustomerPortalActivity.objects.create(
            customer=job_card.customer_profile,
            activity_type='ESTIMATE_APPROVED',
            details=f'Approved estimate for job #{job_card.id}',
            job_card=job_card
        )
        
        return Response({'message': 'Estimate approved successfully'})
    
    @action(detail=True, methods=['get'])
    def photos(self, request, pk=None):
        """Get job photos"""
        job_card = self.get_object()
        photos = job_card.photos.all()
        serializer = JobPhotoSerializer(photos, many=True)
        return Response(serializer.data)

class CustomerFeedbackViewSet(viewsets.ModelViewSet):
    queryset = CustomerFeedback.objects.all()
    serializer_class = CustomerFeedbackSerializer
    permission_classes = [permissions.AllowAny]

class CustomerInvoiceListView(generics.ListAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            return Invoice.objects.filter(job_card__customer_profile_id=customer_id)
        return Invoice.objects.none()

class CustomerBookingCreateView(generics.CreateAPIView):
    # TODO: Create a proper BookingSerializer
    serializer_class = InvoiceSerializer # Placeholder, ideally BookingSerializer
    permission_classes = [permissions.AllowAny]
