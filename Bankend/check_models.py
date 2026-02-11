
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee, Branch
import hr.models as hr_models

print(f"Employee class: {Employee}")
print(f"Employee module: {Employee.__module__}")
print(f"Employee fields: {[f.name for f in Employee._meta.get_fields()]}")

print(f"\nBranch class: {Branch}")
print(f"Branch module: {Branch.__module__}")

# Check if Employee is just an alias for Branch somehow
if Employee == Branch:
    print("\n🚨 ERROR: Employee and Branch are the SAME CLASS!")
