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

def definitive_orm_recreation():
    print("="*60)
    print("ELITE SHINE ERP - DEFINITIVE ORM ACCOUNT RECREATION")
    print("="*60)

    target_usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq.abdullah']
    
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
        
        # A. DELETE EVERYTHING (Using ORM for Cascade)
        try:
            existing_user = User.objects.filter(username=username).first()
            if existing_user:
                # This should handle guardian, profiles, and employees via CASCADE
                existing_user.delete()
                print(f"  - Deleted Existing User & Cascaded Profiles/Permissions")
            
            # Additional cleanup for orphaned employees by ID
            Employee.objects.filter(employee_id__icontains=username.upper().replace('.', '')[:4]).delete()
        except Exception as e:
            print(f"  - Error during delete: {e}")

        # B. CREATE USER
        user = User.objects.create_user(
            username=username, 
            email=f"{username}@eliteshine.com",
            password="EliteShine2025!"
        )
        user.is_active = True
        user.is_staff = True
        user.save()
        print(f"  - Created New User: {user.username} (ID: {user.id})")

        # C. UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.email_verified = True
        profile.save()
        print(f"  - UserProfile verified")

        # D. CREATE EMPLOYEE
        emp = Employee.objects.create(
            user=user,
            employee_id=f"EP-{user.id}-{user.username[:3].upper()}",
            full_name_passport=username.replace('.', ' ').title(),
            role='Team Member',
            department=front_office,
            company=shine,
            branch=main_branch,
            nationality='TBD',
            dob=date(1990, 1, 1),
            passport_no='RECREATION',
            date_joined=date(2025, 1, 1),
            pin_code=str(7000 + user.id).zfill(6), # Safe offset
            is_active=True
        )
        print(f"  - Created Employee: {emp.employee_id}")

        # E. PERMISSIONS
        for mod in ['Attendance', 'Job Cards', 'Operations']:
            ModulePermission.objects.get_or_create(
                employee=emp,
                module_name=mod,
                defaults={'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True}
            )
        print(f"  - Permissions granted")

    print("\n" + "="*60)
    print("ALL ACCOUNTS RECREATED SUCCESSFULLY.")
    print("="*60)

if __name__ == '__main__':
    definitive_orm_recreation()
