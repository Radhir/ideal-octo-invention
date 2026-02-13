import os
import django
import sys

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from hr.models import Employee

User = get_user_model()

def list_users():
    print(f"Total users: {User.objects.count()}")
    users = User.objects.all()[:20]
    for user in users:
        print(f"User: {user.username} (ID: {user.id})")
        try:
            employee = Employee.objects.get(user=user)
            print(f"  Employee ID: {employee.employee_id}")
        except Employee.DoesNotExist:
            print("  No Employee profile found")

if __name__ == "__main__":
    list_users()
