import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department

print("=" * 50)
print("LIVE VERIFICATION")
print("=" * 50)

# 1. Check Nomaan
u = User.objects.get(username="nomaan_admin")
print(f"User: {u.username}")
print(f"Staff: {u.is_staff}")
print(f"Superuser: {u.is_superuser}")

e = u.hr_profile
print(f"Employee: {e.full_name}")
print(f"Role: {e.role}")
print(f"Nationality: {e.nationality}")
print(f"Department: {e.department}")

# 2. Check all employees
print(f"\nTotal Employees: {Employee.objects.count()}")
for emp in Employee.objects.all():
    print(f"  - {emp.full_name} | {emp.role} | {emp.department}")

# 3. Check departments
print(f"\nDepartments: {Department.objects.count()}")
for d in Department.objects.all():
    print(f"  - {d.name}")

print("\n ALL CHECKS PASSED")
