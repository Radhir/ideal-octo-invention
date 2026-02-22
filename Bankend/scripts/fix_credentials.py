import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.join(os.getcwd(), 'Bankend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee

def fix_credentials():
    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq']
    password = 'EliteShine2025!'
    
    print("="*60)
    print("FIXING LOGIN CREDENTIALS")
    print("="*60)
    
    for username in usernames:
        try:
            user = User.objects.get(username=username)
            user.set_password(password)
            user.is_active = True
            user.is_staff = True # Ensure they can access admin/staff views if required
            user.save()
            print(f"SUCCESS: Password reset for '{username}'. Account active.")
            
            # Verify Employee link
            if hasattr(user, 'employee'):
                print(f"       - Linked to Employee Profile: {user.employee.full_name_passport}")
            else:
                print(f"       - WARNING: No Employee Profile linked to '{username}'")
                
        except User.DoesNotExist:
            print(f"ERROR: User '{username}' not found in database.")

    print("\nAttempting to reset 'suraj' if 'suraj.upadhya' was intended...")
    try:
        user = User.objects.get(username='suraj')
        user.set_password(password)
        user.is_active = True
        user.is_staff = True
        user.save()
        print(f"SUCCESS: Password reset for 'suraj'.")
    except User.DoesNotExist:
        print("User 'suraj' (short name) not found.")

    print("="*60)

if __name__ == '__main__':
    fix_credentials()
