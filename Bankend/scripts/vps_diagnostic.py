import os
import django
import sys
from django.conf import settings

# Set up Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection
from django.contrib.auth.models import User
from authentication.models import UserProfile
from hr.models import Employee

def diagnose():
    print("="*60)
    print("VPS AUTHENTICATION DIAGNOSTIC")
    print("="*60)

    # 1. Database Info
    db_conn = settings.DATABASES['default']
    print(f"DATABASE CONFIG:")
    print(f"  - Engine: {db_conn['ENGINE']}")
    print(f"  - Host: {db_conn.get('HOST', 'localhost')}")
    print(f"  - DB Name: {db_conn['NAME']}")
    print(f"  - User: {db_conn['USER']}")
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"  - PG Version: {version[0] if version else 'Unknown'}")
    except Exception as e:
        print(f"  - Connection Error: {e}")
        return

    # 2. User Check
    target_users = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq.abdullah']
    print(f"\nUSER STATUS CHECK:")
    for username in target_users:
        user = User.objects.filter(username=username).first()
        if user:
            profile = UserProfile.objects.filter(user=user).first()
            emp = Employee.objects.filter(user=user).first()
            print(f"  - {username}:")
            print(f"    * Active: {user.is_active}")
            print(f"    * Verified Profile: {profile.email_verified if profile else 'MISSING'}")
            print(f"    * Employee Link: {'YES' if emp else 'NO'}")
            if emp:
                print(f"      - Role: {emp.role}")
                print(f"      - Company: {emp.company.name if emp.company else 'MISSING'}")
                print(f"      - Branch: {emp.branch.name if emp.branch else 'MISSING'}")
        else:
            print(f"  - {username}: NOT FOUND")

    print("\n" + "="*60)
    print("DIAGNOSTIC COMPLETE")
    print("="*60)

if __name__ == '__main__':
    diagnose()
