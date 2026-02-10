import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee

def list_all_data():
    employees = Employee.objects.all()
    print("="*60)
    print(f"{'NAME':<25} | {'ROLE':<20} | {'SALARY/RATE':<15}")
    print("-"*60)
    
    for e in employees:
        print(f"{e.full_name:<25} | {e.role:<20} | {e.basic_salary} ({e.salary_type})")
        print(f"  > ID: {e.employee_id}")
        print(f"  > Dept: {e.department.name if e.department else 'N/A'}")
        print(f"  > Bio: {e.bio if e.bio else 'No bio provided'}")
        print(f"  > Skills: {e.skills if e.skills else 'No skills listed'}")
        print("-" * 60)

if __name__ == "__main__":
    list_all_data()
