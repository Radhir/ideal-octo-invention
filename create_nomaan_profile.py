import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department, ModulePermission

def create_nomaan_profile():
    username = "nomaan_admin"
    try:
        user = User.objects.get(username=username)
        # Create Employee profile
        emp, created = Employee.objects.get_or_create(
            user=user,
            defaults={
                'full_name': 'Mohammed Nomaanuddin',
                'employee_id': 'ES-NOMAN',
                'role': 'HR Admin',
                'department': Department.objects.filter(name__icontains='HR').first()
            }
        )
        if created:
            print(f"Created Employee profile for {username}")
        else:
            print(f"Profile already exists for {username}")
            
        # Grant all permissions again just to be safe
        modules = [
            "Employees", "HR Management", "Job Cards", "Bookings", "Stock",
            "Payroll", "Attendance", "Invoices", "Dashboard", "Finance",
            "Leads", "Projects", "Ceramic/PPF", "Pick & Drop"
        ]
        for mod in modules:
            ModulePermission.objects.update_or_create(
                employee=emp,
                module_name=mod,
                defaults={'can_view': True, 'can_create': True, 'can_edit': True, 'can_delete': True}
            )
        print("Granted all permissions.")

    except User.DoesNotExist:
        print(f"User {username} not found.")

if __name__ == "__main__":
    create_nomaan_profile()
