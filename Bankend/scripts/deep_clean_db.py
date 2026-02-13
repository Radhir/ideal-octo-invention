
import sqlite3
import os

def deep_clean():
    db_path = 'db.sqlite3'
    if not os.path.exists(db_path):
        print("Database not found!")
        return
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f"Scanning {len(tables)} tables...")
    
    for table in tables:
        if table.startswith('sqlite_'): continue
        
        cursor.execute(f"PRAGMA table_info({table})")
        columns = [row[1] for row in cursor.fetchall()]
        
        for col in columns:
            try:
                # Find if 'Radhir' exists in this column
                cursor.execute(f"SELECT COUNT(*) FROM {table} WHERE {col} = 'Radhir' OR {col} = 'Mohammed Nomaanuddin'")
                count = cursor.fetchone()[0]
                if count > 0:
                    print(f"📍 Found {count} instances in {table}.{col}. Nulling...")
                    cursor.execute(f"UPDATE {table} SET {col} = NULL WHERE {col} = 'Radhir' OR {col} = 'Mohammed Nomaanuddin'")
            except Exception:
                pass
    
    conn.commit()
    conn.close()
    print("Deep clean complete.")

if __name__ == "__main__":
    deep_clean()
