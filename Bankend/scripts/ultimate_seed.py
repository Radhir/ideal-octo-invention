import os
import django
import sys
from django.utils import timezone
from decimal import Decimal
import random

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Company, Department
from job_cards.models import JobCard, Service, ServiceCategory
from locations.models import Branch

def seed_data():
    print("Starting Ultimate Seed...")
    
    # 1. Ensure Company
    company, _ = Company.objects.get_or_create(
        name="EliteShine Car Polish", 
        defaults={'legal_name': 'EliteShine Car Polish Services LLC', 'trn': '100123456789001'}
    )
    
    # 2. Ensure Department
    dept, _ = Department.objects.get_or_create(name="Operations")
    
    # 3. Ensure Branch
    branch, _ = Branch.objects.get_or_create(
        code='MB01',
        defaults={
            'name': 'Main Branch', 
            'address': 'Al Quoz, Dubai', 
            'contact_email': 'info@eliteshine.com', 
            'contact_phone': '041234567'
        }
    )

    # 4. Ensure Admins & Employees
    admin_usernames = ['radhir', 'ankit', 'ravit', 'ruchika', 'afsar']
    
    users = []
    for i, uname in enumerate(admin_usernames):
        user, created = User.objects.get_or_create(
            username=uname,
            defaults={
                'email': f'{uname}@eliteshine.com',
                'first_name': uname.capitalize(),
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            user.set_password('Elite123!')
            user.save()
            print(f"Created user: {uname}")
        users.append(user)
        
        # Ensure Employee Profile
        # pin_code must be unique
        pin = f"{1000 + i}"
        
        Employee.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': f'ES-{uname.upper()}',
                'company': company,
                'department': dept,
                'branch': branch,
                'pin_code': pin,
                'role': 'Owner' if uname == 'radhir' else 'Admin',
                'date_joined': timezone.now().date(),
                'is_active': True
            }
        )

    # 5. Ensure some Services exist
    cat, _ = ServiceCategory.objects.get_or_create(name="Detaling")
    services_data = [
        ("Interior Detailing", 500),
        ("Exterior Polishing", 800),
        ("Ceramic Coating", 2500),
        ("PPF Protection", 15000),
        ("Window Tinting", 1200)
    ]
    for name, price in services_data:
        Service.objects.get_or_create(category=cat, name=name, defaults={'price': Decimal(str(price))})

    # 6. Create 5 Job Cards
    customers = [
        ("Ahmed Al Mansoori", "0501234567"),
        ("Sarah Williams", "0529876543"),
        ("Rajesh Kumar", "0551122334"),
        ("Fatima Bin Zayed", "0564455667"),
        ("John Smith", "0587788990")
    ]
    
    cars = [
        ("Tesla", "Model 3", 2024, "White", "D 12345"),
        ("BMW", "X5", 2023, "Black", "K 54321"),
        ("Mercedes", "G63", 2025, "Matte Grey", "Z 99999"),
        ("Toyota", "Land Cruiser", 2022, "Silver", "A 11111"),
        ("Porsche", "911", 2024, "Guards Red", "P 911")
    ]

    for i in range(5):
        jc_num = f"JC-{1000 + i + random.randint(1, 100)}"
        cust_name, phone = customers[i]
        brand, model, year, color, plate = cars[i]
        
        # Avoid duplicate JC numbers
        while JobCard.objects.filter(job_card_number=jc_num).exists():
            jc_num = f"JC-{ random.randint(1000, 9999)}"

        job = JobCard.objects.create(
            job_card_number=jc_num,
            date=timezone.now().date(),
            customer_name=cust_name,
            phone=phone,
            brand=brand,
            model=model,
            year=year,
            color=color,
            registration_number=plate,
            plate_emirate="Dubai",
            plate_code=plate.split(' ')[0],
            kilometers=random.randint(100, 50000),
            job_description=f"Standard Detail Request for {brand} {model}.",
            total_amount=Decimal("1500.00"),
            vat_amount=Decimal("75.00"),
            net_amount=Decimal("1575.00"),
            status='RECEPTION',
            branch=branch,
            service_advisor=Employee.objects.get(user__username='ravit')
        )
        print(f"Created Job Card: {jc_num} for {cust_name}")

    print("Seeding complete!")

if __name__ == "__main__":
    seed_data()
