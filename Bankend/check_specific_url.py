
import os
import django
import sys
from django.urls import resolve, reverse

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def check_urls():
    paths_to_check = [
        '/hr/api/notifications/',
        '/hr/api/notifications/mark_all_as_read/',
        '/api/hr/notifications/',
        '/forms/notifications/api/logs/',
    ]
    
    print("Checking URL resolution:")
    for path in paths_to_check:
        try:
            match = resolve(path)
            print(f"[OK] {path} resolves to {match.func.__name__} (view: {match.view_name})")
        except Exception as e:
            print(f"[FAIL] {path}: {e}")

if __name__ == "__main__":
    check_urls()
