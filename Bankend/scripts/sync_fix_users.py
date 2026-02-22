import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.join(os.getcwd(), 'Bankend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee

def sync_and_fix_users():
    # Target profiles based on user request and images
    targets = [
        {'username': 'ankit', 'pattern': 'Ankit'},
        {'username': 'anish', 'pattern': 'Anish'},
        {'username': 'suraj.upadhya', 'pattern': 'Suraj'},
        {'username': 'tamer', 'pattern': 'Tamer'},
        {'username': 'tariq', 'pattern': 'Tariq'},
    ]
    
    password = 'EliteShine2025!'
    
    print("="*60)
    print("RESTORE & SYNC LOGIN ACCOUNTS")
    print("="*60)
    
    for t in targets:
        u_name = t['username']
        p_pattern = t['pattern']
        
        print(f"\nProcessing: {u_name}")
        
        # 1. Ensure User exists and is configured correctly
        user, created = User.objects.get_or_create(username=u_name)
        user.set_password(password)
        user.is_active = True
        user.is_staff = True
        user.save()
        if created:
            print(f"  - User '{u_name}' was created.")
        else:
            print(f"  - User '{u_name}' was updated and password reset.")
            
        # 2. Find matching Employee profile(s)
        # Search by name pattern or existing link
        emps = Employee.objects.filter(full_name_passport__icontains=p_pattern)
        
        if emps.count() == 0:
            print(f"  - WARNING: No Employee profile found containing '{p_pattern}'")
        elif emps.count() == 1:
            emp = emps.first()
            emp.user = user
            emp.save()
            print(f"  - Employee '{emp.full_name_passport}' linked to User '{u_name}'")
        else:
            print(f"  - Multiple employees found for '{p_pattern}'. Linking most recent.")
            emp = emps.order_by('-id').first()
            emp.user = user
            emp.save()
            # Deactivate or handle others if necessary? For now just link one.
            print(f"  - Linked '{emp.full_name_passport}' (ID: {emp.employee_id})")

    print("\n" + "="*60)
    print("SYNC COMPLETE. PLEASE LOG IN WITH 'EliteShine2025!'")
    print("="*60)

if __name__ == '__main__':
    sync_and_fix_users()
