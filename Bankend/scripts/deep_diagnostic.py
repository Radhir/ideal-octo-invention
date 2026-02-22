import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.join(os.getcwd(), 'Bankend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Company, Branch, Department
from authentication.models import UserProfile

def deep_diagnostic():
    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq']
    
    # Check if we have at least one branch and company
    comp = Company.objects.first()
    branch = Branch.objects.first()
    dept = Department.objects.get_or_create(name='Front Office')[0]
    
    print("="*60)
    print("ELITE SHINE ERP - DEEP RELATIONSHIP AUDIT")
    print("="*60)
    print(f"Global Defaults: Company={comp}, Branch={branch}, Dept={dept}")
    
    for u in usernames:
        print(f"\nUser: {u}")
        try:
            user = User.objects.get(username=u)
            print(f"  - User ID: {user.id}")
            
            # 1. HR Profile (Employee)
            try:
                emp = user.hr_profile
                print(f"  - Employee ID: {emp.employee_id}")
                print(f"  - Emp Branch: {emp.branch}")
                print(f"  - Emp Company: {emp.company}")
                print(f"  - Emp Dept: {emp.department}")
                
                # Auto-fix if missing
                fixed = False
                if not emp.branch and branch:
                    emp.branch = branch
                    fixed = True
                if not emp.company and comp:
                    emp.company = comp
                    fixed = True
                if fixed:
                    emp.save()
                    print(f"    [FIXED] Assigned missing Branch/Company to Employee.")
            except Employee.DoesNotExist:
                print("  - WARNING: NO HR_PROFILE (Employee) found for this user!")
                
            # 2. Auth Profile (UserProfile)
            profile, created = UserProfile.objects.get_or_create(user=user)
            if created:
                print(f"  - UserProfile created for {u}")
            
            profile.email_verified = True # Force verify for login
            profile.save()
            print(f"  - UserProfile verified: {profile.email_verified}")

        except User.DoesNotExist:
            print("  - Status: USER NOT FOUND")

    print("\n" + "="*60)
    print("AUDIT AND AUTO-FIX COMPLETE")
    print("="*60)

if __name__ == '__main__':
    deep_diagnostic()
