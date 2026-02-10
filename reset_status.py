import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_cards.models import JobCard

try:
    jc = JobCard.objects.get(job_card_number="TEST-LIVE-001")
    jc.status = "WIP"
    jc.estimated_timeline = timezone.now() + timezone.timedelta(days=3)
    jc.assigned_technician = "EliteMaster"
    jc.save()
    print(f"Status Reset: {jc.status}")
except JobCard.DoesNotExist:
    print("Job Card Not Found")
