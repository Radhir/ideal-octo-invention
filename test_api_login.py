import os
import django
import json
from django.test import Client

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

client = Client()
from django.conf import settings
settings.ALLOWED_HOSTS = ['*']

username = 'ravit'
password = 'adhirHAS@123'

print(f"--- Testing API Login: {username} ---")

payload = {
    "username": username,
    "password": password
}

response = client.post(
    '/api/auth/login/',
    data=json.dumps(payload),
    content_type='application/json'
)

print(f"Status Code: {response.status_code}")
try:
    print(f"Response Content: {response.content.decode()}")
except:
    print(f"Response Content (raw): {response.content}")

print("--- End of API Test ---")
