import sqlite3
import os

def final_report():
    db_path = os.path.join('Bankend', 'db.sqlite3')
    if not os.path.exists(db_path):
        print("Database not found.")
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq']
    
    print("="*60)
    print("ELITE SHINE ERP - CONSOLIDATED STATUS REPORT")
    print("="*60)
    
    for u in usernames:
        print(f"\n[ USER: {u} ]")
        
        # 1. Initialization
        cur.execute('''
            SELECT e.full_name_passport, e.employee_id, e.nationality, e.dob 
            FROM hr_employee e 
            JOIN auth_user u ON e.user_id = u.id 
            WHERE u.username = ?
        ''', (u,))
        emp = cur.fetchone()
        if emp:
            print(f"  1. Initialization: SUCCESS")
            print(f"     - Name: {emp[0]}")
            print(f"     - ID: {emp[1]}")
            print(f"     - Nationality: {emp[2]}")
            print(f"     - DOB: {emp[3]}")
        else:
            print(f"  1. Initialization: PENDING/NOT FOUND")
            continue
            
        # 2. Permissions
        cur.execute('''
            SELECT module_name 
            FROM hr_modulepermission p 
            JOIN hr_employee e ON p.employee_id = e.id 
            JOIN auth_user u ON e.user_id = u.id 
            WHERE u.username = ?
        ''', (u,))
        perms = [r[0] for r in cur.fetchall()]
        if perms:
            print(f"  2. Permissions: GRANTED ({', '.join(perms)})")
        else:
            print(f"  2. Permissions: NONE")
            
        # 3. Job Cards
        cur.execute('''
            SELECT job_card_number, status 
            FROM job_cards_jobcard j 
            JOIN hr_employee e ON j.service_advisor_id = e.id 
            JOIN auth_user u ON e.user_id = u.id 
            WHERE u.username = ?
        ''', (u,))
        jobs = cur.fetchall()
        if jobs:
            print(f"  3. Job Cards: CREATED ({len(jobs)} records)")
            for j in jobs:
                print(f"     - {j[0]}: {j[1]}")
        else:
            print(f"  3. Job Cards: NONE")
            
    print("\n" + "="*60)
    print("REPORT COMPLETE")
    print("="*60)
    conn.close()

if __name__ == '__main__':
    final_report()
