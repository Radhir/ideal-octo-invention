import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth.models import User

# Re-create user to be clean
try:
    u = User.objects.get(username='radhir')
    u.delete()
    print("Deleted old user")
except User.DoesNotExist:
    pass

user = User.objects.create_superuser('radhir', 'email@example.com', 'admin')
print("Created Superuser 'radhir'")

client = APIClient()

print("\n--- Testing Login ---")
response = client.post('/api/auth/login/', {'username': 'radhir', 'password': 'admin'}, format='json')
print(f"Login Status: {response.status_code}")
if response.status_code != 200:
    print(f"Login Error: {response.content.decode()}")
else:
    token = response.data['access']
    print("Login Success. Token obtained.")
    
    print("\n--- Testing Profile ---")
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
    prof_resp = client.get('/api/auth/profile/')
    print(f"Profile Status: {prof_resp.status_code}")
    if prof_resp.status_code != 200:
        # Print first 1000 chars of error to see stack trace
        print(f"Profile Error: {prof_resp.content.decode()[:2000]}")
