import os
import django
import sys
from django.db import connection

# Set up Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def postgres_investigate():
    print("="*60)
    print("POSTGRES SCHEMA & INDEX INVESTIGATION")
    print("="*60)

    with connection.cursor() as cursor:
        # 1. Check search path
        cursor.execute("SHOW search_path;")
        print(f"Search Path: {cursor.fetchone()[0]}")

        # 2. Check for duplicate table names in different schemas
        cursor.execute("""
            SELECT schemaname, tablename 
            FROM pg_catalog.pg_tables 
            WHERE tablename = 'hr_employee';
        """)
        tables = cursor.fetchall()
        print(f"Tables found: {tables}")

        # 3. Check indexes on hr_employee
        cursor.execute("""
            SELECT indexname, indexdef 
            FROM pg_indexes 
            WHERE tablename = 'hr_employee';
        """)
        indexes = cursor.fetchall()
        print("\nIndexes on hr_employee:")
        for idx in indexes:
            print(f"  - {idx[0]}: {idx[1]}")

        # 4. Check for rows with user_id 37 raw
        cursor.execute("SELECT ctid, * FROM hr_employee WHERE user_id = 37;")
        rows = cursor.fetchall()
        print(f"\nRaw rows with user_id 37: {rows}")

    print("\n" + "="*60)

if __name__ == '__main__':
    postgres_investigate()
