
import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee

print(f"Investigating Employee Model: {Employee}")
opts = Employee._meta
print(f"App label: {opts.app_label}")
print(f"Model name: {opts.model_name}")
print(f"Table name: {opts.db_table}")

fields = [f.name for f in opts.get_fields()]
print(f"All fields: {fields}")

if 'is_active' in fields:
    print("✅ 'is_active' FOUND in fields.")
else:
    print("❌ 'is_active' MISSING from fields.")

# Check the database table columns directly
with connection.cursor() as cursor:
    cursor.execute(f"PRAGMA table_info({opts.db_table})")
    cols = [row[1] for row in cursor.fetchall()]
    print(f"Database columns in {opts.db_table}: {cols}")
    if 'is_active' in cols:
        print("✅ 'is_active' FOUND in database.")
    else:
        print("❌ 'is_active' MISSING from database.")
