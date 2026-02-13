import os
import django
import sys
from django.db import connection

# Setup Django
sys.path.append(r'R:\webplot\Bankend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def count_tables():
    with connection.cursor() as cursor:
        # SQLite or PostgreSQL depending on environment
        if connection.vendor == 'sqlite':
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        else:
            cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
        
        tables = cursor.fetchall()
        print(f"📊 Total Tables in Database: {len(tables)}")
        for i, table in enumerate(tables, 1):
            print(f"  {i}. {table[0]}")

if __name__ == "__main__":
    count_tables()
