
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee, Branch, Company, Department
from django.contrib.auth.models import User

def debug_delete():
    print("Testing Employee deletion...")
    try:
        # Check Employee fields
        emp_fields = [f.name for f in Employee._meta.get_fields()]
        print(f"Employee fields: {emp_fields}")
        
        # Check if is_active is in fields
        if 'is_active' not in emp_fields:
            print("❌ is_active is MISSING from Employee fields!")
        
        # Test a query
        count = Employee.objects.count()
        print(f"Current Employee count: {count}")
        
        if count > 0:
            first = Employee.objects.first()
            print(f"Attempting to delete Employee {first.id}...")
            first.delete()
            print("✅ Successfully deleted one employee.")
        
        print("Attempting bulk delete...")
        # This is where it fails in seed script
        Employee.objects.all().delete()
        print("✅ Successfully bulk deleted all employees.")

    except Exception as e:
        print(f"❌ Caught exception: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_delete()
