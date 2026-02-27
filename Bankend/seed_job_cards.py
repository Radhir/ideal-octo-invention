import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_cards.models import JobCard
from customers.models import Customer
from masters.models import VehicleBrand, VehicleModel, Vehicle
from authentication.models import User

# --- 1. Setup Data Requirements ---

user = User.objects.filter(username='ravit').first()
if not user:
    print("User 'ravit' not found!")
    exit(1)

# Ensure at least one Customer exists
customer, _ = Customer.objects.get_or_create(
    phone='971501234567',
    defaults={
        'name': 'Test Customer',
        'email': 'test@example.com',
    }
)

# Ensure at least one Vehicle brand/model/vehicle exists
brand, _ = VehicleBrand.objects.get_or_create(name='Toyota')
v_model, _ = VehicleModel.objects.get_or_create(brand=brand, name='Camry')
vehicle, _ = Vehicle.objects.get_or_create(
    plate_number='DXB-1234',
    defaults={
        'customer': customer,
        'model': v_model,
        'year': 2023,
        'vin': 'TESTVIN1234567890'
    }
)

print("Setup complete. Creating 10 Job Cards...")

statuses = [
    'IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS', # 3 Operations
    'COMPLETED', 'COMPLETED',                    # 2 Invoiced (COMPLETED state usually)
    'QUALITY_CHECK',                             # 1 Ready (QC state)
    'PENDING', 'PENDING', 'PENDING', 'PENDING'   # 4 Pending
]

payment_statuses = [
    'UNPAID', 'UNPAID', 'UNPAID',     # 3 Operations
    'PAID', 'PAID',                   # 2 Invoiced
    'UNPAID',                         # 1 Ready
    'UNPAID', 'UNPAID', 'UNPAID', 'UNPAID' # 4 Pending
]

for i in range(10):
    JobCard.objects.create(
        customer=customer,
        vehicle=vehicle,
        advisor=user,
        status=statuses[i],
        payment_status=payment_statuses[i],
        estimated_delivery=timezone.now() + timedelta(days=random.randint(1, 5)),
        total_amount=random.randint(500, 5000),
        notes=f"Seed Job Card {i+1} - Status: {statuses[i]}"
    )

print("Successfully created 10 Job Cards.")
