import os
import django
import sys
from django.utils import timezone
from datetime import timedelta

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from hr.models import Employee

User = get_user_model()

def find_recent_users():
    # 2 days ago to be safe
    recent = timezone.now() - timedelta(days=2)
    print(f"Searching for users joined since {recent}...")
    users = User.objects.filter(date_joined__gte=recent)
    
    print(f"Found {users.count()} recent users:")
    for user in users:
        print(f"User: {user.username} (ID: {user.id})")
        print(f"  Joined: {user.date_joined}")
        try:
            emp = user.hr_profile
            print(f"  Employee ID: {emp.employee_id}")
            print(f"  Role: {emp.role}")
        except:
            print("  No HR Profile")
        print("-" * 30)

if __name__ == "__main__":
    find_recent_users()
