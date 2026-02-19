import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

username = 'ravit'
password = 'adhirHAS@123'

try:
    u = User.objects.get(username=username)
    u.set_password(password)
    u.is_superuser = True
    u.is_staff = True
    u.save(update_fields=['password', 'is_superuser', 'is_staff'])
    print(f"Password for {username} updated successfully.")
except User.DoesNotExist:
    User.objects.create_superuser(username, '', password)
    print(f"Superuser {username} created successfully.")
except Exception as e:
    print(f"Error: {e}")
    # Try even "dirtier" update if signals fail
    User.objects.filter(username=username).update(is_superuser=True, is_staff=True)
    # Note: password won't be hashed if we use update(), so we need save() or a manual hash.
    # But hopefully save(update_fields) worked.
