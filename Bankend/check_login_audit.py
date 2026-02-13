import os
import sys
import django

# Setup Django
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from core.models import AuditLog

def check_logins():
    logins = AuditLog.objects.filter(action='LOGIN').order_by('-timestamp')
    print(f"TOTAL LOGIN ACTIONS: {logins.count()}")
    for log in logins[:5]:
        print(f" - {log.user.username if log.user else 'Anon'} @ {log.timestamp}")

if __name__ == "__main__":
    check_logins()
