import os
import django
import sys
from django.db import connection

# Set up Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department, Company

def manual_fix():
    print("="*60)
    print("DEBUG: MANUAL VPS REPAIR - ANKIT ONLY")
    print("="*60)

    username = 'ankit'
    
    with connection.cursor() as cursor:
        # 1. Get user id
        cursor.execute("SELECT id FROM auth_user WHERE username = %s", [username])
        row = cursor.fetchone()
        if not row:
            print("User ankit not found. Please run fix_robust first to create user.")
            return
        uid = row[0]
        print(f"User ID: {uid}")

        # 2. Raw Delete
        print(f"Executing DELETE FROM hr_employee WHERE user_id = {uid}")
        cursor.execute("DELETE FROM hr_employee WHERE user_id = %s", [uid])
        print(f"Deleted {cursor.rowcount} rows.")

        # 3. Check count again
        cursor.execute("SELECT count(*) FROM hr_employee WHERE user_id = %s", [uid])
        count = cursor.fetchone()[0]
        print(f"Count after delete: {count}")

        # 4. Try to create manually via ORM
        try:
            from datetime import date
            shine = Company.objects.get(name="Elite Shine")
            front_office = Department.objects.get(name="Front Office")
            from locations.models import Branch
            main_branch = Branch.objects.get(code="DXB-001")
            
            print("Attempting ORM create...")
            emp = Employee.objects.create(
                user_id=uid,
                employee_id="DEBUG-ANKIT",
                full_name_passport="Ankit Dhamija",
                role="General Manager",
                department=front_office,
                company=shine,
                branch=main_branch,
                nationality="India",
                dob=date(1990, 3, 31),
                passport_no="784-1990-2194620-9",
                date_joined=date(2025, 1, 1),
                pin_code="A37000",
                is_active=True
            )
            print(f"SUCCESS: Created Employee ID {emp.id}")
        except Exception as e:
            print(f"FAILED ORM CREATE: {e}")

    print("\n" + "="*60)

if __name__ == '__main__':
    manual_fix()
