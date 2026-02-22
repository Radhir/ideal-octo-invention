
import os
import django
import sys
import json
from rest_framework.test import APIClient

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
try:
    django.setup()
except Exception as e:
    print(f"Django setup failed: {e}")
    sys.exit(1)

from django.contrib.auth.models import User

client = APIClient()

# 1. Login
print("--- TESTING LOGIN: ravit ---")
try:
    user = User.objects.get(username='ravit')
    # We can force login or use token. Let's use force_authenticate to bypass JWT logic for pure view testing, 
    # OR better: use the login endpoint to test EVERYTHING.
    
    # Testing login endpoint first
    response = client.post('/api/auth/login/', {'username': 'ravit', 'password': 'adhirHAS@123'}, format='json')
    if response.status_code == 200:
        token = response.data['access']
        print("LOGIN SUCCESS. Token obtained.")
        
        # 2. Get Profile
        print("--- TESTING PROFILE FETCH ---")
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        prof_resp = client.get('/api/auth/profile/')
        if prof_resp.status_code == 200:
            print("PROFILE FECTCH SUCCESS (200 OK)")
            print(f"Profile Data Keys: {list(prof_resp.data.keys())}")
            # Check hr_profile presence
            print(f"HR Profile: {prof_resp.data.get('hr_profile')}")
        else:
            print(f"PROFILE FETCH FAILED: {prof_resp.status_code}")
            print(prof_resp.data)
    else:
        print(f"LOGIN FAILED: {response.status_code}")
        print(response.data)

except User.DoesNotExist:
    print("User 'ravit' does not exist!")
except Exception as e:
    print(f"An error occurred: {e}")
