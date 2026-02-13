
import os
import django
import sqlite3

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def diagnostic():
    db_path = 'db.sqlite3'
    if not os.path.exists(db_path):
        print("Database not found!")
        return
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Checking job_cards_jobcard table...")
    try:
        cursor.execute("PRAGMA table_info(job_cards_jobcard)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"Columns: {columns}")
        
        target_cols = ['service_advisor', 'service_advisor_id', 'assigned_technician', 'assigned_technician_id', 'branch', 'branch_id']
        for col in target_cols:
            if col in columns:
                print(f"\n--- Cleaning {col} ---")
                cursor.execute(f"SELECT id, {col}, typeof({col}) FROM job_cards_jobcard WHERE {col} IS NOT NULL LIMIT 10")
                print(f"Sample data for {col}: {cursor.fetchall()}")
                
                # Use a more explicit update
                cursor.execute(f"UPDATE job_cards_jobcard SET {col} = NULL")
                print(f"CRITICAL: SET ALL {col} TO NULL. Rows updated: {cursor.rowcount}")
        
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    diagnostic()
