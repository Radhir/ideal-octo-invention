import os
import django
import random
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from leads.models import Lead
from hr.models import Employee

def seed_leads():
    print("--- STARTING MULTI-CHANNEL LEAD SEEDING ---")
    
    # 1. Get available employees for assignment
    advisors = list(Employee.objects.all())
    if not advisors:
        print("No advisors found in database. Leads will be unassigned.")
    
    sources = ['INSTAGRAM', 'FACEBOOK', 'WHATSAPP', 'WALKIN', 'REFERRAL', 'WEBSITE']
    services = [
        'Full Body PPF (Gloss)', 'Interior Detailing', 'Ceramic Coating 10H',
        'Window Tinting (Ceramic)', 'Wheels Refurbishment', 'Brake Caliper Painting',
        'Roof Wrap (Carbon Fiber)', 'Full De-Chrome', 'Leather Restoration'
    ]
    names = [
        'Sheikh Mohammed', 'Fatima Al Mansouri', 'James Bond', 'Elon Musk',
        'Sarah Jenkins', 'Ahmed Al Falasi', 'Zayed Rashid', 'Michael Chen',
        'David Miller', 'Linda Thompson', 'Omar Hassan', 'Elena Rodriguez'
    ]
    priorities = ['LOW', 'MEDIUM', 'HIGH', 'HOT']
    statuses = ['NEW', 'CONTACTED', 'NEGOTIATION', 'QUOTED']

    for i in range(20):
        name = random.choice(names)
        source = random.choice(sources)
        service = random.choice(services)
        priority = random.choice(priorities)
        status = random.choice(statuses)
        value = random.randint(500, 25000)
        
        phone = f"+971 5{random.randint(0,9)} {random.randint(100,999)} {random.randint(1000,9999)}"
        email = f"{name.lower().replace(' ', '.')}@example.com"
        
        advisor = random.choice(advisors) if advisors else None
        
        # Randomize creation date over the last 30 days
        created_at = timezone.now() - timedelta(days=random.randint(0, 30))
        
        lead = Lead.objects.create(
            customer_name=name,
            phone=phone,
            email=email,
            source=source,
            interested_service=service,
            priority=priority,
            estimated_value=value,
            assigned_to=advisor,
            status=status,
            notes=f"Simulated lead from {source}. Interested in {service}. High potential customer."
        )
        
        # Override auto_now_add for historical spread
        Lead.objects.filter(id=lead.id).update(created_at=created_at)
        
        print(f"Created {status} Lead: {name} via {source} (AED {value})")

    print(f"\n--- SUCCESSFULLY SEEDED 20 LEADS ---")

if __name__ == '__main__':
    seed_leads()
