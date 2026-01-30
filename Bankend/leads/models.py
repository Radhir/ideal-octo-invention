from django.db import models

class Lead(models.Model):
    SOURCE_CHOICES = [
        ('INSTAGRAM', 'Instagram'),
        ('FACEBOOK', 'Facebook'),
        ('WHATSAPP', 'WhatsApp'),
        ('GMAIL', 'Gmail'),
        ('COBONE', 'Cobone'),
        ('GROUPON', 'Groupon'),
        ('TABBY', 'Tabby'),
        ('WALKIN', 'Walk-in'),
        ('REFERENCE', 'Reference / Referral'),
        ('WEBSITE', 'Website'),
        ('EXISTING', 'Existing Customer'),
    ]
    STATUS_CHOICES = [
        ('INBOX', 'Inbox / Ghost'),
        ('NEW', 'New Lead'),
        ('CONTACTED', 'First Contact'),
        ('NEGOTIATION', 'Negotiation'),
        ('QUOTED', 'Quote Sent'),
        ('CONVERTED', 'Converted'),
        ('LOST', 'Lost'),
    ]
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('HOT', 'Hot / Immediate'),
    ]
    
    customer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES)
    interested_service = models.CharField(max_length=255)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    estimated_value = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    assigned_to = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_leads')
    customer_profile = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    follow_up_date = models.DateField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='NEW')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer_name} ({self.status})"

class LeadPhoto(models.Model):
    lead = models.ForeignKey(Lead, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='lead_photos/')
    caption = models.CharField(max_length=50, blank=True) # e.g., 'Front', 'Damage'
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for {self.lead.customer_name} - {self.caption}"
