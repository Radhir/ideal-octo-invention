import sys
import os
from django.core.management import execute_from_command_line

def migrate_to_postgres():
    print("Step 1: Dumping data from SQLite...")
    os.system("python manage.py dumpdata --exclude auth.permission --exclude contenttypes > datadump.json")
    
    print("Step 2: Please ensure PostgreSQL is running and credentials are set in settings.py or env vars.")
    print("Step 3: After configuring settings.py to usage PostgreSQL, run:")
    print("   python manage.py migrate")
    print("   python manage.py loaddata datadump.json")

if __name__ == "__main__":
    migrate_to_postgres()
