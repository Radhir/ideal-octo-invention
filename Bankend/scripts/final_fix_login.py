import os
import sqlite3
import django
import sys
from django.contrib.auth.hashers import make_password

# Set up Django environment for hashing
sys.path.append(os.path.join(os.getcwd(), 'Bankend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def final_fix():
    db_path = os.path.join('Bankend', 'db.sqlite3')
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    password = 'EliteShine2025!'
    hashed_password = make_password(password)
    
    targets = [
        {'username': 'ankit', 'name_pattern': 'Ankit%'},
        {'username': 'anish', 'name_pattern': 'Anish%'},
        {'username': 'suraj.upadhya', 'name_pattern': 'Suraj%'},
        {'username': 'tamer', 'name_pattern': 'Tamer%'},
        {'username': 'tariq', 'name_pattern': 'Tariq%'},
    ]
    
    print("="*60)
    print("FINAL SQL/DJANGO FIX FOR LOGIN")
    print("="*60)
    
    for t in targets:
        u_name = t['username']
        pattern = t['name_pattern']
        
        # 1. Get User ID
        cur.execute('SELECT id FROM auth_user WHERE username = ?', (u_name,))
        user_row = cur.fetchone()
        
        if not user_row:
            print(f"User '{u_name}' NOT FOUND in auth_user.")
            continue
            
        u_id = user_row[0]
        
        # 2. Update User (Password, Active, Staff)
        cur.execute('''
            UPDATE auth_user 
            SET password = ?, is_active = 1, is_staff = 1 
            WHERE id = ?
        ''', (hashed_password, u_id))
        
        # 3. Link Employee
        cur.execute('''
            UPDATE hr_employee 
            SET user_id = ? 
            WHERE full_name_passport LIKE ? OR employee_id LIKE ?
        ''', (u_id, pattern, f"ES-{u_name.upper()}%"))
        
        rows_affected = cur.rowcount
        print(f"SUCCESS: User '{u_name}' (ID: {u_id}) updated. Employee profiles linked: {rows_affected}")

    conn.commit()
    conn.close()
    print("="*60)
    print("FIX COMPLETE. TESTING LOGIN SHOULD WORK NOW.")

if __name__ == '__main__':
    final_fix()
