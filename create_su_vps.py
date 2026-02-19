import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

username = 'ravit'
password = 'adhirHAS@123'

User.objects.filter(username=username).delete()
User.objects.create_superuser(username, '', password)
print(f"Superuser {username} created/updated successfully.")
