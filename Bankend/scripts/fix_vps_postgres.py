import os
import django
import sys
from datetime import date

# Set up Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department, Company, ModulePermission
from locations.models import Branch
from authentication.models import UserProfile
from job_cards.models import JobCard
from django.db import transaction

def fix_all():
    print("="*60)
    print("ELITE SHINE ERP - COMPREHENSIVE FIX (POSTGRES COMPATIBLE)")
    print("="*60)

    # 1. Setup Base Data
    with transaction.atomic():
        shine, _ = Company.objects.get_or_create(name="Elite Shine", defaults={'trn': '100XXXXXXXXXXXX'})
        main_branch, _ = Branch.objects.get_or_create(
            name="Elite Shine Main", 
            defaults={
                'code': 'DXB-001', 
                'is_head_office': True,
                'address': 'Dubai, UAE',
                'contact_email': 'info@eliteshine.com',
                'contact_phone': '0500000000'
            }
        )
        front_office, _ = Department.objects.get_or_create(name="Front Office")

        employees_to_fix = [
            {
                'username': 'ankit',
                'full_name': 'Ankit Dhamija',
                'role': 'General Manager',
                'nationality': 'India',
                'dob': '1990-03-31',
                'passport': '784-1990-2194620-9',
                'emp_id': 'ES-ANKIT-1'
            },
            {
                'username': 'suraj.upadhya',
                'full_name': 'Suraj Upadhya',
                'role': 'Service Advisor',
                'nationality': 'India',
                'dob': '1996-06-23',
                'passport': '784-1996-2773435-5',
                'emp_id': 'ES-SURAJ-1'
            },
            {
                'username': 'anish',
                'full_name': 'Anish Anandhankattuparambil Azeez',
                'role': 'Service Advisor',
                'nationality': 'India',
                'dob': '1985-12-25',
                'passport': '784-1985-1946252-1',
                'emp_id': 'ES-ANISH-1'
            },
            {
                'username': 'tamer',
                'full_name': 'Tamer Diaaeldin Mohamed Fahmy Ahmed Farag',
                'role': 'Branch Manager',
                'nationality': 'Egypt',
                'passport': '118810490',
                'emp_id': 'ES-TAMER-1'
            },
            {
                'username': 'tariq.abdullah',
                'full_name': 'Tariq Abdullah',
                'role': 'Accounts',
                'nationality': 'Pakistan',
                'dob': '1992-01-01',
                'passport': 'PAK12345678',
                'emp_id': 'ES-TARIQ-1'
            }
        ]

        # Modules to grant permission
        modules = ['Attendance', 'Job Cards', 'Operations']

        for data in employees_to_fix:
            print(f"\nProcessing User: {data['username']}")
            
            # A. User Creation/Update
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={'email': f"{data['username']}@eliteshine.com", 'is_active': True, 'is_staff': True}
            )
            user.is_active = True
            user.is_staff = True
            user.set_password("EliteShine2025!")
            user.save()
            print(f"  - User ready (Created: {created})")

            # B. UserProfile Verification
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.email_verified = True
            profile.save()
            print(f"  - UserProfile verified")

            # C. Employee Profile Linking
            emp, emp_created = Employee.objects.get_or_create(
                user=user,
                defaults={
                    'employee_id': data['emp_id'],
                    'full_name_passport': data['full_name'],
                    'department': front_office,
                    'company': shine,
                    'branch': main_branch,
                    'role': data['role'],
                    'nationality': data['nationality'],
                    'dob': data['dob'],
                    'passport_no': data['passport'],
                    'date_joined': date(2025, 1, 1)
                }
            )
            
            # Explicit update to ensure latest data
            emp.full_name_passport = data['full_name']
            emp.nationality = data['nationality']
            emp.dob = data['dob']
            emp.passport_no = data['passport']
            emp.branch = main_branch
            emp.company = shine
            emp.is_active = True
            emp.save()
            print(f"  - Employee profile linked/updated")

            # D. Grant Permissions
            for mod in modules:
                ModulePermission.objects.get_or_create(
                    employee=emp,
                    module_name=mod,
                    defaults={'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True}
                )
            print(f"  - Permissions granted: {', '.join(modules)}")

            # E. Create Test Job Cards
            for i in range(1, 3):
                job_num = f"V-TEST-{data['username'].split('.')[0].upper()}-{i}"
                JobCard.objects.get_or_create(
                    job_card_number=job_num,
                    defaults={
                        'date': date.today(),
                        'customer_name': f"Test Customer {i}",
                        'phone': "0500000000",
                        'brand': "Test Brand",
                        'model': "Test Model",
                        'year': 2025,
                        'service_advisor': emp,
                        'branch': main_branch,
                        'status': 'RECEIVED',
                        'kilometers': 100 * i
                    }
                )
            print(f"  - 2 Test Job Cards created/verified")

    print("\n" + "="*60)
    print("ALL FIXES APPLIED SUCCESSFULLY.")
    print("="*60)

if __name__ == '__main__':
    fix_all()
