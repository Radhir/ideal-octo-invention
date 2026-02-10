import os
import django
import random
import string

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department, Company
from locations.models import Branch

def create_sales_manager():
    # 1. Get or create dependencies
    dept, _ = Department.objects.get_or_create(name="Sales")
    comp, _ = Company.objects.get_or_create(name="Elite Pro")
    branch, _ = Branch.objects.get_or_create(
        name="Dubai Main", 
        defaults={'code': 'DXB-001', 'address': 'Main HQ', 'contact_email': 'dxb@example.com', 'contact_phone': '04-1234567'}
    )
    
    username = "sales_manager_" + ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
    email = f"{username}@example.com"
    
    # 2. Create User
    user = User.objects.create_user(
        username=username,
        email=email,
        password="SalesManager123!",
        first_name="John",
        last_name="Doe"
    )
    
    # Generate unique PIN
    while True:
        pin = ''.join(random.choices(string.digits, k=6))
        if not Employee.objects.filter(pin_code=pin).exists():
            break

    # 3. Create Employee
    employee = Employee.objects.create(
        user=user,
        employee_id="SALES-" + ''.join(random.choices(string.digits, k=4)),
        department=dept,
        company=comp,
        branch=branch,
        role="Sales Manager",
        pin_code=pin,
        basic_salary=12000.00,
        salary_type='MONTHLY',
        gender="Male",
        date_joined="2026-02-10",
        bio="Experienced Sales Manager with a focus on high-end luxury services and client retention.",
        skills="Strategic Planning, B2B Sales, CRM Management, Negotiation, Team Leadership"
    )
    
    print(f"Created Sales Manager: {employee.full_name} ({employee.employee_id})")
    print(f"Username: {username}")
    print(f"PIN: {pin}")
    print(f"Department: {dept.name}")
    print(f"Salary: {employee.basic_salary} ({employee.salary_type})")

if __name__ == "__main__":
    create_sales_manager()
