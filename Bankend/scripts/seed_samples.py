import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_cards.models import JobCard
from invoices.models import Invoice
from bookings.models import Booking
from leads.models import Lead
from ppf_warranty.models import PPFWarrantyRegistration
from ceramic_warranty.models import CeramicWarrantyRegistration
from stock.models import StockForm
from leaves.models import LeaveApplication
from service_requests.models import RequestForm
from checklists.models import Checklist
from operations.models import Operation

def seed():
    today = timezone.now().date()
    
    # Use unique IDs to avoid integrity errors on re-runs
    suffix = timezone.now().strftime("%H%M%S")

    # 1. Create a Job Card (Reception Stage)
    j1, _ = JobCard.objects.get_or_create(
        job_card_number=f"JC-SEED-{suffix}-1",
        defaults={
            'customer_name': "John Wick",
            'phone': "+971 55 111 2222",
            'brand': "Mercedes",
            'model': "G63 AMG",
            'year': 2024,
            'color': "Matte Black",
            'registration_number': f"D {suffix}",
            'kilometers': 10,
            'status': 'RECEPTION',
            'date': today
        }
    )
    print(f"Created Job Card: {j1.job_card_number}")

    # 2. Create a Job Card (Closed Stage)
    j2, _ = JobCard.objects.get_or_create(
        job_card_number=f"JC-SEED-{suffix}-2",
        defaults={
            'customer_name': "Bruce Wayne",
            'phone': "+971 55 333 4444",
            'brand': "Lucid",
            'model': "Air Sapphire",
            'year': 2024,
            'color': "Blue",
            'registration_number': f"G {suffix}",
            'kilometers': 5000,
            'status': 'CLOSED',
            'date': today,
            'total_amount': 12000,
            'vat_amount': 600,
            'net_amount': 12600
        }
    )
    print(f"Created Closed Job Card: {j2.job_card_number}")

    # 3. Create an Invoice for the Closed Job
    inv, _ = Invoice.objects.get_or_create(
        invoice_number=f"INV-SEED-{suffix}",
        defaults={
            'job_card': j2,
            'date': today,
            'customer_name': j2.customer_name,
            'items': "Full Car PPF - 10 Year Warranty|1|12000",
            'total_amount': 12000,
            'vat_amount': 600,
            'grand_total': 12600,
            'payment_status': 'PAID'
        }
    )
    print(f"Created Invoice: {inv.invoice_number}")

    # 4. Create a PPF Warranty linked to the Invoice
    ppf, _ = PPFWarrantyRegistration.objects.get_or_create(
        invoice=inv,
        defaults={
            'full_name': j2.customer_name,
            'contact_number': j2.phone,
            'email': "bruce@wayne.com",
            'vehicle_brand': j2.brand,
            'vehicle_model': j2.model,
            'vehicle_year': j2.year,
            'vehicle_color': j2.color,
            'license_plate': j2.registration_number,
            'vin': f"VIN{suffix}BAT",
            'installation_date': today,
            'branch_location': 'DXB',
            'film_brand': "Elite Pro",
            'film_type': 'GLOSS',
            'coverage_area': "Full Car"
        }
    )
    print(f"Created PPF Warranty for {ppf.full_name}")

    # 5. Create a Booking
    b, _ = Booking.objects.get_or_create(
        customer_name=f"Tony Stark {suffix}",
        defaults={
            'phone': "+971 50 777 8888",
            'vehicle_details': "Audi R8",
            'service_type': "Ceramic Coating",
            'booking_date': today + timedelta(days=1),
            'booking_time': "10:00:00",
            'status': 'PENDING'
        }
    )
    print(f"Created Booking for {b.customer_name}")

    # 6. Create a Lead
    lead, _ = Lead.objects.get_or_create(
        phone=f"+971 44 {suffix}",
        defaults={
            'customer_name': "Peter Parker",
            'source': "INSTAGRAM",
            'interested_service': "Window Tinting",
            'status': 'NEW'
        }
    )
    print(f"Created Lead: {lead.customer_name}")

    print("\n--- ALL SAMPLES SEEDED SUCCESSFULLY ---")

if __name__ == '__main__':
    seed()
