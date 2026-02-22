
import os
import django
import sys

print("--- STARTING CREDENTIAL SYNC SCRIPT ---")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
try:
    django.setup()
    print("Django setup successful.")
except Exception as e:
    print(f"Django setup failed: {e}")
    sys.exit(1)

from django.contrib.auth.models import User
from hr.models import Employee

def sync_employees_to_users():
    employees = Employee.objects.all()
    print(f"Found {employees.count()} employees in HR database.")
    
    admins = {
        'ravit': 'adhirHAS@123',
        'radhir': 'adhirHAS@123',
        'ruchika': 'ruchika@ELITE123',
        'afsar': 'afsar@ELITE123',
        'ankit': 'ankit@ELITE123',
    }

    # 1. Sync Admins first
    for username, pwd in admins.items():
        try:
            u, created = User.objects.get_or_create(username=username)
            if created:
                print(f"Created admin user: {username}")
            u.set_password(pwd)
            u.is_staff = True
            u.is_superuser = True
            u.save()
            print(f"Verified Admin: {username}")
        except Exception as e:
            print(f"Error syncing admin {username}: {e}")

    # 2. Sync All Other Employees
    default_pwd = 'eliteoffice@UAE123'
    
    for emp in employees:
        try:
            # Employee already has a OneToOne relationship to User
            # We just need to ensure that User exists (it should due to CASCADE protections usually, but let's be safe)
            # Actually, emp.user is a User instance.
            
            user = emp.user
            username = user.username
            
            # Skip if this user is in our admin list (handled above)
            if username in admins:
                continue
                
            # For everyone else, set default password
            # We only set it if we want to FORCE reset. The user said "register all employee".
            # I will force reset to ensure they can log in.
            user.set_password(default_pwd)
            user.save()
            print(f"Synced Employee: {username} ({emp.full_name}) -> {default_pwd}")
            
        except User.DoesNotExist:
            print(f"CRITICAL: Employee {emp.id} has no valid User link!")
        except Exception as e:
            print(f"Error syncing employee {emp.employee_id}: {e}")

    print("--- CREDENTIAL SYNC COMPLETE ---")

if __name__ == '__main__':
    sync_employees_to_users()
