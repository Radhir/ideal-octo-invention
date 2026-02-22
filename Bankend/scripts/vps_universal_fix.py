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

def universal_fix():
    print("="*60)
    print("ELITE SHINE ERP - UNIVERSAL VPS DATA REPAIR")
    print("="*60)

    # 1. Base Data
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

    target_data = [
        {'username': 'ankit', 'full_name': 'Ankit Dhamija', 'role': 'General Manager', 'nationality': 'India', 'dob': '1990-03-31', 'passport': '784-1990-2194620-9', 'emp_id': 'ES-ANKIT-PROD'},
        {'username': 'suraj.upadhya', 'full_name': 'Suraj Upadhya', 'role': 'Service Advisor', 'nationality': 'India', 'dob': '1996-06-23', 'passport': '784-1996-2773435-5', 'emp_id': 'ES-SURAJ-PROD'},
        {'username': 'anish', 'full_name': 'Anish Azeez', 'role': 'Service Advisor', 'nationality': 'India', 'dob': '1985-12-25', 'passport': '784-1985-1946252-1', 'emp_id': 'ES-ANISH-PROD'},
        {'username': 'tamer', 'full_name': 'Tamer Diaaeldin', 'role': 'Branch Manager', 'nationality': 'Egypt', 'passport': '118810490', 'emp_id': 'ES-TAMER-PROD'},
        {'username': 'tariq.abdullah', 'full_name': 'Tariq Abdullah', 'role': 'Accounts', 'nationality': 'Pakistan', 'dob': '1992-01-01', 'passport': 'PAK12345678', 'emp_id': 'ES-TARIQ-PROD'}
    ]

    for data in target_data:
        print(f"\nProcessing: {data['username']}")
        
        # A. Handle User
        user = User.objects.filter(username=data['username']).first()
        if not user:
            user = User.objects.create_user(username=data['username'], email=f"{data['username']}@eliteshine.com")
            print(f"  - Created User: {user.username} (ID: {user.id})")
        else:
            print(f"  - Found Existing User: {user.username} (ID: {user.id})")
        
        user.is_active = True
        user.is_staff = True
        user.set_password("EliteShine2025!")
        user.save()

        # B. Handle UserProfile
        UserProfile.objects.update_or_create(user=user, defaults={'email_verified': True})
        print(f"  - UserProfile verified")

        # C. Handle Employee (Carefully)
        # Search for any employee linked to this user
        emp = Employee.objects.filter(user=user).first()
        if not emp:
            # Maybe an employee exists with the same ID but wrong user?
            emp = Employee.objects.filter(employee_id=data['emp_id']).first()
            if emp:
                print(f"  - Found Employee by ID {emp.employee_id}, re-linking to User {user.id}")
                emp.user = user
            else:
                print(f"  - Creating NEW Employee for User {user.id}")
                emp = Employee(user=user, employee_id=data['emp_id'])
        
        # Update details
        emp.full_name_passport = data['full_name']
        emp.role = data['role']
        emp.nationality = data['nationality']
        emp.dob = data.get('dob', '1990-01-01')
        emp.passport_no = data['passport']
        emp.company = shine
        emp.branch = main_branch
        emp.department = front_office
        emp.is_active = True
        emp.date_joined = date(2025, 1, 1)
        emp.save()
        print(f"  - Employee Profile Synchronized: {emp.employee_id}")

        # D. Permissions
        for mod in ['Attendance', 'Job Cards', 'Operations']:
            ModulePermission.objects.update_or_create(
                employee=emp,
                module_name=mod,
                defaults={'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True}
            )
        print(f"  - Permissions standardizing complete")

    print("\n" + "="*60)
    print("VPS UNIVERSAL DATA REPAIR COMPLETE.")
    print("="*60)

if __name__ == '__main__':
    universal_fix()
