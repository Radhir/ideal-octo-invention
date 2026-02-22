import os
import django
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee
from locations.models import Branch

def fix_branches():
    print("Starting Employee Branch Fix...")
    
    # 1. Ensure Main Branch exists
    branch, created = Branch.objects.get_or_create(
        code='MB01',
        defaults={
            'name': 'Main Branch', 
            'address': 'Al Quoz, Dubai', 
            'contact_email': 'info@eliteshine.com', 
            'contact_phone': '041234567',
            'is_head_office': True,
            'is_active': True
        }
    )
    
    if created:
        print(f"Created Main Branch: {branch}")
    else:
        print(f"Main Branch already exists: {branch}")

    # 2. Assign all branch-less employees to this branch
    employees = Employee.objects.filter(branch__isnull=True)
    count = employees.count()
    
    if count > 0:
        updated = employees.update(branch=branch)
        print(f"Successfully assigned {updated} employees to {branch.name}")
    else:
        print("No employees found without a branch assignment.")

    print("Fix complete!")

if __name__ == "__main__":
    fix_branches()
