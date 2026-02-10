import os
import django
import sys
import uuid
from decimal import Decimal
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_cards.models import JobCard

# Check for existing
if JobCard.objects.exists():
    jc = JobCard.objects.first()
    print(f"{jc.job_card_number} | {jc.portal_token}")
else:
    # Create Dummy
    jc = JobCard.objects.create(
        job_card_number="TEST-LIVE-001",
        customer_name="Elite Client",
        brand="Porsche",
        model="911 GT3",
        year=2024,
        color="Shark Blue",
        kilometers=5000,
        phone="0501234567",
        vin="TESTVIN123456",
        registration_number="DXB-TEST",
        status="WIP",
        date=timezone.now().date(),
        job_description="Full Ceramic Coating & PPF Application",
        total_amount=Decimal("15000.00"),
        net_amount=Decimal("15750.00"),
        vat_amount=Decimal("750.00")
    )
    print(f"{jc.job_card_number} | {jc.portal_token}")
