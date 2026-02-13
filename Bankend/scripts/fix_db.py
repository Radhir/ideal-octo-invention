
import sqlite3
import os

def fix_and_clean():
    db_path = 'db.sqlite3'
    if not os.path.exists(db_path): return
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Restore Radhir user
    print("Restoring 'radhir' user if needed...")
    cursor.execute("SELECT COUNT(*) FROM auth_user WHERE username = 'radhir'")
    if cursor.fetchone()[0] == 0:
        cursor.execute("UPDATE auth_user SET username = 'radhir' WHERE username IS NULL")
        print(f"Restored {cursor.rowcount} user(s).")
    else:
        print("User 'radhir' already exists.")
    
    # 2. Aggressive clean for JobCard
    print("Aggressive clean for job_cards_jobcard...")
    cursor.execute("PRAGMA table_info(job_cards_jobcard)")
    cols_info = cursor.fetchall()
    cols = [row[1] for row in cols_info]
    print(f"Current columns in DB: {cols}")
    
    for col in cols:
        print(f"Scanning {col}...")
        try:
            # Try setting to NULL first (for FKs)
            cursor.execute(f"UPDATE job_cards_jobcard SET {col} = NULL WHERE {col} = 'Radhir' OR {col} = 'Mohammed Nomaanuddin'")
            if cursor.rowcount > 0:
                print(f"✅ Nulled {cursor.rowcount} rows in {col}")
        except sqlite3.IntegrityError:
            # If NOT NULL constraint, try empty string
            try:
                cursor.execute(f"UPDATE job_cards_jobcard SET {col} = '' WHERE {col} = 'Radhir' OR {col} = 'Mohammed Nomaanuddin'")
                if cursor.rowcount > 0:
                    print(f"✅ Cleared {cursor.rowcount} rows in {col} with empty string")
            except Exception as e:
                print(f"⚠️ Failed to clean {col} even with empty string: {e}")
        except Exception as e:
            print(f"⚠️ Error cleaning {col}: {e}")

    # 3. Check for any other table that might be 'hr_jobcard' or similar
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%jobcard%'")
    jobcard_tables = [row[0] for row in cursor.fetchall()]
    for table in jobcard_tables:
        print(f"Scanning related table: {table}")
        cursor.execute(f"PRAGMA table_info({table})")
        tcols = [row[1] for row in cursor.fetchall()]
        for c in tcols:
            cursor.execute(f"UPDATE {table} SET {c} = NULL WHERE {c} = 'Radhir' OR {c} = 'Mohammed Nomaanuddin'")
            if cursor.rowcount > 0:
                print(f"✅ Cleaned {cursor.rowcount} rows in {table}.{c}")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_and_clean()
