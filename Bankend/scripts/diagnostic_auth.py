import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.join(os.getcwd(), 'Bankend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import authenticate
from django.contrib.auth.models import User

def diagnostic():
    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq']
    password = 'EliteShine2025!'
    
    print("="*60)
    print("DJANGO AUTHENTICATION DIAGNOSTIC")
    print("="*60)
    
    for u in usernames:
        print(f"\nUser: {u}")
        try:
            user = User.objects.get(username=u)
            print(f"  - Active: {user.is_active}")
            print(f"  - Staff: {user.is_staff}")
            print(f"  - Last Login: {user.last_login}")
            
            # Test authentication
            auth_user = authenticate(username=u, password=password)
            if auth_user:
                print(f"  - Authentication: SUCCESS")
            else:
                print(f"  - Authentication: FAILED")
                # Check if password hashing looks okay
                if user.password.startswith('pbkdf2_sha256$'):
                    print("    (Password is hashed with pbkdf2_sha256)")
                else:
                    print(f"    (Password hash prefix: {user.password[:20]}...)")
                    
        except User.DoesNotExist:
            print("  - Status: USER NOT FOUND")

    print("\n" + "="*60)

if __name__ == '__main__':
    diagnostic()
