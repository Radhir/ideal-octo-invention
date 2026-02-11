
import sqlite3
import os

def reset_job_cards():
    db_path = 'db.sqlite3'
    if not os.path.exists(db_path): return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Dropping job_cards_jobcard table and related tables...")
    cursor.execute("DROP TABLE IF EXISTS job_cards_jobcard")
    cursor.execute("DROP TABLE IF EXISTS job_cards_jobcardphoto")
    cursor.execute("DROP TABLE IF EXISTS job_cards_jobcardtask")
    
    print("Clearing migration history for 'job_cards'...")
    cursor.execute("DELETE FROM django_migrations WHERE app = 'job_cards'")
    
    conn.commit()
    conn.close()
    print("Reset complete.")

if __name__ == "__main__":
    reset_job_cards()
