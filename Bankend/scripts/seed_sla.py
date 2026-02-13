import os
import django
import sys
from datetime import date, timedelta
from decimal import Decimal
import random

# Setup Django
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from contracts.sla.models import ServiceLevelAgreement, SLAMetric, SLAViolation
from customers.models import Customer
from job_cards.models import JobCard
from django.utils import timezone

def seed_sla_data():
    print("🚀 Seeding SLA Compliance data...")
    
    # 1. Get or Create Commercial Customers
    commercial_clients = [
        {"name": "ElitePro Trading LLC", "phone": "+971500000001", "type": "CORPORATE", "level": "PLATINUM"},
        {"name": "Dubai Fleet Services", "phone": "+971500000002", "type": "GOVERNMENT", "level": "GOLD"},
        {"name": "Alpha Rental Car", "phone": "+971500000003", "type": "RENTAL", "level": "GOLD"},
        {"name": "Prestige Dealership", "phone": "+971500000004", "type": "DEALERSHIP", "level": "SILVER"},
    ]
    
    today = date.today()
    start_of_current_month = today.replace(day=1)
    
    for client_data in commercial_clients:
        customer, _ = Customer.objects.get_or_create(
            phone=client_data["phone"],
            defaults={"name": client_data["name"]}
        )
        
        # 2. Create SLA
        sla, created = ServiceLevelAgreement.objects.get_or_create(
            agreement_number=f"SLA-{client_data['name'][:3].upper()}-2024",
            defaults={
                "customer": customer,
                "agreement_type": client_data["type"],
                "start_date": today - timedelta(days=365),
                "end_date": today + timedelta(days=365),
                "service_level": client_data["level"],
                "standard_response_time": 4 if client_data["level"] == "PLATINUM" else 24,
                "resolution_time": 24 if client_data["level"] == "PLATINUM" else 48,
                "service_credit_percentage": Decimal("10.00"),
                "min_service_credit": Decimal("250.00"),
                "monthly_retainer": Decimal("5000.00") if client_data["level"] == "PLATINUM" else Decimal("1500.00"),
                "is_active": True
            }
        )
        
        # 3. Create Historical Metrics (Last 6 Months)
        for i in range(6, -1, -1):
            m_date = (start_of_current_month - timedelta(days=i*30)).replace(day=1)
            
            # Generate plausible random performance
            total_jobs = random.randint(20, 50)
            on_time = int(total_jobs * random.uniform(0.85, 0.98))
            avg_time = random.uniform(18.0, 42.0)
            
            SLAMetric.objects.update_or_create(
                sla=sla,
                month=m_date,
                defaults={
                    "total_jobs": total_jobs,
                    "on_time_completions": on_time,
                    "average_completion_time": Decimal(str(round(avg_time, 2))),
                    "calculated_at": timezone.now()
                }
            )
            
        # 4. Create Recent Violations
        if random.random() > 0.5:
            # Create a mock job for the violation
            job = JobCard.objects.filter(customer_profile=customer).first()
            if not job:
                # Create one if missing
                job = JobCard.objects.create(
                    job_card_number=f"JOB-SLA-{random.randint(1000,9999)}",
                    customer_name=customer.name,
                    customer_profile=customer,
                    phone=customer.phone,
                    brand="Toyota", model="Camry", year=2023, color="White", vin="TESTVIN123", kilometers=15000,
                    date=today - timedelta(days=2),
                    status="CLOSED"
                )
            
            SLAViolation.objects.get_or_create(
                job_card=job,
                sla=sla,
                violation_type='RESOLUTION_TIME',
                defaults={
                    "violation_date": timezone.now() - timedelta(days=random.randint(1, 5)),
                    "expected_time": sla.resolution_time,
                    "actual_time": sla.resolution_time + 12,
                    "time_exceeded": 12,
                    "description": f"Resolution SLA breached for critical repair on job {job.job_card_number}.",
                    "service_credit_amount": Decimal("500.00"),
                    "is_acknowledged": False
                }
            )

    print("✅ SLA Seeding Complete.")

if __name__ == "__main__":
    seed_sla_data()
