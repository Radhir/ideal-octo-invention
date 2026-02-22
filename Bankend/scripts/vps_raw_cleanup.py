import os
import django
import sys
from django.db import connection

# Set up Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def raw_cleanup():
    print("="*60)
    print("ELITE SHINE ERP - RAW SQL VPS REPAIR")
    print("="*60)

    with connection.cursor() as cursor:
        # 1. Identify User ID for target accounts
        usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq.abdullah']
        
        cursor.execute("SELECT id, username FROM auth_user WHERE username IN %s", [tuple(usernames)])
        users = cursor.fetchall()
        user_ids = [u[0] for u in users]
        print(f"Target User IDs: {user_ids}")
        
        if not user_ids:
            print("No users found to repair.")
            return

        # 2. Forced deletion of conflicting employee records
        print("\nCleaning up hr_employee table...")
        cursor.execute("DELETE FROM hr_employee WHERE user_id IN %s", [tuple(user_ids)])
        print(f"  - Deleted employee records for user IDs: {user_ids}")
        
        # 3. Clean up by employee_id fragments
        fragments = ['ANKIT', 'SURAJ', 'ANISH', 'TAMER', 'TARIQ']
        for frag in fragments:
            cursor.execute("DELETE FROM hr_employee WHERE employee_id LIKE %s", [f"%{frag}%"])
        print("  - Deleted employee records by ID patterns")

    print("\n" + "="*60)
    print("RAW CLEANUP COMPLETE. NOW RUNNING FINAL FIX.")
    print("="*60)

if __name__ == '__main__':
    raw_cleanup()
