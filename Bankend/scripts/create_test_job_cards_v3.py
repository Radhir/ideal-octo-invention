import sqlite3
import os
import uuid
from datetime import date, datetime

def create_test_job_cards_robust():
    db_path = os.path.join('Bankend', 'db.sqlite3')
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    # Mapping types to defaults
    type_defaults = {}
    for row in cur.execute('PRAGMA table_info(job_cards_jobcard)'):
        col_name = row[1]
        col_type = row[2].upper()
        if 'INT' in col_type or 'DECIMAL' in col_type or 'REAL' in col_type or 'BOOL' in col_type:
            type_defaults[col_name] = 0
        else:
            type_defaults[col_name] = ''

    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer']
    branch_id = 1
    datestr = date.today().strftime('%y%m%d')
    today_str = str(date.today())
    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    for u in usernames:
        cur.execute('SELECT e.id FROM hr_employee e JOIN auth_user u ON e.user_id = u.id WHERE u.username = ?', (u,))
        row = cur.fetchone()
        if not row:
            print(f"Employee {u} not found.")
            continue
        
        emp_id = row[0]
        print(f"Propagating job cards for {u} (ID: {emp_id})")
        
        for i in range(1, 3):
            job_num = f"TEST-{u.upper()[:3]}-{datestr}-{i:02d}"
            
            # Check if exists
            cur.execute('SELECT id FROM job_cards_jobcard WHERE job_card_number = ?', (job_num,))
            if cur.fetchone():
                print(f"  - Job {job_num} already exists.")
                continue

            # Build data dict with defaults based on type
            data = type_defaults.copy()
            data.update({
                'job_card_number': job_num,
                'date': today_str,
                'customer_name': f"Test Customer for {u}",
                'phone': '0500000000',
                'brand': 'Test Brand',
                'model': 'Test Model',
                'year': 2025,
                'color': 'Silver',
                'kilometers': 1000 * i,
                'service_advisor_id': emp_id,
                'status': 'RECEIVED' if i == 1 else 'IN_PROGRESS',
                'branch_id': branch_id,
                'job_description': f"Test job card {i} for {u}. Verification record.",
                'created_at': now_str,
                'updated_at': now_str,
                'portal_token': str(uuid.uuid4()),
                'plate_emirate': 'Dubai',
                'order_type': 'Normal',
                'job_category': 'Regular',
                'customer_approval_status': 'WAITING',
                'paint_stage': 'NONE',
                'title': 'Mr',
                'address': 'Test Address',
                'vin': f'TESTVIN-{u.upper()[:3]}-{i}',
            })

            keys = sorted(data.keys())
            query = f"INSERT INTO job_cards_jobcard ({', '.join(keys)}) VALUES ({', '.join(['?' for _ in keys])})"
            try:
                cur.execute(query, [data[k] for k in keys])
                print(f"  - Successfully created {job_num}")
            except sqlite3.Error as e:
                print(f"  - Error creating {job_num}: {e}")

    conn.commit()
    conn.close()
    print("Done.")

if __name__ == '__main__':
    create_test_job_cards_robust()

    conn.commit()
    conn.close()
    print("Done.")

if __name__ == '__main__':
    create_test_job_cards_robust()
