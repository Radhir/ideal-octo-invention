import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department, Company
from locations.models import Branch

def set_rights(username):
    try:
        user = User.objects.get(username=username)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        print(f"User '{username}' promoted to Superuser.")
        
        # Ensure Employee profile exists with GM role
        profile, created = Employee.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': f"ES-{username.upper()}",
                'role': 'General Manager',
                'date_joined': '2026-01-01',
                'pin_code': '9999'
            }
        )
        if not created:
            profile.role = 'General Manager'
            profile.save()
            print(f"Profile for '{username}' updated to General Manager.")
        else:
            print(f"Profile for '{username}' created as General Manager.")
            
    except User.DoesNotExist:
        print(f"User '{username}' not found. Please create it first.")

if __name__ == "__main__":
    set_rights('ankit')
