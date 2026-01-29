import os
import django
import datetime
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee, Roster
from django.contrib.auth.models import User

def seed_live_shift():
    # Ensure a demo user exists
    user, _ = User.objects.get_or_create(username='radhir', defaults={'first_name': 'Radhir', 'last_name': 'Director'})
    employee, _ = Employee.objects.get_or_create(
        user=user, 
        defaults={
            'employee_id': 'DIR-001',
            'pin_code': '123456',
            'role': 'Director',
            'date_joined': timezone.now().date()
        }
    )

    # Create a 10-hour roster for today (08:00 to 18:00)
    today = timezone.now().date()
    start_dt = timezone.make_aware(datetime.datetime.combine(today, datetime.time(8, 0)))
    end_dt = timezone.make_aware(datetime.datetime.combine(today, datetime.time(18, 0)))

    roster, created = Roster.objects.update_or_create(
        employee=employee,
        shift_start__date=today,
        defaults={
            'shift_start': start_dt,
            'shift_end': end_dt,
            'task_notes': 'Elite Shine Standard industrial 10-Hour Shift'
        }
    )

    print(f"Shift seeded: {roster.shift_start} to {roster.shift_end} (10 hrs)")

if __name__ == "__main__":
    seed_live_shift()
