import os
import sqlite3
import django
import sys
import uuid
from django.contrib.auth.hashers import make_password

# Set up Django environment for hashing
sys.path.append(os.path.join(os.getcwd(), 'Bankend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def brute_fix():
    db_path = os.path.join('Bankend', 'db.sqlite3')
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    password = 'EliteShine2025!'
    hashed_password = make_password(password)
    
    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq']
    
    print("="*60)
    print("BRUTE FORCE LOGIN REPAIR")
    print("="*60)
    
    for u in usernames:
        print(f"\nRepairing: {u}")
        
        # 1. Ensure auth_user is perfect
        cur.execute('''
            UPDATE auth_user 
            SET password = ?, is_active = 1, is_staff = 1, is_superuser = 0
            WHERE username = ?
        ''', (hashed_password, u))
        
        cur.execute('SELECT id FROM auth_user WHERE username = ?', (u,))
        user_row = cur.fetchone()
        if not user_row:
            print(f"  - Error: User {u} not found.")
            continue
        u_id = user_row[0]
        
        # 2. Ensure hr_employee is linked and has branch/company
        # We search by name or username-based ID
        cur.execute('''
            UPDATE hr_employee 
            SET user_id = ?, branch_id = 1, company_id = 1, is_active = 1
            WHERE full_name_passport LIKE ? OR employee_id LIKE ?
        ''', (u_id, f"%{u.split('.')[0]}%", f"ES-{u.upper()}%"))
        
        if cur.rowcount == 0:
            print(f"  - Warning: No Employee profile linked.")
        else:
            print(f"  - Employee profile(s) linked and branch/company set.")
            
        # 3. Ensure authentication_userprofile exists and is verified
        cur.execute('SELECT id FROM authentication_userprofile WHERE user_id = ?', (u_id,))
        if not cur.fetchone():
            token = str(uuid.uuid4()).replace('-', '')
            from django.utils import timezone
            now = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
            cur.execute('''
                INSERT INTO authentication_userprofile 
                (email_verified, verification_token, token_created_at, user_id)
                VALUES (1, ?, ?, ?)
            ''', (token, now, u_id))
            print(f"  - Created verified UserProfile.")
        else:
            cur.execute('UPDATE authentication_userprofile SET email_verified = 1 WHERE user_id = ?', (u_id,))
            print(f"  - Updated UserProfile to verified.")

    conn.commit()
    conn.close()
    print("\n" + "="*60)
    print("REPAIR COMPLETE. TRY LOGIN AGAIN.")
    print("="*60)

if __name__ == '__main__':
    brute_fix()
