import os
import django
from django.utils import timezone
from datetime import timedelta

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from leads.models import Lead
from job_cards.models import JobCard
from pick_and_drop.models import PickAndDrop

def seed_demo():
    print("Seeding Demo Workflow Data...")

    # 1. Create Lead
    lead, _ = Lead.objects.get_or_create(
        customer_name="John Doe",
        phone="+971501234567",
        email="john.doe@example.com",
        source="INSTAGRAM",
        interested_service="Gold Package Detailing - BMW 3 Series",
        budget=1500.00,
        notes="Customer wants deep polishing and interior ceramic coating.",
        status="NEW"
    )
    print(f"Created Lead: {lead}")

    # 2. Create Pick & Drop Schedule (for tomorrow)
    tomorrow = timezone.now() + timedelta(days=1)
    tomorrow = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
    
    trip, _ = PickAndDrop.objects.get_or_create(
        customer_name="John Doe",
        phone="+971501234567",
        vehicle_details="BMW 3 Series Sedan - Grey (Plate: A12345)",
        pickup_location="Downtown Dubai, Mall of Emirates Area",
        drop_off_location="Elite Shine Workshop, Al Quoz",
        scheduled_time=tomorrow,
        driver_name="Sajid (Driver)",
        status="SCHEDULED"
    )
    print(f"Created Pick & Drop Trip: {trip}")

    # 3. Create Job Card
    job_card, _ = JobCard.objects.get_or_create(
        job_card_number="JC-9999",
        date=timezone.now().date(),
        customer_name="John Doe",
        phone="+971501234567",
        registration_number="DXB A 12345",
        vin="WBA3SERIES00998877",
        brand="BMW",
        model="3 Series",
        year=2023,
        color="Grey",
        kilometers=12500,
        job_description="Detailing Gold Package Transfer from Lead. Needs pickup at 10 AM.",
        service_advisor="Admin",
        status="RECEPTION"
    )
    print(f"Created Job Card: {job_card}")

    print("\nDemo Data Seeded Successfully!")

if __name__ == "__main__":
    seed_demo()
