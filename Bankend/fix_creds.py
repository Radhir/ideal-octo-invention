import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

username = 'radhir'
password = 'Elite123!'

user = User.objects.filter(username=username).first()
if user:
    print(f"User '{username}' found. Resetting password...")
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print("Password and permissions updated successfully.")
else:
    print(f"User '{username}' NOT found. Creating superuser...")
    User.objects.create_superuser(username=username, password=password, email='admin@example.com')
    print("Superuser created successfully.")

print("Current users in database:", list(User.objects.values_list('username', flat=True)))
