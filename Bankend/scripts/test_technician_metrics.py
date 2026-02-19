import os
import django
from decimal import Decimal
from datetime import date
import sys

# Add project root to path
sys.path.append('/app')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee
from job_cards.models import JobCard
from django.contrib.auth.models import User
from django.db.models import Count, Sum, Q

def run():
    print("Setting up test data for Technician Metrics...")
    
    # Create Tech
    user, _ = User.objects.get_or_create(username='test_tech_user')
    tech, _ = Employee.objects.get_or_create(
        employee_id='TECH-001',
        defaults={
            'user': user,
            'full_name_passport': 'Test Technician',
            'basic_salary': Decimal('5000.00'),
            'role': 'Technician',
            'pin_code': '888888',
            'date_joined': date(2023, 1, 1),
        }
    )
    
    # Clean up previous test data
    JobCard.objects.filter(assigned_technician=tech).delete()
    
    print("Creating Job Cards...")
    # Job 1: Closed, High Revenue, QC Passed
    JobCard.objects.create(
        job_card_number='JC-TEST-001',
        status='CLOSED',
        date=date.today(),
        customer_name='Test Customer 1',
        phone='0000000000',
        vin='VIN123',
        brand='Toyota',
        model='Camry',
        year=2022,
        color='White',
        kilometers=10000,
        job_description='Test Job 1',
        assigned_technician=tech,
        net_amount=Decimal('1000.00'),
        qc_sign_off=True
    )
    
    # Job 2: Closed, Lower Revenue, QC Failed (or not signed off)
    JobCard.objects.create(
        job_card_number='JC-TEST-002',
        status='CLOSED',
        date=date.today(),
        customer_name='Test Customer 2',
        phone='0000000000',
        vin='VIN456',
        brand='Honda',
        model='Civic',
        year=2021,
        color='Black',
        kilometers=20000,
        job_description='Test Job 2',
        assigned_technician=tech,
        net_amount=Decimal('500.00'),
        qc_sign_off=False
    )
    
    # Job 3: In Progress (Should not count)
    JobCard.objects.create(
        job_card_number='JC-TEST-003',
        status='IN_PROGRESS',
        date=date.today(),
        customer_name='Test Customer 3',
        phone='0000000000',
        vin='VIN789',
        brand='Ford',
        model='Mustang',
        year=2023,
        color='Red',
        kilometers=5000,
        job_description='Test Job 3',
        assigned_technician=tech,
        net_amount=Decimal('2000.00'), # High amount but shouldn't count
        qc_sign_off=False
    )
    
    print("Verifying Metrics...")
    
    # Replicating view logic
    stats = JobCard.objects.filter(status='CLOSED', assigned_technician=tech).aggregate(
        total_jobs=Count('id'),
        total_revenue=Sum('net_amount'),
        qc_passes=Count('id', filter=Q(qc_sign_off=True))
    )
    
    print(f"Stats: {stats}")
    
    expected_jobs = 2
    expected_revenue = Decimal('1500.00')
    expected_qc_passes = 1
    
    if (stats['total_jobs'] == expected_jobs and 
        stats['total_revenue'] == expected_revenue and 
        stats['qc_passes'] == expected_qc_passes):
        
        pass_rate = (stats['qc_passes'] / stats['total_jobs'] * 100)
        print(f"SUCCESS: Metrics match. Jobs: {stats['total_jobs']}, Revenue: {stats['total_revenue']}, QC Pass Rate: {pass_rate}%")
    else:
        print("FAILURE: Metrics do not match expected values.")

if __name__ == '__main__':
    run()
