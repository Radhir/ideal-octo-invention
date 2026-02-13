import os
import sys
import django
import json

# Setup Django
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from contracts.sla.models import ServiceLevelAgreement, SLAMetric, SLAViolation
from django.test import RequestFactory
from contracts.sla.views import SLAViewSet

def verify_sla_summary():
    print("--- SLA Summary API Verification ---")
    factory = RequestFactory()
    request = factory.get('/api/contracts/sla/agreements/summary/')
    
    view = SLAViewSet.as_view({'get': 'summary'})
    response = view(request)
    
    if response.status_code == 200:
        print("✅ API Response: 200 OK")
        print(json.dumps(response.data, indent=2))
    else:
        print(f"❌ API Response: {response.status_code}")
        print(response.data)

if __name__ == "__main__":
    verify_sla_summary()
