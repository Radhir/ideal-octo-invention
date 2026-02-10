import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee

def check_users():
    print("--- Users ---")
    for u in User.objects.all():
        has_profile = hasattr(u, 'hr_profile')
        print(f"Username: {u.username}, Superuser: {u.is_superuser}, Staff: {u.is_staff}, Has Profile: {has_profile}")
    
    print("\n--- Employees ---")
    for e in Employee.objects.all():
        print(f"Name: {e.full_name}, ID: {e.employee_id}, User: {e.user.username if e.user else 'None'}")

if __name__ == "__main__":
    check_users()
