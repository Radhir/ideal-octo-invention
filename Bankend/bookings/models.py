from django.db import models
from locations.models import Branch

class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Confirmation'),
        ('CONFIRMED', 'Confirmed'),
        ('ARRIVED', 'Vehicle Arrived'),
        ('CANCELLED', 'Cancelled'),
        ('NOSHOW', 'No Show'),
    ]
    
    customer_name = models.CharField(max_length=255)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    customer_profile = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    phone = models.CharField(max_length=20)
    v_registration_no = models.CharField(max_length=50, blank=True, null=True)
    vehicle_details = models.CharField(max_length=255, blank=True, null=True)
    
    # Linked to industrial Catalog
    service_category = models.ForeignKey('job_cards.ServiceCategory', on_delete=models.SET_NULL, null=True, blank=True)
    service = models.ForeignKey('job_cards.Service', on_delete=models.SET_NULL, null=True, blank=True)
    
    booking_date = models.DateField()
    booking_time = models.TimeField()
    
    # Linked to HR
    advisor = models.ForeignKey('hr.Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='advisor_bookings')
    
    # Linked to CRM
    related_lead = models.ForeignKey('leads.Lead', on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    
    estimated_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    notes = models.TextField(blank=True)
    signature_data = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} - {self.booking_date} ({self.status})"
    
    def convert_to_job_card(self):
        from job_cards.models import JobCard
        import datetime
        
        # Unique Serial Logic: JC-YYYYMMDD-COUNT
        today = datetime.date.today()
        count = JobCard.objects.filter(date=today).count() + 1
        jc_no = f"JC-{today.strftime('%Y%m%d')}-{count:03d}"
        
        # Mapping Booking -> Job Card
        total_net = float(self.estimated_total)
        vat_amt = round(total_net * 0.05, 2)
        gross_total = total_net + vat_amt

        jc = JobCard.objects.create(
            job_card_number=jc_no,
            date=today,
            customer_name=self.customer_name,
            phone=self.phone,
            registration_number=self.v_registration_no,
            brand=self.vehicle_details.split(' ')[0] if ' ' in self.vehicle_details else "General",
            model=self.vehicle_details,
            year=today.year,
            color="Not Specified",
            kilometers=0,
            service_advisor=self.advisor.full_name if self.advisor else "Walk-in",
            job_description=f"Pre-booked Service: {self.service_category.name if self.service_category else 'General Maintenance'}\nBooking ID: {self.id}\nNotes: {self.notes}",
            total_amount=total_net,
            vat_amount=vat_amt,
            net_amount=gross_total,
            balance_amount=gross_total,
            branch=self.branch,
            custom_fields={},
            # New Links
            related_booking=self,
            related_lead=self.related_lead
        )
        
        # Update Statuses
        self.status = 'ARRIVED'
        self.save()
        
        if self.related_lead:
            self.related_lead.status = 'CONVERTED'
            self.related_lead.save()
            
        return jc
