import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, ModulePermission

def enforce():
    print("🚀 Starting RBAC Enforcement...")
    
    # 1. Configuration
    DEFAULT_PASSWORD = "EliteShine2025!"
    
    ELITE_USERS = ['radhir', 'ruchika', 'afsar', 'ravit', 'ankit']
    
    RESTRICTED_STAFF = {
        'suraj.upadhya': ['Operations', 'Inventory', 'Attendance'],
        'anish': ['Operations', 'Inventory', 'Attendance'],
        'tamer': ['Operations', 'Inventory', 'Attendance'],
        'tariq.abdullah': ['Operations', 'Inventory', 'Attendance'],
    }

    # 2. Process Elites
    for username in ELITE_USERS:
        user = User.objects.filter(username=username).first()
        if user:
            print(f"✅ Setting ELITE access for {username}")
            user.set_password(DEFAULT_PASSWORD)
            user.is_superuser = True
            user.is_staff = True
            user.save()
        else:
            print(f"⚠️ Elite user {username} not found")

    # 3. Process Restricted Staff
    for username, modules in RESTRICTED_STAFF.items():
        user = User.objects.filter(username=username).first()
        if user:
            print(f"🔒 Setting RESTRICTED access for {username}")
            user.set_password(DEFAULT_PASSWORD)
            user.is_superuser = False
            user.is_staff = True # Keep staff for basic admin/system access if needed
            user.save()
            
            # Get or create Employee profile
            employee, _ = Employee.objects.get_or_create(
                user=user,
                defaults={'employee_id': f"ES-{username[:5].upper()}", 'date_joined': '2025-01-01'}
            )
            
            # Clear old permissions and set new ones
            ModulePermission.objects.filter(employee=employee).delete()
            for mod in modules:
                ModulePermission.objects.create(
                    employee=employee,
                    module_name=mod,
                    can_view=True,
                    can_create=True,
                    can_edit=True,
                    can_delete=True
                )
                print(f"   - Assigned {mod}")
        else:
            print(f"⚠️ Staff user {username} not found")

    print("✨ RBAC Enforcement Complete.")

if __name__ == "__main__":
    enforce()
