
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee

def sync_credentials():
    print("🚀 Starting User Credential Synchronization...")
    employees = Employee.objects.all()
    count = 0
    
    for emp in employees:
        # Determine username from email if available, else derive from name
        username = emp.user.username if emp.user else None
        
        if not username:
            # Fallback for employees without a user linked
            # Try to find user by email or create one
            email = getattr(emp, 'email', None)
            if not email:
                # If no email, skip or create a dummy one
                print(f"⚠️ Employee {emp.full_name} has no email. Skipping.")
                continue
                
            username = email.split('@')[0]
            user, created = User.objects.get_or_create(username=username, defaults={'email': email})
            emp.user = user
            emp.save()
        else:
            user = emp.user
            
        # Set password to Elite123!
        user.set_password("Elite123!")
        user.is_active = True
        user.save()
        
        print(f"✅ Synced user '{user.username}' for employee '{emp.full_name}'")
        count += 1
        
    print(f"\n✨ Successfully synchronized {count} employee accounts.")

if __name__ == "__main__":
    sync_credentials()
