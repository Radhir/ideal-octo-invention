from django.db import models
from customers.models import Customer
from job_cards.models import JobCard

class PortalToken(models.Model):
    """Secure token for customer portal access"""
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    last_used = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['token', 'is_active']),
            models.Index(fields=['expires_at']),
        ]
    
    def is_valid(self):
        from django.utils import timezone
        return self.is_active and self.expires_at > timezone.now()

class CustomerPortalActivity(models.Model):
    """Track all customer portal activities"""
    ACTIVITY_TYPES = [
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('JOB_VIEW', 'Job View'),
        ('ESTIMATE_APPROVED', 'Estimate Approved'),
        ('PAYMENT_MADE', 'Payment Made'),
        ('FEEDBACK_SUBMITTED', 'Feedback Submitted'),
        ('BOOKING_CREATED', 'Booking Created'),
    ]
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    details = models.TextField(blank=True)
    job_card = models.ForeignKey(
        JobCard, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['customer', 'timestamp']),
            models.Index(fields=['activity_type']),
        ]

class CustomerFeedback(models.Model):
    """Customer feedback and ratings"""
    RATING_CHOICES = [
        (1, 'Very Poor'),
        (2, 'Poor'),
        (3, 'Average'),
        (4, 'Good'),
        (5, 'Excellent'),
    ]
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=RATING_CHOICES)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_anonymous = models.BooleanField(default=False)
    response = models.TextField(blank=True)  # Management response
    responded_at = models.DateTimeField(null=True, blank=True)
    responded_by = models.ForeignKey(
        'auth.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    class Meta:
        unique_together = ['customer', 'job_card']
        indexes = [
            models.Index(fields=['customer', 'created_at']),
            models.Index(fields=['rating']),
        ]
