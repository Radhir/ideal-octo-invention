from django.db import connection
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def fix_orphans():
    cursor = connection.cursor()
    # Check if table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='job_cards_jobcard'")
    if not cursor.fetchone():
        print("Table job_cards_jobcard does not exist. Skipping.")
        return

    # Map field names to their respective tables
    relationships = {
        'service_advisor_id': 'hr_employee',
        'assigned_technician_id': 'hr_employee',
        'supervisor_id': 'hr_employee',
        'driver_id': 'hr_employee',
        'salesman_id': 'hr_employee',
        'current_booth_id': 'workshop_booth',
        'branch_id': 'locations_branch',
        'customer_profile_id': 'customers_customer',
        'related_lead_id': 'leads_lead',
        'related_booking_id': 'bookings_booking',
        'vehicle_node_id': 'masters_vehicle',
    }
    
    for field, ref_table in relationships.items():
        try:
            # Check if column exists
            cursor.execute(f"PRAGMA table_info(job_cards_jobcard)")
            columns = [row[1] for row in cursor.fetchall()]
            if field not in columns:
                print(f"Column {field} does not exist. Skipping.")
                continue

            # Check if reference table exists
            cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{ref_table}'")
            if not cursor.fetchone():
                print(f"Reference table {ref_table} does not exist. Skipping cleanup for {field}.")
                continue

            # Update orphans to NULL if they don't exist in the reference table
            cursor.execute(f"UPDATE job_cards_jobcard SET {field} = NULL WHERE {field} IS NOT NULL AND {field} NOT IN (SELECT id FROM {ref_table})")
            print(f"Fixed {field} (checked against {ref_table})")
        except Exception as e:
            print(f"Error fixing {field}: {e}")

if __name__ == "__main__":
    fix_orphans()
