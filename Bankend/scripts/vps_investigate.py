import os
import django
import sys

# Set up Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee

def investigate():
    print("="*60)
    print("INVESTIGATING DUPLICATE CONSTRAINT")
    print("="*60)
    
    # Check User ID 37
    try:
        user_37 = User.objects.get(id=37)
        print(f"User ID 37: {user_37.username}")
    except User.DoesNotExist:
        print("User ID 37: DOES NOT EXIST")
        
    # Check if any employee has user_id 37
    emp_37 = Employee.objects.filter(user_id=37).first()
    if emp_37:
        print(f"Employee with UserID 37: {emp_37.employee_id} (Linked to: {emp_37.user.username if emp_37.user else 'NULL'})")
    else:
        print("Employee with UserID 37: NOT FOUND")

    # Target users
    target_users = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq.abdullah']
    for username in target_users:
        u = User.objects.filter(username=username).first()
        if u:
            print(f"\nUser: {u.username} (ID: {u.id})")
            e = Employee.objects.filter(user=u).first()
            if e:
                print(f"  - Linked Employee: {e.employee_id}")
            else:
                print(f"  - No Linked Employee")
                # Check if employee_id already exists elsewhere
                e_by_id = Employee.objects.filter(employee_id__icontains=u.username.upper()).first()
                if e_by_id:
                     print(f"  - Found Employee by ID search: {e_by_id.employee_id} (UserID: {e_by_id.user_id})")

    print("\n" + "="*60)

if __name__ == '__main__':
    investigate()
