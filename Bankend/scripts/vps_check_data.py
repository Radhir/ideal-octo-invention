import os
import django
import sys

# Set up Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee

def check_data():
    print("="*60)
    print("DATABASE DATA CHECK")
    print("="*60)
    print(f"USER COUNT: {User.objects.count()}")
    print(f"EMP COUNT: {Employee.objects.count()}")
    
    print("\nUSERS:")
    for u in User.objects.all().order_by('-id')[:20]:
        print(f"  - {u.username} (ID: {u.id})")
        
    print("\nEMPLOYEES:")
    for e in Employee.objects.all().order_by('-id')[:20]:
        print(f"  - {e.employee_id} (User: {e.user.username if e.user else 'NULL'}, UserID: {e.user_id})")

    print("\n" + "="*60)

if __name__ == '__main__':
    check_data()
