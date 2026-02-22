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

def surgical_repair():
    print("="*60)
    print("ELITE SHINE ERP - SURGICAL VPS REPAIR")
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
        
        # A. Find/Fix User
        user = User.objects.filter(username=username).first()
        if not user:
            user = User.objects.create_user(username=username, email=f"{username}@eliteshine.com")
            print(f"  - Created User ID: {user.id}")
        else:
            print(f"  - Found User ID: {user.id}")
        
        user.is_active = True
        user.is_staff = True
        user.set_password("EliteShine2025!")
        user.save()

        # B. UserProfile
        UserProfile.objects.update_or_create(user=user, defaults={'email_verified': True})

        # C. SURGERY: Delete any employee record tied to this user OR this username-based ID
        bad_emp_ids = [f"ES-{username.upper()}-PROD", f"ES-{username.upper()}-1", f"ES-{username.upper().replace('.', '')[:5]}"]
        Employee.objects.filter(user=user).delete()
        Employee.objects.filter(employee_id__in=bad_emp_ids).delete()
        print(f"  - Cleared existing/conflicting employee records")

        # D. Create Clean Employee
        emp = Employee.objects.create(
            user=user,
            employee_id=f"E-{user.username.upper().replace('.', '')[:5]}",
            full_name_passport=username.replace('.', ' ').title(),
            role='Team Member',
            department=front_office,
            company=shine,
            branch=main_branch,
            nationality='TBD',
            dob=date(1990, 1, 1),
            passport_no='TBD',
            date_joined=date(2025, 1, 1),
            pin_code=str(1000 + user.id).zfill(6), # Guaranteed unique based on ID
            is_active=True
        )
        print(f"  - Created Clean Employee: {emp.employee_id} (PIN: {emp.pin_code})")

        # E. Permissions
        for mod in ['Attendance', 'Job Cards', 'Operations']:
            ModulePermission.objects.update_or_create(
                employee=emp,
                module_name=mod,
                defaults={'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True}
            )
        print(f"  - Permissions granted")

    print("\n" + "="*60)
    print("SURGICAL REPAIR COMPLETE.")
    print("="*60)

if __name__ == '__main__':
    surgical_repair()
