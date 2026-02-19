import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

username = 'ravit'
password = 'adhirHAS@123'

print("--- All users in database ---")
for u in User.objects.all():
    print(f"Username: '{u.username}', Is Active: {u.is_active}")
print("----------------------------")

# Check authentication
authenticated_user = authenticate(username=username, password=password)
if authenticated_user:
    print("Success: authenticate() returned the user object.")
else:
    print("Failure: authenticate() returned None.")
