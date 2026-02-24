import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth.models import User
from hr.models import Employee
try:
    u = User.objects.get(username='radhir')
    e = Employee.objects.filter(user=u).first()
    print(f'USER_ID:{u.id}, USERNAME:{u.username}, EMP_EXISTS:{e is not None}')
    if e: print(f'EMP_ID:{e.id}, EMP_NAME:{e.full_name_passport}')
except Exception as ex:
    print(f'ERROR: {ex}')
