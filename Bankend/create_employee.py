import os
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee
from django.utils import timezone
import random

def create_employee_for_radhir():
    try:
        user = User.objects.get(username='radhir')
        print(f"Found user: {user.username}")
        
        # Check if employee already exists
        if hasattr(user, 'hr_profile'):
            print(f"Employee already exists: {user.hr_profile}")
            return
        
        # Generate unique ID
        emp_id = f"ES{random.randint(1000, 9999)}"
        pin = str(random.randint(100000, 999999))
        
        # Create employee
        emp = Employee.objects.create(
            user=user,
            employee_id=emp_id,
            pin_code=pin,
            role='Administrator',
            date_joined=timezone.now().date(),
            is_active=True,
        )
        print(f"✅ Created Employee: {emp.employee_id} - {user.username}")
        print(f"   PIN Code: {pin}")
        
    except User.DoesNotExist:
        print("❌ User 'radhir' not found")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_employee_for_radhir()
