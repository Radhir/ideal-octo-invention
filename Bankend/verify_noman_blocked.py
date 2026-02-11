import os
import django
import sys
from django.test import RequestFactory

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model
from rest_framework.test import APIClient

User = get_user_model()

def test_login():
    username = 'nomaanuddin.mohammed'
    password = 'Elite123!' # From credentials file
    
    print(f"Testing login for {username}...")
    
    # 1. Check User Status Directly
    try:
        user = User.objects.get(username=username)
        print(f"User found: {user.username}")
        print(f"User is_active: {user.is_active}")
        
        try:
            emp = user.hr_profile
            print(f"Employee profile found: {emp.employee_id}")
            print(f"Employee is_active: {emp.is_active}")
        except:
            print("No employee profile.")
            
    except User.DoesNotExist:
        print("User not found in DB!")
        return

    # 2. Try Authentication
    user_auth = authenticate(username=username, password=password)
    if user_auth is None:
        print("\nSUCCESS: authenticate() returned None. Login rejected.")
    else:
        print("\nFAILURE: authenticate() returned a user! Login still working.")
        if not user_auth.is_active:
             print("(Note: User is inactive, so authentication might succeed but login view should block it. Checking API next...)")

    # 3. Try API Login (Simulation)
    client = APIClient()
    response = client.post('/api/auth/login/', {'username': username, 'password': password}, format='json')
    
    print(f"\nAPI Login Response Code: {response.status_code}")
    print(f"API Response Body: {response.data}")
    
    if response.status_code == 401 or response.status_code == 400: # Assuming 401/400 for failed login
         print("SUCCESS: API rejected login.")
    elif 'active' in str(response.data).lower():
         print("SUCCESS: API rejected with inactivity message.")
    else:
         print("FAILURE: API seems to have allowed login (or unexpected error).")

if __name__ == "__main__":
    test_login()
