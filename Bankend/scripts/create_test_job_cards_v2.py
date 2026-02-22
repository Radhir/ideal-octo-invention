import sqlite3
import os
from datetime import date, datetime

def create_test_job_cards_sql():
    db_path = os.path.join('Bankend', 'db.sqlite3')
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer']
    branch_id = 1
    datestr = date.today().strftime('%y%m%d')
    today_str = str(date.today())
    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    for u in usernames:
        # Get employee id
        cur.execute('SELECT e.id FROM hr_employee e JOIN auth_user u ON e.user_id = u.id WHERE u.username = ?', (u,))
        row = cur.fetchone()
        if not row:
            print(f"Employee {u} not found.")
            continue
        
        emp_id = row[0]
        print(f"Inserting job cards for {u} (ID: {emp_id})")
        
        for i in range(1, 3):
            job_num = f"TEST-{u.upper()[:3]}-{datestr}-{i:02d}"
            status = 'RECEIVED' if i == 1 else 'IN_PROGRESS'
            cust_name = f"Test Customer for {u}"
            desc = f"Test job card {i} for {u}. This is a verification record."
            
            # Check if exists
            cur.execute('SELECT id FROM job_cards_jobcard WHERE job_card_number = ?', (job_num,))
            if cur.fetchone():
                print(f"  - Job {job_num} already exists.")
                continue

            try:
                cur.execute('''
                    INSERT INTO job_cards_jobcard (
                        job_card_number, date, customer_name, phone, brand, model, year, 
                        color, kilometers, service_advisor_id, status, branch_id, 
                        job_description, plate_emirate, paint_stage, total_amount, 
                        vat_amount, discount_amount, net_amount, advance_amount, 
                        balance_amount, advisor_commission, technician_commission, 
                        loyalty_points, efficiency_score, actual_days, no_of_days, 
                        customer_estimated_price, qc_sign_off, pre_work_head_sign_off, 
                        post_work_tl_sign_off, post_work_head_sign_off, 
                        floor_incharge_sign_off, commission_applied, is_released, 
                        created_at, updated_at, title, address, vin,
                        account_name, bank_name, account_number, iban,
                        checklist_remarks, cylinder_type, job_category, attendee,
                        brought_by_name, mulkiya_number, signature_data, feedback_notes,
                        assigned_bay, initial_inspection_notes, customer_approval_status,
                        estimation_number, appointment_number, inspection_number,
                        order_type, paint_stage
                    ) VALUES (
                        ?, ?, ?, '0500000000', 'Test Brand', 'Test Model', 2025, 
                        'Silver', ?, ?, ?, ?, 
                        ?, 'Dubai', 'NONE', 0, 
                        0, 0, 0, 0, 
                        0, 0, 0, 
                        0, 0, 0, 0, 
                        0, 0, 0, 
                        0, 0, 
                        0, 0, 0, 
                        ?, ?, 'Mr', 'Test Address', 'TESTVIN123',
                        '', '', '', '',
                        '', '', 'Regular', '',
                        '', '', '', '',
                        '', '', 'WAITING',
                        NULL, NULL, NULL,
                        'Normal', 'NONE'
                    )
                ''', (
                    job_num, today_str, cust_name, 1000 * i, emp_id, status, 
                    branch_id, desc, now_str, now_str
                ))
                print(f"  - Inserted {job_num}")
            except sqlite3.Error as e:
                print(f"  - Error inserting {job_num}: {e}")

    conn.commit()
    conn.close()
    print("Completed SQL insertion.")

if __name__ == '__main__':
    create_test_job_cards_sql()
