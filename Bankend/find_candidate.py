import os
import django
import sys
from django.db.models import Q

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from hr.models import Employee

User = get_user_model()

def find_candidate():
    print("Searching for users...")
    # Search for anything looking like noman, uddin, or HR role
    users = User.objects.filter(
        Q(username__icontains='noman') | 
        Q(username__icontains='uddin') |
        Q(hr_profile__role__icontains='HR') |
        Q(hr_profile__department__name__icontains='HR')
    ).distinct()
    
    print(f"Found {users.count()} potential matches:")
    for user in users:
        print(f"User: {user.username} (ID: {user.id})")
        print(f"  Joined: {user.date_joined}")
        try:
            emp = user.hr_profile
            print(f"  Employee ID: {emp.employee_id}")
            print(f"  Role: {emp.role}")
            print(f"  Department: {emp.department}")
        except:
            print("  No HR Profile")
        print("-" * 30)

if __name__ == "__main__":
    find_candidate()
