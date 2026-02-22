import os
import django
import sys

# Set up Django environment
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department
from locations.models import Branch

def activate_all():
    print("Starting user activation and credential retrieval...")
    
    # Get all users
    users = User.objects.all()
    
    # Default password used in seeds
    default_password = "Elite123!ChangeMe"
    
    credentials = []
    
    for user in users:
        # Activate user
        if not user.is_active:
            user.is_active = True
            user.save()
            print(f"Activated user: {user.username}")
        
        # Ensure user has a usable password (if seeded, it's already there)
        # Note: We won't change passwords, just report the seeded ones if known
        
        credentials.append({
            'username': user.username,
            'email': user.email,
            'is_active': user.is_active,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        })
    
    print("\n--- USER CREDENTIALS ---")
    with open('credentials.txt', 'w') as f:
        f.write(f"{'Username':<30} | {'Email':<40} | {'Role':<15}\n")
        f.write("-" * 90 + "\n")
        for cred in credentials:
            role = "Superuser" if cred['is_superuser'] else ("Staff" if cred['is_staff'] else "Employee")
            f.write(f"{cred['username']:<30} | {cred['email']:<40} | {role:<15}\n")
            print(f"{cred['username']:<30} | {cred['email']:<40} | {role:<15}")
    
    return credentials

if __name__ == "__main__":
    activate_all()
