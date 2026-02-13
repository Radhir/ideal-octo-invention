from datetime import date, timedelta
from decimal import Decimal
import random
from contracts.sla.models import ServiceLevelAgreement, SLAMetric
from customers.models import Customer
from django.utils import timezone

def seed_sla_minimal():
    print("START: Minimal SLA Seeding...")
    try:
        commercial_clients = [
            {"name": "ElitePro Trading LLC", "phone": "+971500000001", "type": "CORPORATE", "level": "PLATINUM"},
            {"name": "Dubai Fleet Services", "phone": "+971500000002", "type": "GOVERNMENT", "level": "GOLD"},
        ]
        
        today = date.today()
        start_of_current_month = today.replace(day=1)
        
        for client_data in commercial_clients:
            print(f"Client: {client_data['name']}")
            customer, _ = Customer.objects.get_or_create(
                phone=client_data["phone"],
                defaults={"name": client_data["name"]}
            )
            
            sla, created = ServiceLevelAgreement.objects.get_or_create(
                agreement_number=f"SLA-MIN-{client_data['name'][:3].upper()}",
                defaults={
                    "customer": customer,
                    "agreement_type": client_data["type"],
                    "start_date": today - timedelta(days=100),
                    "end_date": today + timedelta(days=100),
                    "service_level": client_data["level"],
                    "standard_response_time": 24,
                    "resolution_time": 48,
                    "service_credit_percentage": Decimal("5.00"),
                    "min_service_credit": Decimal("100.00"),
                    "is_active": True
                }
            )
            
            # Historical Metrics
            for i in range(3, -1, -1):
                m_date = (start_of_current_month - timedelta(days=i*30)).replace(day=1)
                SLAMetric.objects.update_or_create(
                    sla=sla,
                    month=m_date,
                    defaults={
                        "total_jobs": 10,
                        "on_time_completions": 9,
                        "average_completion_time": Decimal("24.5"),
                        "calculated_at": timezone.now()
                    }
                )
        print("SUCCESS: Minimal SLA Seeding Complete.")
    except Exception as e:
        print(f"ERROR: {e}")

seed_sla_minimal()
