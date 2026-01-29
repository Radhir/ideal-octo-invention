import sqlite3
import sys

try:
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM django_migrations WHERE app IN ('projects', 'risk_management')")
    conn.commit()
    print(f'Deleted {cursor.rowcount} migration records')
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
