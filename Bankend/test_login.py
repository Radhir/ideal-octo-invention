import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth.models import User

client = APIClient()

# Ensure user exists (created in previous step)
try:
    user = User.objects.get(username='radhir')
    print("User found")
except User.DoesNotExist:
    User.objects.create_user('radhir', 'email@example.com', 'admin')
    print("User created")

response = client.post('/api/auth/login/', {'username': 'radhir', 'password': 'admin'}, format='json')
print(f"Status: {response.status_code}")
print(f"Content: {response.content.decode()}")
