import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

username = 'ravit'
password = 'adhirHAS@123'
h = make_password(password)

updated = User.objects.filter(username=username).update(password=h, is_superuser=True, is_staff=True)
if updated:
    print(f"Password for {username} updated successfully via update() (signals skipped).")
else:
    # If it doesn't exist, we have to create it. Creation MIGHT fire signals, 
    # but we'll try it if update() fails to find the user.
    User.objects.create_superuser(username, 'ravit@example.com', password)
    print(f"Superuser {username} created successfully.")
