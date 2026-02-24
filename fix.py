from django.contrib.auth.models import User
from hr.models import Employee
try:
    u=User.objects.get(username='radhir')
    emp, created = Employee.objects.get_or_create(user=u, defaults={'employee_id': 'SYS-001', 'full_name': 'Radhir Admin', 'is_active': True, 'pin_code': '0000', 'date_joined': '2025-01-01'})
    print(f'FIX_DONE_SUCCESS: Created={created}')
except Exception as e:
    print(f'ERROR: {e}')
