import sys
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

try:
    print("Trying to import stock.views...")
    import stock.views
    print("Successfully imported stock.views")
except Exception as e:
    print(f"An error occurred: {e}")
    import traceback
    traceback.print_exc()
