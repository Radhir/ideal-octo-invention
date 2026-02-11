import os
import django
import sys

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from hr.models import Employee

User = get_user_model()

def search_users(query):
    print(f"Searching for users with '{query}' in username, first_name, or last_name...")
    users = User.objects.filter(username__icontains=query) | \
            User.objects.filter(first_name__icontains=query) | \
            User.objects.filter(last_name__icontains=query)
            
    for user in users:
        print(f"User: {user.username} (ID: {user.id})")
        try:
            employee = Employee.objects.get(user=user)
            print(f"  Employee ID: {employee.employee_id}")
        except Employee.DoesNotExist:
            print("  No Employee profile found")

if __name__ == "__main__":
    search_users("noman")
