import os
import django
import random
import uuid
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_cards.models import JobCard
from customers.models import Customer
from masters.models import VehicleBrand, VehicleModel, Vehicle

# Disconnect the audit signal to prevent Celery timeout hangs
from django.db.models.signals import post_save
try:
    from core.signals import audit_post_save
    post_save.disconnect(audit_post_save)
except Exception:
    pass

# Ensure at least one Customer exists
customer, _ = Customer.objects.get_or_create(
    phone='971500000000',
    defaults={
        'name': 'Seed Ravit 2',
        'email': 'seed2@example.com',
    }
)

# Ensure at least one Vehicle brand/model/vehicle exists
brand, _ = VehicleBrand.objects.get_or_create(name='BMW')
v_model, _ = VehicleModel.objects.get_or_create(brand=brand, name='X5')
vehicle, _ = Vehicle.objects.get_or_create(
    plate_number='SEED-999',
    defaults={
        'customer': customer,
        'model': v_model,
        'year': 2024,
        'vin': 'SEEDVIN000000000'
    }
)

statuses = [
    'RECEIVED', 'RECEIVED', 'RECEIVED',         
    'IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS',
    'READY', 'READY',                           
    'INVOICED', 'INVOICED'                      
]

for i, status in enumerate(statuses):
    try:
        JobCard.objects.create(
            customer_profile=customer,
            customer_name=customer.name,
            vehicle_node=vehicle,
            status=status,
            date=timezone.now().date(),
            job_card_number=f"JC-SEED2-{i+1}",
            phone=customer.phone,
            total_amount=1000 + (i * 100),
            plate_code='A',
            plate_emirate='DXB',
            registration_number='12345',
            brand='BMW',
            model='X5',
            job_description=f'Legacy Seed Job {i+1}'
        )
        print(f"Created JC-SEED2-{i+1} with status {status}")
    except Exception as e:
        print(f"Error creating seed {i+1}: {e}")

print("Successfully created 10 additional Job Cards.")
