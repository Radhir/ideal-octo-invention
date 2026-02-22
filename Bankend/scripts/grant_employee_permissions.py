import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.join(os.getcwd(), 'Bankend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee, ModulePermission

def grant_permissions():
    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer']
    target_modules = ['Attendance', 'Job Cards', 'Operations']
    
    employees = Employee.objects.filter(user__username__in=usernames)
    
    if not employees.exists():
        print("No employees found with the specified usernames.")
        return

    for emp in employees:
        print(f"Granting permissions for: {emp.full_name} ({emp.user.username})")
        for module in target_modules:
            perm, created = ModulePermission.objects.get_or_create(
                employee=emp,
                module_name=module,
                defaults={
                    'can_view': True,
                    'can_create': True,
                    'can_edit': True,
                    'can_delete': True
                }
            )
            if not created:
                perm.can_view = True
                perm.can_create = True
                perm.can_edit = True
                perm.can_delete = True
                perm.save()
                print(f"  - Updated permissions for {module}")
            else:
                print(f"  - Created permissions for {module}")

if __name__ == '__main__':
    grant_permissions()
