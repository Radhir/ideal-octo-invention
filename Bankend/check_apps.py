import sys
import os

apps = ['stock', 'finance', 'job_cards', 'invoices', 'hr']

print("Python Path:", sys.path)

for app in apps:
    try:
        print(f"Trying to import {app}...")
        __import__(app)
        print(f"  SUCCESS: {app} imported")
    except Exception as e:
        print(f"  FAILED: {app} import failed: {e}")
        import traceback
        traceback.print_exc()

try:
    print("Trying to import stock.views...")
    from stock import views
    print("  SUCCESS: stock.views imported")
except Exception as e:
    print(f"  FAILED: stock.views import failed: {e}")
    import traceback
    traceback.print_exc()
