
import os
import django
import sys

print("--- STARTING PASSWORD RESET SCRIPT ---")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
try:
    django.setup()
    print("Django setup successful.")
except Exception as e:
    print(f"Django setup failed: {e}")
    sys.exit(1)

from django.contrib.auth.models import User

def reset_user(username, password):
    try:
        u = User.objects.get(username=username)
        u.set_password(password)
        u.save()
        print(f"SUCCESS: {username} password updated.")
    except User.DoesNotExist:
        print(f"WARNING: User {username} does not exist.")
    except Exception as e:
        print(f"ERROR: {username} - {e}")

# Admins with specific passwords
reset_user('ravit', 'adhirHAS@123')
reset_user('radhir', 'adhirHAS@123') # Setup both just in case
reset_user('ruchika', 'ruchika@ELITE123')
reset_user('afsar', 'afsar@ELITE123')
reset_user('ankit', 'ankit@ELITE123')

# Bulk update others (optional but good practice)
# Skipping bulk update for now to focus on the 4 key users the user complained about.

print("--- FINISHED PASSWORD RESET SCRIPT ---")
