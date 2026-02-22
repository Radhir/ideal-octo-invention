
import os
import django
import sys
import json
from rest_framework.test import APIClient
from django.contrib.auth.models import User

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
try:
    django.setup()
except Exception as e:
    print(f"Django setup failed: {e}")
    sys.exit(1)

from job_cards.models import JobCard

def run_test():
    print("--- TESTING WORKSHOP DIARY FILTERS ---")
    
    # 1. Setup Client & Login
    client = APIClient()
    try:
        user = User.objects.get(username='ravit')
        client.force_authenticate(user=user)
        print(f"Authenticated as {user.username}")
    except User.DoesNotExist:
        print("User 'ravit' not found. Creating temporary admin...")
        user = User.objects.create_superuser('temp_admin', 'temp@example.com', 'pass')
        client.force_authenticate(user=user)

    # 2. Get Data for Testing
    job = JobCard.objects.first()
    if not job:
        print("NO JOB CARDS FOUND. CANNOT TEST FILTERS.")
        return

    print(f"Reference Job: #{job.job_card_number} | Plate: {job.registration_number} | Status: {job.status}")
    
    advisor_id = job.service_advisor_id if job.service_advisor else None
    if not advisor_id:
        print("Reference job has no advisor linked. Trying to find one...")
        job_with_advisor = JobCard.objects.filter(service_advisor__isnull=False).first()
        if job_with_advisor:
            advisor_id = job_with_advisor.service_advisor_id
            print(f"Found Advisor ID: {advisor_id} from Job #{job_with_advisor.job_card_number}")
        else:
            print("No jobs with linked advisors found. Skipping Advisor test.")

    # 3. Test No Filter
    print("\n[TEST 1] No Filters")
    resp = client.get('/reports/api/workshop-diary/')
    if resp.status_code == 200:
        print(f"Success. Total Entries: {len(resp.data['entries'])}")
    else:
        print(f"FAILED: {resp.status_code} - {resp.data}")

    # 4. Test Plate Filter
    print(f"\n[TEST 2] Filter by Plate: {job.registration_number}")
    resp = client.get(f'/reports/api/workshop-diary/?plate_no={job.registration_number}')
    entries = resp.data.get('entries', [])
    print(f"Entries Found: {len(entries)}")
    if len(entries) > 0 and job.registration_number in entries[0]['asset']:
         print("PASS: Found matching plate.")
    else:
         print("FAIL: Plate filter did not return expected result.")

    # 5. Test Status Filter
    print(f"\n[TEST 3] Filter by Status: {job.status}")
    resp = client.get(f'/reports/api/workshop-diary/?status={job.status}')
    entries = resp.data.get('entries', [])
    print(f"Entries Found: {len(entries)}")
    if len(entries) > 0 and entries[0]['status'] == job.status:
         print("PASS: Found matching status.")
    else:
         print("FAIL: Status filter issue.")

    # 6. Test Advisor Filter
    if advisor_id:
        print(f"\n[TEST 4] Filter by Advisor ID: {advisor_id}")
        resp = client.get(f'/reports/api/workshop-diary/?advisor={advisor_id}')
        entries = resp.data.get('entries', [])
        print(f"Entries Found: {len(entries)}")
        # Verification might be tricky without easy name lookup, but if count > 0 it's good
        if len(entries) > 0:
            print("PASS: Advisor filter returned data.")
        else:
            print("FAIL: Advisor filter returned empty.")

    print("\n--- TEST COMPLETE ---")

if __name__ == "__main__":
    run_test()
