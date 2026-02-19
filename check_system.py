import os
import sys

# Ensure current directory is in sys.path
sys.path.append('/app')

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

def check_db():
    print("--- DB Schema Check ---")
    with connection.cursor() as cursor:
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'job_cards_jobcard'")
        columns = [row[0] for row in cursor.fetchall()]
        print(f"Columns in job_cards_jobcard: {columns}")
        if 'is_released' in columns:
            print("SUCCESS: 'is_released' column exists.")
        else:
            print("FAILURE: 'is_released' column is MISSING.")

def list_users():
    print("\n--- All Users ---")
    users = User.objects.all()
    for u in users:
        print(f"Username: '{u.username}', Is Active: {u.is_active}, Is Superuser: {u.is_superuser}")

def check_user():
    print("\n--- User Verification (ravit) ---")
    username = 'ravit'
    password = 'adhirHAS@123'
    try:
        user = User.objects.get(username=username)
        auth_user = authenticate(username=username, password=password)
        if auth_user:
            print(f"SUCCESS: Authentication successful for '{username}' with provided password.")
        else:
            print(f"FAILURE: Authentication FAILED for '{username}' with provided password.")
    except User.DoesNotExist:
        print(f"FAILURE: User '{username}' does not exist.")

if __name__ == "__main__":
    check_db()
    list_users()
    check_user()
