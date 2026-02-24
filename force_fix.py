import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth.models import User
from hr.models import Employee
try:
    u = User.objects.get(username='radhir')
    e, created = Employee.objects.get_or_create(user=u, defaults={
        'employee_id': 'SYS-001',
        'full_name': 'Radhir Admin',
        'is_active': True,
        'pin_code': '0000',
        'date_joined': '2025-01-01'
    })
    print(f'FIX_SUCCESS: Created={created}, EmpID={e.id}')
except Exception as ex:
    print(f'FIX_ERROR: {ex}')
