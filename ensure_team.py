import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee
from django.utils import timezone

TEAM_DATA = [
    ('radhir', 'Radhir Architecture', 'System Architect | Admin', '04 ARCHITECTURE'),
    ('afsar', 'Afsar Hussain', 'Service Advisor', '02 OPERATIONS'),
    ('ruchika', 'Ruchika', 'Owner & Managing Director', '01 MANAGEMENT'),
    ('ankit', 'Ankit Manager', 'Group Manager', '03 LOGISTICS'),
    ('noman', 'Noman', 'Technical Lead', '05 TECHNICAL')
]

def ensure_team():
    print("Ensuring team profiles...")
    for username, full_name, role, label in TEAM_DATA:
        user, created = User.objects.get_or_create(username=username)
        if created:
            user.set_password('elite123')
            print(f"Created user: {username}")
        
        names = full_name.split(' ')
        user.first_name = names[0]
        user.last_name = ' '.join(names[1:]) if len(names) > 1 else ''
        user.save()
        
        employee, e_created = Employee.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': f"ES-{username.upper()[:3]}",
                'pin_code': '1234',
                'role': role,
                'date_joined': '2025-01-01'
            }
        )
        if not e_created:
            employee.role = role
            employee.save()
            print(f"Updated employee: {username}")
        else:
            print(f"Created employee: {username}")

    print("Team profiles ensured.")

if __name__ == "__main__":
    ensure_team()
