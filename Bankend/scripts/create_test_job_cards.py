import os
import django
import sys
from datetime import date

# Set up Django environment
sys.path.append(os.path.join(os.getcwd(), 'Bankend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee
from job_cards.models import JobCard
from locations.models import Branch

def create_test_job_cards():
    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer']
    branch = Branch.objects.first() # Use the first available branch
    
    if not branch:
        print("No branch found. Please create a branch first.")
        return

    for username in usernames:
        try:
            emp = Employee.objects.get(user__username=username)
            print(f"Creating job cards for: {emp.full_name} ({username})")
            
            for i in range(1, 3):
                job_number = f"TEST-{username.upper()[:3]}-{date.today().strftime('%y%m%d')}-{i:02d}"
                
                # Check if already exists to be idempotent
                if JobCard.objects.filter(job_card_number=job_number).exists():
                    print(f"  - Job card {job_number} already exists.")
                    continue
                
                job = JobCard.objects.create(
                    job_card_number=job_number,
                    date=date.today(),
                    customer_name=f"Test Customer for {username}",
                    phone="0500000000",
                    brand="Test Brand",
                    model="Test Model",
                    year=2025,
                    color="Silver",
                    kilometers=1000 * i,
                    service_advisor=emp,
                    status='RECEIVED' if i == 1 else 'IN_PROGRESS',
                    branch=branch,
                    job_description=f"Test job card {i} for {emp.full_name}. This is a verification record."
                )
                print(f"  - Created job card: {job.job_card_number}")
                
        except Employee.DoesNotExist:
            print(f"Employee with username {username} not found.")

if __name__ == '__main__':
    create_test_job_cards()
