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

def final_repair():
    print("="*60)
    print("ELITE SHINE ERP - FINAL INFRASTRUCTURE DATA REPAIR")
    print("="*60)

    # Added 'ravit' to the target list
    target_usernames = ['ravit', 'ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq.abdullah']
    
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

    for username in target_usernames:
        print(f"\nProcessing: {username}")
        
        try:
            # A. DELETE & RECREATE (Definitive)
            existing_user = User.objects.filter(username=username).first()
            if existing_user:
                existing_user.delete()
                print(f"  - Resetting existing data for {username}")
            
            # Additional cleanup for orphaned employees
            Employee.objects.filter(employee_id__icontains=username.upper().replace('.', '')[:4]).delete()

            # B. CREATE USER
            user = User.objects.create_user(
                username=username, 
                email=f"{username}@eliteshine.com",
                password="EliteShine2025!"
            )
            user.is_active = True
            user.is_staff = True
            if username == 'ravit':
                user.is_superuser = True
            user.save()
            print(f"  - Created New User: {user.username} (ID: {user.id})")

            # C. UserProfile
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.email_verified = True
            profile.save()

            # D. CREATE EMPLOYEE (Skip for ravit if they are pure superuser, or keep for consistency)
            emp = Employee.objects.create(
                user=user,
                employee_id=f"EP-{user.id}-{user.username[:3].upper()}",
                full_name_passport=username.replace('.', ' ').title(),
                role='Administrator' if username == 'ravit' else 'Team Member',
                department=front_office,
                company=shine,
                branch=main_branch,
                nationality='TBD',
                dob=date(1990, 1, 1),
                passport_no='FINAL-REPAIR',
                date_joined=date(2025, 1, 1),
                pin_code=str(8000 + user.id).zfill(6),
                is_active=True
            )
            print(f"  - Created Employee Profile: {emp.employee_id}")

            # E. PERMISSIONS
            for mod in ['Attendance', 'Job Cards', 'Operations', 'Finance', 'HR', 'Settings']:
                ModulePermission.objects.get_or_create(
                    employee=emp,
                    module_name=mod,
                    defaults={'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True}
                )
            print(f"  - Module Permissions granted")
            
        except Exception as e:
            print(f"  ! Error processing {username}: {e}")

    print("\n" + "="*60)
    print("ALL ACCOUNTS INITIALIZED.")
    print("="*60)

if __name__ == '__main__':
    final_repair()
