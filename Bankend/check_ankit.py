import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, ModulePermission

def check_user(username):
    try:
        user = User.objects.get(username=username)
        print(f"User: {user.username}")
        print(f"Is Superuser: {user.is_superuser}")
        print(f"Is Staff: {user.is_staff}")
        
        try:
            emp = user.hr_profile
            print(f"Employee ID: {emp.employee_id}")
            print(f"Role: {emp.role}")
            print(f"Permissions Config: {emp.permissions_config}")
            
            perms = ModulePermission.objects.filter(employee=emp)
            print(f"Module Permissions: {[p.module_name for p in perms]}")
        except Employee.DoesNotExist:
            print("No HR Employee profile found.")
            
    except User.DoesNotExist:
        print(f"User '{username}' does not exist.")

if __name__ == "__main__":
    check_user('ankit')
