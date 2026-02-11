import os
import django
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from core.models import ErrorLog

def list_errors():
    errors = ErrorLog.objects.all().order_by('-timestamp')[:10]
    if not errors:
        print("No errors found in log.")
        return
        
    for err in errors:
        print(f"[{err.timestamp}] {err.severity} - {err.endpoint} ({err.method})")
        print(f"Type: {err.error_type}")
        print(f"Message: {err.error_message}")
        print("-" * 40)

if __name__ == "__main__":
    list_errors()
