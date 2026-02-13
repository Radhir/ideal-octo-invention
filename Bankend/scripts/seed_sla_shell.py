from datetime import date, timedelta
from decimal import Decimal
import random
from contracts.sla.models import ServiceLevelAgreement, SLAMetric, SLAViolation
from customers.models import Customer
from job_cards.models import JobCard
from django.utils import timezone
import traceback

def seed_sla_data():
    print("START: Seeding SLA Compliance data...")
    try:
        commercial_clients = [
            {"name": "ElitePro Trading LLC", "phone": "+971500000001", "type": "CORPORATE", "level": "PLATINUM"},
            {"name": "Dubai Fleet Services", "phone": "+971500000002", "type": "GOVERNMENT", "level": "GOLD"},
            {"name": "Alpha Rental Car", "phone": "+971500000003", "type": "RENTAL", "level": "GOLD"},
            {"name": "Prestige Dealership", "phone": "+971500000004", "type": "DEALERSHIP", "level": "SILVER"},
        ]
        
        today = date.today()
        start_of_current_month = today.replace(day=1)
        
        for client_data in commercial_clients:
            print(f"Processing client: {client_data['name']}")
            customer, created = Customer.objects.get_or_create(
                phone=client_data["phone"],
                defaults={"name": client_data["name"]}
            )
            print(f"Customer {'created' if created else 'found'}: {customer.id}")
            
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
            print(f"SLA {'created' if created else 'found'}: {sla.id}")
            
            for i in range(6, -1, -1):
                m_date = (start_of_current_month - timedelta(days=i*30)).replace(day=1)
                total_jobs = random.randint(20, 50)
                on_time = int(total_jobs * random.uniform(0.85, 0.98))
                avg_time = random.uniform(18.0, 42.0)
                
                metric, m_created = SLAMetric.objects.update_or_create(
                    sla=sla,
                    month=m_date,
                    defaults={
                        "total_jobs": total_jobs,
                        "on_time_completions": on_time,
                        "average_completion_time": Decimal(str(round(avg_time, 2))),
                        "calculated_at": timezone.now()
                    }
                )
                if m_created: print(f"  Metric created for {m_date}")
                
            if random.random() > 0.3:
                # Find a job or create one
                job = JobCard.objects.filter(customer_profile=customer).first()
                if not job:
                    job = JobCard.objects.create(
                        job_card_number=f"JOB-SLA-{random.randint(1000,9999)}",
                        customer_name=customer.name,
                        customer_profile=customer,
                        phone=customer.phone,
                        brand="Toyota", model="Camry", year=2023, color="White", vin=f"TESTVIN{random.randint(100,999)}", kilometers=15000,
                        date=today - timedelta(days=2),
                        status="CLOSED"
                    )
                    print(f"  Job Card created: {job.id}")
                
                violation, v_created = SLAViolation.objects.get_or_create(
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
                if v_created: print(f"  Violation created: {violation.id}")

        print("SUCCESS: SLA Seeding Complete.")
    except Exception as e:
        print(f"ERROR: Error during seeding: {e}")
        traceback.print_exc()

seed_sla_data()
